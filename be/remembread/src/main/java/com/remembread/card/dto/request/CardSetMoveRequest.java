package com.remembread.card.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class CardSetMoveRequest {
    Long targetFolderId;
    List<Long> cardSetIds;
}
