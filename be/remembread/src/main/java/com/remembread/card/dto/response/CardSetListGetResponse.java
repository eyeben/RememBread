package com.remembread.card.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class CardSetListGetResponse {
    private List<CardSet> cardSets;

    @Data
    public static class CardSet {
        private Long cardSetId;
        private String title;
        private Boolean isLike;
        private Boolean isPublic;
        private Integer viewCount;
        private Integer forkCount;
        private Integer totalCardCount;
        private Long lastViewedCardId;
        private List<String> hashTags;
    }
}
