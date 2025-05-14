import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "@/components/common/CustomButton";
import Timer from "@/components/common/Timer";
import GameResultModal from "@/components/game/GameResultModal";
import StartModal from "@/components/game/StartModal";
import useGameStore from "@/stores/gameStore";

const MemoryGamePage = () => {
  const navigate = useNavigate();
  const { setMemoryScore } = useGameStore();
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<number>(3); // 초기 난이도 3개
  const [score, setLocalScore] = useState<number>(0);
  const [userInput, setUserInput] = useState<(string|number)[]>([]);
  const [resultModalType, setResultModalType] = useState<"success"|"fail"|null>(null);
  const [successCount, setSuccessCount] = useState<number>(0); // 현재 난이도에서의 성공 횟수
  
  // 사용 가능한 모든 아이템
  const allItems = [1,2,3,4,5,6,7,8,9,'🍞','🥖','🥐'];
  
  // 현재 난이도에 맞는 랜덤 조합 생성
  const generateRandomCombination = (count: number) => {
    const shuffled = [...allItems].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const [answer, setAnswer] = useState<(string|number)[]>([]);

  // 게임 시작 시 초기화
  const handleGameStart = () => {
    setIsGameStarted(true);
    setShowQuiz(true);
    setAnswer(generateRandomCombination(difficulty));
  };

  // 난이도가 변경되거나 게임이 시작될 때 새로운 조합 생성
  useEffect(() => {
    if (!isGameStarted) return;
    setAnswer(generateRandomCombination(difficulty));
    setShowQuiz(true);
    setSuccessCount(0);
  }, [difficulty, isGameStarted]);

  useEffect(() => {
    if (!showQuiz) return;
    const timer = setTimeout(() => setShowQuiz(false), 2000);
    return () => clearTimeout(timer);
  }, [showQuiz]);

  useEffect(() => {
    if (!resultModalType) return;
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
        const newSuccessCount = successCount + 1;
        setSuccessCount(newSuccessCount);
        
        // 3번 성공하면 난이도 증가
        if (newSuccessCount >= 3 && difficulty < 10) {
          // 난이도 증가는 모달이 닫힐 때 처리
        } else {
          // 같은 난이도에서 새로운 문제 출제
          setAnswer(generateRandomCombination(difficulty));
        }
      } else {
        setResultModalType("fail");
        // 실패 시에도 새로운 문제 출제
        setAnswer(generateRandomCombination(difficulty));
      }
    }
  };

  const handleTimeEnd = () => {
    setMemoryScore(score);
    navigate("/games/result", { state: { game: "memory" } });
  };

  return (
    <div className="min-h-screen w-full max-w-[600px] mx-auto flex flex-col items-center justify-start bg-primary-100 px-2 sm:px-4 pt-4 overflow-hidden">
      {!isGameStarted ? (
        <StartModal onCountdownEnd={handleGameStart} />
      ) : (
        <>
          <div className="mb-4 text-2xl font-bold text-primary-700 flex items-center gap-2">
            <span>숫자와 빵을 기억하자!</span>
            <span className="ml-2 text-2xl text-neutral-500">
              <Timer initial={60} onEnd={handleTimeEnd}>{(v) => `${v}초`}</Timer>
            </span>
          </div>
          <div className="w-full max-w-[376px] h-[90px] sm:h-[108px] flex-shrink-0 bg-primary-600 rounded-xl flex flex-row items-center justify-center gap-2 sm:gap-4 py-4 mb-4 text-white text-2xl sm:text-3xl font-bold">
            {showQuiz ? (
              <>
                {answer.map((item, idx) => (
                  <span key={idx}>{item}</span>
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center w-full">
                <div className="flex flex-row items-center justify-center gap-4 sm:gap-6 text-white text-xl sm:text-2xl font-bold h-8 mb-2">
                  {answer.map((_, idx) => (
                    <span key={idx} className="w-6 sm:w-8 text-center">
                      {userInput[idx] !== undefined ? userInput[idx] : ""}
                    </span>
                  ))}
                </div>
                <div className="flex flex-row items-end justify-center gap-4 sm:gap-6">
                  {answer.map((_, idx) => (
                    <span
                      key={idx}
                      className="inline-block w-6 sm:w-8 h-1 rounded bg-white opacity-80"
                    ></span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="w-full max-w-[376px] mx-auto mt-2 grid grid-cols-3 gap-2 xs:gap-3 sm:gap-4 md:gap-6">
            {allItems.map((item, idx) => (
              <CustomButton
                key={idx}
                className="w-full h-[64px] xs:h-[60px] sm:h-[64px] md:h-[86px] flex-shrink-0 rounded-[20px] bg-primary-300 shadow flex items-center justify-center text-2xl sm:text-3xl font-bold text-neutral-700 p-0 sm:px-2 sm:py-2 disabled:opacity-100"
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
              
              if (successCount >= 3 && difficulty < 10) {
                setDifficulty(prev => prev + 1);
              } else {
                setAnswer(generateRandomCombination(difficulty));
              }
            }}
          />
        </>
      )}
    </div>
  );
};

export default MemoryGamePage; 