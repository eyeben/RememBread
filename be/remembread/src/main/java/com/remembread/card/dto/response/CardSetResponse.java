package com.remembread.card.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class CardSetResponse {
    private String name;
    private List<String> hashtags;
    private Boolean isPublic;
}
