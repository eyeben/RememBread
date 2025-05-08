package com.remembread.card.controller;

import com.remembread.apipayload.ApiResponse;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.card.dto.response.CardResponse;
import com.remembread.card.service.LargeTextService;
import com.remembread.common.service.GPTService;
import com.remembread.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.List;

@RestController
@RequestMapping("/cards/large-text")
@RequiredArgsConstructor
public class LargeTextController {

    private final LargeTextService largeTextService;
    private final GPTService gptService;

    @PostMapping
    @Operation(summary = "대량 텍스트로 생성 API", description = "대량 텍스트 입력 시 자동으로 빵을 생성해주는 API 입니다.")
    public ApiResponse<List<CardResponse>> agreeTerms(@AuthUser User user, @RequestBody String text) {
        return ApiResponse.onSuccess(largeTextService.createCardList(text));
    }

    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "대량 텍스트로 생성 스트림 API", description = "대량 텍스트 입력 시 주제별로 하나씩 스트림 방식으로 반환하는 API 입니다.")
    public Flux<CardResponse> streamCards(@AuthUser User user, @RequestBody String text) {
        return largeTextService.createCardListStream(text);
    }
}
