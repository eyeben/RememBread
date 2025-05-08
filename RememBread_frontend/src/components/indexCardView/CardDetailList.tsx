import React, { useEffect, useState } from "react";
import { indexCard } from "@/types/indexCard";
import { getCardsByCardSet, deleteCard } from "@/services/card";

interface CardDetailListProps {
  cardSetId: number;
  highlightIndex?: number;
}

const CardDetailList: React.FC<CardDetailListProps> = ({ cardSetId, highlightIndex = -1 }) => {
  const [cards, setCards] = useState<indexCard[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // 카드 목록 로드
  useEffect(() => {
    (async () => {
      try {
        const res = await getCardsByCardSet(cardSetId, 0, 100, "asc");
        setCards(res.result.cards);
      } catch (e) {
        console.error("카드 불러오기 실패:", e);
      }
    })();
  }, [cardSetId]);

  // 우클릭으로 선택 토글
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>, cardId?: number) => {
    e.preventDefault();
    console.log("오른쪽 클릭된 카드 ID:", cardId);
    if (!cardId) return;
    setSelectedIds((prev) => {
      const isSelected = prev.includes(cardId);
      return isSelected ? prev.filter((id) => id !== cardId) : [...prev, cardId];
    });
  };

  // 선택 삭제
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm("삭제하시겠습니까?")) return;
    try {
      await Promise.all(selectedIds.map((id) => deleteCard(id)));
      setCards((prev) => prev.filter((c) => !selectedIds.includes(c.id!)));
      setSelectedIds([]);
    } catch (e) {
      console.error("삭제 실패:", e);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="w-full px-4">
      {/* 삭제 버튼 (선택된 카드가 있을 때만) */}
      {selectedIds.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            className="px-3 py-1 bg-negative-500 text-white rounded"
            onClick={handleDeleteSelected}
          >
            삭제하기 ({selectedIds.length})
          </button>
        </div>
      )}

      {/* 카드 리스트 */}
      <div className="flex flex-col gap-2">
        {cards.map((card, idx) => {
          const isSelected = card.id !== undefined && selectedIds.includes(card.id);
          return (
            <div
              key={card.id ?? idx}
              onContextMenu={(e) => handleContextMenu(e, card.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full w-full text-sm font-medium hover:cursor-pointer
                ${
                  isSelected
                    ? "bg-negative-500 text-white"
                    : idx === highlightIndex
                    ? "bg-primary-700 text-white"
                    : "bg-primary-200"
                }
              `}
            >
              <span className="font-bold w-12 truncate whitespace-nowrap">{card.concept}</span>
              <span className="flex-1 font-bold truncate whitespace-nowrap">
                {card.description}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CardDetailList;
