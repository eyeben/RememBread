package com.remembread.card.service;

import com.remembread.apipayload.code.status.ErrorStatus;
import com.remembread.apipayload.exception.GeneralException;
import com.remembread.card.dto.request.CardCreateGetDto;
import com.remembread.card.entity.Card;
import com.remembread.card.entity.CardSet;
import com.remembread.card.entity.Folder;
import com.remembread.card.repository.CardRepository;
import com.remembread.card.repository.CardSetRepository;
import com.remembread.card.repository.FolderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CardService {
    private final CardRepository cardRepository;
    private final CardSetRepository cardSetRepository;
    private final FolderRepository folderRepository;

    public void createCard(CardCreateGetDto request, Long userId) {
        CardSet cardSet = cardSetRepository.findById(request.getCardSetId()).orElseThrow(() -> new GeneralException(ErrorStatus.CARDSET_NOT_FOUND));

        if(!cardSet.getUser().getId().equals(userId))
            throw new GeneralException(ErrorStatus.CARDSET_FORBIDDEN);

        // 마지막 페이지로 업데이트
        Integer num = 0;
        Card LastPageCard = cardRepository.findFirstByCardSetOrderByNumberDesc(cardSet).orElse(null);
        if(LastPageCard != null)
            num = LastPageCard.getNumber();

        //카드 생성
        Card card = new Card(cardSet, num, request.getConcept(), request.getDescription(), null, null);
        cardRepository.save(card);
    }

}
