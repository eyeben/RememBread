package com.remembread.card.repository;

import com.remembread.card.dto.response.*;
import com.remembread.card.entity.CardSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CardSetRepository extends JpaRepository<CardSet, Long> {
    @Query(value = """
    SELECT 
        cs.id AS cardSetId,
        cs.name AS name,
        cs.is_public AS isPublic,
        cs.is_like AS isLike,
        cs.views AS viewCount,
        cs.forks AS forkCount,
        CAST(COUNT(c.id) AS INTEGER) AS totalCardCount,
        cs.last_viewed_card_id AS lastViewedCardId,
        h.name AS hashTag,
        cs.updated_at AS updatedAt
    FROM card_sets cs
    LEFT JOIN cards c ON cs.id = c.card_set_id
    LEFT JOIN card_set_hashtags csh ON cs.id = csh.card_set_id
    LEFT JOIN hashtags h ON csh.hashtag_id = h.id
    WHERE cs.folder_id = :folderId
    GROUP BY 
        cs.id, cs.name, cs.is_public, cs.views, cs.forks, cs.last_viewed_card_id, h.name
    ORDER BY 
        CASE WHEN :column = 'created_at' THEN cs.created_at END DESC,
        CASE WHEN :column = 'views' THEN cs.views END DESC,
        CASE WHEN :column = 'forks' THEN cs.forks END DESC,
        CASE WHEN :column = 'name' THEN cs.name END ASC
    LIMIT :size OFFSET :offset
    """, nativeQuery = true)
    List<CardSetFlatDto> getCardSetSorted(
            @Param("folderId") Long folderId,
            @Param("column") String column,
            @Param("size") int size,
            @Param("offset") int offset
    );

    @Query(value = """
    SELECT
        cs.id AS cardSetId,
        cs.name AS name, 
        cs.views AS viewCount,
        cs.forks AS forkCount,
        cs.updated_at AS updatedAt,
        (cs.user_id = :userId) AS isMine,
        u.nickname AS nickname    
    FROM card_sets cs
    JOIN users u ON cs.user_id = u.id
    WHERE cs.is_public = true
        AND cs.name ILIKE %:query%
    ORDER BY
        CASE WHEN :column = 'created_at' THEN cs.created_at END DESC,
        CASE WHEN :column = 'views' THEN cs.views END DESC,
        CASE WHEN :column = 'forks' THEN cs.forks END DESC    LIMIT :size OFFSET :offset
    """, nativeQuery = true)
    List<CardSetSearchResponse.CardSet> searchByTitle(
            @Param("query") String query,
            @Param("column") String column,
            @Param("size") int size,
            @Param("offset") int offset,
            @Param("userId") Long userId
    );

    @Query(value = """
        SELECT 
            cs.id AS cardSetId, 
            cs.name AS name,
            cs.views AS viewCount,
            cs.forks AS forkCount,
            cs.updated_at AS updatedAt,
            (cs.user_id = :userId) AS isMine,
            u.nickname AS nickname    
        FROM card_sets cs
        JOIN users u ON cs.user_id = u.id
        WHERE cs.is_public = true
            AND u.nickname ILIKE :query
        ORDER BY
            CASE WHEN :column = 'created_at' THEN cs.created_at END DESC,
            CASE WHEN :column = 'views' THEN cs.views END DESC,
            CASE WHEN :column = 'forks' THEN cs.forks END DESC 
        LIMIT :size OFFSET :offset
    """, nativeQuery = true)
    List<CardSetSearchResponse.CardSet> searchByAuthor(
            @Param("query") String query,
            @Param("column") String column,
            @Param("size") int size,
            @Param("offset") int offset,
            @Param("userId") Long userId
    );

    @Query(value = """
    SELECT 
        cs.id AS cardSetId,
        cs.name AS name,
        cs.views AS viewCount,
        cs.forks AS forkCount,
        cs.updated_at AS updatedAt,
        (cs.user_id = :userId) AS isMine,
        u.nickname AS nickname    
    FROM card_sets cs
    JOIN users u ON cs.user_id = u.id
    WHERE cs.is_public = true
      AND cs.id IN (
          SELECT csh.card_set_id
          FROM card_set_hashtags csh
          JOIN hashtags h ON csh.hashtag_id = h.id
          WHERE h.name ILIKE :query
      )
    ORDER BY
        CASE WHEN :column = 'created_at' THEN cs.created_at END DESC,
        CASE WHEN :column = 'views' THEN cs.views END DESC,
        CASE WHEN :column = 'forks' THEN cs.forks END DESC
    LIMIT :size OFFSET :offset
    """, nativeQuery = true)
    List<CardSetSearchResponse.CardSet> searchByHashtag(
            @Param("query") String query,
            @Param("column") String column,
            @Param("size") int size,
            @Param("offset") int offset,
            @Param("userId") Long userId
    );

    @Query(value = """
    SELECT 
        cs.id AS cardSetId,
        cs.name AS name
    FROM card_sets cs
    WHERE cs.folder_id = :folderId
    ORDER BY cs.name ASC
    """, nativeQuery = true)
    List<CardSetSimpleListGetResponse.CardSet> findByFolderIdOrderByName(@Param("folderId") Long folderId);

    @Query(value = """
    SELECT 
        cs.id AS cardSetId,
        cs.name AS name,
        cs.views AS viewCount,
        cs.forks AS forkCount,
        cs.updated_at AS updatedAt,
        cs.is_like AS isLike
    FROM card_sets cs
    WHERE cs.user_id = :userId
        AND cs.name ILIKE %:query%
    ORDER BY
        CASE WHEN :column = 'created_at' THEN cs.created_at END DESC,
        CASE WHEN :column = 'views' THEN cs.views END DESC,
        CASE WHEN :column = 'forks' THEN cs.forks END DESC    LIMIT :size OFFSET :offset
    """, nativeQuery = true)
    List<CardSetSearchMyResponse.CardSet> searchMyCardSetByTitle(
            @Param("userId") long userId,
            @Param("query") String query,
            @Param("column") String column,
            @Param("size") int size,
            @Param("offset") int offset
    );
    @Query(value = """
    SELECT 
        cs.id AS cardSetId,
        cs.name AS name,
        cs.is_public AS isPublic,
        cs.is_like AS isLike,
        cs.views AS viewCount,
        cs.forks AS forkCount,
        CAST(COUNT(c.id) AS INTEGER) AS totalCardCount,
        cs.last_viewed_card_id AS lastViewedCardId,
        h.name AS hashTag,
        cs.updated_at AS updatedAt
    FROM card_sets cs
    LEFT JOIN cards c ON cs.id = c.card_set_id
    LEFT JOIN card_set_hashtags csh ON cs.id = csh.card_set_id
    LEFT JOIN hashtags h ON csh.hashtag_id = h.id
    WHERE
        cs.user_id = :userId AND cs.is_like = true
    GROUP BY 
        cs.id, cs.name, cs.is_public, cs.views, cs.forks, cs.last_viewed_card_id, h.name
    ORDER BY 
        CASE WHEN :column = 'created_at' THEN cs.created_at END DESC,
        CASE WHEN :column = 'name' THEN cs.name END ASC
    LIMIT :size OFFSET :offset
    """, nativeQuery = true)
    List<CardSetFlatDto> getLikeCardSetSorted(
            @Param("userId") Long userId,
            @Param("column") String column,
            @Param("size") int size,
            @Param("offset") int offset
    );


    @Modifying
    @Query("UPDATE CardSet c SET c.views = c.views + :viewCount WHERE c.id = :cardSetId")
    void increaseViewCount(@Param("cardSetId") Long cardSetId, @Param("viewCount") Integer viewCount);
}
