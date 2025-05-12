package com.remembread.card.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class CardSetSearchResponse {
    List<CardSet> cardSets;

    @Data
    public static class CardSet {
        Long cardSetId;
        String name;
        Integer viewCount;
        Integer forkCount;
        LocalDateTime updatedAt;
        Boolean isMine;

        public CardSet(Long cardSetId, String name, Integer viewCount, Integer forkCount, Timestamp updatedAt, Boolean isMine) {
            this.cardSetId = cardSetId;
            this.name = name;
            this.viewCount = viewCount;
            this.forkCount = forkCount;
            this.updatedAt = updatedAt.toLocalDateTime();
            this.isMine = isMine;
        }

        public void updateViewCount(Integer viewCount){this.viewCount = viewCount;}
    }
}
