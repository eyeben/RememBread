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
import java.util.ArrayList;
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
    public SummaryLogResponse getDayLogResponses(
            LocalDate start, LocalDate end, Long userId
    ) {
        List<DayLogProjection> dayLogProjections =
                cardStudyLogRepository.findDailyStudyStatsByUserIdAndStudiedAtBetween(userId, start, end);

        Integer monthTotalCorrect = 0;
        Integer monthTotalSolved = 0;
        Integer yearTotalCorrect = 0;
        Integer yearTotalSolved = 0;
        Integer totalCorrect = 0;
        Integer totalSolved = 0;

        int lastYear = -1;
        int lastMonth = -1;

        List<SummaryLogResponse.YearLogResponse> years = new ArrayList<>();
        List<SummaryLogResponse.YearLogResponse.MonthLogResponse> months = new ArrayList<>();
        List<SummaryLogResponse.YearLogResponse.MonthLogResponse.DayLogResponse> days = new ArrayList<>();

        for (DayLogProjection dayLogProjection : dayLogProjections) {
            LocalDate studiedAt = dayLogProjection.getDay();
            int year = studiedAt.getYear();
            int month = studiedAt.getMonthValue();
            days.add(StudyConverter.toDayLogResponseList(dayLogProjection));
            monthTotalCorrect += dayLogProjection.getTotalCorrect();
            monthTotalSolved += dayLogProjection.getTotalSolved();

            if (lastMonth != month) {
                SummaryLogResponse.YearLogResponse.MonthLogResponse monthLogResponse =
                        SummaryLogResponse.YearLogResponse.MonthLogResponse.builder()
                        .month(month)
                        .totalCorrect(monthTotalCorrect)
                        .totalSolved(monthTotalSolved)
                        .days(days)
                        .build();
                months.add(monthLogResponse);

                days = new ArrayList<>();
                yearTotalCorrect += monthTotalCorrect;
                yearTotalSolved += monthTotalSolved;
                monthTotalCorrect = 0;
                monthTotalSolved = 0;
                lastMonth = month;
            }

            if (lastYear != year) {
                SummaryLogResponse.YearLogResponse yearLogResponse =
                        SummaryLogResponse.YearLogResponse.builder()
                        .year(year)
                        .totalCorrect(yearTotalCorrect)
                        .totalSolved(yearTotalSolved)
                        .months(months)
                        .build();
                years.add(yearLogResponse);

                months = new ArrayList<>();
                totalCorrect += yearTotalCorrect;
                totalSolved += yearTotalSolved;
                yearTotalCorrect = 0;
                yearTotalSolved = 0;
                lastYear = year;
            }

        }

        if (lastMonth != -1) {
            SummaryLogResponse.YearLogResponse.MonthLogResponse monthLogResponse =
                    SummaryLogResponse.YearLogResponse.MonthLogResponse.builder()
                    .month(lastMonth)
                    .totalCorrect(monthTotalCorrect)
                    .totalSolved(monthTotalSolved)
                    .days(days)
                    .build();
            months.add(monthLogResponse);
        }

        if (lastYear != -1) {
            SummaryLogResponse.YearLogResponse yearLogResponse =
                    SummaryLogResponse.YearLogResponse.builder()
                    .year(lastYear)
                    .totalCorrect(yearTotalCorrect)
                    .totalSolved(yearTotalSolved)
                    .months(months)
                    .build();
            years.add(yearLogResponse);
        }

        return SummaryLogResponse.builder()
                .totalCorrect(totalCorrect)
                .totalSolved(totalSolved)
                .years(years)
                .build();
    }

}
