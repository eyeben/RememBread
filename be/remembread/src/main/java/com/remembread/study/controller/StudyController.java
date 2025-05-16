package com.remembread.study.controller;

import com.remembread.apipayload.ApiResponse;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.card.dto.response.CardResponse;
import com.remembread.study.dto.request.AnswerResultRequest;
import com.remembread.study.dto.request.LocationRequest;
import com.remembread.study.dto.request.StudyStartRequest;
import com.remembread.study.dto.request.StudyStopRequest;
import com.remembread.study.dto.response.RemainingCardCountResponse;
import com.remembread.study.dto.response.RouteResponse;
import com.remembread.study.dto.response.StudyLogResponse;
import com.remembread.study.facade.StudyFacade;
import com.remembread.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/studies")
@RequiredArgsConstructor
public class StudyController {
    private final StudyFacade studyFacade;

    @PostMapping("/{cardSetId}/start")
    public ApiResponse<Void> startStudySession(
            @PathVariable("cardSetId") Long cardSetId,
            @RequestBody StudyStartRequest request,
            @AuthUser User user
            ) {
        studyFacade.startStudySession(cardSetId, request, user);
        return ApiResponse.onSuccess(null);
    }

    @PostMapping("/{cardSetId}/stop")
    public ApiResponse<Void> stopStudySession(
            @PathVariable("cardSetId") Long cardSetId,
            @RequestBody StudyStopRequest request,
            @AuthUser User user
            ) {
        studyFacade.stopStudySession(cardSetId, request, user);
        return ApiResponse.onSuccess(null);
    }

    @PostMapping("/{cardSetId}/cards/{cardId}/answer")
    public ApiResponse<RemainingCardCountResponse> submitAnswer(
            @PathVariable Long cardSetId,
            @PathVariable Long cardId,
            @RequestBody AnswerResultRequest request,
            @AuthUser User user
    ) {
        return ApiResponse.onSuccess(studyFacade.submitAnswer(cardSetId, cardId, request, user));
    }

    @GetMapping("/{cardSetId}/next")
    public ApiResponse<CardResponse> getNextCard(
            @PathVariable Long cardSetId,
            @AuthUser User user
    ) {
        return ApiResponse.onSuccess(studyFacade.getNextCard(cardSetId, user));
    }

    @PostMapping("/{cardSetId}/location")
    public ApiResponse<Void> addPoint(
            @PathVariable Long cardSetId,
            @RequestBody LocationRequest request,
            @AuthUser User user
    ) {
        studyFacade.addPoint(user, request.getLongitude(), request.getLatitude());
        return ApiResponse.onSuccess(null);
    }

    @GetMapping("/{cardSetId}/routes")
    public ApiResponse<RouteResponse> getRoutes(
            @PathVariable Long cardSetId,
            @RequestParam Integer page,
            @RequestParam Integer size,
            @AuthUser User user
            ) {
        return ApiResponse.onSuccess(studyFacade.getRoutes(cardSetId, page, size, user));
    }

    @GetMapping("/{cardSetId}/logs")
    public ApiResponse<StudyLogResponse> getLogsByCardSet(
            @PathVariable Long cardSetId,
            @RequestParam Integer page,
            @RequestParam Integer size,
            @AuthUser User user
    ) {
        return ApiResponse.onSuccess(studyFacade.getLogsByCardSet(cardSetId, user, page, size));
    }
}
