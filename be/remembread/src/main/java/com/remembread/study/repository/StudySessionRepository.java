package com.remembread.study.repository;

import com.remembread.card.entity.CardSet;
import com.remembread.study.entity.StudySession;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudySessionRepository extends JpaRepository<StudySession, Long> {
    List<StudySession> findByCardSetOrderByStudiedAtDesc(CardSet cardSet, Pageable pageable);
}
