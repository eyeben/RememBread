package com.remembread.study.controller;

import com.remembread.apipayload.ApiResponse;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.study.dto.request.StudyStartRequest;
import com.remembread.study.dto.request.StudyStopRequest;
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
    public ApiResponse<Void> startStudySession(
            @PathVariable("cardSetId") Long cardSetId,
            StudyStartRequest request,
            @AuthUser User user
            ) {
        studyService.startStudySession(cardSetId, request, user);
        return ApiResponse.onSuccess(null);
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
}
