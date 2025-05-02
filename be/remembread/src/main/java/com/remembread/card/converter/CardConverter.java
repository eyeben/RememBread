package com.remembread.card.converter;

import com.remembread.card.dto.response.CardListResponse;
import com.remembread.card.dto.response.CardResponse;
import com.remembread.card.entity.Card;

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
}
