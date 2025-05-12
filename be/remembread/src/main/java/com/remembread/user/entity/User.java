package com.remembread.user.entity;

import com.remembread.common.enums.SocialLoginType;
import com.remembread.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Column(nullable = false, length = 10)
    private String nickname;

    @Column(nullable = false)
    private String socialLoginId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SocialLoginType socialLoginType;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "main_character_id")
    private Character mainCharacter;

    @Column(length = 255)
    private String fcmToken;

    @Setter
    @Column(nullable = false, columnDefinition = "DEFAULT '09:00:00'")
    private LocalTime notificationTime;

    @Setter
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean notificationTimeEnable;

    private Double notificationLocationLatitude;

    private Double notificationLocationLongitude;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean notificationLocationEnable;

    private LocalDateTime lastLocationNotified;

    @Setter
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isAgreedTerms;

    @Column(nullable = false)
    private LocalDateTime lastLoginAt;
}
