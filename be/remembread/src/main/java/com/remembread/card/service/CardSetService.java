package com.remembread.card.service;

import com.remembread.card.converter.CardConverter;
import com.remembread.apipayload.code.status.ErrorStatus;
import com.remembread.apipayload.exception.GeneralException;
import com.remembread.card.dto.request.CardSetCreateRequest;
import com.remembread.card.dto.request.CardSetDeleteManyRequest;
import com.remembread.card.dto.request.CardSetMoveRequest;
import com.remembread.card.dto.request.CardSetUpdateRequest;
import com.remembread.card.dto.response.*;
import com.remembread.card.entity.Card;
import com.remembread.card.entity.CardSet;
import com.remembread.card.entity.Folder;
import com.remembread.card.enums.CardSetSortType;
import com.remembread.card.enums.SearchCategory;
import com.remembread.card.repository.CardRepository;
import com.remembread.card.repository.CardSetRepository;
import com.remembread.card.repository.FolderRepository;
import com.remembread.hashtag.entity.CardSetHashtag;
import com.remembread.hashtag.entity.Hashtag;
import com.remembread.hashtag.repository.CardSetHashtagRepository;
import com.remembread.hashtag.repository.HashtagRepository;
import com.remembread.user.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class CardSetService {

    private final CardRepository cardRepository;
    private final CardSetRepository cardSetRepository;
    private final FolderRepository folderRepository;

    private final HashtagRepository hashtagRepository;
    private final CardSetHashtagRepository cardSetHashtagRepository;

    private final RedisTemplate<String, String> redisTemplate;

    public CardSetService(
            CardRepository cardRepository,
            CardSetRepository cardSetRepository,
            FolderRepository folderRepository,
            HashtagRepository hashtagRepository,
            CardSetHashtagRepository cardSetHashtagRepository,
            @Qualifier("viewCountRedisTemplate") RedisTemplate<String, String> redisTemplate
    ) {
        this.cardRepository = cardRepository;
        this.cardSetRepository = cardSetRepository;
        this.folderRepository = folderRepository;
        this.hashtagRepository = hashtagRepository;
        this.cardSetHashtagRepository = cardSetHashtagRepository;
        this.redisTemplate = redisTemplate;
    }

    @Transactional
    public CardSetCreateResponse createCardSet(CardSetCreateRequest request, User user) {
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
        return CardSetCreateResponse.builder().cardSetId(cardSet.getId()).build();
    }

    @Transactional
    public void setHashtag(List<String> hashtags, CardSet cardSet) {
        cardSetHashtagRepository.deleteAllByCardSet(cardSet);
        cardSetHashtagRepository.flush();
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

    @Transactional(readOnly = true)
    public CardSetResponse getCardSetInfo(Long id) {
        CardSet cardSet = cardSetRepository.getReferenceById(id);
        CardSetResponse response = new CardSetResponse();
        List<String> hashtags = hashtagRepository.findAllNamesByCardSetId(cardSet.getId());
        response.setName(cardSet.getName());
        response.setHashtags(hashtags);
        response.setIsPublic(cardSet.getIsPublic());
        return response;
    }

    @Transactional
    public void forkCardSet(Long cardSetId, Long folderId, User user) {
        CardSet cardSet = cardSetRepository.findById(cardSetId).orElseThrow(() -> new GeneralException(ErrorStatus.CARDSET_NOT_FOUND));
        Folder folder = null;
        if(folderId == null)
            folder = folderRepository.findByUserAndUpperFolderIsNull(user);
        else
            folder = folderRepository.findById(folderId).orElseThrow(() -> new GeneralException(ErrorStatus.FOLDER_NOT_FOUND));

        // 공개한 카드셋이 아닌 경우
        if (!cardSet.getIsPublic())
            throw new GeneralException(ErrorStatus.CARDSET_NOT_PUBLIC);

        // 폴더 주인이 유저가 아닌 경우
        if(!folder.getUser().getId().equals(user.getId()))
            throw new GeneralException(ErrorStatus.FOLDER_FORBIDDEN);

        List<Card> cards = cardRepository.findAllByCardSet(cardSet);
        List<Card> newCards = new ArrayList<>();

        CardSet newCardSet = CardSet.builder()
                .folder(folder)
                .name(cardSet.getName())
                .user(folder.getUser())
                .isPublic(false)
                .build();
        cardSetRepository.save(newCardSet);

        // 포크 수 업데이트
        cardSet.updateForks(cardSet.getForks()+1);
        cardSetRepository.save(cardSet);

        int num = 1;
        for (Card card : cards) {
            newCards.add(new Card(newCardSet, num++, card.getConcept(), card.getDescription(), card.getConceptImageUrl(), card.getDescriptionImageUrl()));
        }
        cardRepository.saveAll(newCards);
    }

    @Transactional(readOnly = true)
    public CardSetResponse getCardSetInfo(Long id, User user) {
        CardSet cardSet = cardSetRepository.findById(id).orElseThrow(() ->
                new GeneralException(ErrorStatus.CARDSET_NOT_FOUND));
        if (!cardSet.getIsPublic() && !cardSet.getUser().getId().equals(user.getId())) {
            throw new GeneralException(ErrorStatus.CARDSET_NOT_PUBLIC);
        }
        CardSetResponse response = new CardSetResponse();
        List<String> hashtags = hashtagRepository.findAllNamesByCardSetId(cardSet.getId());
        response.setName(cardSet.getName());
        response.setHashtags(hashtags);
        response.setIsPublic(cardSet.getIsPublic());
        return response;
    }

    @Transactional
    public CardListResponse getCardSetList(Long id, Integer page, Integer size, String order, User user) {
        CardSet cardSet = cardSetRepository.findById(id).orElseThrow(() ->
                new GeneralException(ErrorStatus.CARDSET_NOT_FOUND));
        if (!cardSet.getIsPublic() && !cardSet.getUser().getId().equals(user.getId())) {
            throw new GeneralException(ErrorStatus.CARDSET_NOT_PUBLIC);
        }
        Sort sort = order.equalsIgnoreCase("desc") ?
                Sort.by("number").descending() :
                Sort.by("number").ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        List<Card> cards = cardRepository.findAllByCardSet(cardSet, pageable);

        // 자기 카드셋 아니면 조회수 로직 수행
        if(!user.getId().equals(cardSet.getUser().getId()))
            updateViews(user.getId(), cardSet.getId());

        return CardConverter.toCardListResponse(cards);
    }

    @Transactional
    public void updateCardSetInfo(Long id, CardSetUpdateRequest request, User user) {
        CardSet cardSet = cardSetRepository.findById(id).orElseThrow(() ->
                new GeneralException(ErrorStatus.CARDSET_NOT_FOUND));
        if (!cardSet.getUser().getId().equals(user.getId())) {
            throw new GeneralException(ErrorStatus.CARDSET_FORBIDDEN);
        }
        cardSet.updateName(request.getName());
        cardSet.updateIsPublic(request.getIsPublic());
        this.setHashtag(request.getHashtags(), cardSet);
        cardSetRepository.save(cardSet);
    }

    @Transactional
    public void deleteCardSet(Long id, User user) {
        CardSet cardSet = cardSetRepository.findById(id).orElseThrow(() ->
                new GeneralException(ErrorStatus.CARDSET_NOT_FOUND));
        if (!cardSet.getUser().getId().equals(user.getId())) {
            throw new GeneralException(ErrorStatus.CARDSET_FORBIDDEN);
        }
        cardSetRepository.delete(cardSet);
    }

    @Transactional(readOnly = true)
    public CardSetListGetResponse getCardSetList(Long folderId, int page, int size, String sort, User user ) {
        Folder folder;
        if(folderId == null)
            folder = folderRepository.findByUserAndUpperFolderIsNull(user);
        else
            folder = folderRepository.findById(folderId).orElseThrow(() -> new GeneralException(ErrorStatus.FOLDER_NOT_FOUND));

        // 접근 권한이 없는 경우
        if(!folder.getUser().getId().equals(user.getId()))
            throw new GeneralException(ErrorStatus.FOLDER_FORBIDDEN);

        // 정렬 기준 DB컬럼 기준으로 변환
        String column = CardSetSortType.getColumnByKor(sort);
        int offset = page * size;
        // flat → response 변환 (Map을 사용해 중복 제거 + 그룹핑)
        // 1. flat 결과 가져오기
        List<CardSetFlatDto> flatResults = cardSetRepository.getCardSetSorted(folderId, column, size, offset);

        // 2. 중복 제거 + 해시태그 병합
        Map<Long, CardSetListGetResponse.CardSet> map = new LinkedHashMap<>();

        for (CardSetFlatDto row : flatResults) {
            Long id = row.getCardSetId();

            CardSetListGetResponse.CardSet dto = map.computeIfAbsent(id, k ->
                    CardSetListGetResponse.CardSet.builder()
                            .cardSetId(row.getCardSetId())
                            .name(row.getName())
                            .isLike(row.getIsLike())
                            .isPublic(row.getIsPublic())
                            .viewCount(row.getViewCount() + getCachedCardSetViewCount(row.getCardSetId())) // 캐시값도 고려
                            .forkCount(row.getForkCount())
                            .totalCardCount(row.getTotalCardCount())
                            .lastViewedCardId(row.getLastViewedCardId())
                            .hashTags(new ArrayList<>())
                            .updatedAt(row.getUpdatedAt())
                            .build()
            );


            // 해시태그 누적 (null 체크 + 중복 제거)
            String tag = row.getHashTag();
            if (tag != null && !dto.getHashTags().contains(tag)) {
                dto.getHashTags().add(tag);
            }
        }

        // 3. 최종 응답 구성
        return new CardSetListGetResponse(new ArrayList<>(map.values()));
    }

    @Transactional(readOnly = true)
    public CardSetSearchResponse searchCardSets(String query, int page, int size, CardSetSortType cardSetSortType, User user) {
        Long userId = user == null ? null : user.getId();
        SearchCategory searchCategory = SearchCategory.제목;
        int offset = page * size;
        String sortColumn = cardSetSortType.getColumn();

        if(!query.isEmpty() && query.charAt(0) == '#'){
            query = query.substring(1);
            searchCategory = SearchCategory.해시태그;
        }
        else if(!query.isEmpty() && query.charAt(0) == '@'){
            query = query.substring(1);
            searchCategory = SearchCategory.작성자;
        }

        CardSetSearchResponse response;
        switch (searchCategory) {
            case 제목 -> response = new CardSetSearchResponse(cardSetRepository.searchByTitle(query, sortColumn, size, offset, userId));
            case 작성자 -> response = new CardSetSearchResponse(cardSetRepository.searchByAuthor(query, sortColumn, size, offset, userId));
            case 해시태그 -> response = new CardSetSearchResponse(cardSetRepository.searchByHashtag(query, sortColumn, size, offset, userId));
            default -> throw new GeneralException(ErrorStatus.ENUM_NOT_FOUND);
        }

        // 캐시된 애들 조회수 추가
        for(CardSetSearchResponse.CardSet itm: response.getCardSets())
            itm.updateViewCount(itm.getViewCount() + getCachedCardSetViewCount(itm.getCardSetId()));

        return response;
    }

    @Transactional(readOnly = true)
    public CardSetSimpleListGetResponse getCardSetSimpleList(Long folderId, User user) {
        Folder folder;
        if(folderId == null)
            folder = folderRepository.findByUserAndUpperFolderIsNull(user);
        else
            folder = folderRepository.findById(folderId).orElseThrow(() -> new GeneralException(ErrorStatus.FOLDER_NOT_FOUND));

        // 접근 권한이 없는 경우
        if(!folder.getUser().getId().equals(user.getId()))
            throw new GeneralException(ErrorStatus.FOLDER_FORBIDDEN);

        return new CardSetSimpleListGetResponse(cardSetRepository.findByFolderIdOrderByName(folderId));
    }

    @Transactional(readOnly = true)
    public CardSetSearchMyResponse searchMyCardSets(String query, int page, int size, CardSetSortType cardSetSortType, Long userId) {
        int offset = page * size;
        String sortColumn = cardSetSortType.getColumn();
        CardSetSearchMyResponse response = new CardSetSearchMyResponse(cardSetRepository.searchMyCardSetByTitle(userId, query, sortColumn, size, offset));

        // 캐시된 애들 조회수 추가
        for(CardSetSearchMyResponse.CardSet itm: response.getCardSets())
            itm.updateViewCount(itm.getViewCount() + getCachedCardSetViewCount(itm.getCardSetId()));

        return response;
    }

    @Transactional
    public void likeCardSet(Long cardSetId, User user) {
        CardSet cardSet = cardSetRepository.findById(cardSetId).orElseThrow(() -> new GeneralException(ErrorStatus.CARDSET_NOT_FOUND));

        if(!cardSet.getUser().getId().equals(user.getId()))
            throw new GeneralException(ErrorStatus.CARDSET_FORBIDDEN);

        cardSet.updateIsLike(true);
    }

    @Transactional
    public void undoLikeCardSet(Long cardSetId, User user) {
        CardSet cardSet = cardSetRepository.findById(cardSetId).orElseThrow(() -> new GeneralException(ErrorStatus.CARDSET_NOT_FOUND));

        if(!cardSet.getUser().getId().equals(user.getId()))
            throw new GeneralException(ErrorStatus.CARDSET_FORBIDDEN);

        cardSet.updateIsLike(false);
    }

    @Transactional(readOnly = true)
    public CardSetListGetResponse getLikeCardSets(Integer page, Integer size, CardSetSortType cardSetSortType, User user) {
        // 정렬 기준 DB컬럼 기준으로 변환
        String column = cardSetSortType.getColumn();
        int offset = page * size;
        List<CardSetFlatDto> flatResults = cardSetRepository.getLikeCardSetSorted(user.getId(), column, size, offset);
        // flat → response 변환 (Map을 사용해 중복 제거 + 그룹핑)
        Map<Long, CardSetListGetResponse.CardSet> map = new LinkedHashMap<>();

        for (CardSetFlatDto row : flatResults) {
            Long id = row.getCardSetId();

            CardSetListGetResponse.CardSet dto = map.computeIfAbsent(id, k ->
                    CardSetListGetResponse.CardSet.builder()
                            .cardSetId(row.getCardSetId())
                            .name(row.getName())
                            .isLike(row.getIsLike())
                            .isPublic(row.getIsPublic())
                            .viewCount(row.getViewCount() + getCachedCardSetViewCount(row.getCardSetId()))// 캐시된 조회수 추가
                            .forkCount(row.getForkCount())
                            .totalCardCount(row.getTotalCardCount())
                            .lastViewedCardId(row.getLastViewedCardId())
                            .hashTags(new ArrayList<>())
                            .updatedAt(row.getUpdatedAt())
                            .build()
            );


            // 해시태그 누적 (null 체크 + 중복 제거)
            String tag = row.getHashTag();
            if (tag != null && !dto.getHashTags().contains(tag)) {
                dto.getHashTags().add(tag);
            }
        }
        return new CardSetListGetResponse(new ArrayList<>(map.values()));
    }

    private void updateViews(Long userId, Long cardSetId) {
        String viewedKey = "cardSet:viewed:" + cardSetId;
        String countKey = "cardSet:viewCount:" + cardSetId;
        String userKey = String.valueOf(userId); // 또는 userId.toString()
        // 1. 해당 사용자가 이미 조회했는지 확인
        Boolean isMember = redisTemplate.opsForSet().isMember(viewedKey, userKey);

        if (Boolean.FALSE.equals(isMember)) {
            // 2. 조회 기록 저장 (중복 방지용)
            redisTemplate.opsForSet().add(viewedKey, userKey);

            // 3. TTL 설정 (선택적) – 예: 하루 뒤에 만료
            redisTemplate.expire(viewedKey, Duration.ofDays(1));

            // 4. 실제 조회수 증가
            redisTemplate.opsForValue().increment(countKey);
        }
    }
    public Integer getCachedCardSetViewCount(Long cardSetId) {
        String countKey = "cardSet:viewCount:" + cardSetId;
        String value = redisTemplate.opsForValue().get(countKey);
        return value != null ? Integer.parseInt(value) : 0;
    }

    @Transactional
    public void deleteCardSetMany(CardSetDeleteManyRequest request, User user) {
        List<CardSet> cardSets = cardSetRepository.findAllById(request.getCardSetIds());

        // 잘못된 카드셋 입력 되었는지 확인
        if (cardSets.size() != request.getCardSetIds().size()) {
            throw new GeneralException(ErrorStatus.CARDSET_NOT_FOUND);
        }

        for (CardSet cardSet : cardSets) {
            if (!cardSet.getUser().getId().equals(user.getId())) {
                throw new GeneralException(ErrorStatus.CARDSET_FORBIDDEN);
            }
        }
        cardRepository.deleteAllByCardSetIdIn(request.getCardSetIds());
        cardSetRepository.deleteAll(cardSets);
    }

    @Transactional
    public void moveCardSet(CardSetMoveRequest request, User user) {
        Long userId = user.getId();
        Folder folder = folderRepository.findById(request.getTargetFolderId()).orElseThrow(() -> new GeneralException(ErrorStatus.FOLDER_NOT_FOUND));

        if(!folder.getUser().getId().equals(userId))
            throw new GeneralException(ErrorStatus.FOLDER_FORBIDDEN);

        List<CardSet> cardSets = cardSetRepository.findAllById(request.getCardSetIds());

        if (cardSets.size() != request.getCardSetIds().size()) {
            throw new GeneralException(ErrorStatus.CARDSET_NOT_FOUND);
        }

        for (CardSet cardSet : cardSets) {
            if(!cardSet.getUser().getId().equals(userId))
                throw new GeneralException(ErrorStatus.CARDSET_FORBIDDEN);
            cardSet.updateFolder(folder);
        }
    }

    @Transactional(readOnly = true)
    public CardSet validateCardSetOwner(Long cardSetId, User user) {
        CardSet cardSet = cardSetRepository.findById(cardSetId).orElseThrow(() ->
                new GeneralException(ErrorStatus.CARDSET_NOT_FOUND));
        if (!cardSet.getUser().getId().equals(user.getId())) {
            throw new GeneralException(ErrorStatus.CARDSET_FORBIDDEN);
        }
        return cardSet;
    }
}
