package com.remembread.game.service;

import com.remembread.game.converter.GameConverter;
import com.remembread.game.dto.request.GameRequest;
import com.remembread.game.dto.response.GameRankingResponse;
import com.remembread.game.dto.response.GameSessionResponse;
import com.remembread.game.entity.GameSession;
import com.remembread.game.enums.GameType;
import com.remembread.game.repository.GameSessionRepository;
import com.remembread.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
@RequiredArgsConstructor
public class GameService {

    private final GameSessionRepository gameSessionRepository;

    @Transactional
    public GameRankingResponse addGameSession(User user, GameRequest gameRequest) {
        GameSession gameSession = GameSession.builder()
                .user(user)
                .playedAt(LocalDateTime.now())
                .score(gameRequest.getScore())
                .gameType(gameRequest.getGameType())
                .build();

        gameSessionRepository.save(gameSession);

        Integer maxScore = gameSessionRepository.findMaxScoreByUserIdAndGameType(user, gameRequest.getGameType());
        Integer rank = gameSessionRepository.findRankByUserIdAndGameType(maxScore, gameRequest.getGameType().name());

        return GameRankingResponse.builder()
                .nickname(user.getNickname())
                .mainCharacterImageUrl(user.getMainCharacter().getImageUrl())
                .rank(rank)
                .maxScore(maxScore)
                .build();
    }

    @Transactional(readOnly = true)
    public List<GameSessionResponse> getGameSession(User user) {
        List<GameSession> gameSessionList = gameSessionRepository.findRecent20ByUserId(user.getId());

        return gameSessionList.stream()
                .map(GameConverter::toGameSessionResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<GameRankingResponse> getGameRanking(GameType gameType) {
        List<GameSession> gameSessionList = gameSessionRepository.findTopSessionsByGameType(gameType.name());
        AtomicInteger rank = new AtomicInteger(1);

        return gameSessionList.stream()
                .map(gameSession -> GameRankingResponse.builder()
                        .nickname(gameSession.getUser().getNickname())
                        .mainCharacterImageUrl(gameSession.getUser().getMainCharacter().getImageUrl())
                        .rank(rank.getAndIncrement())
                        .maxScore(gameSession.getScore())
                        .playedAt(gameSession.getPlayedAt())
                        .build())
                .toList();
    }
}
