import { useLocation } from "react-router-dom";
import TagRow from "@/components/indexCardView/TagRow";

const CardDetailPage = () => {
  const location = useLocation();
  const { id } = location.state;
  const { tags = [] } = location.state || {};

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h1 className="text-2xl font-semibold mb-4">카드 상세 보기</h1>
      <p className="text-gray-600">현재 선택한 카드 ID: {id}</p>
      <TagRow tags={tags} />

      <div className="mt-10 space-y-4 w-60">
        <button className="w-full border border-yellow-400 text-yellow-600 py-2 rounded-full">
          학습하기
        </button>
        <button className="w-full border border-yellow-400 text-yellow-600 py-2 rounded-full">
          TTS 학습하기
        </button>
        <button className="w-full border border-yellow-400 text-yellow-600 py-2 rounded-full">
          테스트하기
        </button>
      </div>
    </div>
  );
};

export default CardDetailPage;
