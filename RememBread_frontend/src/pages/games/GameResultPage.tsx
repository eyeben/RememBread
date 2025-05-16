import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useGameStore from "@/stores/gameStore";
import ClearBread from "@/components/svgs/breads/ClearBread";
import DefaultBread from "@/components/svgs/breads/DefaultBread";
import { getRanks, postGameResult } from "@/services/gameService";
import { LeaderboardType } from "@/types/game";

interface UserProfile {
  nickname: string;
  mainCharacterImageUrl: string;
  rank: number;
  maxScore: number;
  playedAt: string;
}

const GameResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { memoryScore, compareScore, detectiveScore, shadowScore, resetMemoryScore, resetCompareScore, resetDetectiveScore, resetShadowScore } = useGameStore();
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [Leaderboard, setLeaderboard] = useState<LeaderboardType[]>([]);
  
  const gameType = location.state?.game.toUpperCase() || "memory";
  const score = gameType === "memory" ? memoryScore : 
                gameType === "compare" ? compareScore : 
                gameType === "detective" ? detectiveScore :
                shadowScore;

  useEffect(() => {
    const sendGameResult = async () => {
      try {
        console.log("게임 결과 저장 시작", score, gameType)
        const response = await postGameResult({
          gameType: gameType,
          score: score
        });
        setUserProfile(response.result)
        console.log("게임 결과 저장 완료", response);
      } catch (error) {
        console.error("게임 결과 저장 중 오류 발생:", error);
      }
    };
    const getLeaderboard = async () => {
      try {
        const response = await getRanks(gameType);
        console.log("게임 랭킹 조회 완료", response);
        setLeaderboard(response.result);
      } catch (error) {
        console.error("게임 랭킹 조회 중 오류 발생:", error);
      }
    };
    sendGameResult().then(() => {
      getLeaderboard();
    });
  }, [gameType, score]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <header>
        <div className="flex justify-center mb-2">
          <ClearBread className="w-16 h-16" />
        </div>
        <span className="flex text-2xl font-bold mb-4 justify-center">
          {gameType === "memory" ? "순간기억" : 
          gameType === "compare" ? "가격비교" : 
          gameType === "detective" ? "빵 탐정" :
          "그림자빵"}
        </span>
      </header>

      <div className="w-full max-w-md bg-white rounded-lg border-2 border-primary-200 p-6 mb-8">
        {/* 현재 사용자 점수 */}
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
            {userProfile?.mainCharacterImageUrl ? (
              <img      
                src={userProfile.mainCharacterImageUrl} 
                alt="User" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <DefaultBread className="w-full h-full" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold">{userProfile?.nickname}</div>
            <div className="text-xl font-bold text-gray-600">{score} Pts</div>
          </div>
        </div>

        {/* 리더보드 */}
        <div>
          <h3 className="text-xl font-bold mb-4">리더보드</h3>
          <div className="space-y-2 h-[200px] sm:h-[270px] overflow-y-auto pr-2">
            {Leaderboard.map((player, index) => (
              <div 
                key={index}
                className={`flex items-center gap-4 p-3 rounded-lg ${
                  player.nickname === userProfile?.nickname ? 'bg-gray-200' : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-8 text-center font-bold">{player.rank}</div>
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                {userProfile?.mainCharacterImageUrl ? (
              <img 
                src={userProfile.mainCharacterImageUrl} 
                alt="User" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <DefaultBread className="w-full h-full" />
            )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{player.nickname}</div>
                  <div className="text-xs text-neutral-400">{player.playedAt.split('T')[0]}</div>
                </div>
                <div className="font-bold text-primary-500">{player.maxScore}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-grid gap-4 w-full max-w-md">
        <button
          onClick={() => {
            if (gameType === "memory") {
              resetMemoryScore();
              navigate("/games/memory");
            } else if (gameType === "compare") {
              resetCompareScore();
              navigate("/games/compare");
            } else if (gameType === "detective") {
              resetDetectiveScore();
              navigate("/games/detective");
            } else if (gameType === "shadow") {
              resetShadowScore();
              navigate("/games/shadow");
            }
          }}
          className="w-full px-6 py-2 bg-primary-500 font-bold text-white rounded-lg hover:bg-primary-600"
        >
          다시하기
        </button>
        <button
          onClick={() => {
            resetMemoryScore();
            resetCompareScore();
            resetDetectiveScore();
            resetShadowScore();
            navigate("/games");
          }}
          className="w-full px-6 py-2 bg-neutral-200 text-neutral-700 font-bold rounded-lg hover:bg-neutral-300"
        >
          게임 목록으로
        </button>
      </div>
    </div>
  );
};

export default GameResultPage; 