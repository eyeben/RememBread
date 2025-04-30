package com.remembread.card.repository;

import com.remembread.card.entity.Card;
import com.remembread.card.entity.CardSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, Long> {
    Optional<Card> findFirstByCardSetOrderByNumberDesc(CardSet cardSet);

}
