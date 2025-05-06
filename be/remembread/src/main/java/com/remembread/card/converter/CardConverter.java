package com.remembread.card.converter;

import com.remembread.card.dto.response.CardListResponse;
import com.remembread.card.dto.response.CardResponse;
import com.remembread.card.entity.Card;
import com.remembread.study.dto.CardCache;

import java.util.ArrayList;
import java.util.List;

public class CardConverter {

    public static CardResponse toCardResponse(Card card) {
        CardResponse cardResponse = new CardResponse();
        cardResponse.setNumber(card.getNumber());
        cardResponse.setConcept(card.getConcept());
        cardResponse.setDescription(card.getDescription());
        cardResponse.setConceptImageUrl(card.getConceptImageUrl());
        cardResponse.setDescriptionImageUrl(card.getDescriptionImageUrl());
        return cardResponse;
    }

    public static CardListResponse toCardListResponse(List<Card> cards) {
        CardListResponse cardListResponse = new CardListResponse();
        List<CardResponse> cardResponses = new ArrayList<CardResponse>();
        for (Card card : cards) {
            CardResponse cardResponse = toCardResponse(card);
            cardResponses.add(cardResponse);
        }
        cardListResponse.setTotal(cards.size());
        cardListResponse.setCards(cardResponses);
        return cardListResponse;
    }

    public static CardCache toCardCache(Card card) {
        CardCache cardCache = new CardCache();
        cardCache.setId(card.getId());
        cardCache.setCardSetId(cardCache.getCardSetId());
        cardCache.setNumber(card.getNumber());
        cardCache.setConcept(card.getConcept());
        cardCache.setDescription(card.getDescription());
        cardCache.setCorrectCount(card.getCorrectCount());
        cardCache.setSolvedCount(card.getSolvedCount());
        cardCache.setRetentionRate(card.getRetentionRate());
        cardCache.setStability(card.getStability());
        cardCache.setConceptImageUrl(card.getConceptImageUrl());
        cardCache.setDescriptionImageUrl(card.getDescriptionImageUrl());
        return cardCache;
    }

}
