import http from "@/services/httpCommon";
import { indexCardSet } from "@/types/indexCard";

interface CardSetListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    cardSets: indexCardSet[];
  };
}

interface GetCardSetListParams {
  folderId: number;
  page: number;
  size: number;
  sort: string; // '최신순', '인기순', '포크순'
}

interface UpdateCardSetResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: object;
}

// 카드셋 목록 조회
export const getCardSetList = async (
  params: GetCardSetListParams,
): Promise<CardSetListResponse> => {
  try {
    const response = await http.get<CardSetListResponse>("/card-sets/lists", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("API 호출 에러:", error);
    throw new Error("카드셋 목록 조회 중 오류가 발생했습니다.");
  }
};

// 카드셋 간단 조회
export const getCardSetSimple = async (folderId: number) => {
  try {
    const response = await http.get("/card-sets/lists-simple", {
      params: { folderId },
    });
    return response.data;
  } catch (error) {
    console.error("API 호출 에러:", error);
    throw new Error("카드셋 간단 조회 중 오류가 발생했습니다.");
  }
};

export const updateCardSet = async (cardSet: indexCardSet): Promise<UpdateCardSetResponse> => {
  try {
    const payload = {
      name: cardSet.name ?? "",
      hashtags: cardSet.hashTags ?? [],
      isPublic: !!cardSet.isPublic,
    };

    const response = await http.patch<UpdateCardSetResponse>(
      `/card-sets/${cardSet.cardSetId}`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("카드셋 수정 중 오류:", error);
    throw new Error("카드셋 수정 요청 실패");
  }
};
