package com.remembread.study.service;

import com.remembread.study.converter.StudyConverter;
import com.remembread.study.dto.response.SummaryLogResponse;
import com.remembread.study.entity.CardStudyLog;
import com.remembread.study.repository.CardStudyLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CardStudyLogService {
    private final CardStudyLogRepository cardStudyLogRepository;

    @Transactional
    public void saveAll(List<CardStudyLog> cardStudyLogs) {
        cardStudyLogRepository.saveAll(cardStudyLogs);
    }

    @Transactional(readOnly = true)
    public List<SummaryLogResponse.YearLogResponse.MonthLogResponse.DayLogResponse> getDayLogResponses(
            LocalDate start, LocalDate end, Long userId
    ) {
        return StudyConverter.toDayLogResponseList(cardStudyLogRepository.findDailyStudyStatsByUserIdAndStudiedAtBetween(userId, start, end));
    }

}
