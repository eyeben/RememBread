import http from "@/services/httpCommon";

// 빵 묶음 테스트 다음 카드
export const getNextCard = async (cardSetId: number) => {
  //   try {
  //     const response = await http.get(`studies/${cardSetId}/next`);
  //     return response.data.result;
  //   } catch (error) {
  //     console.error("다음 카드 조회 중 오류:", error);
  //     throw new Error("다음 카드 조회 실패");
  //   }

  const conceptPool = [
    "자료구조",
    "알고리즘",
    "컴퓨터네트워크",
    "운영체제",
    "데이터베이스",
    "자바스크립트",
    "리액트",
    "HTTP",
    "REST API",
    "클로저",
  ];

  const randomIndex = Math.floor(Math.random() * conceptPool.length);
  const randomConcept = conceptPool[randomIndex];

  return {
    cardId: 1,
    concept: randomConcept,
    description: `${randomConcept}에 대한 설명입니다.`,
  };
};

// 빵 묶음 답 제출
export const postAnswer = async (cardSetId: number, cardId: number, isCorrect: boolean) => {
  //   try {
  //     const response = await http.post(`studies/${cardSetId}/cards/${cardId}/answer`, { isCorrect });

  //     return response.data.result;
  //   } catch (error) {
  //     console.error("답 제출 중 오류:", error);
  //     throw new Error("답 제출 실패");
  //   }

  const randomCount = Math.floor(Math.random() * 10);
  return { remainingCardCount: randomCount };
};

// 빵 묶음 테스트 중단/종료
export const postStopTest = async (cardSetId: number) => {
  //   try {
  //     const response = await http.post(`studies/${cardSetId}/stop`);
  //     return response.data.result;
  //   } catch (error) {
  //     console.error("테스트 중단 중 오류:", error);
  //     throw new Error("테스트 중단 실패");
  //   }

  return;
};
