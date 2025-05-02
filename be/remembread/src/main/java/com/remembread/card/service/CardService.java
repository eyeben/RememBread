package com.remembread.card.service;

import com.remembread.apipayload.code.status.ErrorStatus;
import com.remembread.apipayload.exception.GeneralException;
import com.remembread.card.dto.request.CardCreateManyRequest;
import com.remembread.card.dto.request.CardCreateRequest;
import com.remembread.card.dto.response.CardGetResponse;
import com.remembread.card.entity.Card;
import com.remembread.card.entity.CardSet;
import com.remembread.card.repository.CardRepository;
import com.remembread.card.repository.CardSetRepository;
import com.remembread.card.repository.FolderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CardService {
    private final CardRepository cardRepository;
    private final CardSetRepository cardSetRepository;
    private final FolderRepository folderRepository;

    public void createCard(CardCreateRequest request, Long userId) {
        CardSet cardSet = cardSetRepository.findById(request.getCardSetId()).orElseThrow(() -> new GeneralException(ErrorStatus.CARDSET_NOT_FOUND));

        if(!cardSet.getUser().getId().equals(userId))
            throw new GeneralException(ErrorStatus.CARDSET_FORBIDDEN);

        // 마지막 페이지로 업데이트
        int num = 1;
        Card LastPageCard = cardRepository.findFirstByCardSetOrderByNumberDesc(cardSet).orElse(null);
        if(LastPageCard != null)
            num = LastPageCard.getNumber() + 1;

        //카드 생성
        Card card = new Card(cardSet, num, request.getConcept(), request.getDescription(), null, null);
        cardRepository.save(card);
    }

    public void createCardMany(CardCreateManyRequest request, Long userId) {
        CardSet cardSet = cardSetRepository.findById(request.getCardSetId()).orElseThrow(() -> new GeneralException(ErrorStatus.CARDSET_NOT_FOUND));

        if (!cardSet.getUser().getId().equals(userId))
            throw new GeneralException(ErrorStatus.CARDSET_FORBIDDEN);

        // 마지막 페이지로 업데이트
        int num = 1;
        Card LastPageCard = cardRepository.findFirstByCardSetOrderByNumberDesc(cardSet).orElse(null);
        if (LastPageCard != null)
            num = LastPageCard.getNumber() + 1;

        //카드 생성
        List<Card> cards = new ArrayList<>();
        for (CardCreateManyRequest.Bread bread : request.getBreads()) {
            cards.add(new Card(cardSet, num++, bread.getConcept(), bread.getDescription(), null, null));
        }
        cardRepository.saveAll(cards);
    }

    public CardGetResponse getCard(Long cardId, Long userId) {
        Card card = cardRepository.findById(cardId).orElseThrow(() -> new GeneralException(ErrorStatus.CARD_NOT_FOUND));


        // 카드 주인인지 확인하기 위한 절차
        CardSet cardSet = card.getCardSet();
        if(cardSet == null)
            throw new GeneralException(ErrorStatus.CARDSET_NOT_FOUND);

        if(!cardSet.getUser().getId().equals(userId))
            throw new GeneralException(ErrorStatus.FOLDER_FORBIDDEN);

        return CardGetResponse.builder()
                .number(card.getNumber())
                .concept(card.getConcept())
                .description(card.getDescription())
                .conceptUrl(card.getConceptImageUrl())
                .descriptionUrl(card.getDescriptionImageUrl())
                .build();
    }
}
