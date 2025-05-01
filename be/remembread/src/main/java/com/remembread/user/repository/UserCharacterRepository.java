package com.remembread.user.repository;

import com.remembread.user.entity.Character;
import com.remembread.user.entity.User;
import com.remembread.user.entity.UserCharacter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserCharacterRepository extends JpaRepository<UserCharacter, Long> {
    Optional<UserCharacter> findByUserAndCharacter(User user, Character character);
}
