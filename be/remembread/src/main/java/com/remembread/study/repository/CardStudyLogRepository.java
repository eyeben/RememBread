package com.remembread.study.repository;

import com.remembread.study.dto.response.DayLogProjection;
import com.remembread.study.entity.CardStudyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface CardStudyLogRepository extends JpaRepository<CardStudyLog, Long> {

    @Query(value = """
        SELECT 
            ss.studied_at::DATE AS date, 
            SUM(DISTINCT ss.study_duration_seconds) AS studyTime, 
            COALESCE(SUM(csl.correct_count), 0) AS totalCorrect, 
            COALESCE(SUM(csl.solved_count), 0) AS totalSolved 
        FROM study_sessions ss 
        LEFT JOIN card_study_logs csl ON ss.id = csl.study_session_id 
        WHERE ss.user_id = :userId 
        AND :start <= ss.studied_at::DATE AND ss.studied_at::DATE < :end 
        GROUP BY date 
        ORDER BY date ASC 
        """, nativeQuery = true)
    List<DayLogProjection> findDailyStudyStatsByUserIdAndStudiedAtBetween(
            @Param("userId") Long userId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );
}
