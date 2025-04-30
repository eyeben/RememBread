package com.remembread.card.service;

import com.remembread.card.dto.request.CardSetCreateRequest;
import com.remembread.card.entity.CardSet;
import com.remembread.card.entity.Folder;
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

import java.util.List;

@Service
@RequiredArgsConstructor
public class CardSetService {
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
}
