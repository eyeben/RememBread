import { useNavigate } from "react-router-dom";
import SpeechBubble from "@/components/common/SpeechBubble";
import Button from "@/components/common/Button";
import Game from "@/components/svgs/footer/Game";
import { motion } from "framer-motion";

const GamesHomePage = () => {
  const navigate = useNavigate();

  const handleRandomGame = () => {
    const games = ["/games/memory", "/games/compare", "/games/detective", "/games/shadow"];
    const randomIndex = Math.floor(Math.random() * games.length);
    navigate(games[randomIndex]);
  };

  return (
    <div className="flex flex-col items-center px-4 min-h-[calc(100vh-126px)]">
      <div className="flex w-full flex-col items-center">
        <SpeechBubble text="오늘도 열심히 해봐요!" />
        <div className="flex flex-col items-center mt-4 mb-4">
        <motion.div
            animate={{
              y: [10, -40, 10],
            }}
            transition={{
              duration: 0.8,
              ease: ["easeOut", "easeIn"], 
              repeat: Infinity,
              repeatType: "loop",
              // repeatDelay: 0.1,
            }}
          >
            <Game className="w-60 h-60" />
          </motion.div>
          <motion.div
            animate={{
              rotate: 360
            }}
            transition={{
              type: "spring",
              stiffness: 20,
              damping: 5,
              mass: 1,
              repeat: Infinity,
              repeatType: "loop",
              duration: undefined
            }}
          >
            <Game className="w-60 h-60" />
          </motion.div>

        </div>
      </div>
      <div className="w-full flex flex-col gap-3 max-w-[384px] mt-4">
        <Button 
          className="w-full h-[80px] flex-shrink-0 rounded-[30px] bg-primary-200 text-2xl text-neutral-700 hover:bg-primary-200 active:bg-primary-300"
          onClick={handleRandomGame}
        >
          랜덤모드
        </Button>
        <Button 
          className="w-full h-[80px] flex-shrink-0 rounded-[30px] bg-primary-200 text-2xl text-neutral-700 hover:bg-primary-200 active:bg-primary-300"
          onClick={() => navigate('/games/game-mode')}
        >
          선택모드
        </Button>
        <Button 
          className="w-full h-[80px] flex-shrink-0 rounded-[30px] bg-primary-200 text-2xl text-neutral-700 hover:bg-primary-200 active:bg-primary-300"
          onClick={() => navigate('/games/rank')}
        >
          랭킹
        </Button>
      </div>
    </div>
  );
};

export default GamesHomePage; 