import { useNavigate, useLocation } from "react-router-dom";
import useGameStore from "@/stores/gameStore";
import ClearBread from "@/components/svgs/breads/ClearBread";

const GameResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { memoryScore, compareScore, resetMemoryScore, resetCompareScore } = useGameStore();
  const gameType = location.state?.game || "memory";
  const score = gameType === "memory" ? memoryScore : compareScore;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">
        {gameType === "memory" ? "순간기억" : "가격비교"}
      </h1>
      <div className="mb-8">
        <ClearBread className="w-64 h-64" />
      </div>
      
      
      <div className="text-xl mb-8">
        최종 점수: <span className="font-bold">{score}점</span>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => {
            if (gameType === "memory") {
              resetMemoryScore();
              navigate("/games/memory");
            } else if (gameType === "compare") {
              resetCompareScore();
              navigate("/games/compare");
            }
          }}
          className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          다시하기
        </button>
        <button
          onClick={() => {
            resetMemoryScore();
            resetCompareScore();
            navigate("/games");
          }}
          className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300"
        >
          게임 목록으로
        </button>
      </div>
    </div>
  );
};

export default GameResultPage; 