package com.remembread.card.controller;

import com.remembread.apipayload.ApiResponse;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.card.dto.request.CardSetCreateRequest;
import com.remembread.card.dto.request.CardSetUpdateRequest;
import com.remembread.card.dto.response.CardListResponse;
import com.remembread.card.dto.response.CardSetResponse;
import com.remembread.card.dto.request.ForkCardSetRequest;
import com.remembread.card.service.CardSetService;
import com.remembread.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/{cardSetId}/fork")
    public ApiResponse<?> forkCardSet(@PathVariable Long cardSetId, @RequestBody ForkCardSetRequest request, @AuthUser User user) {
        cardSetService.forkCardSet(cardSetId, request.getFolderId(), user.getId());
        return ApiResponse.onSuccess(null);
    }


    @GetMapping("/{cardSetId}")
    public ApiResponse<CardSetResponse> getCardSetInfo(@PathVariable Long cardSetId) {
        CardSetResponse response = cardSetService.getCardSetInfo(cardSetId);
        return ApiResponse.onSuccess(response);
    }

    @GetMapping("/{cardSetId}/cards")
    public ApiResponse<CardListResponse> getCardSetList(@PathVariable Long cardSetId) {
        CardListResponse response = cardSetService.getCardSetList(cardSetId);
        return ApiResponse.onSuccess(response);
    }

    @PatchMapping("/{cardSetId}")
    public ApiResponse<Void> updateCardSet(
            @PathVariable Long cardSetId,
            @RequestBody CardSetUpdateRequest request
    ) {
        cardSetService.updateCardSetInfo(cardSetId, request);
        return ApiResponse.onSuccess(null);
    }
}
