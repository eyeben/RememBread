package com.remembread.card.dto.response;

import lombok.Data;

@Data
public class CardListInfiniteResponse {
    Long cardId;
    Integer num;
    String concept;
    String description;
}
