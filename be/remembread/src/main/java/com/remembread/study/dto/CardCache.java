package com.remembread.study.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CardCache {
    private Long id;
    private Long cardSetId;
    private Integer number;
    private String concept;
    private String description;
    private String conceptImageUrl;
    private String descriptionImageUrl;

    private Integer correctCount;
    private Integer solvedCount;
    private Integer sessionCorrectCount;
    private Integer sessionSolvedCount;
    @Setter
    private Double retentionRate;
    private Double stability;
    private LocalDateTime lastViewedTime;

}
