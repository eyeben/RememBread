package com.remembread.user.service;

import com.remembread.user.converter.UserConverter;
import com.remembread.user.dto.UserResponseDto;
import com.remembread.user.entity.User;
import com.remembread.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public UserResponseDto updateUserIsAgreedTerms(User user) {
        user.setIsAgreedTerms(true);
        return UserConverter.toUserResponseDto(user);
    }
}
