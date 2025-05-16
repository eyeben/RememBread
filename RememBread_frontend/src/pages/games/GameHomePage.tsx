import { useNavigate } from "react-router-dom";
import SpeechBubble from "@/components/common/SpeechBubble";
import Button from "@/components/common/Button";
import Game from "@/components/svgs/footer/Game";

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
          <Game className="w-60 h-60 " />
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