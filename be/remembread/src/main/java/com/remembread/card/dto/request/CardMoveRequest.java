package com.remembread.card.dto.request;

import lombok.Data;

@Data
public class CardMoveRequest {
    Long fromCardId;
    Integer toNumber;
}

