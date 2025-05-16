package com.remembread.study.service;

import com.remembread.apipayload.code.status.ErrorStatus;
import com.remembread.apipayload.exception.GeneralException;
import com.remembread.card.entity.CardSet;
import com.remembread.common.service.RedisService;
import com.remembread.study.dto.response.CardStudyLogResponse;
import com.remembread.study.entity.StudySession;
import com.remembread.study.repository.StudySessionRepository;
import com.remembread.user.entity.User;
import lombok.RequiredArgsConstructor;
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
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudySessionService {

    @Value("${spring.application.name}")
    private String redisPrefix;

    private static final Integer SRID = 4326;

    private final StudySessionRepository studySessionRepository;
    private final RedisService redisService;

    @Transactional
    public Long startStudySession(CardSet cardSet, User user) {
        StudySession studySession = StudySession.builder()
                .user(user)
                .cardSet(cardSet)
                .studiedAt(LocalDateTime.now())
                .build();
        studySessionRepository.saveAndFlush(studySession);
        return studySession.getId();
    }

    @Transactional
    public void updateRoute(Long userId, StudySession studySession) {
        List<Object> objList = redisService.getList(redisPrefix + "::study-log::" + userId + "::route::");
        List<Coordinate> coordList = new ArrayList<>();
        for (Object obj : objList) {
            String[] coordStr = ((String) obj).split(",");
            coordList.add(new Coordinate(Double.parseDouble(coordStr[0]), Double.parseDouble(coordStr[1])));
        }
        PrecisionModel precisionModel = new PrecisionModel();
        GeometryFactory geometryFactory = new GeometryFactory(precisionModel, SRID);
        Coordinate[] coords = coordList.toArray(new Coordinate[0]);

        LineString route = geometryFactory.createLineString(coords);
        studySession.updateRoute(route);
        studySessionRepository.save(studySession);
    }

    @Transactional(readOnly = true)
    public StudySession findById(Long id) {
        return studySessionRepository.findById(id).orElseThrow(() -> new GeneralException(ErrorStatus.STUDY_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public List<StudySession> findAllByCardSetOrderByStudiedAtDesc(CardSet cardSet, Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        return studySessionRepository.findByCardSetOrderByStudiedAtDesc(cardSet, pageable);
    }

    @Transactional(readOnly = true)
    public List<CardStudyLogResponse> fetchLogsByStudySessionId(Long studySessionId) {
        return studySessionRepository.fetchLogsByStudySessionId(studySessionId);
    }
}
