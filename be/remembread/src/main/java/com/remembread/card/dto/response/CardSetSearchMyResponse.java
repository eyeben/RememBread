package com.remembread.card.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
public class CardSetSearchMyResponse {
    List<CardSet> cardSets = new ArrayList<CardSet>();
    Boolean hasNext;

    @Data
    public static class CardSet {
        Long cardSetId;
        String name;
        Integer viewCount;
        Integer forkCount;
        LocalDateTime updatedAt;
        Boolean isLike;

        public CardSet(Long cardSetId, String name, Integer viewCount, Integer forkCount, Timestamp updatedAt, Boolean isLike) {
            this.cardSetId = cardSetId;
            this.name = name;
            this.viewCount = viewCount;
            this.forkCount = forkCount;
            this.updatedAt = updatedAt.toLocalDateTime();
            this.isLike = isLike;
        }

        public void updateViewCount(Integer viewCount){this.viewCount = viewCount;}
    }
}
