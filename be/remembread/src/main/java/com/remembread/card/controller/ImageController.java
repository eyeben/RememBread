package com.remembread.card.controller;

import com.remembread.auth.annotation.AuthUser;
import com.remembread.card.dto.response.CardResponse;
import com.remembread.card.facade.ImageFacadeService;
import com.remembread.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;

import java.util.List;

@RestController
@RequestMapping("/cards/image")
@RequiredArgsConstructor
public class ImageController {

    private final ImageFacadeService imageFacadeService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "이미지로 생성 스트림 API", description = "이미지 입력 시 주제별로 하나씩 스트림 방식으로 반환하는 API 입니다.")
    public Flux<CardResponse> streamCards(@AuthUser User user, @RequestPart(name = "image") List<MultipartFile> images) {
        return imageFacadeService.createCardListStream(images);
    }
}
