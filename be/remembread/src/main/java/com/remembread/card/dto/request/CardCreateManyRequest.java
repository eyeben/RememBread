package com.remembread.card.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class CardCreateManyRequest {
    Long cardSetId;
    List<Bread> breads;

    @Data
    public static class Bread {
        String concept;
        String description;
    }
}
