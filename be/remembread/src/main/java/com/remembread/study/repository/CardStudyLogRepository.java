package com.remembread.study.repository;

import com.remembread.study.entity.CardStudyLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardStudyLogRepository extends JpaRepository<CardStudyLog, Long> {
}
