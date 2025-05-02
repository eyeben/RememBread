package com.remembread.card.projection;

public interface FlatCardSetProjection {
    Long getCardSetId();
    String getTitle();
    Boolean getIsPublic();
    Integer getViewCount();
    Integer getForkCount();
    Integer getTotalCardCount();
    Long getLastViewedCardId();
    String getHashtag();
}