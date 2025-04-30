package com.remembread.hashtag.repository;

import com.remembread.hashtag.entity.Hashtag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HashtagRepository extends JpaRepository<Hashtag, Long> {
    boolean existsByName(String name);

    Hashtag findOneByName(String name);

    @Query(nativeQuery = true,
            value = "SELECT h.name " +
                    "FROM hashtags h " +
                    "JOIN card_set_hashtags ch " +
                    "ON h.id = ch.hashtag_id " +
                    "WHERE ch.card_set_id = :cardSetId "
    )
    List<String> findAllNamesByCardSetId(@Param("cardSetId") Long id);
}
