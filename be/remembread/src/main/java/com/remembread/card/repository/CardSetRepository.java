package com.remembread.card.repository;

import com.remembread.card.dto.response.CardSetSearchResponse;
import com.remembread.card.dto.response.CardSetSimpleListGetResponse;
import com.remembread.card.entity.CardSet;
import com.remembread.card.projection.FlatCardSetProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CardSetRepository extends JpaRepository<CardSet, Long> {
    @Query(value = """
    SELECT 
        cs.id AS card_set_id,
        cs.name AS title,
        cs.is_public AS is_public,
        cs.views AS view_count,
        cs.forks AS fork_count,
        COUNT(c.id) AS total_card_count,
        cs.last_viewed_card_id AS last_viewed_card_id,
        h.name AS hashtag
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
    List<FlatCardSetProjection> getCardSetSorted(
            @Param("folderId") Long folderId,
            @Param("column") String column,
            @Param("size") int size,
            @Param("offset") int offset
    );

    @Query(value = """
    SELECT cs.id AS cardSetId, cs.name AS title, cs.views AS viewCount, cs.forks AS forkCount
    FROM card_sets cs
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
            @Param("offset") int offset
    );

    @Query(value = """
    SELECT cs.id AS cardSetId, cs.name AS title, cs.views AS viewCount, cs.forks AS forkCount
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
            @Param("offset") int offset
    );

    @Query(value = """
    SELECT 
        cs.id AS cardSetId,
        cs.name AS title,
        cs.views AS viewCount,
        cs.forks AS forkCount
    FROM card_sets cs
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
            @Param("offset") int offset
    );

    @Query("""
    SELECT new com.remembread.card.dto.response.CardSetSimpleListGetResponse$CardSet(
        cs.id,
        cs.name
    )
    FROM CardSet cs
    WHERE cs.folder.id = :folderId
    ORDER BY cs.name ASC
""")
    List<CardSetSimpleListGetResponse.CardSet> findByFolderIdOrderByName(@Param("folderId") Long folderId);

}
