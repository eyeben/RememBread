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

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class TextService {

    private final GPTService gptService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String createDescription(String concept) {
        try {
            String systemPrompt = "너는 사용자가 입력한 용어에 대해 신뢰할 수 있는 설명을 정확하게 작성하는 역할을 해.";

            String userPrompt = """
            - 이 개념에 대해 신뢰할 수 있는 설명을 한 문단으로 작성해줘.
            - 설명에는 입력된 개념 단어가 그대로 들어가면 안 되고, 다른 표현으로 바꾸거나 자연스럽게 생략해야 해.
            - 무조건 검증된 자료와 표준에 기반한 내용만을 사용해 설명해야 해.

            텍스트:
            %s
            """.formatted(concept);

            return gptService.ask(systemPrompt, userPrompt);

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

        AtomicInteger index = new AtomicInteger(1);

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
