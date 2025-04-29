package com.remembread.card.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long cardSetId;
    private Integer number;
    private String concept;
    private String description;
    private Integer rightCount;
    private Integer testCount;
    private Double retentionRate;
    private Double stabilityFactor;
    private LocalDateTime lastRightAt;
    private String conceptUrl;
    private String descriptionUrl;

}
