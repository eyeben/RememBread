package com.remembread.user.dto;

import com.remembread.common.enums.SocialLoginType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDto {
    String nickname;
    String mainCharacterImageUrl;
    Boolean pushEnable;
    SocialLoginType socialLoginType;
}
