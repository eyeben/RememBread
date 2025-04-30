package com.remembread.card.controller;

import com.remembread.apipayload.ApiResponse;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.card.dto.request.CardSetCreateRequest;
import com.remembread.card.service.CardSetService;
import com.remembread.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/card-sets")
@RequiredArgsConstructor
public class CardSetController {
    private final CardSetService cardSetService;

    @PostMapping
    public ApiResponse<Void> createCardSet(
            @RequestBody CardSetCreateRequest request,
            @AuthUser User user
            ) {
        cardSetService.createCardSet(request, user);
        return ApiResponse.onSuccess(null);
    }
}
