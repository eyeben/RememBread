import TestTypeInput from "@/components/indexCardView/TestTypeInput";
import TestCountInput from "@/components/indexCardView/TestCountInput";

const CardTestPage = () => {
  return (
    <div className="flex flex-col items-center justify-center px-16 py-4 gap-8">
      <h2 className="text-primary-700 font-bold text-2xl mb-8">테스트를 세팅해주세요!</h2>

      <div className="flex flex-col justify-between items-center w-full gap-8">
        <TestTypeInput />
        <TestCountInput />
      </div>

      <button className="mt-8 w-full bg-primary-700 hover:bg-primary-700 text-white font-semibold py-2 px-8 rounded-md">
        테스트 시작
      </button>
    </div>
  );
};

export default CardTestPage;
