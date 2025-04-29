import { useState } from "react";
import { Star } from "lucide-react";
import CardSet from "@/components/svgs/indexCardView/CardSet";

const BreadList = () => {
  const breads = Array.from({ length: 20 }, (_, i) => i + 1); // 예시 데이터
  const ITEMS_PER_PAGE = 9; // 한 페이지당 최대 9개
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(breads.length / ITEMS_PER_PAGE);

  const currentItems = breads.slice(page * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE + ITEMS_PER_PAGE);

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  return (
    <div className="flex flex-col items-center w-full px-4">
      {/* 빵 리스트 */}
      <div className="grid grid-cols-3 w-full gap-4 pc:gap-8">
        {currentItems.map((_, idx) => (
          <div key={idx} className="relative w-full h-40">
            <div className="w-full h-auto">
              <Star className="text-primary-700 hover:cursor-pointer pc:size-8 size-5" />
            </div>
            <CardSet className="w-full h-30" />
            <div className="w-full h-auto text-center">
              <span className="pc:text-xl text-sm">정보처리기사</span>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지 넘기기 버튼 */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={handlePrev}
          disabled={page === 0}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          이전
        </button>
        <button
          onClick={handleNext}
          disabled={page === totalPages - 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default BreadList;
