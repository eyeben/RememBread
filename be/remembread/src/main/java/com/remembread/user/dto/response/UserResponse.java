package com.remembread.user.dto.response;

import com.remembread.common.enums.SocialLoginType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    String nickname;
    Long mainCharacterId;
    String mainCharacterImageUrl;
    Boolean notificationTimeEnable;
    LocalTime notificationTime;
    SocialLoginType socialLoginType;
}
