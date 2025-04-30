package com.remembread.user.controller;

import com.remembread.apipayload.ApiResponse;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.user.converter.UserConverter;
import com.remembread.user.dto.UserRequestDto;
import com.remembread.user.dto.UserResponseDto;
import com.remembread.user.entity.User;
import com.remembread.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/agree")
    public ApiResponse<UserResponseDto> agreeTerms(@AuthUser User user) {
        return ApiResponse.onSuccess(userService.updateUserIsAgreedTerms(user));
    }

    @GetMapping
    public ApiResponse<UserResponseDto> getUserInfo(@AuthUser User user) {
        return ApiResponse.onSuccess(UserConverter.toUserResponseDto(user));
    }
}
