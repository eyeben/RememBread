package com.remembread.card.facade;

import com.remembread.card.dto.response.CardResponse;
import com.remembread.card.service.TextService;
import com.remembread.common.service.OCRService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageFacadeService {

    private final OCRService ocrService;
    private final TextService textService;

    public Flux<CardResponse> createCardListStream(List<MultipartFile> images) {
        AtomicInteger globalIndex = new AtomicInteger(1);

        return Flux.fromIterable(images)
                .concatMap(image -> {
                    String text = ocrService.convert(image);
                    return textService.createCardListStream(text, globalIndex); // 공유된 index로 넘김
                });
    }
}
