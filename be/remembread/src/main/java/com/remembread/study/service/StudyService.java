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
import com.remembread.study.converter.StudyConverter;
import com.remembread.study.dto.CardCache;
import com.remembread.study.dto.request.AnswerResultRequest;
import com.remembread.study.dto.request.StudyStartRequest;
import com.remembread.study.dto.request.StudyStopRequest;
import com.remembread.study.dto.response.RemainingCardCountResponse;
import com.remembread.study.dto.response.RouteResponse;
import com.remembread.study.dto.response.StudyLogResponse;
import com.remembread.study.entity.CardStudyLog;
import com.remembread.study.entity.StudySession;
import com.remembread.study.repository.CardStudyLogRepository;
import com.remembread.study.repository.StudySessionRepository;
import com.remembread.study.util.RetentionUtil;
import com.remembread.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudyService {

    @Value("${spring.application.name}")
    private String redisPrefix;

    private static final Double S_MAX = 50.0;
    private static final Double S_MIN = 0.08;
    private static final Double INCREASE_RATE = 1.4;
    private static final Double DECREASE_RATE = 0.7;
    private static final Integer SRID = 4326;

    private final StudySessionRepository studySessionRepository;
    private final CardStudyLogRepository cardStudyLogRepository;
    private final CardSetRepository cardSetRepository;
    private final CardRepository cardRepository;
    private final RedisService redisService;

    private final ObjectMapper objectMapper;

    @Transactional
    public void startStudySession(Long cardSetId, StudyStartRequest request, User user) {
        CardSet cardSet = cardSetRepository.findById(cardSetId).orElseThrow(() ->
                new GeneralException(ErrorStatus.CARDSET_NOT_FOUND));
        if (!cardSet.getUser().getId().equals(user.getId())) {
            throw new GeneralException(ErrorStatus.CARDSET_FORBIDDEN);
        }
        this.deleteStudySession(user);

        String mode = request.getMode().toString();
        redisService.setValue(redisPrefix + "::study-mode::" + user.getId(), mode);

        if (!mode.equals("STUDY")) {
            this.loadCardSet(cardSet, request.getCount(), user);
        }

        StudySession studySession = StudySession.builder()
                .user(user)
                .cardSet(cardSet)
                .studiedAt(LocalDateTime.now())
                .build();
        studySessionRepository.saveAndFlush(studySession);
        this.addPoint(user,request.getLongitude(), request.getLatitude());
        redisService.setValue(redisPrefix + "::study-log::" + user.getId() + "::session-id::", studySession.getId());
    }

    @Transactional(readOnly = true)
    public void loadCardSet(CardSet cardSet, Integer count, User user) {
        List<Card> cards = cardRepository.findAllByCardSet(cardSet);
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
            if (count <= redisService.getZSetSize(zSetKey)) break;
            String cardKey = redisPrefix + "::study::" + user.getId() + "::card::" + cardCache.getId();
            redisService.addToZSet(zSetKey, cardKey, cardCache.getRetentionRate());
            Map<String, Object> hash = objectMapper.convertValue(cardCache, new TypeReference<HashMap<String, Object>>() {});
            redisService.putAllHash(cardKey, hash);
        }
    }

    @Transactional
    public void stopStudySession(Long cardSetId, StudyStopRequest request, User user) {
        CardSet cardSet = cardSetRepository.findById(cardSetId).orElseThrow(() ->
                new GeneralException(ErrorStatus.CARDSET_NOT_FOUND));
        if (!cardSet.getUser().getId().equals(user.getId())) {
            throw new GeneralException(ErrorStatus.CARDSET_FORBIDDEN);
        }
        Card lastCard = cardRepository.findById(request.getLastCardId()).orElseThrow(() ->
                new GeneralException(ErrorStatus.CARD_NOT_FOUND));
        Long studySessionId = ((Number) redisService.getValue(redisPrefix + "::study-log::" + user.getId() + "::session-id::")).longValue();
        StudySession studySession = studySessionRepository.findById(studySessionId).orElseThrow(() ->
                new GeneralException(ErrorStatus.STUDY_NOT_FOUND));
        cardSet.updateLastViewedCard(lastCard);
        cardSetRepository.save(cardSet);

        String mode = (String) redisService.getValue(redisPrefix + "::study-mode::" + user.getId());

        if (!mode.equals("STUDY")) {
            this.saveCardSet(cardSet, user, studySession);
        }

        this.addPoint(user,request.getLongitude(), request.getLatitude());
        List<Object> objList = redisService.getList(redisPrefix + "::study-log::" + user.getId() + "::route::");
        List<Coordinate> coordList = new ArrayList<>();
        for (Object obj : objList) {
            String[] coordStr = ((String) obj).split(",");
            coordList.add(new Coordinate(Double.parseDouble(coordStr[0]), Double.parseDouble(coordStr[1])));
        }
        PrecisionModel precisionModel = new PrecisionModel();
        GeometryFactory geometryFactory = new GeometryFactory(precisionModel, SRID);
        Coordinate[] coords = coordList.toArray(new Coordinate[0]);

        LineString route = geometryFactory.createLineString(coords);
        studySession.addRoute(route);
        studySessionRepository.save(studySession);

        this.deleteStudySession(user);
    }

    @Transactional
    public void saveCardSet(CardSet cardSet, User user, StudySession studySession) {
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

        List<Card> cards = cardRepository.findAllById(cardIds);
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

        cardStudyLogRepository.saveAll(cardStudyLogs);
    }

    public void addPoint(User user, Double longitude, Double latitude) {
        String listKey = redisPrefix + "::study-log::" + user.getId() + "::route::";
        redisService.pushList(listKey, longitude + "," + latitude);
    }

    public void deleteStudySession(User user) {
        redisService.deleteValue(redisPrefix + "::study-mode::" + user.getId());
        Set<Object> cards = redisService.getZSetRange(
                redisPrefix + "::study::" + user.getId() + "::sorted-set::", 0, -1);
        for (Object cardJson : cards) {
            redisService.deleteValue((String) cardJson);
        }
        redisService.deleteValue(redisPrefix + "::study::" + user.getId() + "::sorted-set::");
        redisService.deleteValue(redisPrefix + "::study-log::" + user.getId() + "::route::");
        redisService.deleteValue(redisPrefix + "::study-log::" + user.getId() + "::session-id::");
    }

    public RemainingCardCountResponse submitAnswer(Long cardSetId, Long cardId, AnswerResultRequest request, User user) {
        String zSetKey = redisPrefix + "::study::" + user.getId() + "::sorted-set::";
        String cardKey = redisPrefix + "::study::" + user.getId() + "::card::" + cardId;
        if (!redisService.hasKey(cardKey)) {
            throw new GeneralException(ErrorStatus.CARDCACHE_NOT_FOUND);
        }

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

    public void updateAllCardCaches(User user) {
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

    @Transactional(readOnly = true)
    public RouteResponse getRoutes(Long cardSetId, Integer page, Integer size, User user) {
        CardSet cardSet = cardSetRepository.findById(cardSetId).orElseThrow(()
                -> new GeneralException(ErrorStatus.CARDSET_NOT_FOUND));
        if (!cardSet.getUser().getId().equals(user.getId())) {
            throw new GeneralException(ErrorStatus.CARDSET_FORBIDDEN);
        }
        Pageable pageable = PageRequest.of(page, size);
        List<StudySession> studySessions = studySessionRepository.findByCardSetOrderByStudiedAtDesc(cardSet, pageable);
        return StudyConverter.toRouteResponse(studySessions);
    }

    @Transactional(readOnly = true)
    public StudyLogResponse getLogsByCardSet(Long cardSetId, User user, Integer page, Integer size) {
        CardSet cardSet = cardSetRepository.findById(cardSetId).orElseThrow(()
                -> new GeneralException(ErrorStatus.CARDSET_NOT_FOUND));
        if (!cardSet.getUser().getId().equals(user.getId())) {
            throw new GeneralException(ErrorStatus.CARDSET_FORBIDDEN);
        }
        Pageable pageable = PageRequest.of(page, size);
        List<StudySession> studySessions = studySessionRepository.findByCardSetOrderByStudiedAtDesc(cardSet, pageable);
        List<StudyLogResponse.StudySession> studySessionList = new ArrayList<>();
        for (StudySession studySession : studySessions) {
            studySessionList.add(StudyLogResponse.StudySession.builder()
                    .studySessionId(studySession.getId())
                    .studiedAt(studySession.getStudiedAt())
                    .cards(studySessionRepository.fetchLogsByStudySessionId(studySession.getId()))
                    .build());
        }

        return StudyLogResponse.builder()
                .cardSetId(cardSetId)
                .name(cardSet.getName())
                .logs(studySessionList)
                .build();
    }
}
