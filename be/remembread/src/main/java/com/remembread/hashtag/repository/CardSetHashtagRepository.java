package com.remembread.hashtag.repository;

import com.remembread.card.entity.CardSet;
import com.remembread.hashtag.entity.CardSetHashtag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardSetHashtagRepository extends JpaRepository<CardSetHashtag, Long> {
    void deleteAllByCardSet(CardSet cardSet);
}
