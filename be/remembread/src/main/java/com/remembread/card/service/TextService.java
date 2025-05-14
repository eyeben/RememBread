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

    public Flux<CardResponse> createCardListStream(String text, AtomicInteger index) {
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

        systemPrompt = """
                ### 역할
                입력된 텍스트로부터 사용자가 학습할 플래시카드를 CSV 형식의 텍스트로 출력하는 역할이다.
                모든 출력은 원문에 존재하는 내용으로만 구성해야 하며, 원문의 내용을 아래 규칙에 맞게 CSV 텍스트로 분할만 한다.
                절대로 새로운 텍스트를 생성해서는 안 된다.
                
                ### 규칙
                - 양식은 다음과 같다:
                ```text
                "개념 1", "설명 1"
                "개념 2", "설명 2"
                ...
                ```
                - 각 줄은 "개념", "설명" 쌍으로 구성된 하나의 플래시카드이다.
                - "개념"은 텍스트 내에서 중요한 단어나 개념을 그대로 추출한 것이다. 이것은 단어(Word) 또는 구(Phrase)일 수 있다.
                - "설명"은 "개념"을 다른 문자열로 표현한 것이다. "설명" 또한 원문 텍스트에서 추출하지만, 주의할 점이 몇 가지 있다.
                  - 원문에 존재하는 "개념"에 대한 모든 설명을 그대로 복사해서 가져온다.
                  - 가져온 각 문장에서 "개념"의 문자열과 완전히 일치하는 부분을 제외한 나머지를 포함시켜야 한다.
                - 정말 중요해서 다시 한 번 강조하는데, 무슨 일이 있어도 "설명"에는 "개념"과 동일한 문자열이 직접적으로 들어가면 안 된다.
                """;

        text = text.replace("`", "");
        userPrompt = """
                ### 입력
                다음 텍스트에서 플래시카드를 추출해야 한다:
                ```text
                %s
                ```
                """.formatted(text);

        AtomicBoolean insideCodeBlock = new AtomicBoolean(false);
        AtomicInteger backTickCount = new AtomicInteger(0);

        return gptService.askStream(systemPrompt, userPrompt)
                .filter(line -> {
                    String trimmed = line.strip();
                    for (char c : trimmed.toCharArray()) {
                        if (c == '`' && 3 <= backTickCount.incrementAndGet())
                            insideCodeBlock.set(true);
                    }
                    return insideCodeBlock.get()
                            && !trimmed.isBlank();
                })
                .transform(this::splitCsvObjectsFromStream) // CSV 객체로 분리
                .map(csvLine -> {
                    try {
                        // CSV 라인을 ", "로 분리하고, 각각을 concept와 description에 맵핑
                        String[] fields = csvLine.split("\", \"", -1);  // -1 옵션은 빈 문자열도 유지
                        if (fields.length < 2) {
                            throw new RuntimeException("잘못된 CSV 형식: " + csvLine);
                        }

                        String concept = fields[0].replaceAll("\"", "").strip();
                        String description = fields[1].replaceAll("\"", "").strip();

                        return CardResponse.builder()
                                .number(index.getAndIncrement())
                                .concept(concept)
                                .description(description)
                                .build();
                    } catch (Exception e) {
                        throw new RuntimeException("CardResponse 변환 실패: " + csvLine, e);
                    }
                });
//        return gptService.askStream(systemPrompt, userPrompt)
//                .filter(line -> {
//                    String trimmed = line.strip();
//                    return !trimmed.isBlank()
//                            && !trimmed.equals("```")
//                            && !trimmed.equals("```json")
//                            && !trimmed.equals("[")
//                            && !trimmed.equals("]")
//                            && !trimmed.equals(",");
//                })
//                .transform(this::splitJsonObjectsFromStream)
//                .map(json -> {
//                    try {
//                        Map<String, String> map = objectMapper.readValue(json, new TypeReference<>() {});
//                        return CardResponse.builder()
//                                .number(index.getAndIncrement())
//                                .concept(map.get("concept"))
//                                .description(map.get("description"))
//                                .build();
//                    } catch (Exception e) {
//                        throw new RuntimeException("CardResponse 변환 실패: " + json, e);
//                    }
//                });
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

    private Flux<String> splitCsvObjectsFromStream(Flux<String> stream) {
        return Flux.create(sink -> {
            StringBuilder buffer = new StringBuilder();
            AtomicInteger doubleQuotesCount = new AtomicInteger(0);
            stream.subscribe(
                    chunk -> {
                        for (char c : chunk.toCharArray()) {
                            if (c == '"') {
                                doubleQuotesCount.incrementAndGet();
                            } else if (c == '\n') {
                                buffer.setLength(0);
                                continue;
                            }
                            if (doubleQuotesCount.get() == 0) continue;
                            if (doubleQuotesCount.get() % 4 == 0) {
                                if (c == '"') {
                                    buffer.append(c);
                                    String completed = buffer.toString();
                                    sink.next(completed);
                                }
                            } else {
                                buffer.append(c);
                            }
                        }
                    },
                    sink::error,
                    sink::complete
            );
        });
    }

}
