package com.remembread.card.converter;

import com.remembread.card.dto.response.CardListResponse;
import com.remembread.card.dto.response.CardResponse;
import com.remembread.card.entity.Card;
import com.remembread.study.dto.CardCache;

import java.util.ArrayList;
import java.util.List;

public class CardConverter {

    public static CardResponse toCardResponse(Card card) {
        return CardResponse.builder()
            .cardId(card.getId())
            .number(card.getNumber())
            .concept(card.getConcept())
            .description(card.getDescription())
            .conceptImageUrl(card.getConceptImageUrl())
            .descriptionImageUrl(card.getDescriptionImageUrl())
            .build();
    }

    public static CardListResponse toCardListResponse(List<Card> cards) {
        List<CardResponse> cardResponses = new ArrayList<CardResponse>();
        for (Card card : cards) {
            CardResponse cardResponse = toCardResponse(card);
            cardResponses.add(cardResponse);
        }
        return CardListResponse.builder()
                .total(cards.size())
                .cards(cardResponses)
                .build();
    }

    public static CardCache toCardCache(Card card) {
        return CardCache.builder()
                .id(card.getId())
                .cardSetId(card.getCardSet().getId())
                .number(card.getNumber())
                .concept(card.getConcept())
                .description(card.getDescription())
                .conceptImageUrl(card.getConceptImageUrl())
                .descriptionImageUrl(card.getDescriptionImageUrl())

                .retentionRate(card.getRetentionRate())
                .stability(card.getStability())
                .lastViewedTime(card.getUpdatedAt())
                .build();
    }

}
