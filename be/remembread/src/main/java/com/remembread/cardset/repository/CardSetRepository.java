package com.remembread.cardset.repository;

import com.remembread.cardset.entity.CardSet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardSetRepository extends JpaRepository<CardSet, Long> {
}
