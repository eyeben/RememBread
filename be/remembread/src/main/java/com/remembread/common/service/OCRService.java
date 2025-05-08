package com.remembread.common.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.remembread.common.util.MultipartInputStreamFileResource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class OCRService {

    private final RestTemplate restTemplate = new RestTemplate(); // Bean으로 등록해도 무방
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${clova.ocr.api.url}")
    private String OCR_URL; // 문서 OCR API URL
    @Value("${clova.ocr.api.key}")
    private String OCR_SECRET; // 발급받은 X-OCR-SECRET 키

    public String convert(MultipartFile image) {
        try {
            // JSON metadata 구성
            Map<String, Object> requestPayload = new HashMap<>();
            requestPayload.put("version", "V2");
            requestPayload.put("requestId", UUID.randomUUID().toString());
            requestPayload.put("timestamp", System.currentTimeMillis());

            Map<String, Object> imageInfo = new HashMap<>();
            imageInfo.put("format", getExtension(image.getOriginalFilename()));
            imageInfo.put("name", "image");

            requestPayload.put("images", Collections.singletonList(imageInfo));

            String jsonPayload = objectMapper.writeValueAsString(requestPayload);

            // 요청 바디 구성
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("message", jsonPayload);
            body.add("file", new MultipartInputStreamFileResource(image.getInputStream(), image.getOriginalFilename(), image.getSize()));

            // 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.set("X-OCR-SECRET", OCR_SECRET);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // 요청 실행
            ResponseEntity<String> response = restTemplate.exchange(
                    OCR_URL,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            // 텍스트 추출
            Map<String, Object> responseBody = objectMapper.readValue(response.getBody(), Map.class);
            List<Map<String, Object>> images = (List<Map<String, Object>>) responseBody.get("images");
            if (images == null || images.isEmpty()) return "";

            List<Map<String, Object>> fields = (List<Map<String, Object>>) images.get(0).get("fields");
            if (fields == null) return "";

            return reconstructTextFromOcrFields(fields);

        } catch (IOException e) {
            log.error("OCR 처리 중 오류 발생", e);
            return "";
        }
    }

    private String getExtension(String filename) {
        if (filename == null) return "jpg";
        int dotIndex = filename.lastIndexOf(".");
        return dotIndex != -1 ? filename.substring(dotIndex + 1) : "jpg";
    }

    // 여기서부터 뻘짓
    public String reconstructTextFromOcrFields(List<Map<String, Object>> fields) {
        // 1. 필드 중심 X좌표 기반으로 열 클러스터링
        int threshold = 100; // 같은 열로 묶을 x 거리 기준 (조절 가능)
        List<List<Map<String, Object>>> columns = new ArrayList<>();

        for (Map<String, Object> field : fields) {
            int centerX = getCenterX(field);
            boolean added = false;

            for (List<Map<String, Object>> col : columns) {
                int refX = getCenterX(col.get(0));
                if (Math.abs(centerX - refX) < threshold) {
                    col.add(field);
                    added = true;
                    break;
                }
            }

            if (!added) {
                List<Map<String, Object>> newCol = new ArrayList<>();
                newCol.add(field);
                columns.add(newCol);
            }
        }

        // 2. 열 정렬 (왼쪽 → 오른쪽)
        columns.sort(Comparator.comparing(col -> getCenterX(col.get(0))));

        // 3. 각 열에서 줄 단위로 텍스트 조립
        StringBuilder finalText = new StringBuilder();
        for (List<Map<String, Object>> col : columns) {
            finalText.append(processColumnByLine(col)).append("\n\n");
        }

        return finalText.toString().trim();
    }

    private int getCenterX(Map<String, Object> field) {
        Map<String, Object> bounding = (Map<String, Object>) field.get("boundingPoly");
        List<Map<String, Object>> vertices = (List<Map<String, Object>>) bounding.get("vertices");
        int xSum = 0;
        for (Map<String, Object> v : vertices) {
            xSum += ((Number) v.get("x")).intValue();
        }
        return xSum / vertices.size();
    }

    private int getTopY(Map<String, Object> field) {
        Map<String, Object> bounding = (Map<String, Object>) field.get("boundingPoly");
        List<Map<String, Object>> vertices = (List<Map<String, Object>>) bounding.get("vertices");

        return ((Number) vertices.get(0).get("y")).intValue(); // 좌측 상단 y
    }

    private String processColumnByLine(List<Map<String, Object>> fields) {
        fields.sort(Comparator.comparing(this::getTopY));

        List<List<Map<String, Object>>> lines = new ArrayList<>();
        int lineThreshold = 20;

        for (Map<String, Object> field : fields) {
            int y = getTopY(field);
            boolean added = false;

            for (List<Map<String, Object>> line : lines) {
                int refY = getTopY(line.get(0));
                if (Math.abs(y - refY) < lineThreshold) {
                    line.add(field);
                    added = true;
                    break;
                }
            }

            if (!added) {
                List<Map<String, Object>> newLine = new ArrayList<>();
                newLine.add(field);
                lines.add(newLine);
            }
        }

        StringBuilder sb = new StringBuilder();
        for (List<Map<String, Object>> line : lines) {
            line.sort(Comparator.comparing(f -> {
                Map<String, Object> bounding = (Map<String, Object>) f.get("boundingPoly");
                List<Map<String, Object>> vertices = (List<Map<String, Object>>) bounding.get("vertices");
                return ((Number) vertices.get(0).get("x")).intValue();
            }));

            for (Map<String, Object> field : line) {
                sb.append(field.get("inferText")).append(" ");
            }
            sb.append("\n");
        }

        return sb.toString();
    }

    private boolean isProbablyTableCell(Map<String, Object> field) {
        Map<String, Object> bounding = (Map<String, Object>) field.get("boundingPoly");
        List<Map<String, Object>> vertices = (List<Map<String, Object>>) bounding.get("vertices");

        int x1 = ((Number) vertices.get(0).get("x")).intValue();
        int y1 = ((Number) vertices.get(0).get("y")).intValue();
        int x3 = ((Number) vertices.get(2).get("x")).intValue();
        int y3 = ((Number) vertices.get(2).get("y")).intValue();

        int width = Math.abs(x3 - x1);
        int height = Math.abs(y3 - y1);
        double aspectRatio = width > 0 ? (double) height / width : 0.0;

        // 셀 크기가 작거나 정사각형 형태면 표일 가능성이 높다고 판단
        return (width < 150 && height < 50) || (aspectRatio > 0.8 && aspectRatio < 1.2);
    }

}
