package com.remembread.card.controller;

import com.remembread.apipayload.ApiResponse;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.card.dto.request.FolderCreateRequest;
import com.remembread.card.dto.request.FolderUpdateRequest;
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
    public ApiResponse<FolderResponse> getFolderInfo(
            @PathVariable Long folderId,
            @AuthUser User user
    ) {
        FolderResponse response = folderService.getFolderInfo(folderId, user);
        return ApiResponse.onSuccess(response);
    }

    @GetMapping("/{folderId}/sub-folders")
    public ApiResponse<SubFolderListResponse> getSubFolderList(
            @PathVariable Long folderId,
            @AuthUser User user
    ) {
        SubFolderListResponse response = folderService.getSubFolderList(folderId, user);
        return ApiResponse.onSuccess(response);
    }

    @PatchMapping("/{folderId}")
    public ApiResponse<Void> updateFolder(
            @PathVariable Long folderId,
            @RequestBody FolderUpdateRequest request,
            @AuthUser User user
    ) {
        folderService.updateFolderName(folderId, request.getName(), user);
        return ApiResponse.onSuccess(null);
    }

    @DeleteMapping("/{folderId}")
    public ApiResponse<Void> deleteFolder(
            @PathVariable Long folderId,
            @AuthUser User user
    ) {
        folderService.deleteFolder(folderId, user);
        return ApiResponse.onSuccess(null);
    }
}
