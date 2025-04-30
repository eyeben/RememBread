package com.remembread.user.service;

import com.remembread.apipayload.code.status.ErrorStatus;
import com.remembread.apipayload.exception.GeneralException;
import com.remembread.user.converter.UserConverter;
import com.remembread.user.dto.UserRequestDto;
import com.remembread.user.dto.UserResponseDto;
import com.remembread.user.entity.User;
import com.remembread.user.repository.CharacterRepository;
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
    private final CharacterRepository characterRepository;

    @Transactional
    public UserResponseDto updateUserIsAgreedTerms(User user) {
        user.setIsAgreedTerms(true);
        return UserConverter.toUserResponseDto(user);
    }

    @Transactional
    public UserResponseDto updateUser(User user, UserRequestDto userRequestDto) {
        user.setNickname(userRequestDto.getNickname());
        user.setPushEnable(userRequestDto.getPushEnable());
        user.setMainCharacter(characterRepository.findById(userRequestDto.getMainCharacterId())
                .orElseThrow(() -> new GeneralException(ErrorStatus.NOT_FOUND_CHARACTER)));

        return UserConverter.toUserResponseDto(user);
    }
}
