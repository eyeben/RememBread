package com.remembread.game.dto.request;

import com.remembread.game.enums.GameType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class GameRequest {
    @NotNull
    @Min(0)
    Integer score;

    @NotNull
    GameType gameType;
}
