import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Timer from "@/components/common/Timer";
import GameResultModal from "@/components/game/GameResultModal";
import QuizContainer from "@/components/game/QuizContainer";
import useGameStore from "@/stores/gameStore";
import Bread from "@/components/svgs/game/Bread";
import Baguette from "@/components/svgs/game/Baguette";
import Croissant from "@/components/svgs/game/Croissant";

interface Bread {
  name: string;
  price: number;
  type: string;
}

function getRandomBreads(breads: Bread[], count: number) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(breads[Math.floor(Math.random() * breads.length)]);
  }
  return arr;
}

function getNewQuiz(breads: Bread[]) {
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

  const breads = [
    { name: "식빵", price: 2000, type: "bread" },
    { name: "바게트", price: 3000, type: "baguette" },
    { name: "크로와상", price: 5000, type: "croissant" }
  ];

  const [quiz, setQuiz] = useState(() => getNewQuiz(breads));

  useEffect(() => {
    if (!resultModalType) return;
  }, [resultModalType]);

  const handleInput = (selected: string) => {
    if (userInput !== null) return;
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

  const renderBread = (type: string) => {
    switch (type) {
      case 'bread':
        return <Bread className="w-16 h-16" />;
      case 'baguette':
        return <Baguette className="w-16 h-16" />;
      case 'croissant':
        return <Croissant className="w-16 h-16" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 min-h-screen w-full max-w-[600px] mx-auto flex flex-col items-center justify-start bg-primary-100 px-2 sm:px-4 pt-16 pb-16 overflow-hidden">
      <div className="mb-4 text-2xl font-bold text-primary-700 flex items-center gap-2">
        <span>가격이 더 비싼 빵은?</span>
        <span className="ml-2 text-2xl text-neutral-500">
          <Timer initial={60} onEnd={handleTimeEnd}>{(v) => `${v}초`}</Timer>
        </span>
      </div>
      <div className="w-full max-w-96 h-28 flex-shrink-0 bg-primary-600 rounded-xl flex flex-row items-center justify-center gap-8 py-4 mb-8 text-white text-3xl font-bold">
        <div className="flex flex-row items-center justify-center w-full gap-12">
          {breads.map((bread, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 mb-1 flex items-center justify-center">
                {renderBread(bread.type)}
              </div>
              <span className="text-md mt-1">{bread.price}원</span>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-96 mx-auto mt-8 flex flex-col gap-6">
        <QuizContainer breads={quiz.top} onClick={() => handleInput("top")} />
        <QuizContainer breads={quiz.bottom} onClick={() => handleInput("bottom")} />
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