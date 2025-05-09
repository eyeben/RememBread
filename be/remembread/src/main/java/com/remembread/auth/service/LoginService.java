package com.remembread.auth.service;

import com.remembread.apipayload.code.status.ErrorStatus;
import com.remembread.apipayload.exception.GeneralException;
import com.remembread.auth.JwtUtil;
import com.remembread.auth.entity.RefreshToken;
import com.remembread.auth.entity.UserTokens;
import com.remembread.auth.infrastructure.*;
import com.remembread.card.entity.Folder;
import com.remembread.card.repository.FolderRepository;
import com.remembread.common.enums.SocialLoginType;
import com.remembread.common.service.RedisService;
import com.remembread.user.entity.Character;
import com.remembread.user.entity.User;
import com.remembread.user.entity.UserCharacter;
import com.remembread.user.repository.CharacterRepository;
import com.remembread.user.repository.UserCharacterRepository;
import com.remembread.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.security.MessageDigest;
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
    private final CharacterRepository characterRepository;
    private final UserCharacterRepository userCharacterRepository;
    private final FolderRepository folderRepository;

    private final KakaoOAuthProvider kakaoOAuthProvider;
    private final NaverOAuthProvider naverOAuthProvider;
    private final GoogleOAuthProvider googleOAuthProvider;

    @Transactional
    public UserTokens login(String code, SocialLoginType socialLoginType, String redirectUri) {
        String socialLoginId = "";
        String nickname = "";

        switch (socialLoginType) {
            case KAKAO -> {
                KakaoUserInfo userInfo = kakaoOAuthProvider.getUserInfo(code, redirectUri);
                socialLoginId = userInfo.getSocialLoginId();
                nickname = userInfo.getNickname();
                nickname = nickname.length() < 6 ? nickname : nickname.substring(0, 6);
                nickname += socialLoginId.substring(0, 4);
            }
            case NAVER -> {
                NaverUserInfo userInfo = naverOAuthProvider.getUserInfo(code, redirectUri);
                socialLoginId = userInfo.getSocialLoginId();

                try {
                    nickname = userInfo.getNickname();
                    nickname = nickname.length() < 6 ? nickname : nickname.substring(0, 6);
                    nickname = generateNickname(nickname, socialLoginId);
                } catch (Exception e) {
                    throw new GeneralException(ErrorStatus._INTERNAL_SERVER_ERROR);
                }
            }
            case GOOGLE -> {
                GoogleUserInfo userInfo = googleOAuthProvider.getUserInfo(code, redirectUri);
                socialLoginId = userInfo.getSocialLoginId();
                nickname = userInfo.getNickname();
                nickname = nickname.length() < 6 ? nickname : nickname.substring(0, 6);
                nickname += socialLoginId.substring(0, 4);
            }
            default -> throw new GeneralException(ErrorStatus.INVALID_SOCIAL_PROVIDER);
        }

        if (socialLoginId == null || nickname == null) {
            throw new GeneralException(ErrorStatus._BAD_REQUEST);
        }

        User user = findOrCreateUser(nickname, socialLoginId, socialLoginType);
        log.info("user id: {}", user.getId());

        UserTokens userTokens = jwtUtil.createLoginToken(user.getIsAgreedTerms(), user.getId().toString());
        RefreshToken refreshToken = new RefreshToken(user.getId(), userTokens.getRefreshToken());
        redisService.setValue(redisPrefix + "::refresh-token::" + user.getId(), userTokens.getRefreshToken(), Duration.ofDays(7));

        return userTokens;
    }

    public String generateNickname(String nickname, String socialLoginId) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] hashBytes = md.digest(socialLoginId.getBytes());
        int hash = new BigInteger(1, hashBytes).mod(BigInteger.valueOf(10000)).intValue();
        String suffix = String.format("%04d", hash); // 항상 4자리로 맞춤
        return nickname + suffix;
    }

    @Transactional(readOnly = true)
    public UserTokens reissueAccessToken(String refreshToken, String authHeader) {
        String accessToken = authHeader.split(" ")[1];

        boolean isAccessTokenValid = jwtUtil.validateAccessToken(accessToken);
        boolean isRefreshTokenValid = jwtUtil.validateRefreshToken(refreshToken);

        log.info("reissueAccessToken 요청... accessToken: {}, refreshToken: {}", accessToken, refreshToken);

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

        Boolean isAgreedTerms = userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new GeneralException(ErrorStatus.NOT_FOUND_USER_ID)).getIsAgreedTerms();

        return new UserTokens(isAgreedTerms, userId, refreshToken, reissuedAccessToken);
    }

    public Long logout(User user) {
        redisService.deleteValue(redisPrefix + "::refresh-token::" + user.getId());
        return user.getId();
    }

    @Transactional
    public User findOrCreateUser(String nickname, String socialLoginId, SocialLoginType socialLoginType) {
        User user = userRepository.findBySocialLoginId(socialLoginId)
                .orElseGet(() -> createUser(nickname, socialLoginId, socialLoginType));
        user.setLastLoginAt(LocalDateTime.now(ZoneId.of("Asia/Seoul")));
        return user;
    }

    @Transactional
    public User createUser(String nickname, String socialLoginId, SocialLoginType socialLoginType) {
        Character defaultCharacter = characterRepository.findByIsDefaultTrue()
                .orElseThrow(() -> new RuntimeException("기본 캐릭터가 없습니다"));

        User user = userRepository.save(User.builder()
                .nickname(nickname)
                .socialLoginId(socialLoginId)
                .socialLoginType(socialLoginType)
                .mainCharacter(defaultCharacter)
                .pushEnable(false)
                .isAgreedTerms(false)
                .build());

        userCharacterRepository.save(UserCharacter.builder()
                .user(user)
                .character(defaultCharacter)
                .build());
        //루트 폴더 생성
        Folder rootFolder = Folder.builder()
                .user(user)
                .name("root")
                .upperFolder(null)
                .build();
        folderRepository.save(rootFolder);

        return user;
    }
}
