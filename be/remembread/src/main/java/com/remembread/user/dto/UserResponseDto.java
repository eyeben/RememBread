package com.remembread.user.dto;

import com.remembread.common.enums.SocialLoginType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDto {
    String nickname;
    Long mainCharacterId;
    String mainCharacterImageUrl;
    Boolean notificationTimeEnable;
    LocalTime notificationTime;
    SocialLoginType socialLoginType;
}
