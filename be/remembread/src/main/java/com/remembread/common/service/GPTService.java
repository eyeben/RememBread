package com.remembread.common.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.Map;

@Service
public class GPTService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${chatgpt.openai.api.key}")
    private String OPENAI_API_KEY;
    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private static final String OPENAI_MODEL = "gpt-4o";

    public GPTService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public String ask(String systemPrompt, String userPrompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(OPENAI_API_KEY);

            // 메시지 JSON 배열 구성
            List<Map<String, String>> messages = List.of(
                    Map.of("role", "system", "content", systemPrompt),
                    Map.of("role", "user", "content", userPrompt)
            );

            // 전체 요청 바디 구성
            Map<String, Object> requestBody = Map.of(
                    "model", OPENAI_MODEL,
                    "messages", messages,
                    "temperature", 0.0
            );

            // 안전한 JSON 직렬화
            String body = objectMapper.writeValueAsString(requestBody);

            HttpEntity<String> request = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    OPENAI_API_URL, request, String.class
            );

            JsonNode root = objectMapper.readTree(response.getBody());
            return root.path("choices").get(0).path("message").path("content").asText();

        } catch (Exception e) {
            throw new RuntimeException("GPT 호출 중 오류 발생", e);
        }
    }

    public Flux<String> askStream(String systemPrompt, String userPrompt) {
        try {
            WebClient webClient = WebClient.builder()
                    .baseUrl("https://api.openai.com/v1/chat/completions")
                    .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + OPENAI_API_KEY)
                    .build();

            // 메시지 JSON 배열 구성
            List<Map<String, String>> messages = List.of(
                    Map.of("role", "system", "content", systemPrompt),
                    Map.of("role", "user", "content", userPrompt)
            );

            // 전체 요청 바디 구성
            Map<String, Object> requestBody = Map.of(
                    "model", OPENAI_MODEL,
                    "messages", messages,
                    "temperature", 0.0,
                    "stream", true
            );

            String requestValue = objectMapper.writeValueAsString(requestBody);

            Flux<String> eventStream = webClient.post()
                    .bodyValue(requestValue)
                    .accept(MediaType.TEXT_EVENT_STREAM)
                    .retrieve()
                    .bodyToFlux(String.class)
                    .map(data -> {
                        try {
                            JsonNode root = objectMapper.readTree(data);
                            return root.get("choices").get(0).get("delta").get("content").asText("");
                        } catch (Exception e) {
                            return ""; // content 없는 chunk 무시
                        }
                    })
                    .filter(c -> !c.isBlank());

            return eventStream;
        } catch (Exception e) {
            throw new RuntimeException("GPT 호출 중 오류 발생", e);
        }
    }
}
