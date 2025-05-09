package com.remembread.card.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
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
}