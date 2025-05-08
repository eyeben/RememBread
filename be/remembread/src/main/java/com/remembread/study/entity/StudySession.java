package com.remembread.study.entity;

import com.remembread.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.LineString;

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

    @Column(name = "studied_at", nullable = false)
    private LocalDateTime studiedAt;

    @Column(columnDefinition = "geometry(LINESTRING, 4326)")
    private LineString route;

    public void addRoute(LineString route) {
        this.route = route;
    }
}
