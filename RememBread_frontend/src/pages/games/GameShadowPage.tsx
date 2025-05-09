import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from '@/components/common/Timer';
import StartModal from '@/components/game/StartModal';
import useGameStore from '@/stores/gameStore';

const GameShadowPage = () => {
  const navigate = useNavigate();
  const { setShadowScore } = useGameStore();
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [score, setScore] = useState(0);

  const handleGameStart = () => {
    setIsGameStarted(true);
  };

  const handleTimeEnd = () => {
    setShadowScore(score);
    navigate("/games/result", { state: { game: "shadow" } });
  };

  return (
    <div className="fixed inset-0 min-h-screen w-full max-w-[600px] mx-auto flex flex-col items-center justify-start bg-primary-100 px-2 sm:px-4 pt-16 pb-16 overflow-hidden">
      {!isGameStarted ? (
        <StartModal onCountdownEnd={handleGameStart} />
      ) : (
        <>
          <div className="mb-4 text-2xl font-bold text-primary-700 flex items-center gap-2">
            <span>그림자로 변한 빵은?</span>
            <span className="ml-2 text-2xl text-neutral-500">
              <Timer initial={60} onEnd={handleTimeEnd}>{(v) => `${v}초`}</Timer>
            </span>
          </div>
          <div className="w-full max-w-[376px] h-[107px] flex-shrink-0 bg-primary-600 rounded-xl flex flex-row items-center justify-center gap-4 py-4 mb-8 text-white text-3xl font-bold">
            {/* 게임 컨텐츠가 들어갈 자리 */}
          </div>
        </>
      )}
    </div>
  );
};

export default GameShadowPage; 