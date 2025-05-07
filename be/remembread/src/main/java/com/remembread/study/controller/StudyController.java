package com.remembread.study.controller;

import com.remembread.apipayload.ApiResponse;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.card.dto.response.CardResponse;
import com.remembread.study.dto.request.AnswerResultRequest;
import com.remembread.study.dto.request.StudyStartRequest;
import com.remembread.study.dto.request.StudyStopRequest;
import com.remembread.study.dto.response.RemainingCardCountResponse;
import com.remembread.study.service.StudyService;
import com.remembread.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/studies")
@RequiredArgsConstructor
public class StudyController {
    private final StudyService studyService;

    @PostMapping("/{cardSetId}/start")
    public ApiResponse<CardResponse> startStudySession(
            @PathVariable("cardSetId") Long cardSetId,
            StudyStartRequest request,
            @AuthUser User user
            ) {
        return ApiResponse.onSuccess(studyService.startStudySession(cardSetId, request, user));
    }

    @PostMapping("/{cardSetId}/stop")
    public ApiResponse<Void> stopStudySession(
            @PathVariable("cardSetId") Long cardSetId,
            StudyStopRequest request,
            @AuthUser User user
            ) {
        studyService.stopStudySession(cardSetId, request, user);
        return ApiResponse.onSuccess(null);
    }

    @PostMapping("/{cardSetId}/cards/{cardId}/answer")
    public ApiResponse<RemainingCardCountResponse> submitAnswer(
            @PathVariable Long cardSetId,
            @PathVariable Long cardId,
            AnswerResultRequest request,
            @AuthUser User user
    ) {
        return ApiResponse.onSuccess(studyService.submitAnswer(cardSetId, cardId, request, user));
    }

    @GetMapping("/{cardSetId}/next")
    public ApiResponse<CardResponse> getNextCard(
            @PathVariable Long cardSetId,
            @AuthUser User user
    ) {
        return ApiResponse.onSuccess(studyService.getNextCard(cardSetId, user));
    }
}
