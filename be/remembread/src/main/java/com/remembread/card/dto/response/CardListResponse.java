package com.remembread.card.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class CardListResponse {
    private Integer total;
    private List<CardResponse> cards;
}
