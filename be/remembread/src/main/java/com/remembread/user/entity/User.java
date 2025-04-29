package com.remembread.user.entity;

import com.remembread.common.enums.SocialLoginType;
import com.remembread.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

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

    @Column(nullable = false, length = 10)
    private String nickname;

    @Column(nullable = false)
    private String socialLoginId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "social_login_type")
    private SocialLoginType socialLoginType;

    @Column(nullable = false, length = 10)
    private LocalDateTime lastLoginAt;
}
