package com.remembread.card.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CardListResponse {
    private Integer total;
    private List<CardResponse> cards;
}
