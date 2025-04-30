package com.remembread.card.controller;

import com.remembread.apipayload.ApiResponse;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.card.dto.request.FolderCreateRequest;
import com.remembread.card.dto.response.FolderResponse;
import com.remembread.card.dto.response.SubFolderListResponse;
import com.remembread.card.service.FolderService;
import com.remembread.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/{folderId}")
    public ApiResponse<FolderResponse> getFolderInfo(@PathVariable Long folderId) {
        FolderResponse response = folderService.getFolderInfo(folderId);
        return ApiResponse.onSuccess(response);
    }

    @GetMapping("/{folderId}/sub-folders")
    public ApiResponse<SubFolderListResponse> getSubFolderList(@PathVariable Long folderId) {
        SubFolderListResponse response = folderService.getSubFolderList(folderId);
        return ApiResponse.onSuccess(response);
    }
}
