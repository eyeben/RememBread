package com.remembread.study.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
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
    private Double retentionRate;
    private Double stability;
    private LocalDateTime lastViewedTime;
}
