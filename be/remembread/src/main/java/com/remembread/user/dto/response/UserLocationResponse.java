package com.remembread.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserLocationResponse {
    Double notificationLocationLatitude;
    Double notificationLocationLongitude;
    Boolean notificationLocationEnable;
}
