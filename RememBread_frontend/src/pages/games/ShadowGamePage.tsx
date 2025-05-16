import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import Timer from '@/components/common/Timer';
import StartModal from '@/components/game/StartModal';
import GameResultModal from '@/components/game/GameResultModal';
import useGameStore from '@/stores/gameStore';
import CustomButton from '@/components/common/CustomButton';
import { BREAD_SVG_LIST } from '@/constants/game';
import { 
  getRandomIndices, 
  getAnswerButtons, 
  SVG_WIDTH, 
  SVG_HEIGHT,
  getRandomPos 
} from '@/utils/breadGame';

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
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  
  // useAnimation을 최상위 레벨에서 호출
  const controlsArray = Array.from({ length: 5 }, () => useAnimation());
  
  // controls 배열을 level에 따라 필터링
  const controls = useMemo(() => controlsArray.slice(0, level), [level]);

  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  
    const startAnimations = async () => {
      for (const control of controls) {
        const firstPos = getRandomPos();
        control.set({ x: firstPos.x, y: firstPos.y });
        
        const animate = async () => {
          while (!isCancelled) {
            const newPos = getRandomPos();
            await control.start({
              x: newPos.x,
              y: newPos.y,
              transition: {
                duration: getDuration(level),
                ease: "easeInOut",
              }
            });
          }
        };
        animate();
      }
    };

    startAnimations();
  
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
    <div className="min-h-[calc(100vh-126px)] w-full max-w-[600px] mx-auto flex flex-col items-center justify-start bg-primary-100 px-2 sm:px-4 pt-4 pb-4 overflow-hidden">
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
          <div className={`w-full ${windowWidth <= 320 ? 'max-w-[320px] h-[320px]' : 'max-w-[375px] h-[350px]'} flex-shrink-0 bg-primary-200 rounded-xl relative flex items-center justify-center gap-4 py-4 mb-6 text-white text-3xl font-bold overflow-hidden`}>
            <div className="relative w-full h-full">
              {randomIdx.map((idx, i) => {
                const Svg = BREAD_SVG_LIST[idx];
                return (
                  <motion.div
                    key={`${idx}-${i}`}
                    className="absolute"
                    animate={controls[i]}
                    style={{ 
                      width: `${SVG_WIDTH}px`, 
                      height: `${SVG_HEIGHT}px`,
                    }}
                  >
                    <Svg className={`w-full h-full ${!solvedBreads.includes(idx) ? 'grayscale brightness-0 contrast-200 opacity-100' : ''}`} />
                  </motion.div>
                );
              })}
            </div>
          </div>
          <div className={`w-full ${windowWidth <= 320 ? 'max-w-[320px]' : 'max-w-[375px]'} grid grid-cols-3 gap-3`}>
            {answerButtons.map((idx) => {
              const Svg = BREAD_SVG_LIST[idx];
              return (
                <CustomButton
                  key={idx}
                  className="bg-white hover:bg-neutral-50 active:bg-neutral-100 shadow-md rounded-xl p-2"
                  onClick={() => handleAnswer(idx)}
                >
                  <Svg className="w-14 h-14 sm:w-16 sm:h-16" />
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