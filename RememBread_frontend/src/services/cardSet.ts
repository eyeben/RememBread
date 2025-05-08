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

export interface PostCardSetParams {
  folderId: number;
  name: string;
  hashtags: string[];
  isPublic: boolean;
}

// 카드셋 생성
export const postCardSet = async (cardSetData: PostCardSetParams) => {
  try {
    const response = await http.post("/card-sets", cardSetData);
    return response.data;
  } catch (error) {
    console.error("API 호출 에러:", error);
    throw new Error("카드셋 생성 중 오류가 발생했습니다.");
  }
};
