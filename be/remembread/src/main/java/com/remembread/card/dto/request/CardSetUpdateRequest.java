package com.remembread.card.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class CardSetUpdateRequest {
    private String name;
    private List<String> hashtags;
    private Boolean isPublic;
}
