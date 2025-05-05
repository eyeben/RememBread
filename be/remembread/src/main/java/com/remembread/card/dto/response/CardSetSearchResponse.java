package com.remembread.card.dto.response;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class CardSetSearchResponse {
    List<CardSet> cardSets = new ArrayList<CardSet>();

    @Data
    public static class CardSet {
        Long cardSetId;
        String title;
        Integer viewCount;
        Integer forkCount;
    }

}
