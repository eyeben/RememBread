import { indexCard } from "@/types/indexCard";
import http from "@/services/httpCommon";

interface CardListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    total: number;
    cards: indexCard[];
  };
}

export const getCardsByCardSet = async (
  cardSetId: number,
  page: number,
  size: number,
  order: "asc" | "desc" = "asc",
): Promise<CardListResponse> => {
  try {
    const response = await http.get<CardListResponse>(`/card-sets/${cardSetId}/cards`, {
      params: {
        page,
        size,
        order,
      },
    });
    return response.data;
  } catch (error) {
    console.error("카드 목록 조회 중 오류:", error);
    throw new Error("카드셋 카드 조회 실패");
  }
};
