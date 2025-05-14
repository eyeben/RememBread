package com.remembread.user.service;

import com.google.firebase.messaging.*;
import com.remembread.user.dto.NotificationMessageDto;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Builder
@RequiredArgsConstructor
public class FcmService {

    public void send(Message message) {
        try {
            String response = FirebaseMessaging.getInstance().send(message);
            log.info("FCM 전송 성공: {}", response);
        } catch (FirebaseMessagingException e) {
            log.error("FCM 전송 실패: {}", e.getMessage(), e);
        }
    }

    //다음 행동 유도가 필요할 때 path를 쓴다
    public Message createMessage(String deviceToken, NotificationMessageDto notificationMessageDto, String path) {
        Notification notification = notificationMessageDto.toNotification();

        return Message.builder()
                .setToken(deviceToken)
                .setNotification(notification)
                .setApnsConfig(
                        ApnsConfig.builder()
                                .setAps(
                                        Aps.builder()
                                                .setSound("default")
                                                .build()
                                )
                                .build()
                )
                .putData("title", notificationMessageDto.title())
                .putData("body", notificationMessageDto.body())
                .putData("type", "NOTIFY")
                .putData("path", path)
                .putData("sound", "default")
                .build();
    }
}
