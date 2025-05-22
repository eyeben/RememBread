package com.remembread.study.entity;

import com.remembread.card.entity.CardSet;
import com.remembread.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.LineString;

import java.time.Duration;
import java.time.LocalDateTime;

@Entity
@Table(name = "study_sessions")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class StudySession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_set_id")
    private CardSet cardSet;

    @Column(name = "studied_at", nullable = false)
    private LocalDateTime studiedAt;

    @Column(name = "study_duration_seconds", columnDefinition = "INTEGER DEFAULT 0")
    @Builder.Default
    private Integer studyDurationSeconds = 0;

    @Column(columnDefinition = "geometry(LINESTRING, 4326)")
    private LineString route;

    public void updateRoute(LineString route) {
        this.route = route;
    }

    public void updateStudyDurationSeconds(Integer studyDurationSeconds) {
        this.studyDurationSeconds = studyDurationSeconds;
    }

    public void updateStudyDurationSeconds(LocalDateTime stoppedAt) {
        this.studyDurationSeconds = (int) Duration.between(studiedAt, stoppedAt).toSeconds();
    }
}
