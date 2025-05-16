package com.remembread.study.facade;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.remembread.apipayload.code.status.ErrorStatus;
import com.remembread.apipayload.exception.GeneralException;
import com.remembread.card.converter.CardConverter;
import com.remembread.card.dto.response.CardResponse;
import com.remembread.card.entity.Card;
import com.remembread.card.entity.CardSet;
import com.remembread.card.service.CardService;
import com.remembread.card.service.CardSetService;
import com.remembread.common.service.RedisService;
import com.remembread.study.converter.StudyConverter;
import com.remembread.study.dto.CardCache;
import com.remembread.study.dto.request.AnswerResultRequest;
import com.remembread.study.dto.request.StudyStartRequest;
import com.remembread.study.dto.request.StudyStopRequest;
import com.remembread.study.dto.response.RemainingCardCountResponse;
import com.remembread.study.dto.response.RouteResponse;
import com.remembread.study.dto.response.StudyLogResponse;
import com.remembread.study.dto.response.SummaryLogResponse;
import com.remembread.study.entity.CardStudyLog;
import com.remembread.study.entity.StudySession;
import com.remembread.study.service.CardStudyLogService;
import com.remembread.study.service.StudySessionService;
import com.remembread.study.util.RetentionUtil;
import com.remembread.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyFacade {

    @Value("${spring.application.name}")
    private String redisPrefix;

    private static final Double S_MAX = 50.0;
    private static final Double S_MIN = 0.08;
    private static final Double INCREASE_RATE = 1.4;
    private static final Double DECREASE_RATE = 0.7;

    private final CardSetService cardSetService;
    private final StudySessionService studySessionService;
    private final CardService cardService;
    private final CardStudyLogService cardStudyLogService;
    private final RedisService redisService;

    private final ObjectMapper objectMapper;

    @Transactional
    public void startStudySession(Long cardSetId, StudyStartRequest request, User user) {
        CardSet cardSet = cardSetService.validateCardSetOwner(cardSetId, user);
        this.deleteStudySession(user.getId());

        redisService.addToSet(redisPrefix + "::studies::", user.getId());

        String mode = request.getMode().toString();
        String modeKey = redisPrefix + "::study-mode::" + user.getId();
        redisService.setValue(modeKey, mode, Duration.ofMinutes(3));

        if (!mode.equals("STUDY")) {    // 테스트 모드 진행할 경우 카드를 로딩한다
            List<Card> cards = cardService.findAllByCardSet(cardSet);
            List<CardCache> cardCaches = new ArrayList<>();
            for (Card card : cards)
                cardCaches.add(CardConverter.toCardCache(card));
            LocalDateTime now = LocalDateTime.now();
            cardCaches.sort(Comparator.comparingDouble(card -> {
                Double retentionRate = RetentionUtil.calcRetentionRate(card.getLastViewedTime(), now, card.getStability());
                card.setRetentionRate(retentionRate);
                return Math.abs(0.9 - retentionRate) + (0.9 <= retentionRate ? 1:0);
            }));
            String zSetKey = redisPrefix + "::study::" + user.getId() + "::sorted-set::";
            for (CardCache cardCache : cardCaches) {
                if (request.getCount() <= redisService.getZSetSize(zSetKey)) break;
                String cardKey = redisPrefix + "::study::" + user.getId() + "::card::" + cardCache.getId();
                redisService.addToZSet(zSetKey, cardKey, cardCache.getRetentionRate());
                Map<String, Object> hash = objectMapper.convertValue(cardCache, new TypeReference<HashMap<String, Object>>() {});
                redisService.putAllHash(cardKey, hash);
            }
        }

        Long studySessionId = studySessionService.startStudySession(cardSet, user);
        String studySessionKey = redisPrefix + "::study-log::" + user.getId() + "::session-id::";
        redisService.setValue(studySessionKey, studySessionId);
        this.addPoint(user, request.getLongitude(), request.getLatitude());
    }

    @Transactional
    public void stopStudySession(Long cardSetId, StudyStopRequest request, User user) {
        CardSet cardSet = cardSetService.validateCardSetOwner(cardSetId, user);
        Card lastCard = cardService.findById(request.getLastCardId());
        Long studySessionId = ((Number) redisService.getValue(redisPrefix + "::study-log::" + user.getId() + "::session-id::")).longValue();
        StudySession studySession = studySessionService.findById(studySessionId);
        cardSet.updateLastViewedCard(lastCard);

        String mode = (String) redisService.getValue(redisPrefix + "::study-mode::" + user.getId());
        if (!mode.equals("STUDY")) {    // 테스트 모드 진행할 경우 카드를 저장한다
            Set<Object> cardJsons = redisService.getZSetRange(
                    redisPrefix + "::study::" + user.getId() + "::sorted-set::", 0, -1);

            List<Long> cardIds = new ArrayList<>();
            Map<Long, CardCache> cardCacheMap = new HashMap<>();
            for (Object cardJson : cardJsons) {
                Map<Object, Object> hash = redisService.getHashMap((String) cardJson);
                CardCache cardCache = objectMapper.convertValue(hash, CardCache.class);
                cardIds.add(cardCache.getId());
                cardCacheMap.put(cardCache.getId(), cardCache);
            }

            List<Card> cards = cardService.findAllById(cardIds);
            Map<Long, Card> cardMap = cards.stream()
                    .collect(Collectors.toMap(Card::getId, card -> card));
            List<CardStudyLog> cardStudyLogs = new ArrayList<>();
            for (Long cardId : cardIds) {
                Card card = cardMap.get(cardId);
                CardCache cardCache = cardCacheMap.get(cardId);
                card.update(cardCache);

                CardStudyLog cardStudyLog = CardStudyLog.builder()
                        .studySession(studySession)
                        .card(card)
                        .correctCount(cardCache.getCorrectCount())
                        .solvedCount(cardCache.getSolvedCount())
                        .build();
                cardStudyLogs.add(cardStudyLog);
            }
            cardStudyLogService.saveAll(cardStudyLogs);
        }

        this.addPoint(user, request.getLongitude(), request.getLatitude());
        studySessionService.updateRoute(user.getId(), studySession);
        this.deleteStudySession(user.getId());
    }

    public RemainingCardCountResponse submitAnswer(Long cardSetId, Long cardId, AnswerResultRequest request, User user) {
        String zSetKey = redisPrefix + "::study::" + user.getId() + "::sorted-set::";
        String cardKey = redisPrefix + "::study::" + user.getId() + "::card::" + cardId;
        if (!redisService.hasKey(cardKey)) throw new GeneralException(ErrorStatus.CARDCACHE_NOT_FOUND);

        LocalDateTime lastViewedTime = LocalDateTime.parse((CharSequence) redisService.getHash(cardKey, "lastViewedTime"));
        Double stability = (Double) redisService.getHash(cardKey, "stability");

        redisService.putHash(cardKey, "lastViewedTime", LocalDateTime.now());

        redisService.incrementHash(cardKey, "solvedCount", 1L);
        if (request.getIsCorrect()) {
            redisService.incrementHash(cardKey, "correctCount", 1L);
            stability = Math.min(stability * INCREASE_RATE, S_MAX);
            Double retentionRate = RetentionUtil.calcRetentionRate(lastViewedTime, stability);
            int correctCount = (int) redisService.getHash(cardKey, "correctCount");
            if (0.9 <= retentionRate && RetentionUtil.calcThreshold(stability) <= correctCount) {
                redisService.removeFromZSet(zSetKey, cardKey);
            }
        } else {
            stability = Math.max(stability * DECREASE_RATE, S_MIN);
        }

        redisService.putHash(cardKey, "stability", stability);
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

    @Transactional(readOnly = true)
    public RouteResponse getRoutes(Long cardSetId, Integer page, Integer size, User user) {
        CardSet cardSet = cardSetService.validateCardSetOwner(cardSetId, user);
        List<StudySession> studySessions = studySessionService.findAllByCardSetOrderByStudiedAtDesc(cardSet, page, size);
        return StudyConverter.toRouteResponse(studySessions);
    }

    @Transactional(readOnly = true)
    public StudyLogResponse getLogsByCardSet(Long cardSetId, User user, Integer page, Integer size) {
        CardSet cardSet = cardSetService.validateCardSetOwner(cardSetId, user);
        List<StudySession> studySessions = studySessionService.findAllByCardSetOrderByStudiedAtDesc(cardSet, page, size);
        List<StudyLogResponse.StudySession> studySessionList = new ArrayList<>();
        for (StudySession studySession : studySessions) {
            studySessionList.add(StudyLogResponse.StudySession.builder()
                    .studySessionId(studySession.getId())
                    .studiedAt(studySession.getStudiedAt())
                    .cards(studySessionService.fetchLogsByStudySessionId(studySession.getId()))
                    .build());
        }
        return StudyLogResponse.builder()
                .cardSetId(cardSetId)
                .name(cardSet.getName())
                .logs(studySessionList)
                .build();
    }

    @Transactional(readOnly = true)
    public SummaryLogResponse getLogs(LocalDate startDate, LocalDate endDate, User user) {
        List<SummaryLogResponse.YearLogResponse.MonthLogResponse.DayLogResponse> dayLogResponses =
                cardStudyLogService.getDayLogResponses(startDate, endDate, user.getId());
        return StudyConverter.toSummaryLogResponse(dayLogResponses);
    }

    public void addPoint(User user, Double longitude, Double latitude) {
        String listKey = redisPrefix + "::study-log::" + user.getId() + "::route::";
        String studySessionKey = redisPrefix + "::study-log::" + user.getId() + "::session-id::";
        String modeKey = redisPrefix + "::study-mode::" + user.getId();
        redisService.expire(modeKey, Duration.ofMinutes(3));
        redisService.pushList(listKey, longitude + "," + latitude);
        Long length = redisService.size(listKey);
        if (length % 5 == 1) {
            if (length == 1) redisService.pushList(listKey, longitude + "," + latitude);
            Long studySessionId = ((Number) redisService.getValue(studySessionKey)).longValue();
            StudySession studySession = studySessionService.findById(studySessionId);
            studySessionService.updateRoute(user.getId(), studySession);
        }
    }

    private void updateAllCardCaches(User user) {
        String zSetKey = redisPrefix + "::study::" + user.getId() + "::sorted-set::";
        Set<Object> cards = redisService.getZSetRange(zSetKey, 0, -1);
        LocalDateTime now = LocalDateTime.now();
        for (Object cardJson : cards) {
            String cardKey = cardJson + "";
            LocalDateTime lastViewedTime = LocalDateTime.parse((CharSequence) redisService.getHash(cardKey, "lastViewedTime"));
            Double stability = (Double) redisService.getHash(cardKey, "stability");
            Double retentionRate = RetentionUtil.calcRetentionRate(lastViewedTime, now, stability);
            redisService.putHash(cardKey, "retentionRate", retentionRate);
            redisService.addToZSet(zSetKey, cardKey, retentionRate);
        }
    }

    private void deleteStudySession(Long userId) {
        redisService.removeFromSet(redisPrefix + "::studies::", userId);
        redisService.deleteValue(redisPrefix + "::study-mode::" + userId);
        Set<Object> cards = redisService.getZSetRange(
                redisPrefix + "::study::" + userId + "::sorted-set::", 0, -1);
        for (Object cardJson : cards) {
            redisService.deleteValue((String) cardJson);
        }
        redisService.deleteValue(redisPrefix + "::study::" + userId + "::sorted-set::");
        redisService.deleteValue(redisPrefix + "::study-log::" + userId + "::route::");
        redisService.deleteValue(redisPrefix + "::study-log::" + userId + "::session-id::");
    }

    @Scheduled(fixedRate = 5 * 60 * 1000) // 스터디 세션 ttl 이후 5분 지나면 DB에 저장 후 삭제하기
    @Transactional
    public void stopStudySession() {
        Set<Object> userIds = redisService.getSet(redisPrefix + "::studies::");
        for (Object userId : userIds) {
            String studySessionKey = redisPrefix + "::study-log::" + userId + "::session-id::";
            String modeKey = redisPrefix + "::study-mode::" + userId;
            if (!redisService.hasKey(modeKey)) {
                Long studySessionId = ((Number) redisService.getValue(studySessionKey)).longValue();
                StudySession studySession = studySessionService.findById(studySessionId);
                studySessionService.updateRoute(((Number) userId).longValue(), studySession);
                this.deleteStudySession(((Number) userId).longValue());
            }
        }
    }
}
