package com.remembread.game.dto.response;

import com.remembread.game.enums.GameType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class GameSessionResponse {
    private Long id;
    private LocalDateTime playedAt;
    private Integer score;
    private GameType gameType;
}
