package com.remembread.card.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CardListResponse {
    private Integer total;
    private Boolean hasNext;
    private List<CardResponse> cards;
}
