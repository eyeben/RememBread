package com.remembread.auth.controller;

import com.remembread.apipayload.ApiResponse;
import com.remembread.apipayload.code.status.ErrorStatus;
import com.remembread.apipayload.exception.GeneralException;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.auth.entity.UserTokens;
import com.remembread.auth.entity.response.AccessTokenResponse;
import com.remembread.auth.service.LoginService;
import com.remembread.common.enums.SocialLoginType;
import com.remembread.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class LoginController {

    private static final int ONE_WEEK_SECONDS = 604800;
    private final LoginService loginService;

    @GetMapping("/login/{provider}")
    @Operation(summary = "로그인 API", description = "소셜 로그인을 하는 API입니다. Access Token을 반환하고 쿠키에 Refresh Token을 저장합니다.")
    public ApiResponse<AccessTokenResponse> socialLogin(
            @PathVariable("provider") String provider,
            @RequestParam("code") String code,
            @RequestParam(name = "redirect-uri", required = false) String redirectUri,
            HttpServletResponse response
    ) {
        // Redirect URI 유효성 검사
        if (redirectUri == null) {
            redirectUri = "http://localhost:8080/auth/login/" + provider.toLowerCase();
        } else {
            int lastSlash = redirectUri.lastIndexOf('/');
            String baseUrl = (lastSlash > -1) ? redirectUri.substring(0, lastSlash) : redirectUri;

            if (!baseUrl.equals("http://localhost:5173/account/login") && !baseUrl.equals("https://remembread.co.kr/account/login")) {
                throw new GeneralException(ErrorStatus.INVALID_REDIRECT_URI);
            }
        }

        SocialLoginType loginType = SocialLoginType.valueOf(provider.toUpperCase());
        UserTokens tokens = loginService.login(code, loginType, redirectUri);

        ResponseCookie cookie = ResponseCookie.from("refresh-token", tokens.getRefreshToken())
                .maxAge(ONE_WEEK_SECONDS)
                .httpOnly(true)
                .sameSite("None")
                .secure(true)
                .path("/")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ApiResponse.onSuccess(new AccessTokenResponse(tokens.getIsAgreedTerms(), tokens.getUserId(), tokens.getAccessToken()));
    }

    @PostMapping("/reissue")
    @Operation(summary = "Access Token 재발급 API", description = "Refresh Token을 기반으로 Access Token을 재발급하는 API 입니다.")
    public ApiResponse<AccessTokenResponse> reissueToken(
            @CookieValue("refresh-token") String refreshToken,
            @RequestHeader("Authorization") String authHeader
    ) {
        UserTokens reissuedToken = loginService.reissueAccessToken(refreshToken, authHeader);
        return ApiResponse.onSuccess(new AccessTokenResponse(reissuedToken.getIsAgreedTerms(), reissuedToken.getUserId(), reissuedToken.getAccessToken()));
    }

    @PostMapping(value = "/logout")
    @Operation(summary = "로그아웃 API", description = "소셜 로그인으로부터 로그아웃하는 API 입니다.")
    public ApiResponse<Long> logout(@AuthUser User user) {
        return ApiResponse.onSuccess(loginService.logout(user));
    }
}
