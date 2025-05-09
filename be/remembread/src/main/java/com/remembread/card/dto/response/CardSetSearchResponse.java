package com.remembread.card.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
public class CardSetSearchResponse {
    List<CardSet> cardSets = new ArrayList<CardSet>();

    @Data
    @AllArgsConstructor
    public static class CardSet {
        Long cardSetId;
        String name;
        Integer viewCount;
        Integer forkCount;

        public void updateViewCount(Integer viewCount){this.viewCount = viewCount;}
    }



}
