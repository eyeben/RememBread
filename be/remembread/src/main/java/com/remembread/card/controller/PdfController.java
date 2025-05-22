package com.remembread.card.controller;

import com.remembread.apipayload.code.status.ErrorStatus;
import com.remembread.apipayload.exception.GeneralException;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.card.dto.response.CardResponse;
import com.remembread.card.facade.PdfFacadeService;
import com.remembread.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
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

    @PostMapping(value = "/pages", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "PDF로 생성 스트림 API (페이지 지정)", description = "PDF 입력 시 주제별로 하나씩 스트림 방식으로 반환하는 API 입니다. 시작 페이지에서부터 끝 페이지까지의 내용만 추출합니다.")
    public Flux<CardResponse> streamCardsByPage(@AuthUser User user,
                                                @RequestPart(name = "file") MultipartFile file,
                                                @RequestParam(name = "startPage") Integer startPage,
                                                @RequestParam(name = "endPage") Integer endPage) {
        if (endPage - startPage > 4) {
            throw new GeneralException(ErrorStatus.TOO_MANY_PAGES);
        }

        return pdfFacadeService.createCardListStreamByPage(file, startPage, endPage);
    }
}
