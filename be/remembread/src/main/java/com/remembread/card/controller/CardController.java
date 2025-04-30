package com.remembread.card.controller;
import com.remembread.apipayload.ApiResponse;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.card.dto.request.CardCreateRequest;
import com.remembread.card.dto.request.CardCreateManyRequest;
import com.remembread.card.service.CardService;
import com.remembread.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
