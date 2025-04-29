import { useState } from "react";
import { Star } from "lucide-react";
import CardSet from "@/components/svgs/indexCardView/CardSet";

const BreadList = () => {
  const breads = Array.from({ length: 25 }, (_, i) => i + 1);
  const ITEMS_PER_PAGE = 12;
  const [page, setPage] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const currentItems = breads.slice(page * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE + ITEMS_PER_PAGE);

  const toggleItem = (id: number) => {
    if (!isEditing) return;
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
    setSelectedItems([]);
  };

  return (
    <div className="flex flex-col items-center w-full px-2">
      <button
        onClick={toggleEditing}
        className="mt-2 text-neutral-400 text-sm underline hover:text-neutral-600 transition"
      >
        {isEditing ? "편집 완료" : "편집하기"}
      </button>

      <div className="grid grid-cols-3 pc:grid-cols-4 gap-2 pc:gap-4 w-full mt-2">
        {currentItems.map((item) => (
          <div key={item} className="relative">
            {/* 별 아이콘 */}
            <div className="absolute top-2 right-2 z-10">
              <Star
                fill="#FDE407"
                className="text-yellow-300 hover:cursor-pointer pc:size-8 size-5"
              />
            </div>

            {/* 카드 콘텐츠 (그림+제목+테두리) */}
            <div
              onClick={() => toggleItem(item)}
              className={`rounded-md box-border border-2 p-1 h-32 flex flex-col justify-between items-center
                ${isEditing ? "cursor-pointer" : ""}
                ${selectedItems.includes(item) ? "border-primary-700" : "border-transparent"}
              `}
            >
              <CardSet className="w-full h-full" />
              <div className="text-center w-full mt-1">
                <span className="pc:text-xl text-sm">정보처리기사 </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BreadList;
