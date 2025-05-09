import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from '@/components/common/Timer';
import StartModal from '@/components/game/StartModal';
import GameResultModal from '@/components/game/GameResultModal';
import useGameStore from '@/stores/gameStore';
import CustomButton from '@/components/common/CustomButton';
import Baguette from '@/components/svgs/game/Baguette';
import Croissant from '@/components/svgs/game/Croissant';
import Bread from '@/components/svgs/game/Bread';
import Bread2 from '@/components/svgs/game/Bread2';
import { motion, useAnimation } from 'framer-motion';

const svgList = [Baguette, Croissant, Bread, Bread2];

function getTwoRandomIndices() {
  const arr = [0, 1, 2, 3];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return [arr[0], arr[1]];
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
  const [randomIdx, setRandomIdx] = useState([0, 1]);
  const [positions, setPositions] = useState([getRandomPos(), getRandomPos()]);
  const [solvedBreads, setSolvedBreads] = useState<number[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const controls1 = useAnimation();
  const controls2 = useAnimation();

  const animateRandom = async (controls: any, initialPos: { x: number, y: number }) => {
    const randomPos = getRandomPos();
    await controls.start({
      x: randomPos.x,
      y: randomPos.y,
      transition: {
        duration: 2,
        ease: "easeInOut",
      }
    });
  };

  const startAnimation = () => {
    const animate = async () => {
      const randomPos1 = getRandomPos();
      const randomPos2 = getRandomPos();
      
      await Promise.all([
        controls1.start({
          x: randomPos1.x,
          y: randomPos1.y,
          transition: {
            duration: 2,
            ease: "easeInOut",
          }
        }),
        controls2.start({
          x: randomPos2.x,
          y: randomPos2.y,
          transition: {
            duration: 2,
            ease: "easeInOut",
          }
        })
      ]);

      if (isGameStarted) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  };

  const generateNewProblem = () => {
    setRandomIdx(getTwoRandomIndices());
    const newPos1 = getRandomPos();
    const newPos2 = getRandomPos();
    setPositions([newPos1, newPos2]);
    controls1.set({ x: newPos1.x, y: newPos1.y });
    controls2.set({ x: newPos2.x, y: newPos2.y });
  };

  useEffect(() => {
    if (isGameStarted) {
      generateNewProblem();
      startAnimation();
    }
  }, [isGameStarted]);

  const handleGameStart = () => {
    setIsGameStarted(true);
  };

  const handleTimeEnd = () => {
    setShadowScore(score);
    navigate("/games/result", { state: { game: "shadow" } });
  };

  const handleAnswer = (selectedIdx: number) => {
    if (randomIdx.includes(selectedIdx) && !solvedBreads.includes(selectedIdx)) {
      setSolvedBreads(prev => [...prev, selectedIdx]);
      
      if (solvedBreads.length + 1 === 2) {
        // 모든 빵을 맞췄을 때
        setIsCorrect(true);
        setShowResultModal(true);
        setScore(prev => prev + 1);
        
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

  const Svg1 = svgList[randomIdx[0]];
  const Svg2 = svgList[randomIdx[1]];

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
              <motion.div
                className="absolute"
                animate={controls1}
                style={{ 
                  width: `${svgW}px`, 
                  height: `${svgH}px`,
                }}
              >
                <Svg1 className={`w-full h-full ${!solvedBreads.includes(randomIdx[0]) ? 'grayscale brightness-0 contrast-200 opacity-80' : ''}`} />
              </motion.div>
              <motion.div
                className="absolute"
                animate={controls2}
                style={{ 
                  width: `${svgW}px`, 
                  height: `${svgH}px`,
                }}
              >
                <Svg2 className={`w-full h-full ${!solvedBreads.includes(randomIdx[1]) ? 'grayscale brightness-0 contrast-200 opacity-80' : ''}`} />
              </motion.div>
            </div>
          </div>
          <div className="w-full max-w-[376px] grid grid-cols-2 gap-4">
            {svgList.map((Svg, idx) => (
              <CustomButton
                key={idx}
                className="bg-white shadow h-24 flex items-center justify-center"
                onClick={() => handleAnswer(idx)}
              >
                <Svg className="w-16 h-16" />
              </CustomButton>
            ))}
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