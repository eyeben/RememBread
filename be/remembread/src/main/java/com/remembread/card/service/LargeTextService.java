package com.remembread.card.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.remembread.card.dto.response.CardResponse;
import com.remembread.common.service.GPTService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class LargeTextService {

    private final GPTService gptService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<CardResponse> createCardList(String text) {
        try {
            String systemPrompt = "너는 사용자가 입력한 텍스트를 주제별로 나눠 JSON 배열로 정리하는 역할을 해. 각 항목은 concept과 description으로 구성돼야 하고, description에는 concept 단어가 그대로 들어가면 안 돼.";

            String userPrompt = """
            가장 중요한 규칙: description에 concept 단어가 그대로 포함되면 안 돼.
            너는 사용자가 입력한 긴 설명 텍스트를 concept과 description으로 나누는 역할을 해.

            - 각 항목은 반드시 concept과 description 키를 포함한 JSON 객체여야 해.
            - description은 **절대로 요약하거나 생략하지 마. 한 문장도 빠뜨리지 말고, 원문 문장 전체를 그대로 포함시켜.**
            - 단지 concept 단어만 다른 표현으로 바꾸거나 문장 속에서 제거해. 문장 순서, 내용은 그대로 유지해.

            텍스트:
            %s
            """.formatted(text);

            String gptResult = gptService.ask(systemPrompt, userPrompt);

            // 마크다운 ``` 제거
            gptResult = stripMarkdownCodeBlock(gptResult);

            // JSON 파싱
            List<Map<String, String>> parsed = objectMapper.readValue(
                    gptResult,
                    new TypeReference<>() {}
            );

            AtomicInteger index = new AtomicInteger();

            return parsed.stream()
                    .map(m -> CardResponse.builder()
                            .number(index.getAndIncrement())
                            .concept(m.get("concept"))
                            .description(m.get("description"))
                            .build())
                    .toList();

        } catch (Exception e) {
            log.error("카드 리스트 생성 중 오류", e);
            throw new RuntimeException("카드 생성 실패", e);
        }
    }

    private String stripMarkdownCodeBlock(String content) {
        if (content == null) return "";

        // ```json 또는 ``` 제거
        return content
                .replaceAll("^```json\\s*", "")  // 시작 부분 ```json
                .replaceAll("^```\\s*", "")      // 시작 부분 ``` (json이 없어도)
                .replaceAll("\\s*```$", "")      // 끝 부분 ```
                .trim();
    }

    public Flux<CardResponse> createCardListStream(String text) {
        String systemPrompt = "너는 사용자가 입력한 텍스트를 주제별로 나눠 JSON 배열로 정리하는 역할을 해. 각 항목은 concept과 description으로 구성돼야 하고, description에는 concept 단어가 그대로 들어가면 안 돼.";

        String userPrompt = """
            가장 중요한 규칙: description에 concept 단어가 그대로 포함되면 안 돼.
            너는 사용자가 입력한 긴 설명 텍스트를 concept과 description으로 나누는 역할을 해.

            - 각 항목은 반드시 concept과 description 키를 포함한 JSON 객체여야 해.
            - description은 **절대로 요약하거나 생략하지 마. 한 문장도 빠뜨리지 말고, 원문 문장 전체를 그대로 포함시켜.**
            - 단지 concept 단어만 다른 표현으로 바꾸거나 문장 속에서 제거해. 문장 순서, 내용은 그대로 유지해.

            텍스트:
            %s
            """.formatted(text);

        AtomicInteger index = new AtomicInteger();

        return gptService.askStream(systemPrompt, userPrompt)
                .filter(line -> {
                    String trimmed = line.strip();
                    return !trimmed.isBlank()
                            && !trimmed.equals("```")
                            && !trimmed.equals("```json")
                            && !trimmed.equals("[")
                            && !trimmed.equals("]")
                            && !trimmed.equals(",");
                })
                .transform(this::splitJsonObjectsFromStream)
                .map(json -> {
                    try {
                        Map<String, String> map = objectMapper.readValue(json, new TypeReference<>() {});
                        return CardResponse.builder()
                                .number(index.getAndIncrement())
                                .concept(map.get("concept"))
                                .description(map.get("description"))
                                .build();
                    } catch (Exception e) {
                        throw new RuntimeException("CardResponse 변환 실패: " + json, e);
                    }
                });
    }

    private Flux<String> splitJsonObjectsFromStream(Flux<String> stream) {
        return Flux.create(sink -> {
            StringBuilder buffer = new StringBuilder();
            AtomicInteger braceDepth = new AtomicInteger(0);
            AtomicBoolean insideObject = new AtomicBoolean(false);

            stream.subscribe(
                    chunk -> {
                        for (char c : chunk.toCharArray()) {
                            if (c == '{') {
                                if (!insideObject.get()) {
                                    buffer.setLength(0); // 초기화
                                    insideObject.set(true);
                                }
                                braceDepth.incrementAndGet();
                            }

                            if (insideObject.get()) {
                                buffer.append(c);
                            }

                            if (c == '}') {
                                if (braceDepth.decrementAndGet() == 0 && insideObject.get()) {
                                    insideObject.set(false);
                                    String completed = buffer.toString();
                                    sink.next(completed);
                                }
                            }
                        }
                    },
                    sink::error,
                    sink::complete
            );
        });
    }

}
