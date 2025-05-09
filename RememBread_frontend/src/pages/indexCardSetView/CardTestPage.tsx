import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TestTypeInput from "@/components/indexCardView/TestTypeInput";
import TestCountInput from "@/components/indexCardView/TestCountInput";

const CardTestPage = () => {
  const navigate = useNavigate();
  const [testType, setTestType] = useState<string>("blank");
  const [testCount, setTestCount] = useState<number>(5);
  const { indexCardId } = useParams(); // URL 파라미터로부터 받아옴

  const handleStartTest = () => {
    if (testType === "blank" && indexCardId) {
      navigate(`/card-view/${indexCardId}/test/blank`);
    } else if (testType === "concept" && indexCardId) {
      navigate(`/card-view/${indexCardId}/test/concept`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-16 py-4 gap-8">
      <h2 className="text-primary-700 font-bold text-2xl mb-8">테스트를 세팅해주세요!</h2>

      <div className="flex flex-col justify-between items-center w-full gap-8">
        <TestTypeInput value={testType} onChange={setTestType} />
        <TestCountInput value={testCount} onChange={setTestCount} />
      </div>

      <button
        onClick={handleStartTest}
        className="mt-8 w-full bg-primary-700 hover:bg-primary-700 text-white font-semibold py-2 px-8 rounded-md"
      >
        테스트 시작
      </button>
    </div>
  );
};

export default CardTestPage;
