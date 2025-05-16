import { useState, useEffect } from "react";
import CharacterImage from "@/components/common/CharacterImage";
import Game from "@/components/svgs/footer/Game";
import useProfileStore from "@/stores/profileStore";
import { getGameHistory } from "@/services/gameService";
import { GameHistoryType } from "@/types/game";



const GameHistory = () => {
  const { nickname, mainCharacterId, mainCharacterImageUrl } = useProfileStore();
  const [gameHistory, setGameHistory] = useState<GameHistoryType[]>([]);

  useEffect(() => {
    const fetchGameHistory = async () => {
      const response = await getGameHistory();
      setGameHistory(response.result);
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
        {gameHistory.length < 2 ? (
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
                <div className="text-xs text-neutral-400 mb-1">{item.gameType}</div>
                <div className="text-xs text-neutral-400 mb-1">{item.playedAt}</div>
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
