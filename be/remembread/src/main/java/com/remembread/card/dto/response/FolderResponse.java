package com.remembread.card.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FolderResponse {
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
