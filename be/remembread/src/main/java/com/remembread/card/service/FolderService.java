package com.remembread.card.service;

import com.remembread.apipayload.code.status.ErrorStatus;
import com.remembread.apipayload.exception.GeneralException;
import com.remembread.card.converter.FolderConverter;
import com.remembread.card.dto.request.FolderCreateRequest;
import com.remembread.card.dto.response.FolderResponse;
import com.remembread.card.dto.response.FolderRootGetResponse;
import com.remembread.card.dto.response.SubFolderListResponse;
import com.remembread.card.entity.Folder;
import com.remembread.card.repository.FolderRepository;
import com.remembread.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FolderService {
    private final FolderRepository folderRepository;

    @Transactional
    public void createFolder(FolderCreateRequest request, User user) {
        Folder upper = null;

        if (request.getUpperFolderId() != null)
            upper = folderRepository.getReferenceById(request.getUpperFolderId());
        else
            upper = folderRepository.findByUserAndUpperFolderIsNull(user);

        Folder folder = Folder.builder()
                .upperFolder(upper)
                .subFolders(new ArrayList<Folder>())
                .user(user)
                .name(request.getName())
                .build();
        if (upper != null) {
            upper.getSubFolders().add(folder);
        }
        folderRepository.save(folder);
    }

    @Transactional(readOnly = true)
    public SubFolderListResponse getRootFolderList(User user) {
        Folder root = folderRepository.findByUserAndUpperFolderIsNull(user);
        List<Folder> folders = folderRepository.findAllByUpperFolder(root);
        return FolderConverter.toSubFolderListResponse(folders);
    }

    @Transactional(readOnly = true)
    public FolderResponse getFolderInfo(Long id, User user) {
        Folder folder = folderRepository.findById(id).orElseThrow(() ->
                new GeneralException(ErrorStatus.FOLDER_NOT_FOUND));
        if (!folder.getUser().getId().equals(user.getId())) {
            throw new GeneralException(ErrorStatus.FOLDER_FORBIDDEN);
        }
        return FolderConverter.toFolderResponse(folder);
    }

    @Transactional(readOnly = true)
    public SubFolderListResponse getSubFolderList(Long id, User user) {
        Folder folder = folderRepository.findById(id).orElseThrow(() ->
                new GeneralException(ErrorStatus.FOLDER_NOT_FOUND));
        if (!folder.getUser().getId().equals(user.getId())) {
            throw new GeneralException(ErrorStatus.FOLDER_FORBIDDEN);
        }
        List<Folder> subFolders = folder.getSubFolders();
        return FolderConverter.toSubFolderListResponse(subFolders);
    }

    @Transactional
    public void updateFolderName(Long id, String name, User user) {
        Folder folder = folderRepository.findById(id).orElseThrow(() ->
                new GeneralException(ErrorStatus.FOLDER_NOT_FOUND));

        if(folder.getUpperFolder() == null)
            throw new GeneralException(ErrorStatus.ROOT_FOLDER_CANNOT_BE_MODIFIED);

        if (!folder.getUser().getId().equals(user.getId())) {
            throw new GeneralException(ErrorStatus.FOLDER_FORBIDDEN);
        }
        folder.updateName(name);
        folderRepository.save(folder);
    }

    @Transactional
    public void deleteFolder(Long id, User user) {
        Folder folder = folderRepository.findById(id).orElseThrow(() ->
                new GeneralException(ErrorStatus.FOLDER_NOT_FOUND));

        if(folder.getUpperFolder() == null)
            throw new GeneralException(ErrorStatus.ROOT_FOLDER_CANNOT_BE_MODIFIED);

        if (!folder.getUser().getId().equals(user.getId())) {
            throw new GeneralException(ErrorStatus.FOLDER_FORBIDDEN);
        }
        folderRepository.delete(folder);
    }

    public FolderRootGetResponse getRootFolderId(User user) {
        return new FolderRootGetResponse(folderRepository.findByUserAndUpperFolderIsNull(user).getId());
    }
}
