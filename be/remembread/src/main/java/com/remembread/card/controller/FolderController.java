package com.remembread.card.controller;

import com.remembread.card.service.FolderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/folders")
@RequiredArgsConstructor
public class FolderController {
    private final FolderService folderService;
}
