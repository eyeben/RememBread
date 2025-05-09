package com.remembread.card.service;

import com.remembread.card.repository.CardSetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Slf4j
@Service
public class CardSetBatchService {
    private final CardSetRepository cardSetRepository;
    private final RedisTemplate<String, String> redisTemplate;

    public CardSetBatchService(
            CardSetRepository cardSetRepository,
            @Qualifier("viewCountRedisTemplate") RedisTemplate<String, String> redisTemplate
    ) {
        this.cardSetRepository = cardSetRepository;
        this.redisTemplate = redisTemplate;
    }

    @Scheduled(fixedRate = 1 * 60 * 1000) // 1분마다 수행
    @Transactional
    public void syncRedisViewCountsToDatabase() {
        Set<String> keys = redisTemplate.keys("cardSet:viewCount:*");
        if (keys.isEmpty()) return;

        for (String key : keys) {
            try {
                Long cardSetId = Long.parseLong(key.replace("cardSet:viewCount:", ""));
                String countStr = redisTemplate.opsForValue().get(key);

                if (countStr != null) {
                    Integer count = Integer.parseInt(countStr);
                    cardSetRepository.increaseViewCount(cardSetId, count);

                    log.info("조회수 동기화 완료 - cardSetId={}, count={}", cardSetId, count);
                }

                redisTemplate.delete(key);
            } catch (Exception e) {
                log.warn("조회수 동기화 실패 - key: {}", key, e);
            }
        }
    }
}
