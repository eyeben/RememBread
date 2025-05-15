package com.remembread.game.service;

import com.remembread.game.dto.request.GameRequest;
import com.remembread.game.dto.response.GameResponse;
import com.remembread.game.entity.GameSession;
import com.remembread.game.repository.GameSessionRepository;
import com.remembread.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class GameService {

    private final GameSessionRepository gameSessionRepository;

    @Transactional
    public GameResponse addGameSession(User user, GameRequest gameRequest) {
        GameSession gameSession = GameSession.builder()
                .user(user)
                .playedAt(LocalDateTime.now())
                .score(gameRequest.getScore())
                .gameType(gameRequest.getGameType())
                .build();

        gameSessionRepository.save(gameSession);

        Integer maxScore = gameSessionRepository.findMaxScoreByUserIdAndGameType(user, gameRequest.getGameType());
        Integer rank = gameSessionRepository.findRankByUserIdAndGameType(maxScore, gameRequest.getGameType().toString());
        log.info("최고 점수 = {}, 등수 = {}", maxScore, rank);

        return GameResponse.builder()
                .maxScore(maxScore)
                .rank(rank)
                .build();
    }
}
