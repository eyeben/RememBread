package com.remembread.user.controller;

import com.remembread.apipayload.ApiResponse;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.user.converter.UserConverter;
import com.remembread.user.dto.UserResponseDto;
import com.remembread.user.entity.User;
import com.remembread.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/agree")
    @Operation(summary = "약관 동의 API", description = "회원가입 시 이용약관을 동의로 처리하는 API 입니다.")
    public ApiResponse<Void> agreeTerms(@AuthUser User user) {
        userService.updateUserIsAgreedTerms(user);
        return ApiResponse.onSuccess(null);
    }

    @GetMapping
    @Operation(summary = "사용자 정보 조회 API", description = "마이페이지에서 사용자의 정보를 조회하는 API 입니다.")
    public ApiResponse<UserResponseDto> getUserInfo(@AuthUser User user) {
        return ApiResponse.onSuccess(UserConverter.toUserResponseDto(user));
    }
}
