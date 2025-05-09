package com.remembread.card.controller;

import com.remembread.apipayload.ApiResponse;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.card.dto.request.CardSetCreateRequest;
import com.remembread.card.dto.request.CardSetUpdateRequest;
import com.remembread.card.dto.response.*;
import com.remembread.card.dto.request.ForkCardSetRequest;
import com.remembread.card.enums.CardSetSortType;
import com.remembread.card.service.CardSetService;
import com.remembread.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/card-sets")
@RequiredArgsConstructor
public class CardSetController {

    private final CardSetService cardSetService;

    @PostMapping
    public ApiResponse<CardSetCreateResponse> createCardSet(
            @RequestBody CardSetCreateRequest request,
            @AuthUser User user
            ) {
        return ApiResponse.onSuccess(cardSetService.createCardSet(request, user));
    }

    @PostMapping("/{cardSetId}/fork")
    public ApiResponse<Void> forkCardSet(@PathVariable Long cardSetId, @RequestBody ForkCardSetRequest request, @AuthUser User user) {
        cardSetService.forkCardSet(cardSetId, request.getFolderId(), user);
        return ApiResponse.onSuccess(null);
    }


    @GetMapping("/{cardSetId}")
    public ApiResponse<CardSetResponse> getCardSetInfo(
            @PathVariable Long cardSetId,
            @AuthUser User user
    ) {
        CardSetResponse response = cardSetService.getCardSetInfo(cardSetId, user);
        return ApiResponse.onSuccess(response);
    }

    @GetMapping("/{cardSetId}/cards")
    public ApiResponse<CardListResponse> getCardSetList(
            @PathVariable Long cardSetId,
            @RequestParam Integer page,
            @RequestParam Integer size,
            @RequestParam(defaultValue = "asc") String order,
            @AuthUser User user
    ) {
        CardListResponse response = cardSetService.getCardSetList(cardSetId, page, size, order, user);
        return ApiResponse.onSuccess(response);
    }

    @PatchMapping("/{cardSetId}")
    public ApiResponse<Void> updateCardSet(
            @PathVariable Long cardSetId,
            @RequestBody CardSetUpdateRequest request,
            @AuthUser User user
    ) {
        cardSetService.updateCardSetInfo(cardSetId, request, user);
        return ApiResponse.onSuccess(null);
    }

    @DeleteMapping("/{cardSetId}")
    public ApiResponse<Void> deleteCardSet(
            @PathVariable Long cardSetId,
            @AuthUser User user
            ) {
        cardSetService.deleteCardSet(cardSetId, user);
        return ApiResponse.onSuccess(null);
    }

    @GetMapping("/lists")
    @Operation(summary = "카드셋 목록 조회", description = "폴더 ID를 기준으로 카드셋 목록을 페이징 조회합니다.")
    public ApiResponse<CardSetListGetResponse> getCardSetList(@Parameter(description = "카드셋을 조회할 폴더 ID", example = "1", required = true) @RequestParam Long folderId,
                                                              @Parameter(description = "페이지 번호 (0부터 시작)", example = "0", required = true) @RequestParam(defaultValue = "0") int page,
                                                              @Parameter(description = "페이지당 항목 수", example = "10", required = true) @RequestParam(defaultValue = "10") int size,
                                                              @Parameter(description = "정렬 기준 (예: 최신순, 인기순, 포크순)", example = "최신순", required = true) @RequestParam(defaultValue = "최신순") String sort,
                                                              @AuthUser User user) {
    return ApiResponse.onSuccess(cardSetService.getCardSetList(folderId, page, size, sort, user));
    }

    @GetMapping("/search")
    @Operation(summary = "빵 묶음 검색 (상대방꺼 포함)", description = "조건 설정 후 검색")
    public ApiResponse<CardSetSearchResponse> searchCardSets(@Parameter(description = " 검색어", example = "정보처리기사") @RequestParam(defaultValue = "정보처리기사") String query,
                                                             @Parameter(description = "페이지 번호 (0부터 시작)", example = "0", required = true) @RequestParam(defaultValue = "0") int page,
                                                             @Parameter(description = "한페이지당 보여주는 카드셋 개수", example = "10", required = true) @RequestParam(defaultValue = "10") int size,
                                                             @Parameter(description = "‘인기순’, ‘포크순’, ‘최신순’ 중 하나", example = "최신순", required = true) @RequestParam(defaultValue = "최신순") CardSetSortType cardSetSortType,
                                                             @AuthUser User user){
        return ApiResponse.onSuccess(cardSetService.searchCardSets(query, page, size, cardSetSortType));
    }

    @GetMapping("/lists-simple")
    @Operation(summary = "카드셋 목록 조회", description = "폴더 ID를 기준으로 카드셋 목록을 페이징 조회합니다.")
    public ApiResponse<CardSetSimpleListGetResponse> getCardSetSimpleList(@Parameter(description = "카드셋을 조회할 폴더 ID", example = "1", required = true) @RequestParam Long folderId,
                                                                          @AuthUser User user) {
        return ApiResponse.onSuccess(cardSetService.getCardSetSimpleList(folderId, user));
    }

    @GetMapping("search-my")
    @Operation(summary = "빵 묶음 검색 (자기꺼만)", description = "자기 카드셋 검색")
    public ApiResponse<CardSetSearchResponse> searchMyCardSets(@Parameter(description = " 검색어", example = "정보처리기사") @RequestParam(defaultValue = "정보처리기사") String query,
                                                             @Parameter(description = "페이지 번호 (0부터 시작)", example = "0", required = true) @RequestParam(defaultValue = "0") int page,
                                                             @Parameter(description = "한페이지당 보여주는 카드셋 개수", example = "10", required = true) @RequestParam(defaultValue = "10") int size,
                                                             @Parameter(description = "‘이름순’, ‘최신순’ 중 하나", example = "최신순", required = true) @RequestParam(defaultValue = "최신순") CardSetSortType cardSetSortType,
                                                             @AuthUser User user){
        return ApiResponse.onSuccess(cardSetService.searchMyCardSets(query, page, size, cardSetSortType, user.getId()));
    }
}
