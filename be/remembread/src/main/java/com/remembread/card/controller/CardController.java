package com.remembread.card.controller;
import com.remembread.apipayload.ApiResponse;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.card.dto.request.CardCreateRequest;
import com.remembread.card.dto.request.CardCreateManyRequest;
import com.remembread.card.dto.request.CardUpdateRequest;
import com.remembread.card.dto.response.CardGetResponse;
import com.remembread.card.service.CardService;
import com.remembread.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cards")
@RequiredArgsConstructor
public class CardController {
    private final CardService cardService;

    @PostMapping("")
    public ApiResponse<?> createCard(@RequestBody CardCreateRequest request, @AuthUser User user) {
        cardService.createCard(request, user.getId());// 로그인 구현 후 변경
        return ApiResponse.onSuccess(null);
    }

    @PostMapping("/create-many")
    public ApiResponse<?> createCardMany(@RequestBody CardCreateManyRequest request, @AuthUser User user) {
        cardService.createCardMany(request, user.getId());
        return ApiResponse.onSuccess(null);
    }

    @GetMapping("{cardId}")
    public ApiResponse<CardGetResponse> getCard(@PathVariable Long cardId, @AuthUser User user) {
        return ApiResponse.onSuccess(cardService.getCard(cardId, user.getId()));
    }

    @PatchMapping("/{cardId}")
    public ApiResponse<Void> updateCard(
            @PathVariable Long cardId,
            @RequestBody CardUpdateRequest request,
            @AuthUser User user
    ) {
        cardService.updateCard(cardId, request, user);
        return ApiResponse.onSuccess(null);
    }

    @DeleteMapping("/{cardId}")
    public ApiResponse<Void> deleteCard(
            @PathVariable Long cardId,
            @AuthUser User user
    ) {
        cardService.deleteCard(cardId, user);
        return ApiResponse.onSuccess(null);
    }

}
