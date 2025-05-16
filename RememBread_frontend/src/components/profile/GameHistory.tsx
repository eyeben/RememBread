import { useState, useEffect } from "react";
import CharacterImage from "@/components/common/CharacterImage";
import Game from "@/components/svgs/footer/Game";
import useProfileStore from "@/stores/profileStore";
import { getGameHistory } from "@/services/gameService";
import { GameHistoryType } from "@/types/game";
import { convertGameTypeToKorean } from "@/utils/breadGame";



const GameHistory = () => {
  const { nickname, mainCharacterId, mainCharacterImageUrl } = useProfileStore();
  const [gameHistory, setGameHistory] = useState<GameHistoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        setIsLoading(true);
        const response = await getGameHistory();
        setGameHistory(response.result);
      } catch (error) {
        console.error("게임 기록 조회 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGameHistory();
  }, []);

  return (
    <div className="flex flex-col items-center w-full webkit-scrollbar-hide">
      {/* 프로필 영역 */}
      <div className="flex flex-col items-center mt-4 mb-6">
        <CharacterImage characterId={mainCharacterId} characterImageUrl={mainCharacterImageUrl} className="w-24 h-24 mb-2" />
        <div className="text-lg font-bold mb-2">{nickname}</div>
        <div className="w-full h-1.5 bg-primary-300 mb-2" />
      </div>
      {/* 게임 히스토리 리스트 */}
      <div className="w-full px-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
            <p className="text-sm text-neutral-400 mt-4">게임 기록을 불러오는 중...</p>
          </div>
        ) : gameHistory.length < 2 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-neutral-400">
            <Game className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-sm font-medium">게임 기록이 없습니다</p>
            <p className="text-xs mt-1">학습을 완료하고 게임을 시작해보세요!</p>
          </div>
        ) : (
          gameHistory.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center py-3 border-t-2 border-primary-300 last:border-b-0"
            >
              <Game className="w-10 h-10 mr-4" />
              <div className="flex-1">
                <div className="text-xs text-neutral-400 mb-1">{convertGameTypeToKorean(item.gameType)}</div>
                <div className="text-xs text-neutral-400 mb-1">{item.playedAt.split('T')[0]}</div>
                <div className="text-md font-semibold">
                  게임 성적 <span className="font-bold">{item.score}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameHistory;
