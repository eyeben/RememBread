package com.remembread.user.repository;

import com.remembread.user.entity.Character;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CharacterRepository extends JpaRepository<Character, Long> {
    List<Character> findAllByOrderByIdAsc();
    Optional<Character> findByIsDefaultTrue();
}
