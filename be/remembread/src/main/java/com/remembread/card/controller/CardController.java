package com.remembread.card.controller;
import com.remembread.apipayload.ApiResponse;
import com.remembread.card.dto.request.CardCreateGetDto;
import com.remembread.card.service.CardService;
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
    public ApiResponse<?> createCard(@RequestBody CardCreateGetDto request) {
        cardService.createCard(request, null);// 로그인 구현 후 변경
        return ApiResponse.onSuccess(null);
    }

}
