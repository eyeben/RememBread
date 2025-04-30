package com.remembread.card.converter;

import com.remembread.card.dto.response.FolderResponse;
import com.remembread.card.dto.response.SubFolderListResponse;
import com.remembread.card.dto.response.SubFolderResponse;
import com.remembread.card.entity.Folder;

import java.util.ArrayList;
import java.util.List;

public class FolderConverter {

    public static FolderResponse toFolderResponse(Folder folder) {
        FolderResponse response = new FolderResponse();
        response.setName(folder.getName());
        response.setCreatedAt(folder.getCreatedAt());
        response.setUpdatedAt(folder.getUpdatedAt());
        return response;
    }

    public static SubFolderListResponse toSubFolderListResponse(List<Folder> folders) {
        SubFolderListResponse response = new SubFolderListResponse();
        response.setTotal(folders.size());
        response.setSubFolders(new ArrayList<>());
        for (Folder folder : folders) {
            SubFolderResponse subFolderResponse = new SubFolderResponse();
            subFolderResponse.setId(folder.getId());
            subFolderResponse.setName(folder.getName());
            response.getSubFolders().add(subFolderResponse);
        }
        return response;
    }
}
