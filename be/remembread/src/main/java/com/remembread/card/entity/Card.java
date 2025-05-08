package com.remembread.card.entity;

import com.remembread.card.dto.request.CardUpdateRequest;
import com.remembread.common.entity.BaseEntity;
import com.remembread.study.dto.CardCache;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cards")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Card extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_set_id", nullable = false)
    private CardSet cardSet;

    @Column(nullable = false)
    private Integer number;

    @Column(length = 50, nullable = false)
    private String concept;

    @Column(length = 1000, nullable = false)
    private String description;

    @Column(name = "correct_count", nullable = false)
    private Integer correctCount = 0;

    @Column(name = "solved_count", nullable = false)
    private Integer solvedCount = 0;

    @Column(name = "retention_rate", nullable = false)
    private Double retentionRate = 0.0;

    @Column(nullable = false)
    private Double stability = 1.0;

    @Column(name = "last_correct_at")
    private LocalDateTime lastCorrectAt;

    @Column(name = "concept_image_url", length = 1024)
    private String conceptImageUrl;

    @Column(name = "description_image_url", length = 1024)
    private String descriptionImageUrl;

    public Card(CardSet cardSet, Integer number, String concept, String description, String conceptImageUrl, String descriptionImageUrl) {
        this.cardSet = cardSet;
        this.number = number;
        this.concept = concept;
        this.description = description;
        this.conceptImageUrl = conceptImageUrl;
        this.descriptionImageUrl = descriptionImageUrl;
    }

    public void update(CardUpdateRequest request) {
        if (request.getNumber() != null) this.number = request.getNumber();
        if (request.getConcept() != null) this.concept = request.getConcept();
        if (request.getDescription() != null) this.description = request.getDescription();
        if (request.getConceptImageUrl() != null) this.conceptImageUrl = request.getConceptImageUrl();
        if (request.getDescriptionImageUrl() != null) this.descriptionImageUrl = request.getDescriptionImageUrl();
    }

    public void update(CardCache cardCache) {
        if (cardCache.getCorrectCount() != null) this.correctCount = cardCache.getCorrectCount();
        if (cardCache.getSolvedCount() != null) this.solvedCount = cardCache.getSolvedCount();
        if (cardCache.getRetentionRate() != null) this.retentionRate = cardCache.getRetentionRate();
        if (cardCache.getStability() != null) this.stability = cardCache.getStability();
    }
}
