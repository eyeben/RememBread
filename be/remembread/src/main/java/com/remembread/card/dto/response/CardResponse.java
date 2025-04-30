package com.remembread.card.dto.response;

import lombok.Data;

@Data
public class CardResponse {
    private Integer number;
    private String concept;
    private String description;
    private String conceptImageUrl;
    private String descriptionImageUrl;
}
