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

        Card card = Card.builder()
                .cardSet(cardSet)
                .concept(request.getConcept())
                .description(request.getDescription())
                .correctCount(0)
                .solvedCount(0)
                .retentionRate(0f)
                .stability(1f)
                .conceptImageUrl(null)
                .descriptionImageUrl(null)
                .build();

        cardRepository.save(card);
    }

}
