import { useState } from 'react';
import Button from '@/components/common/Button';
import Timer from '@/components/common/Timer';
import RandomImage from '@/components/game/RandomImage';

const GameDetectivePage = () => {
  const [problemNumber, setProblemNumber] = useState(1);

  // 사용자가 정답을 누르면
  const handleNextProblem = () => {
    setProblemNumber(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 min-h-screen w-full max-w-[600px] mx-auto flex flex-col items-center justify-start bg-primary-100 px-2 sm:px-4 pt-16 pb-16 overflow-hidden">
      <div className="flex flex-col items-center gap-2">
        {/* 상단: 전체 타이머 */}
        <div className="w-full mb-4 text-2xl font-bold text-primary-700 flex items-center justify-center gap-2">
          <span>무슨 빵일까?</span>
          <span className="text-2xl text-neutral-500">
            <Timer
              initial={60}
            >
              {(time) => `${time}초`}
            </Timer>
          </span>
        </div>

        {/* 중앙: 이미지 */}
        <div className="flex flex-col items-center justify-center w-full max-w-[320px] h-[450px]">
          <div className="w-full h-full">
            <RandomImage 
              key={problemNumber}
            />
          </div>
        </div>

        {/* 하단: 선택지 버튼 */}
        <div className="w-full grid grid-cols-2 gap-4 pb-10">
          <Button variant="primary" className="py-7 text-lg" onClick={handleNextProblem}>바게트</Button>
          <Button variant="primary" className="py-7 text-lg" onClick={handleNextProblem}>밤식빵</Button>
          <Button variant="primary" className="py-7 text-lg" onClick={handleNextProblem}>케이크</Button>
          <Button variant="primary" className="py-7 text-lg" onClick={handleNextProblem}>타르트</Button>
        </div>
      </div>
    </div>
  );
};

export default GameDetectivePage; 