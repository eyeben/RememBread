package com.remembread.card.entity;

import com.remembread.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "cards")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Card extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "card_set_id", nullable = false)
//    private CardSet cardSet;

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
    private Float retentionRate = 0f;

    @Column(nullable = false)
    private Float stability = 1f;

    @Column(name = "last_correct_at")
    private LocalDateTime lastCorrectAt;

    @Column(name = "concept_image_url", length = 1024)
    private String conceptImageUrl;

    @Column(name = "description_image_url", length = 1024)
    private String descriptionImageUrl;
}
