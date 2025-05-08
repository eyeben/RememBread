import Button from '@/components/common/Button';
import Timer from '@/components/common/Timer';
import RandomImage from '@/components/game/RandomImage';

const TOTAL_TIME = 60; // 총 타이머 시간(초)

const GameDetectivePage = () => {

  return (
    <div className="flex flex-col min-h-screen items-center bg-neutral-50">
      {/* 상단: 타이머와 제목 */}
      <div className="mb-4 text-2xl font-bold text-primary-700 flex items-center gap-2">
        <span>숫자와 빵을 기억하자!</span>
        <span className="ml-2 text-2xl text-neutral-500">
          <Timer initial={TOTAL_TIME}>
            {(v) => {
              setTimeout(() => 60, 0);
              return `${v}초`;
            }}
          </Timer>
        </span>
      </div>

      {/* 중앙: 점점 축소되는 SVG */}
      <div className="flex flex-col items-center justify-center">
        <div className="mb-8">
          <RandomImage />
        </div>
      </div>

      {/* 하단: 선택지 버튼 */}
      <div className="w-full max-w-xs mx-auto grid grid-cols-2 gap-4 pb-10">
        <Button variant="primary" className="py-7 text-lg">바게트</Button>
        <Button variant="primary" className="py-7 text-lg">밤식빵</Button>
        <Button variant="primary" className="py-7 text-lg">케이크</Button>
        <Button variant="primary" className="py-7 text-lg">타르트</Button>
      </div>
    </div>
  );
};

export default GameDetectivePage; 