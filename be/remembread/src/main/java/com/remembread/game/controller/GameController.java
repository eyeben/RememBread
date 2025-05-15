package com.remembread.game.controller;

import com.remembread.apipayload.ApiResponse;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.game.dto.request.GameRequest;
import com.remembread.game.dto.response.GameResponse;
import com.remembread.game.service.GameService;
import com.remembread.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/games")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @PostMapping
    @Operation(summary = "게임 기록 저장 API", description = "게임 플레이 후 기록을 저장하는 API 입니다.")
    public ApiResponse<GameResponse> saveGameSession(@AuthUser User user, @RequestBody @Valid GameRequest gameRequest) {
        return ApiResponse.onSuccess(gameService.addGameSession(user, gameRequest));
    }
}
