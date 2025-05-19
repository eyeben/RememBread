package com.remembread.study.repository;

import com.remembread.card.entity.CardSet;
import com.remembread.study.dto.response.CardStudyLogResponse;
import com.remembread.study.entity.StudySession;
import com.remembread.user.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudySessionRepository extends JpaRepository<StudySession, Long> {
    List<StudySession> findByCardSetOrderByStudiedAtDesc(CardSet cardSet, Pageable pageable);

    @Query(value = """
        SELECT 
            c.id AS cardId, 
            c.number, 
            c.concept, 
            c.description, 
            c.concept_image_url, 
            c.description_image_url, 
            csl.correct_count AS correctCount, 
            csl.solved_count AS solvedCount 
        FROM card_study_logs csl 
        JOIN cards c ON c.id = csl.card_id 
        WHERE csl.study_session_id = :studySessionId 
        ORDER BY c.number ASC
        """, nativeQuery = true)
    List<CardStudyLogResponse> fetchLogsByStudySessionId(@Param("studySessionId") Long studySessionId);

    @Query(value = """
    SELECT EXISTS (
        SELECT 1
        FROM study_sessions s
        WHERE s.user_id = :userId
        AND s.route IS NOT NULL
        AND ST_AsText(s.route) <> 'LINESTRING(0 0, 0 0)'
    )
    """, nativeQuery = true)
    boolean existsByUserWithValidRoute(@Param("userId") Long userId);


}
