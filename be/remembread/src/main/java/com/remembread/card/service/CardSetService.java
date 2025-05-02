package com.remembread.card.service;

import com.remembread.apipayload.code.status.ErrorStatus;
import com.remembread.apipayload.exception.GeneralException;
import com.remembread.card.dto.request.CardSetCreateRequest;
import com.remembread.card.entity.Card;
import com.remembread.card.entity.CardSet;
import com.remembread.card.entity.Folder;
import com.remembread.card.repository.CardRepository;
import com.remembread.card.repository.CardSetRepository;
import com.remembread.card.repository.FolderRepository;
import com.remembread.hashtag.entity.CardSetHashtag;
import com.remembread.hashtag.entity.Hashtag;
import com.remembread.hashtag.repository.CardSetHashtagRepository;
import com.remembread.hashtag.repository.HashtagRepository;
import com.remembread.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CardSetService {
    private final CardRepository cardRepository;
    private final CardSetRepository cardSetRepository;
    private final FolderRepository folderRepository;
    private final HashtagRepository hashtagRepository;
    private final CardSetHashtagRepository cardSetHashtagRepository;

    @Transactional
    public void createCardSet(CardSetCreateRequest request, User user) {
        Folder folder = folderRepository.getReferenceById(request.getFolderId());
        CardSet cardSet = CardSet.builder()
                .user(user)
                .folder(folder)
                .name(request.getName())
                .isPublic(request.getIsPublic())
                .build();
        cardSetRepository.saveAndFlush(cardSet);
        List<String> hashtags = request.getHashtags();
        this.setHashtag(hashtags, cardSet);
    }

    @Transactional
    public void setHashtag(List<String> hashtags, CardSet cardSet) {
        for (String name : hashtags) {
            Hashtag hashtag;
            if (!hashtagRepository.existsByName(name)) {
                hashtag = Hashtag.builder()
                        .name(name)
                        .build();
                hashtagRepository.saveAndFlush(hashtag);
            } else {
                hashtag = hashtagRepository.findOneByName(name);
            }
            CardSetHashtag cardSetHashtag = CardSetHashtag.builder()
                    .cardSet(cardSet)
                    .hashtag(hashtag)
                    .build();
            cardSetHashtagRepository.saveAndFlush(cardSetHashtag);
        }
    }
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
        CardSet newCardSet = CardSet.builder()
                .folder(folder)
                .name(cardSet.getName())
                .user(folder.getUser())
                .build();
        cardSetRepository.save(newCardSet);
        int num = 1;
        for (Card card : cards) {
            newCards.add(new Card(newCardSet, num++, card.getConcept(), card.getDescription(), card.getConceptImageUrl(), card.getDescriptionImageUrl()));
        }
        cardRepository.saveAll(newCards);
    }

}
