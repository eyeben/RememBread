package com.remembread.card.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CardGetResponse {
    private Integer number;
    private String concept;
    private String description;
    private String conceptUrl;
    private String descriptionUrl;
}
