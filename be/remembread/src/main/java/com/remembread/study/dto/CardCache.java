package com.remembread.study.dto;

import lombok.Data;

@Data
public class CardCache {
    private Long id;
    private Long cardSetId;
    private Integer number;
    private String concept;
    private String description;
    private Integer correctCount;
    private Integer solvedCount;
    private Float retentionRate;
    private Float stability;
    private String conceptImageUrl;
    private String descriptionImageUrl;
}
