package com.remembread.user.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class UserLocationRequestDto {
    @Digits(integer = 3, fraction = 6)
    Double notificationLocationLatitude;

    @Digits(integer = 3, fraction = 6)
    Double notificationLocationLongitude;

    @NotNull
    Boolean notificationLocationEnable;
}
