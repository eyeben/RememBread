package com.remembread.user.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class UserLocationRequest {
    @Digits(integer = 3, fraction = 6)
    Double notificationLocationLatitude;

    @Digits(integer = 3, fraction = 6)
    Double notificationLocationLongitude;

    @NotNull
    Boolean notificationLocationEnable;
}
