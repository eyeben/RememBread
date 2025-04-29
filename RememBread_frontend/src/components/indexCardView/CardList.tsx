import { useState } from "react";
import { Star } from "lucide-react";
import CardSet from "@/components/svgs/indexCardView/CardSet";

const BreadList = () => {
  const breads = Array.from({ length: 25 }, (_, i) => i + 1);
  const ITEMS_PER_PAGE = 12;
  const [page, setPage] = useState<number>(0);

  const currentItems = breads.slice(page * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE + ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col items-center w-full px-4">
      {/* 빵 리스트 */}
      <div className="flex flex-wrap w-full justify-between gap-4 pc:gap-8">
        {currentItems.map((_, idx) => (
          <div key={idx} className="relative w-[28%] pc:w-1/5">
            <div className="absolute right-2 h-auto ">
              <Star
                fill="#FDE407"
                className=" text-yellow-300 hover:cursor-pointer pc:size-8 size-5"
              />
            </div>
            <CardSet className="w-full h-30" />
            <div className="w-full h-auto text-center">
              <span className="pc:text-xl text-sm">정보처리기사</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BreadList;
