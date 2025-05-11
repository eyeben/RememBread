package com.remembread.study.entity;

import com.remembread.card.entity.Card;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "card_study_logs")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class CardStudyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_session_id", nullable = false)
    private StudySession studySession;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;

    @Column(name = "correct_count", nullable = false)
    @Builder.Default
    private Integer correctCount = 0;

    @Column(name = "solved_count", nullable = false)
    @Builder.Default
    private Integer solvedCount = 0;
}
