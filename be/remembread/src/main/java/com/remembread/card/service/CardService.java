package com.remembread.card.service;

import com.remembread.apipayload.code.status.ErrorStatus;
import com.remembread.apipayload.exception.GeneralException;
import com.remembread.card.dto.request.CardCreateManyRequest;
import com.remembread.card.dto.request.CardCreateRequest;
import com.remembread.card.dto.request.CardDeleteManyRequest;
import com.remembread.card.dto.request.CardUpdateRequest;
import com.remembread.card.dto.response.CardGetResponse;
import com.remembread.card.dto.response.CardListInfiniteResponse;
import com.remembread.card.entity.Card;
import com.remembread.card.entity.CardSet;
import com.remembread.card.repository.CardRepository;
import com.remembread.card.repository.CardSetRepository;
import com.remembread.card.repository.FolderRepository;
import com.remembread.user.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CardService {
    private final CardRepository cardRepository;
    private final CardSetRepository cardSetRepository;
    private final FolderRepository folderRepository;

    @PersistenceContext
    private final EntityManager em;

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

    @Transactional
    public void updateCard(Long cardId, CardUpdateRequest request, User user) {
        Card card = cardRepository.findById(cardId).orElseThrow(() ->
                new GeneralException(ErrorStatus.CARD_NOT_FOUND));
        CardSet cardSet = card.getCardSet();
        if (!cardSet.getUser().getId().equals(user.getId())) {
            throw new GeneralException(ErrorStatus.CARD_FORBIDDEN);
        }
        card.update(request);
        cardRepository.save(card);
    }

    @Transactional
    public void deleteCard(Long cardId, User user) {
        Card card = cardRepository.findById(cardId).orElseThrow(() ->
                new GeneralException(ErrorStatus.CARD_NOT_FOUND));
        CardSet cardSet = card.getCardSet();
        if (!cardSet.getUser().getId().equals(user.getId())) {
            throw new GeneralException(ErrorStatus.CARD_FORBIDDEN);
        }
        cardRepository.delete(card);
    }

    public List<CardListInfiniteResponse> getCardsInfinite(Long cardId, boolean isDownward, int size, Long userId) {
        Card card = cardRepository.findById(cardId).orElseThrow(() ->
                new GeneralException(ErrorStatus.CARD_NOT_FOUND));
        CardSet cardSet = card.getCardSet();
        if (!cardSet.getUser().getId().equals(userId))
            throw new GeneralException(ErrorStatus.CARD_FORBIDDEN);

        int cursorNumber = card.getNumber();
        Long cardSetId = cardSet.getId();
        String operator = isDownward ? ">" : "<";
        String order = isDownward ? "ASC" : "DESC";

        String sql = """
        SELECT * FROM cards
        WHERE card_set_id = :cardSetId
        AND number %s :cursorNumber
        ORDER BY number %s
        LIMIT :size
    """.formatted(operator, order);

        List<Card> result = em.createNativeQuery(sql, Card.class)
                .setParameter("cardSetId", cardSetId)
                .setParameter("cursorNumber", cursorNumber)
                .setParameter("size", size)
                .getResultList();

        // 위 방향일 경우 reverse (번호 큰 것부터 정렬했기 때문)
        if (!isDownward) {
            Collections.reverse(result);
        }

        return result.stream()
                .map(c -> new CardListInfiniteResponse(
                        c.getId(),
                        c.getNumber(),
                        c.getConcept(),
                        c.getDescription()
                ))
                .toList();
    }
    @Transactional
    public void deleteCardMany(CardDeleteManyRequest request, User user) {
        List<Card> cards = cardRepository.findAllById(request.getCardIds());

        if (cards.size() != request.getCardIds().size()) {
            throw new GeneralException(ErrorStatus.CARD_NOT_FOUND);
        }

        Long cardSetId = cards.get(0).getCardSet().getId();

        // 모든 카드의 cardSetId가 같은지 확인
        boolean allSameCardSet = cards.stream()
                .allMatch(card -> card.getCardSet().getId().equals(cardSetId));

        if (!allSameCardSet) {
            throw new GeneralException(ErrorStatus.CARD_FORBIDDEN);
        }

        // 카드셋 주인의 ID와 현재 유저 ID 일치 여부 확인
        CardSet cardSet = cards.get(0).getCardSet();
        if (!cardSet.getUser().getId().equals(user.getId())) {
            throw new GeneralException(ErrorStatus.CARD_FORBIDDEN);
        }

        cardRepository.deleteAll(cards);
    }
}
