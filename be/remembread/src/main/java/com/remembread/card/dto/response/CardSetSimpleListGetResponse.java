package com.remembread.card.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class CardSetSimpleListGetResponse {
    List<CardSet> cardSets;

    @Data
    @AllArgsConstructor
    public static class CardSet{
        Long cardSetId;
        String title;
    }
}
