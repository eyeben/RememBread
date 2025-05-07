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
import com.remembread.study.dto.request.StudyStartRequest;
import com.remembread.study.dto.request.StudyStopRequest;
import com.remembread.study.repository.CardStudyLogRepository;
import com.remembread.study.repository.StudySessionRepository;
import com.remembread.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Limit;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudyService {

    private final RedisTemplate<String, Object> redisTemplate;
    @Value("${spring.application.name}")
    private String redisPrefix;

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
        List<Card> cards = cardRepository.findAllByCardSetOrderByRetentionRate(cardSet, Limit.of(request.getCount()));
        this.deleteStudySession(user);

        redisService.setValue(redisPrefix + "::study-mode::" + user.getId(), request.getMode().toString());
        for (Card card : cards) {
            CardCache cardCache = CardConverter.toCardCache(card);
            redisService.addToZSet(
                    redisPrefix + "::study::" + user.getId() + "::sorted-set::",
                    redisPrefix + "::study::" + user.getId() + "::card::" + cardCache.getId(),
                    cardCache.getRetentionRate()
            );
            Map<String, Object> hash = objectMapper.convertValue(
                    cardCache,
                    new TypeReference<HashMap<String, Object>>() {});
            redisService.putAllHash(
                    redisPrefix + "::study::" + user.getId() + "::card::" + cardCache.getId(),
                    hash
            );
        }

        return CardConverter.toCardResponse(cards.get(0));
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
            Map<Object, Object> hash = redisService.getHashMap((String) cardJson);
            CardCache cardCache = objectMapper.convertValue(hash, CardCache.class);
            Card card = cardRepository.findById(cardCache.getId()).orElseThrow(() ->
                    new GeneralException(ErrorStatus.CARD_NOT_FOUND));
            card.update(cardCache);
            cardRepository.save(card);
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

}
