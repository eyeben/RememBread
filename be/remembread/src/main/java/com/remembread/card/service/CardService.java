package com.remembread.card.service;

import com.remembread.apipayload.code.status.ErrorStatus;
import com.remembread.apipayload.exception.GeneralException;
import com.remembread.card.dto.request.*;
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

import java.util.*;
import java.util.stream.Collectors;

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

        // 삭제 후 번호 재정렬
        List<Card> remainingCards = cardRepository.findByCardSetIdOrderByNumber(cardSet.getId());

        Map<Long, Integer> idToNumberMap = new LinkedHashMap<>();
        for (int i = 0; i < remainingCards.size(); i++) {
            idToNumberMap.put(remainingCards.get(i).getId(), i + 1);
        }

        reorderCardNumbers(idToNumberMap);
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

        // 삭제
        Card lastViewedCard = cardSet.getLastViewedCard();
        if (lastViewedCard != null) {
            Long lastViewedCardId = lastViewedCard.getId();
            for (Card card : cards) {
                if (card.getId().equals(lastViewedCardId)) {
                    cardSet.updateLastViewedCard(null);
                    break;
                }
            }
        }
        cardRepository.deleteAll(cards);

        // 삭제 후 남은 카드 번호 재정렬
        List<Card> remainingCards = cardRepository.findByCardSetIdOrderByNumber(cardSetId);

        Map<Long, Integer> idToNumberMap = new LinkedHashMap<>();
        for (int i = 0; i < remainingCards.size(); i++) {
            idToNumberMap.put(remainingCards.get(i).getId(), i + 1);
        }

        reorderCardNumbers(idToNumberMap);
    }

    @Transactional
    public void moveCard(CardMoveRequest request, User user) {
        Card fromCard = cardRepository.findById(request.getFromCardId())
                .orElseThrow(() -> new GeneralException(ErrorStatus.CARD_NOT_FOUND));

        CardSet cardSet = fromCard.getCardSet();
        // 자기 카드 아닐 때
        if (!cardSet.getUser().getId().equals(user.getId())) {
            throw new GeneralException(ErrorStatus.CARD_FORBIDDEN);
        }

        List<Card> cards = cardRepository.findByCardSetIdOrderByNumber(cardSet.getId());

        // 그대로면 무시
        if (fromCard.getNumber().equals(request.getToNumber())) return;

        // 재정렬 리스트
        List<Card> reordered = new ArrayList<>(cards);
        reordered.removeIf(card -> card.getId().equals(fromCard.getId()));

        int toIndex = Math.max(0, Math.min(request.getToNumber() - 1, reordered.size()));
        reordered.add(toIndex, fromCard);

        Map<Long, Integer> idToNumberMap = new LinkedHashMap<>();
        for (int i = 0; i < reordered.size(); i++) {
            idToNumberMap.put(reordered.get(i).getId(), i + 1);
        }

        reorderCardNumbers(idToNumberMap);

    }
    @Transactional
    public void reorderCardNumbers(Map<Long, Integer> idToNumberMap) {
        if (idToNumberMap == null || idToNumberMap.isEmpty()) {
            return;
        }

        StringBuilder sql = new StringBuilder("UPDATE cards SET number = CASE id ");

        for (Map.Entry<Long, Integer> entry : idToNumberMap.entrySet()) {
            sql.append("WHEN ").append(entry.getKey())
                    .append(" THEN ").append(entry.getValue()).append(" ");
        }

        sql.append("END WHERE id IN (")
                .append(idToNumberMap.keySet().stream()
                        .map(String::valueOf)
                        .collect(Collectors.joining(",")))
                .append(");");

        em.createNativeQuery(sql.toString()).executeUpdate();
    }

    @Transactional(readOnly = true)
    public List<Card> findAllByCardSet(CardSet cardSet) {
        return cardRepository.findAllByCardSet(cardSet);
    }

    @Transactional(readOnly = true)
    public Card findById(Long id) {
        return cardRepository.findById(id).orElseThrow(() -> new GeneralException(ErrorStatus.CARD_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public List<Card> findAllById(List<Long> ids) {
        return cardRepository.findAllById(ids);
    }
}
