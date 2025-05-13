package com.remembread.user.service;

import com.remembread.apipayload.code.status.ErrorStatus;
import com.remembread.apipayload.exception.GeneralException;
import com.remembread.user.converter.UserConverter;
import com.remembread.user.dto.UserCharacterResponseDto;
import com.remembread.user.dto.UserRequestDto;
import com.remembread.user.dto.UserResponseDto;
import com.remembread.user.entity.Character;
import com.remembread.user.entity.User;
import com.remembread.user.entity.UserCharacter;
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
    public UserResponseDto updateUserIsAgreedTerms(User user) {
        user.setIsAgreedTerms(true);
        return UserConverter.toUserResponseDto(user);
    }

    @Transactional(readOnly = true)
    public List<UserCharacterResponseDto> getUserCharacter(User user) {
        List<Character> characterList = characterRepository.findAll();

        return characterList.stream()
                .map(character -> UserCharacterResponseDto.builder()
                        .id(character.getId())
                        .name(character.getName())
                        .imageUrl(character.getImageUrl())
                        .isLocked(userCharacterRepository.findByUserAndCharacter(user, character).isEmpty())
                        .build())
                .toList();
    }

    @Transactional
    public UserResponseDto updateUser(User user, UserRequestDto userRequestDto) {
        if (!user.getNickname().equals(userRequestDto.getNickname()) &&
                userRepository.findByNickname(userRequestDto.getNickname()).isPresent()) {
            throw new GeneralException(ErrorStatus.ALREADY_EXIST_NICKNAME);
        }

        user.setNickname(userRequestDto.getNickname());
        user.setNotificationTimeEnable(userRequestDto.getNotificationTimeEnable());
        user.setNotificationTime(userRequestDto.getNotificationTime());

        Character character = characterRepository.findById(userRequestDto.getMainCharacterId())
                .orElseThrow(() -> new GeneralException(ErrorStatus.NOT_FOUND_CHARACTER));

        if (userCharacterRepository.findByUserAndCharacter(user, character).isEmpty()) {
            throw new GeneralException(ErrorStatus.LOCKED_CHARACTER);
        }

        user.setMainCharacter(character);
        return UserConverter.toUserResponseDto(user);
    }

    @Transactional
    public void deleteUser(User user) {
        // TODO: image delete
        userRepository.delete(user);
    }
}
