import { useState, useEffect } from 'react';
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

// 임시로 같은 SVG를 반복해서 10개로 만듦
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
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(2);
  const [randomIdx, setRandomIdx] = useState<number[]>([]);
  const [solvedBreads, setSolvedBreads] = useState<number[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answerButtons, setAnswerButtons] = useState<number[]>([]);
  const [positions, setPositions] = useState<{x: number, y: number}[]>([]);
  
  // 각 이미지마다 별도의 controls 생성
  const controls = Array.from({ length: 5 }, () => useAnimation());

  const generateNewProblem = () => {
    const newIndices = getRandomIndices(level);
    setRandomIdx(newIndices);
    
    // 새로운 위치 생성
    const newPositions = newIndices.map(() => getRandomPos());
    setPositions(newPositions);
    
    setAnswerButtons(getAnswerButtons(newIndices));
  };

  // 게임 시작 시 문제 생성
  useEffect(() => {
    if (isGameStarted) {
      generateNewProblem();
    }
  }, [isGameStarted]);

  // 애니메이션 효과
  useEffect(() => {
    if (!isGameStarted || randomIdx.length === 0) return;

    const animate = async () => {
      const newPositions = randomIdx.map(() => getRandomPos());
      setPositions(newPositions);
      
      await Promise.all(
        randomIdx.map((_, idx) =>
          controls[idx].start({
            x: newPositions[idx].x,
            y: newPositions[idx].y,
            transition: {
              duration: 2,
              ease: "easeInOut",
            }
          })
        )
      );

      // 애니메이션이 끝나면 0.2초 후에 다음 애니메이션 시작
      setTimeout(() => {
        if (isGameStarted) {
          animate();
        }
      }, 200);
    };

    // 초기 위치 설정
    randomIdx.forEach((_, idx) => {
      controls[idx].set({ x: positions[idx]?.x || 0, y: positions[idx]?.y || 0 });
    });

    animate();
  }, [isGameStarted, randomIdx]);

  const handleAnswer = (selectedIdx: number) => {
    if (randomIdx.includes(selectedIdx) && !solvedBreads.includes(selectedIdx)) {
      setSolvedBreads(prev => [...prev, selectedIdx]);
      
      if (solvedBreads.length + 1 === level) {
        // 모든 빵을 맞췄을 때
        setIsCorrect(true);
        setShowResultModal(true);
        setScore(prev => prev + 1);
        
        // 레벨 업 조건 체크
        if (score + 1 >= level * 2) { // 현재 레벨의 2배 점수를 획득하면 레벨업
          if (level < 4) {
            setLevel(prev => prev + 1);
          }
        }
        
        // 정확히 1초 후에 다음 문제로 이동
        const timer = setTimeout(() => {
          setShowResultModal(false);
          setSolvedBreads([]);
          generateNewProblem();
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    } else {
      // 실패 시 모달 표시 후 새 문제 출제
      setIsCorrect(false);
      setShowResultModal(true);
      setSolvedBreads([]);
      
      const timer = setTimeout(() => {
        setShowResultModal(false);
        generateNewProblem();
      }, 1000);
      
      return () => clearTimeout(timer);
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