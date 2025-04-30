package com.remembread.user.entity;

import com.remembread.common.enums.SocialLoginType;
import com.remembread.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

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
    @Column(nullable = false)
    private SocialLoginType socialLoginType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "main_character_id")
    private Character mainCharacter;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean pushEnable;

    @Setter
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isAgreedTerms;

    @Column(nullable = false)
    private LocalDateTime lastLoginAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<UserCharacter> characterList;
}
