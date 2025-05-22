package com.remembread.game.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class GameRankingResponse {
    String nickname;
    String mainCharacterImageUrl;
    Integer rank;
    Integer maxScore;
    LocalDateTime playedAt;
}
