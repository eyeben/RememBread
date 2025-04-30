package com.remembread.card.controller;

import com.remembread.apipayload.ApiResponse;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.card.service.CardSetService;
import com.remembread.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/card-sets")
@RequiredArgsConstructor
public class CardSetController {
    private final CardSetService cardSetService;

    @PostMapping("/{cardSetId}/fork")
    public ApiResponse<?> forkCardSet(@PathVariable Long cardSetId, @RequestBody Long folderId, @AuthUser User user) {
        cardSetService.forkCardSet(cardSetId, folderId, user.getId());
        return ApiResponse.onSuccess(null);
    }
}
