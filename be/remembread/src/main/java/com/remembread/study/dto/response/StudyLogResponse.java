package com.remembread.study.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudyLogResponse {
    private Long cardSetId;
    private String name;
    private List<StudySession> logs;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudySession {
        private Long studySessionId;
        private LocalDateTime studiedAt;
        private List<CardStudyLogResponse> cards;
    }
}
