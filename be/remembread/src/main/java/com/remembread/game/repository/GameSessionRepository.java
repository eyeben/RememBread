package com.remembread.game.repository;

import com.remembread.game.entity.GameSession;
import com.remembread.game.enums.GameType;
import com.remembread.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GameSessionRepository extends JpaRepository<GameSession, Long> {

    @Query("SELECT MAX(gs.score) FROM GameSession gs WHERE gs.user = :user AND gs.gameType = :gameType")
    Integer findMaxScoreByUserIdAndGameType(User user, GameType gameType);

    @Query(value = """
        WITH user_best_scores AS (
            SELECT user_id, MAX(score) AS best_score
            FROM game_sessions
            WHERE game_type = :gameType
            GROUP BY user_id
        )
        SELECT COUNT(*) + 1
        FROM user_best_scores
        WHERE best_score > :maxScore
        """, nativeQuery = true)
    Integer findRankByUserIdAndGameType(Integer maxScore, String gameType);

    @Query(value = """
    SELECT gs.*
    FROM game_sessions gs
    INNER JOIN (
        SELECT user_id, MAX(score) AS max_score
        FROM game_sessions
        WHERE game_type = :gameType
        GROUP BY user_id
    ) best_scores
    ON gs.user_id = best_scores.user_id AND gs.score = best_scores.max_score
    WHERE game_type = :gameType
    AND gs.played_at = (
        SELECT MIN(played_at)
        FROM game_sessions
        WHERE user_id = gs.user_id AND score = gs.score AND game_type = :gameType
    )
    ORDER BY gs.score DESC, gs.played_at ASC
    """, nativeQuery = true)
    List<GameSession> findTopSessionsByGameType(String gameType);

    @Query(value = """
    SELECT * FROM game_sessions 
    WHERE user_id = :userId 
    ORDER BY played_at DESC 
    LIMIT 20
    """, nativeQuery = true)
    List<GameSession> findRecent20ByUserId(Long userId);
}
