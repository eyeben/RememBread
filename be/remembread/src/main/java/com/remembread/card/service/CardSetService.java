package com.remembread.card.service;

import com.remembread.apipayload.code.status.ErrorStatus;
import com.remembread.apipayload.exception.GeneralException;
import com.remembread.card.entity.Card;
import com.remembread.card.entity.CardSet;
import com.remembread.card.entity.Folder;
import com.remembread.card.repository.CardRepository;
import com.remembread.card.repository.CardSetRepository;
import com.remembread.card.repository.FolderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CardSetService {

    private final CardRepository cardRepository;
    private final CardSetRepository cardSetRepository;
    private final FolderRepository folderRepository;

    public void forkCardSet(Long cardSetId, Long folderId, Long userId) {
        CardSet cardSet = cardSetRepository.findById(cardSetId).orElseThrow(() -> new GeneralException(ErrorStatus.CARDSET_NOT_FOUND));
        Folder folder = folderRepository.findById(folderId).orElseThrow(() -> new GeneralException(ErrorStatus.FOLDER_NOT_FOUND));

        // 공개한 카드셋이 아닌 경우
        if (!cardSet.getIsPublic())
            throw new GeneralException(ErrorStatus.CARDSET_NOT_PUBLIC);

        // 폴더 주인이 유저가 아닌 경우
        if(!folder.getUser().getId().equals(userId))
            throw new GeneralException(ErrorStatus.FOLDER_FORBIDDEN);

        List<Card> cards = cardRepository.findAllByCardSet(cardSet);
        List<Card> newCards = new ArrayList<>();
        //CardSet newCardSet = new CardSet();
        int num = 1;
        for (Card card : cards) {
            newCards.add(new Card(cardSet, num++, card.getConcept(), card.getDescription(), card.getConceptImageUrl(), card.getDescriptionImageUrl()));
        }
        cardRepository.saveAll(newCards);
    }
}
