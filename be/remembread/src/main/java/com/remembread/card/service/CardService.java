package com.remembread.card.service;

import com.remembread.apipayload.code.status.ErrorStatus;
import com.remembread.apipayload.exception.GeneralException;
import com.remembread.card.dto.request.CardCreateManyRequest;
import com.remembread.card.dto.request.CardCreateRequest;
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
        int num = 0;
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
        int num = 0;
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
}
