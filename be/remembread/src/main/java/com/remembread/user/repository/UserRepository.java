package com.remembread.user.repository;

import com.remembread.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findBySocialLoginId(String socialLoginId);
    Optional<User> findByNickname(String nickname);
    List<User> findByNotificationTime(LocalTime notificationTime);

    @Query("SELECT u.notificationTimeEnable FROM User u WHERE u.id = :id")
    Boolean findNotificationTimeEnableById(@Param("id") Long id);

}
