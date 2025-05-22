package com.remembread.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

import java.time.LocalTime;

@Getter
public class UserRequest {
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
