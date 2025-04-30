package com.remembread.user.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class UserRequestDto {
    @NotNull
    @Size(max = 10)
    String nickname;

    @NotNull
    Boolean pushEnable;

    @NotNull
    Long mainCharacterId;
}
