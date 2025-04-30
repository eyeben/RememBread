package com.remembread.card.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class CardCreateGetDto {
    Long cardSetId;
    String concept;
    String description;
}
