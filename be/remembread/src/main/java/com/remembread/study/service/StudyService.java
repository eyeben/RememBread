package com.remembread.study.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.remembread.apipayload.code.status.ErrorStatus;
import com.remembread.apipayload.exception.GeneralException;
import com.remembread.card.converter.CardConverter;
import com.remembread.card.dto.response.CardResponse;
import com.remembread.card.entity.Card;
import com.remembread.card.entity.CardSet;
import com.remembread.card.repository.CardRepository;
import com.remembread.card.repository.CardSetRepository;
import com.remembread.common.service.RedisService;
import com.remembread.study.dto.CardCache;
import com.remembread.study.dto.request.AnswerResultRequest;
import com.remembread.study.dto.request.StudyStartRequest;
import com.remembread.study.dto.request.StudyStopRequest;
import com.remembread.study.dto.response.RemainingCardCountResponse;
import com.remembread.study.repository.CardStudyLogRepository;
import com.remembread.study.repository.StudySessionRepository;
import com.remembread.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudyService {

    private final RedisTemplate<String, Object> redisTemplate;
    @Value("${spring.application.name}")
    private String redisPrefix;

    private static final Double S_MAX = 100.0;
    private static final Double S_MIN = 0.04;
    private static final Double INCREASE_RATE = 1.4;
    private static final Double DECREASE_RATE = 0.7;
    private static final Double SECONDS_IN_A_DAY = 86400.0;
    private static final Double ALPHA = 50.0;

    private final StudySessionRepository studySessionRepository;
    private final CardStudyLogRepository cardStudyLogRepository;
    private final CardSetRepository cardSetRepository;
    private final CardRepository cardRepository;
    private final RedisService redisService;

    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public CardResponse startStudySession(Long cardSetId, StudyStartRequest request, User user) {
        CardSet cardSet = cardSetRepository.findById(cardSetId).orElseThrow(() ->
                new GeneralException(ErrorStatus.CARDSET_NOT_FOUND));
        if (!cardSet.getUser().getId().equals(user.getId())) {
            throw new GeneralException(ErrorStatus.CARDSET_FORBIDDEN);
        }
        this.deleteStudySession(user);

        List<Card> cards = cardRepository.findAllByCardSet(cardSet);
        List<CardCache> cardCaches = new ArrayList<>();
        for (Card card : cards) {
            cardCaches.add(CardConverter.toCardCache(card));
        }

        LocalDateTime now = LocalDateTime.now();
        cardCaches.sort(Comparator.comparingDouble(card -> {
            Double R = Math.exp(-(ChronoUnit.SECONDS.between(card.getLastViewedTime(), now) * ALPHA / SECONDS_IN_A_DAY) / card.getStability());
            card.setRetentionRate(R);
            return Math.abs(0.9 - R) + (0.9 <= R ? 1:0);
        }));
        redisService.setValue(redisPrefix + "::study-mode::" + user.getId(), request.getMode().toString());
        String zSetKey = redisPrefix + "::study::" + user.getId() + "::sorted-set::";
        for (CardCache cardCache : cardCaches) {
            if (request.getCount() <= redisService.getZSetSize(zSetKey)) break;
            String cardKey = redisPrefix + "::study::" + user.getId() + "::card::" + cardCache.getId();
            redisService.addToZSet(zSetKey, cardKey, cardCache.getRetentionRate());
            Map<String, Object> hash = objectMapper.convertValue(cardCache, new TypeReference<HashMap<String, Object>>() {});
            redisService.putAllHash(cardKey, hash);
            redisService.putHash(cardKey, "lastViewedTime", now);
        }

        return getNextCard(cardSetId, user);
    }

    @Transactional
    public void stopStudySession(Long cardSetId, StudyStopRequest request, User user) {
        CardSet cardSet = cardSetRepository.findById(cardSetId).orElseThrow(() ->
                new GeneralException(ErrorStatus.CARDSET_NOT_FOUND));
        if (!cardSet.getUser().getId().equals(user.getId())) {
            throw new GeneralException(ErrorStatus.CARDSET_FORBIDDEN);
        }

        Set<Object> cards = redisService.getZSetRange(
                redisPrefix + "::study::" + user.getId() + "::sorted-set::", 0, -1);
        for (Object cardJson : cards) {
            try {
                Map<Object, Object> hash = redisService.getHashMap((String) cardJson);
                CardCache cardCache = objectMapper.convertValue(hash, CardCache.class);
                Card card = cardRepository.findById(cardCache.getId()).orElseThrow(() ->
                        new GeneralException(ErrorStatus.CARD_NOT_FOUND));
                card.update(cardCache);
            } catch (Exception e) {
                log.warn("Exception occurred while updating card ", e);
            }
        }

        Card lastCard = cardRepository.findById(request.getLastCardId()).orElseThrow(() ->
                new GeneralException(ErrorStatus.CARD_NOT_FOUND));
        cardSet.updateLastViewedCard(lastCard);
        cardSetRepository.save(cardSet);

        this.deleteStudySession(user);
    }

    public void deleteStudySession(User user) {
        redisService.deleteValue(redisPrefix + "::study-mode::" + user.getId());
        Set<Object> cards = redisService.getZSetRange(
                redisPrefix + "::study::" + user.getId() + "::sorted-set::", 0, -1);
        for (Object cardJson : cards) {
            redisService.deleteValue((String) cardJson);
        }
        redisService.deleteValue(redisPrefix + "::study::" + user.getId() + "::sorted-set::");
    }

    public RemainingCardCountResponse submitAnswer(Long cardSetId, Long cardId, AnswerResultRequest request, User user) {
        String zSetKey = redisPrefix + "::study::" + user.getId() + "::sorted-set::";
        String cardKey = redisPrefix + "::study::" + user.getId() + "::card::" + cardId;
        if (!redisService.hasKey(cardKey)) {
            throw new GeneralException(ErrorStatus.CARDCACHE_NOT_FOUND);
        }

        LocalDateTime lastViewedTime = LocalDateTime.parse((CharSequence) redisService.getHash(cardKey, "lastViewedTime"));

        Double timeDiff = ChronoUnit.SECONDS.between(lastViewedTime, LocalDateTime.now()) * ALPHA / SECONDS_IN_A_DAY;
        Double stability = (Double) redisService.getHash(cardKey, "stability");

        redisService.putHash(cardKey, "lastViewedTime", LocalDateTime.now());

        redisService.incrementHash(cardKey, "solvedCount", 1L);
        if (request.getIsCorrect()) {
            redisService.incrementHash(cardKey, "correctCount", 1L);
            stability = Math.min(stability * INCREASE_RATE, S_MAX);
        } else {
            stability = Math.max(stability * DECREASE_RATE, S_MIN);
        }

        Double retentionRate = (Double) Math.exp(-timeDiff / stability);

        redisService.putHash(cardKey, "stability", stability);

        int correctCount = (int) redisService.getHash(cardKey, "correctCount");
        if (0.9 <= retentionRate && 3 <= correctCount) {
            redisService.removeFromZSet(zSetKey, cardKey);
        }
        updateAllCardCaches(user);

        RemainingCardCountResponse response = new RemainingCardCountResponse();
        response.setRemainingCardCount(redisService.getZSetSize(zSetKey));

        return response;
    }

    public CardResponse getNextCard(Long cardSetId, User user) {
        String zSetKey = redisPrefix + "::study::" + user.getId() + "::sorted-set::";
        if (redisService.getZSetSize(zSetKey).equals(0L)) {
            throw new GeneralException(ErrorStatus.CARDCACHE_NOT_FOUND);
        }

        Set<Object> cards = redisService.getOneZSetReverseRangeByScore(zSetKey, 0.0, 0.9);
        Map<Object, Object> hash = Map.of();
        for (Object cardJson : cards) {
            hash = redisService.getHashMap((String) cardJson);
        }
        System.out.println(hash);

        CardCache cardCache = objectMapper.convertValue(hash, CardCache.class);

        return CardResponse.builder()
                .cardId(cardCache.getId())
                .number(cardCache.getNumber())
                .concept(cardCache.getConcept())
                .description(cardCache.getDescription())
                .conceptImageUrl(cardCache.getConceptImageUrl())
                .descriptionImageUrl(cardCache.getDescriptionImageUrl())
                .build();
    }

    public void updateAllCardCaches(User user) {
        String zSetKey = redisPrefix + "::study::" + user.getId() + "::sorted-set::";
        Set<Object> cards = redisService.getZSetRange(zSetKey, 0, -1);
        LocalDateTime now = LocalDateTime.now();
        for (Object cardJson : cards) {
            String cardKey = cardJson + "";
            LocalDateTime lastViewedTime = LocalDateTime.parse((CharSequence) redisService.getHash(cardKey, "lastViewedTime"));
            Double timeDiff = ChronoUnit.SECONDS.between(lastViewedTime, now) * ALPHA / SECONDS_IN_A_DAY;
            Double stability = (Double) redisService.getHash(cardKey, "stability");
            Double retentionRate = Math.exp(-timeDiff / stability);
            System.out.println(cardKey + ": " + retentionRate);
            redisService.putHash(cardKey, "retentionRate", retentionRate);
            redisService.addToZSet(zSetKey, cardKey, retentionRate);
        }
    }

}
