package com.remembread.card.repository;

import com.remembread.card.entity.Card;
import com.remembread.card.entity.CardSet;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, Long> {
    Optional<Card> findFirstByCardSetOrderByNumberDesc(CardSet cardSet);
    List<Card> findAllByCardSet(CardSet cardSet);
    List<Card> findAllByCardSet(CardSet cardSet, Pageable pageable);
}
