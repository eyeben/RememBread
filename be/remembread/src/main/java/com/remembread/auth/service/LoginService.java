package com.remembread.auth.service;

import com.remembread.apipayload.code.status.ErrorStatus;
import com.remembread.apipayload.exception.GeneralException;
import com.remembread.auth.JwtUtil;
import com.remembread.auth.entity.RefreshToken;
import com.remembread.auth.entity.UserTokens;
import com.remembread.auth.infrastructure.*;
import com.remembread.common.enums.SocialLoginType;
import com.remembread.common.service.RedisService;
import com.remembread.user.entity.User;
import com.remembread.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
@Slf4j
@RequiredArgsConstructor
public class LoginService {

    @Value("${spring.application.name}")
    private String redisPrefix;

    private final JwtUtil jwtUtil;
    private final RedisService redisService;
    private final UserRepository userRepository;

    private final KakaoOAuthProvider kakaoOAuthProvider;
    private final NaverOAuthProvider naverOAuthProvider;
    private final GoogleOAuthProvider googleOAuthProvider;

    @Transactional
    public UserTokens login(String code, SocialLoginType socialLoginType) {
        String socialLoginId = "";
        String nickname = "";

        switch (socialLoginType) {
            case KAKAO -> {
                KakaoUserInfo userInfo = kakaoOAuthProvider.getUserInfo(code);
                socialLoginId = userInfo.getSocialLoginId();
                nickname = userInfo.getNickname();
            }
            case NAVER -> {
                NaverUserInfo userInfo = naverOAuthProvider.getUserInfo(code);
                socialLoginId = userInfo.getSocialLoginId();
                nickname = userInfo.getNickname();
            }
            case GOOGLE -> {
                GoogleUserInfo userInfo = googleOAuthProvider.getUserInfo(code);
                socialLoginId = userInfo.getSocialLoginId();
                nickname = userInfo.getNickname();
            }
            default -> throw new GeneralException(ErrorStatus.INVALID_SOCIAL_PROVIDER);
        }

        if (socialLoginId == null || nickname == null) {
            throw new GeneralException(ErrorStatus._BAD_REQUEST);
        }

        boolean isNew = userRepository.findBySocialLoginId(socialLoginId).isEmpty();

        User user = findOrCreateUser(nickname + socialLoginId.substring(0, 4), socialLoginId, socialLoginType);
        log.info("user id: {}", user.getId());

        UserTokens userTokens = jwtUtil.createLoginToken(isNew, user.getId().toString());
        RefreshToken refreshToken = new RefreshToken(user.getId(), userTokens.getRefreshToken());
        redisService.setValue(redisPrefix + "::refresh-token::" + user.getId(), userTokens.getRefreshToken(), Duration.ofDays(7));

        return userTokens;
    }

    public UserTokens reissueAccessToken(String refreshToken, String authHeader) {
        String accessToken = authHeader.split(" ")[1];

        boolean isAccessTokenValid = jwtUtil.validateAccessToken(accessToken);
        boolean isRefreshTokenValid = jwtUtil.validateRefreshToken(refreshToken);

        String userId = null;

        if (isAccessTokenValid) {
            userId = jwtUtil.getSubject(accessToken);
        } else if (isRefreshTokenValid) {
            userId = jwtUtil.getSubject(refreshToken);
        }

        if (userId == null) {
            throw new GeneralException(ErrorStatus.FAILED_TO_VALIDATE_TOKEN);
        }

        String savedToken = (String) redisService.getValue(redisPrefix + "::refresh-token::" + userId);
        if (!isRefreshTokenValid || savedToken == null || !savedToken.equals(refreshToken)) {
            throw new GeneralException(ErrorStatus.INVALID_REFRESH_TOKEN);
        }

        String reissuedAccessToken = isAccessTokenValid ? accessToken : jwtUtil.reissueAccessToken(userId);

        return new UserTokens(false, userId, null, reissuedAccessToken);
    }


    public Long logout(User user) {
        redisService.deleteValue(redisPrefix + "::refresh-token::" + user.getId());
        return user.getId();
    }

    @Transactional
    public User findOrCreateUser(String nickname, String socialLoginId, SocialLoginType socialLoginType) {
        return userRepository.findBySocialLoginId(socialLoginId)
                .orElseGet(() -> createUser(nickname, socialLoginId, socialLoginType));
    }

    @Transactional
    public User createUser(String nickname, String socialLoginId, SocialLoginType socialLoginType) {
        return userRepository.save(User.builder()
                .nickname(nickname)
                .socialLoginId(socialLoginId)
                .socialLoginType(socialLoginType)
                .lastLoginAt(LocalDateTime.now(ZoneId.of("Asia/Seoul")))
                .build());
    }
}
