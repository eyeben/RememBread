package com.remembread.card.entity;

import com.remembread.common.entity.BaseEntity;
import com.remembread.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "card_sets")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class CardSet extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id")
    private Folder folder;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "last_viewed_card_id")
    private Card lastViewedCard;

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