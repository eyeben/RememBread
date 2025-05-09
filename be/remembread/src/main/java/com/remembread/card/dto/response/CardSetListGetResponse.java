package com.remembread.card.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class CardSetListGetResponse {
    private List<CardSet> cardSets;

    @Data
    @Builder
    public static class CardSet {
        private Long cardSetId;
        private String name;
        private Boolean isLike;
        private Boolean isPublic;
        private Integer viewCount;
        private Integer forkCount;
        private Integer totalCardCount;
        private Long lastViewedCardId;
        private List<String> hashTags;
    }
}
