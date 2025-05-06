package com.remembread.card.controller;

import com.remembread.apipayload.ApiResponse;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.card.dto.response.CardResponse;
import com.remembread.card.service.LargeTextService;
import com.remembread.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/cards/large-text")
@RequiredArgsConstructor
public class LargeTextController {

    private final LargeTextService largeTextService;

    @PostMapping
    @Operation(summary = "대량 텍스트로 생성 API", description = "대량 텍스트 입력 시 자동으로 빵을 생성해주는 API 입니다.")
    public ApiResponse<List<CardResponse>> agreeTerms(@AuthUser User user, @RequestBody String text) {
        return ApiResponse.onSuccess(largeTextService.createCardList(text));
    }
}
