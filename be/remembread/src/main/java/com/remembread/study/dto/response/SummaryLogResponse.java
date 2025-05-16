package com.remembread.study.dto.response;

import lombok.*;

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
    private List<YearLogResponse> years;

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
        private List<MonthLogResponse> months;

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
            private List<DayLogResponse> days;

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
            }
        }
    }
}
