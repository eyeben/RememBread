package com.remembread.user.service;

import com.remembread.apipayload.code.status.ErrorStatus;
import com.remembread.apipayload.exception.GeneralException;
import com.remembread.user.converter.UserConverter;
import com.remembread.user.dto.request.UserFcmTokenRequest;
import com.remembread.user.dto.request.UserLocationRequest;
import com.remembread.user.dto.request.UserRequest;
import com.remembread.user.dto.response.UserCharacterResponse;
import com.remembread.user.dto.response.UserResponse;
import com.remembread.user.entity.Character;
import com.remembread.user.entity.User;
import com.remembread.user.repository.CharacterRepository;
import com.remembread.user.repository.UserCharacterRepository;
import com.remembread.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CharacterRepository characterRepository;
    private final UserCharacterRepository userCharacterRepository;

    @Transactional
    public UserResponse updateUserIsAgreedTerms(User user) {
        user.setIsAgreedTerms(true);
        return UserConverter.toUserResponseDto(user);
    }

    @Transactional(readOnly = true)
    public List<UserCharacterResponse> getUserCharacter(User user) {
        List<Character> characterList = characterRepository.findAll();

        return characterList.stream()
                .map(character -> UserCharacterResponse.builder()
                        .id(character.getId())
                        .name(character.getName())
                        .imageUrl(character.getImageUrl())
                        .isLocked(userCharacterRepository.findByUserAndCharacter(user, character).isEmpty())
                        .build())
                .toList();
    }

    @Transactional
    public UserResponse updateUser(User user, UserRequest userRequest) {
        if (!user.getNickname().equals(userRequest.getNickname()) &&
                userRepository.findByNickname(userRequest.getNickname()).isPresent()) {
            throw new GeneralException(ErrorStatus.ALREADY_EXIST_NICKNAME);
        }

        user.setNickname(userRequest.getNickname());
        user.setNotificationTimeEnable(userRequest.getNotificationTimeEnable());
        user.setNotificationTime(userRequest.getNotificationTime());

        Character character = characterRepository.findById(userRequest.getMainCharacterId())
                .orElseThrow(() -> new GeneralException(ErrorStatus.NOT_FOUND_CHARACTER));

        if (userCharacterRepository.findByUserAndCharacter(user, character).isEmpty()) {
            throw new GeneralException(ErrorStatus.LOCKED_CHARACTER);
        }

        user.setMainCharacter(character);
        return UserConverter.toUserResponseDto(user);
    }

    @Transactional
    public void updateUserFcmToken(User user, UserFcmTokenRequest userFcmTokenRequest) {
        user.setFcmToken(userFcmTokenRequest.getFcmToken());
    }

    @Transactional
    public void updateUserLocation(User user, UserLocationRequest userLocationRequest) {
        user.setNotificationLocationEnable(userLocationRequest.getNotificationLocationEnable());
        user.setNotificationLocationLatitude(userLocationRequest.getNotificationLocationLatitude());
        user.setNotificationLocationLongitude(userLocationRequest.getNotificationLocationLongitude());

        // 위치 변경 시 마지막 알림 시간 초기화
        user.setLastLocationNotified(null);
    }

    @Transactional
    public void deleteUser(User user) {
        // TODO: image delete
        userRepository.delete(user);
    }
}
