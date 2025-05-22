package com.remembread.card.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class CardSetCreateRequest {
    private Long folderId;
    private String name;
    private List<String> hashtags;
    private Boolean isPublic;
}
