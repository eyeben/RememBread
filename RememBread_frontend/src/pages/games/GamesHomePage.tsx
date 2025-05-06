import SpeechBubble from "@/components/common/SpeechBubble";
import Button from "@/components/common/Button";
import Game from "@/components/svgs/footer/Game";
import { useNavigate } from "react-router-dom";

const GamesHomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center pt-14 pb-16 px-4">
      <SpeechBubble text="오늘도 열심히 해봐요!" />
      <div className="flex flex-col items-center mt-4 mb-4">
        <Game className="w-60 h-60 " />
      </div>
      <div className="w-full flex flex-col gap-3 max-w-[384px]">
        <Button 
          className="w-full h-[90px] flex-shrink-0 rounded-[30px] bg-primary-100 text-xl text-neutral-700 hover:bg-primary-200 active:bg-primary-300"
        >
          랜덤모드
        </Button>
        <Button 
          className="w-full h-[90px] flex-shrink-0 rounded-[30px] bg-primary-100 text-xl text-neutral-700 hover:bg-primary-200 active:bg-primary-300"
          onClick={() => navigate('/games/game-mode')}
        >
          선택모드
        </Button>
      </div>
    </div>
  );
};

export default GamesHomePage; 