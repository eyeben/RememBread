package com.remembread.study.dto.response;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SummaryLogResponse {
    @Builder.Default
    private Integer totalCorrect = 0;
    @Builder.Default
    private Integer totalSolved = 0;
    @Builder.Default
    private Integer totalStudyMinutes = 0;
    @Builder.Default
    private List<YearLogResponse> years = new ArrayList<>();

    public void addYear(YearLogResponse yearLogResponse) {
        this.totalCorrect += yearLogResponse.getTotalCorrect();
        this.totalSolved += yearLogResponse.getTotalSolved();
        this.totalStudyMinutes += yearLogResponse.getTotalStudyMinutes();
        this.years.add(yearLogResponse);
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class YearLogResponse {
        private Integer year;
        @Builder.Default
        private Integer totalCorrect = 0;
        @Builder.Default
        private Integer totalSolved = 0;
        @Builder.Default
        private Integer totalStudyMinutes = 0;
        @Builder.Default
        private List<MonthLogResponse> months = new ArrayList<>();

        public void addMonth(MonthLogResponse monthLogResponse) {
            this.totalCorrect += monthLogResponse.getTotalCorrect();
            this.totalSolved += monthLogResponse.getTotalSolved();
            this.totalStudyMinutes += monthLogResponse.getTotalStudyMinutes();
            this.months.add(monthLogResponse);
        }

        @Getter
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class MonthLogResponse {
            private Integer month;
            @Builder.Default
            private Integer totalCorrect = 0;
            @Builder.Default
            private Integer totalSolved = 0;
            @Builder.Default
            private Integer totalStudyMinutes = 0;
            @Builder.Default
            private List<DayLogResponse> days = new ArrayList<>();

            public void addDay(DayLogResponse dayLogResponse) {
                this.totalCorrect += dayLogResponse.getTotalCorrect();
                this.totalSolved += dayLogResponse.getTotalSolved();
                this.totalStudyMinutes += dayLogResponse.getTotalStudyMinutes();
                this.days.add(dayLogResponse);
            }

            @Getter
            @Builder
            @NoArgsConstructor
            @AllArgsConstructor
            public static class DayLogResponse {
                private Integer day;
                @Builder.Default
                private Integer totalCorrect = 0;
                @Builder.Default
                private Integer totalSolved = 0;
                @Builder.Default
                private Integer totalStudyMinutes = 0;
            }
        }
    }
}
