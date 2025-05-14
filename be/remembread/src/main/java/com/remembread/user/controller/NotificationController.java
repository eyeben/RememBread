package com.remembread.user.controller;

import com.remembread.apipayload.ApiResponse;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.user.entity.User;
import com.remembread.user.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    @Operation(summary = "위치 전송 API", description = "사용자의 위치가 기준점 200m 이내면 알림을 전송하는 API 입니다.")
    public ApiResponse<Boolean> modifyFcmToken(
                @AuthUser User user,
                @RequestParam("latitude") Double latitude,
                @RequestParam("longitude") Double longitude
            ) {
        return ApiResponse.onSuccess(notificationService.sendNotificationByLocation(user, latitude, longitude));
    }
}
