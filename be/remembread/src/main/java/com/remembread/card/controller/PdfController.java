package com.remembread.card.controller;

import com.remembread.auth.annotation.AuthUser;
import com.remembread.card.dto.response.CardResponse;
import com.remembread.card.facade.PdfFacadeService;
import com.remembread.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/cards/pdf")
@RequiredArgsConstructor
public class PdfController {

    private final PdfFacadeService pdfFacadeService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "PDF로 생성 스트림 API", description = "PDF 입력 시 주제별로 하나씩 스트림 방식으로 반환하는 API 입니다.")
    public Flux<CardResponse> streamCards(@AuthUser User user, @RequestPart(name = "file") MultipartFile file) {
        return pdfFacadeService.createCardListStream(file);
    }
}
