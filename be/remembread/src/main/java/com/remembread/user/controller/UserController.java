package com.remembread.user.controller;

import com.remembread.apipayload.ApiResponse;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.user.converter.UserConverter;
import com.remembread.user.dto.UserCharacterResponseDto;
import com.remembread.user.dto.UserRequestDto;
import com.remembread.user.dto.UserResponseDto;
import com.remembread.user.entity.User;
import com.remembread.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PatchMapping("/agree")
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

    @GetMapping("/characters")
    @Operation(summary = "사용자 캐릭터 조회 API", description = "사용자가 가지고 있는 캐릭터의 정보를 조회하는 API 입니다.")
    public ApiResponse<List<UserCharacterResponseDto>> getUserCharacterInfo(@AuthUser User user) {
        return ApiResponse.onSuccess(userService.getUserCharacter(user));
    }

    @PatchMapping
    @Operation(summary = "사용자 정보 수정 API", description = "마이페이지에서 사용자의 메인 캐릭터, 닉네임, 푸시 알림 여부를 수정하는 API 입니다.")
    public ApiResponse<UserResponseDto> modifyUserInfo(@AuthUser User user, @RequestBody @Valid UserRequestDto userRequestDto) {
        return ApiResponse.onSuccess(userService.updateUser(user, userRequestDto));
    }

    @DeleteMapping
    @Operation(summary = "사용자 탈퇴 API", description = "사용자를 탈퇴 처리하는 API입니다. 관련 정보가 모두 삭제됩니다.")
    public ApiResponse<Void> withdrawUser(@AuthUser User user) {
        userService.deleteUser(user);
        return ApiResponse.onSuccess(null);
    }

}
