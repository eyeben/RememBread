package com.remembread.card.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CardListInfiniteResponse {
    Long cardId;
    Integer num;
    String concept;
    String description;
}
