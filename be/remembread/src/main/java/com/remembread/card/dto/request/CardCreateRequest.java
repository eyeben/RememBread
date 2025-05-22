package com.remembread.card.dto.request;

import lombok.Data;

@Data
public class CardCreateRequest {
    Long cardSetId;
    String concept;
    String description;
}
