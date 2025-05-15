import  http  from "@/services/httpCommon";
import { GAME_END_POINT } from "@/services/endPoints";
import { Leaderboard } from "@/types/game";

interface RankResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result:Leaderboard[]
}



interface GameResultResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: {
        nickname: string
        rank: number
        maxScore: number
        profileImage: string;
    }
}

interface GameResultParams {
    gameName: string;
    score: number;
}

/**
 * 게임 결과 저장
 * 
 * 게임 결과 저장 요청 및 응답 처리
 */
export const postGameResult = async (body: GameResultParams): Promise<GameResultResponse> => {
    try {
        const response = await http.post<GameResultResponse>(GAME_END_POINT.POST_GAME_RESULT, body);
        console.log("게임 결과 저장", response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

/**
 * 게임 랭킹 조회
 * 
 * 게임 랭킹 조회 요청 및 응답 처리
 */
export const getRanks = async (): Promise<RankResponse> => {
    try {
      const response = await http.get<RankResponse>(GAME_END_POINT.GET_RANKS);
      console.log("게임 랭킹 조회", response.data)
      return response.data;
    } catch (error) {
      throw error
    }
  };