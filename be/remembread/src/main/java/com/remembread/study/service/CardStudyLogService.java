package com.remembread.study.service;

import com.remembread.study.entity.CardStudyLog;
import com.remembread.study.repository.CardStudyLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CardStudyLogService {
    private final CardStudyLogRepository cardStudyLogRepository;

    @Transactional
    public void saveAll(List<CardStudyLog> cardStudyLogs) {
        cardStudyLogRepository.saveAll(cardStudyLogs);
    }

}
