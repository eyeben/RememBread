package com.remembread.user.converter;

import com.remembread.user.dto.response.UserLocationResponse;
import com.remembread.user.dto.response.UserResponse;
import com.remembread.user.entity.User;

public class UserConverter {

    public static UserResponse toUserResponseDto(User user) {
        return UserResponse.builder()
                .nickname(user.getNickname())
                .mainCharacterId(user.getMainCharacter().getId())
                .mainCharacterImageUrl(user.getMainCharacter().getImageUrl())
                .notificationTimeEnable(user.getNotificationTimeEnable())
                .notificationTime(user.getNotificationTime())
                .socialLoginType(user.getSocialLoginType())
                .build();
    }

    public static UserLocationResponse toUserLocationResponse(User user) {
        return UserLocationResponse.builder()
                .notificationLocationLatitude(user.getNotificationLocationLatitude())
                .notificationLocationLongitude(user.getNotificationLocationLongitude())
                .notificationLocationEnable(user.getNotificationTimeEnable())
                .build();
    }
}
