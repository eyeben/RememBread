import SpeechBubble from "@/components/common/SpeechBubble";
import CustomButton from "@/components/common/CustomButton";
import Game from "@/components/svgs/footer/Game";
import { useNavigate } from "react-router-dom";

const GameModePage = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center pt-14 pb-16 px-4">
      <SpeechBubble text="오늘도 열심히 해봐요!" />
      <div className="flex flex-col items-center mt-4 mb-4">
        <Game className="w-36 h-36" />
      </div>
      <div className="w-full flex flex-col gap-3 max-w-[384px]">
        <CustomButton
          title="순간기억"
          description="숫자와 빵을 기억하자"
          variant="primary"
          icon={<Game className="w-11 h-11 flex-shrink-0 ml-4" />}
          onClick={() => navigate("/games/memory")}
        />
        <CustomButton
          icon={<Game className="w-11 h-11 flex-shrink-0 ml-4" />}
          title="가격비교"
          description="가격이 더 비싼 빵은?"
          variant="primary"
        />
        <CustomButton
          icon={<Game className="w-11 h-11 flex-shrink-0 ml-4" />}
          title="무게계산"
          description="가장 무거운 빵은 뭘까?"
          variant="primary"
        />
        <CustomButton
          icon={<Game className="w-11 h-11 flex-shrink-0 ml-4" />}
          title="빵 탐정"
          description="무슨 빵일까?"
          variant="primary"
        />
      </div>
    </div>
  );
};

export default GameModePage; 