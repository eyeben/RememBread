package com.remembread.user.converter;

import com.remembread.user.dto.UserResponseDto;
import com.remembread.user.entity.User;

public class UserConverter {

    public static UserResponseDto toUserResponseDto(User user) {
        return UserResponseDto.builder()
                .nickname(user.getNickname())
                .mainCharacterId(user.getMainCharacter().getId())
                .mainCharacterImageUrl(user.getMainCharacter().getImageUrl())
                .pushEnable(user.getPushEnable())
                .socialLoginType(user.getSocialLoginType())
                .build();
    }
}
