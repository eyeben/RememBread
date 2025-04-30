package com.remembread.card.converter;

import com.remembread.card.dto.response.FolderResponse;
import com.remembread.card.entity.Folder;

public class FolderConverter {

    public static FolderResponse toFolderResponse(Folder folder) {
        FolderResponse response = new FolderResponse();
        response.setName(folder.getName());
        response.setCreatedAt(folder.getCreatedAt());
        response.setUpdatedAt(folder.getUpdatedAt());
        return response;
    }
}
