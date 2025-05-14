package com.remembread.card.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class CardSetDeleteManyRequest {
    List<Long> cardSetIds;
}
