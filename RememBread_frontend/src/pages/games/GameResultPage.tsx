import { useNavigate } from "react-router-dom";
import useGameStore from "@/store/gameStore";
import ClearBread from "@/components/svgs/breads/ClearBread";
import FailBread from "@/components/svgs/breads/FailBread";

const GameResultPage = () => {
  const navigate = useNavigate();
  const { memoryScore } = useGameStore();
  const isSuccess = memoryScore >= 70; // 70점 이상을 성공으로 간주

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="mb-8">
        {isSuccess ? (
          <ClearBread className="w-32 h-32" />
        ) : (
          <FailBread className="w-32 h-32" />
        )}
      </div>
      
      <h1 className="text-2xl font-bold mb-4">
        {isSuccess ? "축하합니다!" : "다시 도전해보세요!"}
      </h1>
      
      <div className="text-xl mb-8">
        최종 점수: <span className="font-bold">{memoryScore}점</span>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/games/memory")}
          className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          다시하기
        </button>
        <button
          onClick={() => navigate("/games")}
          className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300"
        >
          게임 목록으로
        </button>
      </div>
    </div>
  );
};

export default GameResultPage; 