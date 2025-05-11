package com.remembread.card.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
public class CardSetFlatDto {
    private Long cardSetId;
    private String name;
    private Boolean isPublic;
    private Boolean isLike;
    private Integer viewCount;
    private Integer forkCount;
    private Integer totalCardCount;
    private Long lastViewedCardId;
    private String hashTag;
    private LocalDateTime updatedAt;

    public CardSetFlatDto(Long cardSetId,
                          String name,
                          Boolean isPublic,
                          Boolean isLike,
                          Integer viewCount,
                          Integer forkCount,
                          Integer totalCardCount,
                          Long lastViewedCardId,
                          String hashTag,
                          Timestamp updatedAt) {
        this.cardSetId = cardSetId;
        this.name = name;
        this.isPublic = isPublic;
        this.isLike = isLike;
        this.viewCount = viewCount;
        this.forkCount = forkCount;
        this.totalCardCount = totalCardCount;
        this.lastViewedCardId = lastViewedCardId;
        this.hashTag = hashTag;
        this.updatedAt = updatedAt != null ? updatedAt.toLocalDateTime() : null;
    }

}