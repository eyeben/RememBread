import { useNavigate } from "react-router-dom";
import SpeechBubble from "@/components/common/SpeechBubble";
import CustomButton from "@/components/common/CustomButton";
import Game from "@/components/svgs/footer/Game";
import Bread from "@/components/svgs/game/Bread";
import Baguette from "@/components/svgs/game/Baguette";
import Croissant from "@/components/svgs/game/Croissant";
import Bread2 from "@/components/svgs/game/Bread2";

const GameModePage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center px-4">
      <div className="flex w-full flex-col items-center">
        <SpeechBubble text="오늘도 열심히 해봐요!" />
        <div className="flex flex-col items-center mt-4">
          <Game className="w-36 h-36" />
        </div>
      </div>
      <div className="w-full flex flex-col max-w-[384px] mt-4">
        <CustomButton
          title="순간기억"
          description="숫자와 빵을 기억하자"
          className="bg-primary-200"
          icon={<Bread className="w-11 h-11 flex-shrink-0 ml-4" />}
          onClick={() => navigate("/games/memory")}
        />
        <CustomButton
          title="가격비교"
          description="가격이 더 비싼 빵은?"
          className="bg-primary-200"
          icon={<Baguette className="w-11 h-11 flex-shrink-0 ml-4" />}
          onClick={() => navigate("/games/compare")}
        />
        <CustomButton
          title="그림자빵"
          description="그림자로 변한 빵은?"
          className="bg-primary-200"
          icon={<Croissant className="w-11 h-11 flex-shrink-0 ml-4" />}
          onClick={() => navigate("/games/shadow")}
        />
        <CustomButton
          title="빵 탐정"
          description="무슨 빵일까?"
          className="bg-primary-200"
          icon={<Bread2 className="w-11 h-11 flex-shrink-0 ml-4" />}
          onClick={() => navigate("/games/detective")}
        />
      </div>
    </div>
  );
};

export default GameModePage; 