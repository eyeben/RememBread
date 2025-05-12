import http from "@/services/httpCommon";
import { indexCard } from "@/types/indexCard";
import { tokenUtils } from "@/lib/queryClient";
import { useCardStore } from "@/stores/cardStore";

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

// 카드셋에 여러 카드 추가
export const postCards = async (cardSetId: number, cards: indexCard[]) => {
  try {
    const response = await http.post("/cards/create-many", {
      cardSetId,
      breads: cards,
    });
    return response.data;
  } catch (error) {
    console.error("카드 병합 중 오류:", error);
    throw new Error("카드 병합 실패");
  }
};

// 대량 텍스트로 카드 생성
export const postCardsByText = async (text: string) => {
  try {
    const accessToken = tokenUtils.getToken();
    const baseURL = import.meta.env.VITE_APP_BASE_URL;
    const response = await fetch(baseURL + "/cards/text/large", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.body) {
      throw new Error("ReadableStream이 없습니다.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    const addCard = useCardStore.getState().appendCard;
    useCardStore.getState().clearCardSet();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let newlineIndex;
      while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);

        if (line.startsWith("data:")) {
          const json = line.replace(/^data:\s*/, "");
          const card = JSON.parse(json);

          addCard(card);
        }
      }
    }
  } catch (error) {
    console.error("카드 생성 중 오류:", error);
    throw new Error("카드 생성 실패");
  }
};

// 카드 삭제하기
export const deleteCard = async (cardId: number) => {
  try {
    const { data } = await http.delete(`/cards/${cardId}`);
    return data;
  } catch (error) {
    console.error("카드 삭제 중 오류:", error);
    throw new Error("카드 삭제에 실패했습니다.");
  }
};

// 카드 수정하기
export const patchCard = async (cardId: number, card: Partial<indexCard>) => {
  try {
    const response = await http.patch(`/cards/${cardId}`, card);
    return response.data;
  } catch (error) {
    console.error("카드 수정 중 오류:", error);
    throw new Error("카드 수정에 실패했습니다.");
  }
};
