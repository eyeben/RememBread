package com.remembread.card.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class CardCreateGetDto {
    Long folderId;
    List<String> hashTags;
    List<Bread> breads;

    @Data
    private static class Bread {
        String concept;
        String description;
    }
}
