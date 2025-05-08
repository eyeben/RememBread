import http from "@/services/httpCommon";

interface CardSet {
  cardSetId: number;
  title: string;
  viewCount: number;
  forkCount: number;
}

interface CardSetListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    cardSets: CardSet[];
  };
}

interface GetCardSetListParams {
  folderId: number;
  page: number;
  size: number;
  sort: string; // '최신순', '인기순', '포크순'
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
