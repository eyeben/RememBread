package com.remembread.card.dto.request;

import lombok.Data;

@Data
public class CardCreateGetRequest {
    Long cardSetId;
    String concept;
    String description;
}
