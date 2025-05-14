import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import Timer from '@/components/common/Timer';
import StartModal from '@/components/game/StartModal';
import GameResultModal from '@/components/game/GameResultModal';
import useGameStore from '@/stores/gameStore';
import CustomButton from '@/components/common/CustomButton';
import Baguette from '@/components/svgs/game/Baguette';
import Croissant from '@/components/svgs/game/Croissant';
import Bread from '@/components/svgs/game/Bread';
import Bread2 from '@/components/svgs/game/Bread2';
import Cake from '@/components/svgs/game/Cake';
import Cookie from '@/components/svgs/game/Cookie';
import Cupcake from '@/components/svgs/game/Cupcake';
import Doughnut from '@/components/svgs/game/Doughnut';
import Pizza from '@/components/svgs/game/Pizza';
import Pretzel from '@/components/svgs/game/Pretzel';

const svgList = [
  Baguette, Croissant, Bread, Bread2,
  Cake, Cookie, Cupcake, Doughnut,
  Pizza, Pretzel
];

function getRandomIndices(count: number) {
  const arr = Array.from({ length: svgList.length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

function getAnswerButtons(answerIndices: number[]) {
  // 정답 인덱스들을 포함한 6개의 랜덤 인덱스 생성
  const remainingIndices = Array.from({ length: svgList.length }, (_, i) => i)
    .filter(i => !answerIndices.includes(i));
  
  // 남은 인덱스들 중에서 랜덤하게 선택
  for (let i = remainingIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remainingIndices[i], remainingIndices[j]] = [remainingIndices[j], remainingIndices[i]];
  }
  
  // 정답 인덱스와 랜덤 인덱스를 합쳐서 6개 만들기
  const allIndices = [...answerIndices, ...remainingIndices.slice(0, 6 - answerIndices.length)];
  
  // 최종 인덱스 배열을 섞기
  for (let i = allIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allIndices[i], allIndices[j]] = [allIndices[j], allIndices[i]];
  }
  
  return allIndices;
}

const parentW = 376;
const parentH = 350;
const svgW = 160;
const svgH = 160;
const getRandomPos = () => {
  // 중앙점 계산
  const centerX = (parentW - svgW) / 2;
  const centerY = (parentH - svgH) / 2;
  
  // 중앙에서부터 랜덤하게 이동할 거리 계산 (-60% ~ +40%)
  const offsetX = (Math.random() * 1 - 0.55) * (parentW - svgW);
  const offsetY = (Math.random() * 1 - 0.55) * (parentH - svgH);
  
  return {
    x: centerX + offsetX,
    y: centerY + offsetY
  };
};

const GameShadowPage = () => {
  const navigate = useNavigate();
  const { setShadowScore } = useGameStore();
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(2);
  const [levelScore, setLevelScore] = useState<number>(0); // 현재 레벨에서의 점수
  const [randomIdx, setRandomIdx] = useState<number[]>([]);
  const [solvedBreads, setSolvedBreads] = useState<number[]>([]);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [answerButtons, setAnswerButtons] = useState<number[]>([]);
  
  // useAnimation을 최상위 레벨에서 호출
  const controlsArray = Array.from({ length: 5 }, () => useAnimation());
  
  // controls 배열을 level에 따라 필터링
  const controls = useMemo(() => controlsArray.slice(0, level), [level]);

  const generateNewProblem = () => {
    const newIndices = getRandomIndices(level);
    setRandomIdx(newIndices);
    
    setAnswerButtons(getAnswerButtons(newIndices));
  };

// 문제 출제는 레벨, 게임 시작, solvedBreads가 비었을 때만!
useEffect(() => {
  if (isGameStarted && solvedBreads.length === 0) {
    generateNewProblem();
  }
}, [isGameStarted, level, solvedBreads]);

  // 애니메이션 효과
  useEffect(() => {
    if (!isGameStarted || randomIdx.length === 0) return;
  
    let isCancelled = false;
  
    // duration 계산 함수
    const getDuration = (level:number) => {
      const base = 1.75;
      const decrement = 0.25;
      // 최소값 0.1초로 제한
      return Math.max(base - (level - 1) * decrement, 0.1);
    };
  
    controls.forEach((control) => {
      const animateToRandom = async () => {
        const firstPos = getRandomPos();
        control.set({ x: firstPos.x, y: firstPos.y });
  
        while (!isCancelled) {
          const newPos = getRandomPos();
          await control.start({
            x: newPos.x,
            y: newPos.y,
            transition: {
              duration: getDuration(level), // 레벨에 따라 duration 적용
              ease: "easeInOut",
            }
          });
        }
      };
      animateToRandom();
    });
  
    return () => {
      isCancelled = true;
      controls.forEach(control => control.stop());
    };
  }, [isGameStarted, randomIdx, controls, level]);
  

  const handleAnswer = (selectedIdx: number) => {
    if (randomIdx.includes(selectedIdx) && !solvedBreads.includes(selectedIdx)) {
      setSolvedBreads(prev => [...prev, selectedIdx]);
      if (solvedBreads.length + 1 === level) {
        setIsCorrect(true);
        setShowResultModal(true);
        setScore(prev => prev + 1);
        setLevelScore(prev => prev + 1);
  
        // 레벨업이 필요한지 확인
        if (levelScore + 1 >= 3 && level < 6) {
          setTimeout(() => {
            setLevel(prev => prev + 1); // 레벨업
            setLevelScore(0); // 레벨 점수 초기화
            setShowResultModal(false);
            setSolvedBreads([]);
          }, 1000);
        } else {
          setTimeout(() => {
            setShowResultModal(false);
            setSolvedBreads([]);
            // 여기서 generateNewProblem()을 호출하지 않음!
          }, 1000);
        }
      }
    } else {
      setIsCorrect(false);
      setShowResultModal(true);
      setTimeout(() => {
        setShowResultModal(false);
        setSolvedBreads([]);
      }, 1000);
    }
  };

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
          <div className="w-full max-w-[376px] h-[350px] flex-shrink-0 bg-primary-200 rounded-xl relative flex items-center justify-center gap-4 py-4 mb-8 text-white text-3xl font-bold overflow-hidden">
            <div className="relative w-full h-full">
              {randomIdx.map((idx, i) => {
                const Svg = svgList[idx];
                return (
                  <motion.div
                    key={`${idx}-${i}`}
                    className="absolute"
                    animate={controls[i]}
                    style={{ 
                      width: `${svgW}px`, 
                      height: `${svgH}px`,
                    }}
                  >
                    <Svg className={`w-full h-full ${!solvedBreads.includes(idx) ? 'grayscale brightness-0 contrast-200 opacity-80' : ''}`} />
                  </motion.div>
                );
              })}
            </div>
          </div>
          <div className="w-full max-w-[376px] grid grid-cols-3 gap-4">
            {answerButtons.map((idx) => {
              const Svg = svgList[idx];
              return (
                <CustomButton
                  key={idx}
                  className="bg-white shadow h-24 flex items-center justify-center"
                  onClick={() => handleAnswer(idx)}
                >
                  <Svg className="w-16 h-16" />
                </CustomButton>
              );
            })}
          </div>
          <GameResultModal 
            open={showResultModal} 
            onClose={() => setShowResultModal(false)} 
            type={isCorrect ? "success" : "fail"} 
          />
        </>
      )}
    </div>
  );
};

export default GameShadowPage;