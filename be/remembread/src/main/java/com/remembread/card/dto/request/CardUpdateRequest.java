package com.remembread.card.dto.request;

import lombok.Data;

@Data
public class CardUpdateRequest {
    private Integer number;
    private String concept;
    private String description;
    private String conceptImageUrl;
    private String descriptionImageUrl;
}
