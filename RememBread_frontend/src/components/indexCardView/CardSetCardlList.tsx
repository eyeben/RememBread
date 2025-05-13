import { useEffect, useState, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { indexCard } from "@/types/indexCard";
import { getCardsByCardSet, deleteCard } from "@/services/card";

interface CardSetCardlListProps {
  cardSetId: number;
  highlightIndex?: number;
  isReadonly: boolean;
}

const CardSetCardlList = ({
  cardSetId,
  highlightIndex = -1,
  isReadonly,
}: CardSetCardlListProps) => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<indexCard[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleCardClick = (card: indexCard) => {
    navigate(`/card-view/${cardSetId}/card`, { state: { card, fromTotalPage: true } });
  };

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
  const handleContextMenu = (e: MouseEvent<HTMLDivElement>, cardId?: number) => {
    e.preventDefault();
    if (isReadonly || !cardId) return;

    setSelectedIds((prev) => {
      const isSelected = prev.includes(cardId);
      return isSelected ? prev.filter((id) => id !== cardId) : [...prev, cardId];
    });
  };

  // 선택 삭제
  const handleDeleteSelected = async () => {
    if (isReadonly || selectedIds.length === 0) return;
    if (!window.confirm("삭제하시겠습니까?")) return;
    try {
      await Promise.all(selectedIds.map((id) => deleteCard(id)));
      setCards((prev) => prev.filter((c) => !selectedIds.includes(c.cardId)));
      setSelectedIds([]);
    } catch (e) {
      console.error("삭제 실패:", e);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="w-full px-4">
      {/* 삭제 버튼 */}
      {!isReadonly && selectedIds.length > 0 && (
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
      <div className="flex flex-col gap-2 py-2 pb-10">
        {cards.map((card, idx) => {
          const isSelected = card.cardId !== undefined && selectedIds.includes(card.cardId);
          const isHighlight = idx === highlightIndex;

          const cardStyle =
            isSelected && !isReadonly
              ? "bg-negative-500 text-white"
              : isHighlight
              ? "bg-primary-700 text-white"
              : "bg-primary-200";

          return (
            <div
              key={card.cardId ?? idx}
              onContextMenu={(e) => handleContextMenu(e, card.cardId)}
              onClick={() => handleCardClick(card)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full w-full text-sm font-medium hover:cursor-pointer pc:h-10 h-8 ${cardStyle}`}
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

export default CardSetCardlList;
