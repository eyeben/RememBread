package com.remembread.card.repository;

import com.remembread.card.entity.Card;
import com.remembread.card.entity.CardSet;
import com.remembread.user.entity.User;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, Long> {
    Optional<Card> findFirstByCardSetOrderByNumberDesc(CardSet cardSet);
    List<Card> findAllByCardSet(CardSet cardSet);
    Page<Card> findAllByCardSet(CardSet cardSet, Pageable pageable);

    List<Card> findAllByCardSetOrderByRetentionRate(CardSet cardSet, Limit limit);

    void deleteAllByCardSetIdIn(List<Long> cardSetIds);

    List<Card> findByCardSetIdOrderByNumber(Long id);

}
