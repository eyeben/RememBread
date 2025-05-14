package com.remembread.user.service;

import com.remembread.common.util.GeoUtil;
import com.remembread.user.dto.NotificationMessageDto;
import com.remembread.user.entity.User;
import com.remembread.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationService {
    private final FcmService fcmService;
    private final UserRepository userRepository;

    // 1분 단위로 푸시알람 보내는 함수
    @Scheduled(cron = "0 0/5 * * * *", zone = "Asia/Seoul")
    public void sendNotificationByTime() {
        LocalTime currentTime = LocalTime.now().withSecond(0).withNano(0);
        List<User> users = userRepository.findByNotificationTime(currentTime);

        log.info("time: {}, user count: {}", currentTime, users.size());

        users.forEach(user -> {
            String fcmToken = user.getFcmToken();
            String message = user.getNickname() + "님, 공부하실 시간이에요!";
            String path = "/card-view";

            if (fcmToken != null && !fcmToken.isBlank() && user.getNotificationTimeEnable()) {
                log.info("{} 님에게 알림 전송", user.getNickname());
                NotificationMessageDto notificationMessageDto = NotificationMessageDto.of("암기빵", message);
                fcmService.send(fcmService.createMessage(fcmToken, notificationMessageDto, path));
            }
        });
    }

    // 위치 기반으로 푸시알람 보내는 함수
    public Boolean sendNotificationByLocation(User user, Double latitude, Double longitude) {
        if (GeoUtil.isWithin200m(latitude, longitude, user.getNotificationLocationLatitude(), user.getNotificationLocationLongitude())) {
            String fcmToken = user.getFcmToken();
            String message = user.getNickname() + "님, 공부하실 시간이에요!";
            String path = "/card-view";

            if (fcmToken != null && !fcmToken.isBlank()) {
                log.info("{} 님에게 알림 전송", user.getNickname());
                NotificationMessageDto notificationMessageDto = NotificationMessageDto.of("암기빵", message);
                fcmService.send(fcmService.createMessage(fcmToken, notificationMessageDto, path));
            }



            return true;
        }

        return false;
    }

}
