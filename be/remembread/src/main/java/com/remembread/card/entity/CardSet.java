package com.remembread.card.entity;

import com.remembread.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "card_sets")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardSet extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "folder_id")
    private Long folderId;

    @Column(name = "last_viewed_card_id")
    private Long lastViewedCardId;

    @Column(length = 25, nullable = false)
    private String name;

    @Column(name = "correct_count", nullable = false)
    private Integer correctCount = 0;

    @Column(name = "solved_count", nullable = false)
    private Integer solvedCount = 0;

    @Column(name = "is_public", nullable = false)
    private Boolean isPublic = true;

    @Column(nullable = false)
    private Integer views = 0;

    @Column(nullable = false)
    private Integer forks = 0;
}