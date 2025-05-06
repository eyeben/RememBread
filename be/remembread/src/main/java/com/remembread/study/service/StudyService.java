package com.remembread.study.service;

import com.fasterxml.jackson.core.JsonProcessingException;
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
import com.remembread.study.dto.StudyStartRequest;
import com.remembread.study.repository.CardStudyLogRepository;
import com.remembread.study.repository.StudySessionRepository;
import com.remembread.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Limit;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudyService {

    @Value("${spring.application.name}")
    private String redisPrefix;

    private final StudySessionRepository studySessionRepository;
    private final CardStudyLogRepository cardStudyLogRepository;
    private final CardSetRepository cardSetRepository;
    private final CardRepository cardRepository;
    private final RedisService redisService;

    private final ObjectMapper objectMapper;

    public CardResponse startStudySession(Long cardSetId, StudyStartRequest request, User user) {
        CardSet cardSet = cardSetRepository.findById(cardSetId).orElseThrow(() ->
                new GeneralException(ErrorStatus.CARDSET_NOT_FOUND));
        if (!cardSet.getUser().getId().equals(user.getId())) {
            throw new GeneralException(ErrorStatus.CARDSET_FORBIDDEN);
        }
        List<Card> cards = cardRepository.findAllByCardSetOrderByRetentionRate(cardSet, Limit.of(request.getCount()));
        redisService.deleteValue(redisPrefix + "::study-mode::" + user.getId());
        redisService.deleteValue(redisPrefix + "::study::" + user.getId());
        redisService.setValue(redisPrefix + "::study-mode::" + user.getId(), request.getMode().toString());
        for (Card card : cards) {
            CardCache cardCache = CardConverter.toCardCache(card);
            try {
                redisService.addToZSet(
                        redisPrefix + "::study::" + user.getId(),
                        objectMapper.writeValueAsString(cardCache),
                        cardCache.getRetentionRate()
                );
            } catch (JsonProcessingException e) {
                log.error("Failed to serialize card cache to json", card.getId(), e);
            }
        }

        return CardConverter.toCardResponse(cards.get(0));
    }
}
