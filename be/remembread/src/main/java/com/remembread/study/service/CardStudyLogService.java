package com.remembread.study.service;

import com.remembread.study.converter.StudyConverter;
import com.remembread.study.dto.response.DayLogProjection;
import com.remembread.study.dto.response.SummaryLogResponse;
import com.remembread.study.entity.CardStudyLog;
import com.remembread.study.repository.CardStudyLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class CardStudyLogService {
    private final CardStudyLogRepository cardStudyLogRepository;

    @Transactional
    public void saveAll(List<CardStudyLog> cardStudyLogs) {
        cardStudyLogRepository.saveAll(cardStudyLogs);
    }

    @Transactional(readOnly = true)
    public SummaryLogResponse getDayLogResponses(LocalDate start, LocalDate end, Long userId) {
        List<DayLogProjection> projections =
                cardStudyLogRepository.findDailyStudyStatsByUserIdAndStudiedAtBetween(userId, start, end);
        SummaryLogResponse summary = SummaryLogResponse.builder().build();
        SummaryLogResponse.YearLogResponse currentYearLog = null;
        SummaryLogResponse.YearLogResponse.MonthLogResponse currentMonthLog = null;

        Integer currentYear = null;
        Integer currentMonth = null;

        for (DayLogProjection projection : projections) {
            LocalDate date = projection.getDate();
            int year = date.getYear();
            int month = date.getMonthValue();
            int day = date.getDayOfMonth();

            if (!Objects.equals(currentYear, year)) {
                if (currentYearLog != null) {
                    if (currentMonthLog != null) {
                        currentYearLog.addMonth(currentMonthLog);
                    }
                    summary.addYear(currentYearLog);
                }
                currentYear = year;
                currentYearLog = SummaryLogResponse.YearLogResponse.builder().year(year).build();
                currentMonth = null;
                currentMonthLog = null;
            }

            if (!Objects.equals(currentMonth, month)) {
                if (currentMonthLog != null) {
                    currentYearLog.addMonth(currentMonthLog);
                }
                currentMonth = month;
                currentMonthLog = SummaryLogResponse.YearLogResponse.MonthLogResponse.builder().month(month).build();
            }

            SummaryLogResponse.YearLogResponse.MonthLogResponse.DayLogResponse dayLog =
                    StudyConverter.toDayLogResponse(projection);
            currentMonthLog.addDay(dayLog);
        }

        if (currentMonthLog != null)
            currentYearLog.addMonth(currentMonthLog);
        if (currentYearLog != null)
            summary.addYear(currentYearLog);

        return summary;
    }

}
