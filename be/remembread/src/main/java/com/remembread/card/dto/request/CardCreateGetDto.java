package com.remembread.card.dto.request;

import lombok.Data;

@Data
public class CardCreateGetDto {
    Long cardSetId;
    String concept;
    String description;
}
