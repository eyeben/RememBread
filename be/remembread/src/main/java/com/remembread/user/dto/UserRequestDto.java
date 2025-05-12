package com.remembread.user.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

import java.time.LocalTime;

@Getter
public class UserRequestDto {
    @NotNull
    @Size(max = 10)
    String nickname;

    @NotNull
    Boolean notificationTimeEnable;

    @NotNull
    @Schema(type = "string", example = "09:00:00")
    LocalTime notificationTime;

    @NotNull
    Long mainCharacterId;
}
