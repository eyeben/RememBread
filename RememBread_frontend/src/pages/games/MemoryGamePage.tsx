import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "@/components/common/CustomButton";
import Timer from "@/components/common/Timer";
import GameResultModal from "@/components/game/GameResultModal";
import useGameStore from "@/store/gameStore";

const MemoryGamePage = () => {
  const navigate = useNavigate();
  const { setMemoryScore } = useGameStore();
  // 임시로 랜덤 숫자와 빵 이모지 배열
  const [showQuiz, setShowQuiz] = useState(true);
  const numbers = [4, 9];
  const breads = ["🥖", "🍞"];
  const [userInput, setUserInput] = useState<(string|number)[]>([]);
  const [resultModalType, setResultModalType] = useState<"success"|"fail"|null>(null);
  const [score, setLocalScore] = useState(0);

  // 정답 배열
  const answer = [...numbers, ...breads];

  useEffect(() => {
    if (!showQuiz) return;
    const timer = setTimeout(() => setShowQuiz(false), 2000);
    return () => clearTimeout(timer);
  }, [showQuiz]);

  useEffect(() => {
    if (!resultModalType) return;
    // 모달 닫힘은 GameResultModal에서 onClose로 처리
  }, [resultModalType]);

  // 버튼 클릭 핸들러
  const handleInput = (val: string|number) => {
    if (userInput.length >= answer.length) return;
    const next = [...userInput, val];
    setUserInput(next);
    if (next.length === answer.length) {
      const isCorrect = next.every((v, i) => v === answer[i]);
      if (isCorrect) {
        setResultModalType("success");
        setLocalScore((prev) => prev + 1);
      } else {
        setResultModalType("fail");
      }
    }
  };

  const handleTimeEnd = () => {
    setMemoryScore(score);
    navigate("/games/result", { state: { game: "memory" } });
  };

  return (
    <div className="fixed inset-0 min-h-screen w-full max-w-[600px] mx-auto flex flex-col items-center justify-start bg-primary-100 px-2 sm:px-4 pt-[60px] pb-[64px] overflow-hidden">
      <div className="mb-4 text-2xl font-bold text-primary-700 flex items-center gap-2">
        <span>숫자와 빵을 기억하자!</span>
        <span className="ml-2 text-2xl text-neutral-500">
          <Timer initial={60} onEnd={handleTimeEnd}>{(v) => `${v}초`}</Timer>
        </span>
      </div>
      <div className="w-full max-w-[376px] h-[107px] flex-shrink-0 bg-primary-600 rounded-xl flex flex-row items-center justify-center gap-4 py-4 mb-8 text-white text-3xl font-bold">
        {showQuiz ? (
          <>
            {numbers.map((num, idx) => (
              <span key={idx}>{num}</span>
            ))}
            {breads.map((bread, idx) => (
              <span key={idx}>{bread}</span>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-row items-center justify-center gap-6 text-white text-2xl font-bold h-8 mb-2">
              {answer.map((_, idx) => (
                <span key={idx} className="w-8 text-center">
                  {userInput[idx] !== undefined ? userInput[idx] : ""}
                </span>
              ))}
            </div>
            <div className="flex flex-row items-end justify-center gap-6">
              {answer.map((_, idx) => (
                <span
                  key={idx}
                  className="inline-block w-8 h-1 rounded bg-white opacity-80"
                ></span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="w-full max-w-[376px] mx-auto mt-8 grid grid-cols-3 gap-4 sm:gap-6">
        {[1,2,3,4,5,6,7,8,9,'🍞','🥖','🥐'].map((item, idx) => (
          <CustomButton
            key={idx}
            className="w-[88px] h-[64px] sm:w-[112px] sm:h-[86px] flex-shrink-0 rounded-[20px] bg-primary-300 shadow flex items-center justify-center text-3xl font-bold text-neutral-700 hover:bg-primary-400 transition p-0 sm:px-2 sm:py-2 disabled:opacity-100"
            variant="default"
            onClick={() => handleInput(item)}
            disabled={showQuiz}
          >
            {item}
          </CustomButton>
        ))}
      </div>
      <GameResultModal
        open={!!resultModalType}
        type={resultModalType === "success" ? "success" : "fail"}
        onClose={() => {
          setResultModalType(null);
          setUserInput([]);
          setShowQuiz(true);
        }}
      />
    </div>
  );
};

export default MemoryGamePage; 