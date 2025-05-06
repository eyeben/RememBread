package com.remembread.study.controller;

import com.remembread.apipayload.ApiResponse;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.study.dto.StudyStartRequest;
import com.remembread.study.service.StudyService;
import com.remembread.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/studies")
@RequiredArgsConstructor
public class StudyController {
    private final StudyService studyService;

    @GetMapping("/{cardSetId}/start")
    public ApiResponse<Void> startStudySession(
            @PathVariable("cardSetId") Long cardSetId,
            StudyStartRequest request,
            @AuthUser User user
            ) {
        studyService.startStudySession(cardSetId, request, user);
        return ApiResponse.onSuccess(null);
    }
}
