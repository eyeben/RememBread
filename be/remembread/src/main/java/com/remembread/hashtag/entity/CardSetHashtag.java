package com.remembread.hashtag.entity;

import com.remembread.card.entity.CardSet;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "card_set_hashtags")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class CardSetHashtag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_set_id", nullable = false)
    private CardSet cardSet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hashtag_id", nullable = false)
    private Hashtag hashtag;
}
