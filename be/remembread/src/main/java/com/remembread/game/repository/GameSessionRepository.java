package com.remembread.game.repository;

import com.remembread.game.entity.GameSession;
import com.remembread.game.enums.GameType;
import com.remembread.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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
}
