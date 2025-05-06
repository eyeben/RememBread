import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Timer from "@/components/common/Timer";
import GameResultModal from "@/components/game/GameResultModal";
import useGameStore from "@/store/gameStore";

function getRandomBreads(breads: any[], count: number) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(breads[Math.floor(Math.random() * breads.length)]);
  }
  return arr;
}

function getNewQuiz(breads: any[]) {
  // 위: 3~4개, 아래: 2~3개 랜덤
  const topCount = Math.floor(Math.random() * 2) + 3;
  const bottomCount = Math.floor(Math.random() * 2) + 2;
  return {
    top: getRandomBreads(breads, topCount),
    bottom: getRandomBreads(breads, bottomCount)
  };
}

const CompareGamePage = () => {
  const navigate = useNavigate();
  const { setCompareScore } = useGameStore();
  const [userInput, setUserInput] = useState<string | null>(null);
  const [resultModalType, setResultModalType] = useState<"success"|"fail"|null>(null);
  const [score, setLocalScore] = useState(0);

  // 임시 데이터
  const breads = [
    { name: "식빵", price: 2000, emoji: "🍞" },
    { name: "바게트", price: 3000, emoji: "🥖" },
    { name: "크로와상", price: 5000, emoji: "🥐" }
  ];

  // 문제 상태
  const [quiz, setQuiz] = useState(() => getNewQuiz(breads));

  useEffect(() => {
    if (!resultModalType) return;
  }, [resultModalType]);

  const handleInput = (selected: string) => {
    if (userInput !== null) return;
    // 가격 합계 계산
    const topSum = quiz.top.reduce((acc, cur) => acc + cur.price, 0);
    const bottomSum = quiz.bottom.reduce((acc, cur) => acc + cur.price, 0);
    const isCorrect = (selected === "top" && topSum >= bottomSum) || (selected === "bottom" && bottomSum > topSum);
    setUserInput(selected);
    if (isCorrect) {
      setResultModalType("success");
      setLocalScore((prev) => prev + 1);
    } else {
      setResultModalType("fail");
    }
  };

  const handleTimeEnd = () => {
    setCompareScore(score);
    navigate("/games/result", { state: { game: "compare" } });
  };

  return (
    <div className="fixed inset-0 min-h-screen w-full max-w-[600px] mx-auto flex flex-col items-center justify-start bg-primary-100 px-2 sm:px-4 pt-[60px] pb-[64px] overflow-hidden">
      <div className="mb-4 text-2xl font-bold text-primary-700 flex items-center gap-2">
        <span>가격이 더 비싼 빵은?</span>
        <span className="ml-2 text-2xl text-neutral-500">
          <Timer initial={60} onEnd={handleTimeEnd}>{(v) => `${v}초`}</Timer>
        </span>
      </div>
      <div className="w-full max-w-[376px] h-[107px] flex-shrink-0 bg-primary-600 rounded-xl flex flex-row items-center justify-center gap-8 py-4 mb-8 text-white text-3xl font-bold">
        <div className="flex flex-row items-end justify-center w-full gap-8">
          {breads.map((bread, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-4xl mb-1">{bread.emoji}</span>
              <span className="text-base mt-1">{bread.price}원</span>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-[376px] mx-auto mt-8 flex flex-col gap-6">
        <button
          className="w-full min-h-[100px] bg-neutral-50 rounded-xl border border-neutral-300 flex flex-wrap items-center justify-center gap-2 p-4"
          onClick={() => handleInput("top")}
        >
          {quiz.top.map((bread: any, idx: number) => (
            <span key={idx} className="text-4xl m-1">{bread.emoji}</span>
          ))}
        </button>
        <button
          className="w-full min-h-[100px] bg-neutral-50 rounded-xl border border-neutral-300 flex flex-wrap items-center justify-center gap-2 p-4"
          onClick={() => handleInput("bottom")}
        >
          {quiz.bottom.map((bread: any, idx: number) => (
            <span key={idx} className="text-4xl m-1">{bread.emoji}</span>
          ))}
        </button>
      </div>
      <GameResultModal
        open={!!resultModalType}
        type={resultModalType === "success" ? "success" : "fail"}
        onClose={() => {
          setResultModalType(null);
          setUserInput(null);
          setQuiz(getNewQuiz(breads));
        }}
      />
    </div>
  );
};

export default CompareGamePage; 