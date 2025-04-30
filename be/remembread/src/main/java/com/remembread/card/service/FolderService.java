package com.remembread.card.service;

import com.remembread.card.dto.request.FolderCreateRequest;
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
}
