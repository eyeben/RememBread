package com.remembread.card.repository;

import com.remembread.card.entity.Folder;
import com.remembread.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FolderRepository extends JpaRepository<Folder, Long> {
    Folder findByUserAndUpperFolderIsNull(User user);
    List<Folder> findAllByUpperFolder(Folder root);
    // List<Folder> findByUserAndUpperFolderIsNull(User user);

}
