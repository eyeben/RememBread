package com.remembread.study.service;

import com.remembread.card.repository.CardRepository;
import com.remembread.study.repository.CardStudyLogRepository;
import com.remembread.study.repository.StudySessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudyService {
    private final StudySessionRepository studySessionRepository;
    private final CardStudyLogRepository cardStudyLogRepository;
    private final CardRepository cardRepository;
}
