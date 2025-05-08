package com.remembread.card.controller;

import com.remembread.apipayload.ApiResponse;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.card.dto.response.CardResponse;
import com.remembread.card.service.TextService;
import com.remembread.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/cards/text")
@RequiredArgsConstructor
public class TextController {

    private final TextService TextService;

    @PostMapping
    @Operation(summary = "개념으로 설명 생성 API", description = "개념 입력 시 설명 텍스트를 생성해주는 API 입니다.")
    public ApiResponse<String> createDescription(@AuthUser User user, @RequestParam("concept") String concept) {
        return ApiResponse.onSuccess(TextService.createDescription(concept));
    }

    @PostMapping(value = "/large", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "대량 텍스트로 생성 스트림 API", description = "대량 텍스트 입력 시 주제별로 하나씩 스트림 방식으로 반환하는 API 입니다.")
    public Flux<CardResponse> streamCards(@AuthUser User user, @RequestBody String text) {
        return TextService.createCardListStream(text);
    }
}
