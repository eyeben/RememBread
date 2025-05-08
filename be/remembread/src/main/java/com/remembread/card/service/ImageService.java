package com.remembread.card.service;

import com.remembread.card.dto.response.CardResponse;
import com.remembread.common.service.OCRService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageService {

    private final OCRService ocrService;
    private final TextService textService;

    public Flux<CardResponse> createCardListStream(List<MultipartFile> images) {
        return Flux.fromIterable(images)
                .map(ocrService::convert)               // 이미지 하나 → 텍스트 추출
                .doOnNext(text -> log.info("converted text: {}", text))
                .flatMap(textService::createCardListStream); // 텍스트 → 카드 Flux
    }
}
