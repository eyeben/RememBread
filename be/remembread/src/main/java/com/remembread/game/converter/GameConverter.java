package com.remembread.game.converter;

import com.remembread.game.dto.response.GameSessionResponse;
import com.remembread.game.entity.GameSession;

public class GameConverter {

    public static GameSessionResponse toGameSessionResponse(GameSession gameSession) {
        return GameSessionResponse.builder()
                .id(gameSession.getId())
                .gameType(gameSession.getGameType())
                .score(gameSession.getScore())
                .playedAt(gameSession.getPlayedAt())
                .build();
    }
}
