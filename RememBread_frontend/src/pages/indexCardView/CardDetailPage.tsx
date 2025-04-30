import { useLocation } from "react-router-dom";
import TagRow from "@/components/indexCardView/TagRow";

const CardDetailPage = () => {
  const location = useLocation();
  const { card } = location.state;

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="flex justify-between items-center gap-12">
        <p className="w-[160px] text-sm text-neutral-500"></p>
        <h1 className="text-2xl font-semibold mb-4">카드 상세 보기</h1>
        <p className="w-[160px] text-sm text-neutral-500">현재 선택한 카드 ID: {card.cardSetId}</p>
      </div>
      <TagRow tags={card.hashTags} />

      <div className="pc:mt-24 mt-12 space-y-12 w-1/2">
        <button className="w-full border-2 border-primary-600 text-primary-600 py-2 font-semibold rounded-full hover:bg-primary-600 hover:text-white">
          학습하기
        </button>
        <button className="w-full border-2 border-primary-600 text-primary-600 py-2 font-semibold rounded-full hover:bg-primary-600 hover:text-white">
          TTS 학습하기
        </button>
        <button className="w-full border-2 border-primary-600 text-primary-600 py-2 font-semibold rounded-full hover:bg-primary-600 hover:text-white">
          테스트하기
        </button>
      </div>
    </div>
  );
};

export default CardDetailPage;
