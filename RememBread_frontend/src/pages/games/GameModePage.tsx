import SpeechBubble from "@/components/common/SpeechBubble";
import Button from "@/components/common/Button";
import DefaultBread from "@/components/svgs/breads/DefaultBread";

const GameModePage = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center pt-14 pb-16 px-4">
      <SpeechBubble text="원하는 모드를 골라보세요!" />
      <div className="flex flex-col items-center mt-4 mb-4">
        <DefaultBread className="w-60 h-60" />
      </div>
      <div className="w-full flex flex-col gap-3 max-w-[384px]">
        <Button className="w-full h-[90px] flex-shrink-0 rounded-[30px] bg-primary-200 text-xl text-neutral-700 flex flex-col items-start justify-center px-6">
          <span className="font-bold">순간기억</span>
          <span className="text-base text-neutral-500">숫자와 빵을 기억하자</span>
        </Button>
        <Button className="w-full h-[90px] flex-shrink-0 rounded-[30px] bg-primary-200 text-xl text-neutral-700 flex flex-col items-start justify-center px-6">
          <span className="font-bold">가격비교</span>
          <span className="text-base text-neutral-500">가격이 더 비싼 빵은?</span>
        </Button>
        <Button className="w-full h-[90px] flex-shrink-0 rounded-[30px] bg-primary-200 text-xl text-neutral-700 flex flex-col items-start justify-center px-6">
          <span className="font-bold">무게계산</span>
          <span className="text-base text-neutral-500">가장 무거운 빵은 뭘까?</span>
        </Button>
        <Button className="w-full h-[90px] flex-shrink-0 rounded-[30px] bg-primary-200 text-xl text-neutral-700 flex flex-col items-start justify-center px-6">
          <span className="font-bold">빵 탐정</span>
          <span className="text-base text-neutral-500">무슨 빵일까?</span>
        </Button>
      </div>
    </div>
  );
};

export default GameModePage; 