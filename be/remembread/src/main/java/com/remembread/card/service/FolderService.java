package com.remembread.card.service;

import com.remembread.card.converter.FolderConverter;
import com.remembread.card.dto.request.FolderCreateRequest;
import com.remembread.card.dto.response.FolderResponse;
import com.remembread.card.entity.Folder;
import com.remembread.card.repository.FolderRepository;
import com.remembread.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class FolderService {
    private final FolderRepository folderRepository;

    public void createFolder(FolderCreateRequest request, User user) {
        Folder upper = null;
        if (request.getUpperFolderId() != null) {
            upper = folderRepository.getReferenceById(request.getUpperFolderId());
        }
        Folder folder = Folder.builder()
                .upperFolder(upper)
                .subFolders(new ArrayList<Folder>())
                .user(user)
                .name(request.getName())
                .build();
        folderRepository.save(folder);
    }

    public FolderResponse getFolderInfo(Long id) {
        Folder folder = folderRepository.getReferenceById(id);
        return FolderConverter.toFolderResponse(folder);
    }
}
