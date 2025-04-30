package com.remembread.card.dto.request;

import lombok.Data;

@Data
public class FolderCreateRequest {
    private String name;
    private Long upperFolderId;
}
