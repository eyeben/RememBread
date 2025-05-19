package com.remembread.user.service;

import com.remembread.common.service.FcmService;
import com.remembread.common.util.GeoUtil;
import com.remembread.user.dto.NotificationMessage;
import com.remembread.user.entity.User;
import com.remembread.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
        LocalTime currentTime = roundToNearest5Minutes(LocalTime.now());
        List<User> users = userRepository.findByNotificationTime(currentTime);

        log.info("time: {}, user count: {}", currentTime, users.size());

        users.forEach(user -> {
            String fcmToken = user.getFcmToken();
            String message = user.getNickname() + "님, 공부하실 시간이에요! 오늘도 힘내볼까요?";
            String path = "/card-view";

            if (fcmToken != null && !fcmToken.isBlank() && user.getNotificationTimeEnable()) {
                NotificationMessage notificationMessage = NotificationMessage.of("암기빵", message);
                fcmService.send(fcmService.createMessage(fcmToken, notificationMessage, path));
            }
        });
    }

    // 위치 기반으로 푸시알람 보내는 함수
    @Transactional
    public Boolean sendNotificationByLocation(User user, Double latitude, Double longitude) {
        if (user.getNotificationLocationEnable()
                && (user.getLastLocationNotified() == null
                    || user.getLastLocationNotified().isBefore(LocalDateTime.now().minusHours(12)))
                && GeoUtil.isWithin200m(latitude, longitude, user.getNotificationLocationLatitude(), user.getNotificationLocationLongitude())) {

            String fcmToken = user.getFcmToken();
            String message = user.getNickname() + "님, 이 장소 뭔가 익숙한데요? 슬슬 공부를 시작해봐요!";
            String path = "/card-view";

            if (fcmToken != null && !fcmToken.isBlank()) {
                log.info("{} 님에게 알림 전송", user.getNickname());
                NotificationMessage notificationMessage = NotificationMessage.of("암기빵", message);
                fcmService.send(fcmService.createMessage(fcmToken, notificationMessage, path));
            }

            user.setLastLocationNotified(LocalDateTime.now());
            return true;
        }

        return false;
    }

    // 현재 시간 5분 단위에 맞게 조정
    private LocalTime roundToNearest5Minutes(LocalTime time) {
        int minute = time.getMinute();
        int roundedMinute = Math.round(minute / 5.0f) * 5;

        return time
                .withMinute(roundedMinute % 60)
                .withSecond(0)
                .withNano(0)
                .plusHours(roundedMinute / 60); // 60분 초과 시 시간 반영
    }

}
