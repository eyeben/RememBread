package com.remembread.auth;

import com.remembread.apipayload.code.status.ErrorStatus;
import com.remembread.apipayload.exception.GeneralException;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.user.entity.User;
import com.remembread.user.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthUserArgumentResolver implements HandlerMethodArgumentResolver {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameterAnnotation(AuthUser.class) != null;
    }

    @Override
    @Transactional(readOnly = true)
    public User resolveArgument(
            MethodParameter parameter,
            ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest,
            WebDataBinderFactory binderFactory
    ) {
        HttpServletRequest request = (HttpServletRequest) webRequest.getNativeRequest();
        AuthUser authUserAnnotation = parameter.getParameterAnnotation(AuthUser.class);
        boolean required = authUserAnnotation.required();

        try {
            //access token 추출
            String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                if (required) throw new GeneralException(ErrorStatus.INVALID_ACCESS_TOKEN);
                return null;
            }

            String accessToken = authHeader.split(" ")[1];
            log.info("AuthUserArgumentResolver access token={}", accessToken);

            //검증
            if (!jwtUtil.validateAccessToken(accessToken)) {
                if (required) throw new GeneralException(ErrorStatus.FAILED_TO_VALIDATE_TOKEN);
                return null;
            }

            //Access Token으로 정보 추출
            Long userId = Long.valueOf(jwtUtil.getSubject(accessToken));
            return userRepository.findById(userId)
                    .orElseThrow(() -> new GeneralException(ErrorStatus.NOT_FOUND_USER_ID));
        } catch (RuntimeException e) {
            if (e instanceof GeneralException) {
                throw e; // 이미 GeneralException이면 그대로 던짐
            }

            if (required) {
                throw new GeneralException(ErrorStatus.FAILED_TO_VALIDATE_TOKEN);
            } else {
                return null;
            }
        }
    }
}
