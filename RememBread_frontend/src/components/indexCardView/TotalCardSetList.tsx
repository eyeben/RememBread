import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { indexCardSet } from "@/types/indexCard";
import ViewForkCnt from "@/components/indexCardView/ViewForkCnt";
import CardSet from "@/components/svgs/indexCardView/CardSet";

interface CardSetListProps {
  isEditing: boolean;
  query: string;
  sortType: "latest" | "popularity" | "fork";
  toggleEditing: () => void;
  cardSets: indexCardSet[] | undefined;
}

const TotalCardSetList = ({ isEditing, cardSets }: CardSetListProps) => {
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  if (cardSets === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-lg">로딩 중...</p>
        </div>
      </div>
    );
  }

  const toggleItem = (cardSetId: number) => {
    if (!isEditing) return;
    setSelectedItems((prev) =>
      prev.includes(cardSetId) ? prev.filter((id) => id !== cardSetId) : [...prev, cardSetId],
    );
  };

  const handleCardClick = (cardSetId: number) => {
    if (isEditing) {
      toggleItem(cardSetId);
    } else {
      const selectedCard = cardSets.find((item) => item.cardSetId === cardSetId);
      navigate(`/card-view/${cardSetId}`, { state: { card: selectedCard } });
    }
  };

  return (
    <>
      {/* 카드 그리드 */}
      <div className="flex flex-col items-center w-full px-2">
        {(cardSets?.length ?? 0) === 0 ? (
          <div className="w-full text-center text-neutral-500 py-10">카드셋이 없습니다.</div>
        ) : (
          <div className="grid grid-cols-3 pc:grid-cols-4 gap-2 pc:gap-3 w-full mt-2">
            {cardSets.map((item) => (
              <div key={item.cardSetId} className="relative">
                <div className="absolute top-2 right-2 z-10">
                  <Star
                    fill={item.isLike ? "#FDE407" : "none"}
                    className="text-yellow-300 hover:cursor-pointer pc:size-6 size-4"
                  />
                </div>

                <div
                  onClick={() => handleCardClick(item.cardSetId)}
                  className={`
                    rounded-md box-border border-2 p-1 h-48 flex flex-col justify-between items-center
                    ${isEditing ? "cursor-pointer" : ""}
                    ${
                      selectedItems.includes(item.cardSetId)
                        ? "border-primary-700 bg-primary-100"
                        : "border-transparent"
                    }
                  `}
                >
                  <CardSet className="w-full h-full hover:cursor-pointer" />
                  <div className="text-center w-full">
                    <span className="block pc:text-xl text-sm truncate overflow-hidden whitespace-nowrap hover:cursor-pointer">
                      {item.name || "제목 없음"}
                    </span>
                    <div className="flex justify-end items-center w-full gap-2">
                      <ViewForkCnt viewCount={item.viewCount} forkCount={item.forkCount} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TotalCardSetList;
