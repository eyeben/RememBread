package com.remembread.card.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CardResponse {
    private Integer number;
    private String concept;
    private String description;
    private String conceptImageUrl;
    private String descriptionImageUrl;
}
