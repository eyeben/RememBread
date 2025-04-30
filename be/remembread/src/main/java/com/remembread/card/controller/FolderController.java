package com.remembread.card.controller;

import com.remembread.apipayload.ApiResponse;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.card.dto.request.FolderCreateRequest;
import com.remembread.card.service.FolderService;
import com.remembread.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/folders")
@RequiredArgsConstructor
public class FolderController {
    private final FolderService folderService;

    @PostMapping
    public ApiResponse<Void> createFolder(
            @RequestBody FolderCreateRequest request,
            @AuthUser User user) {
        folderService.createFolder(request, user);
        return ApiResponse.onSuccess(null);
    }
}
