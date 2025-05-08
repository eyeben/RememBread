import { useEffect, useState } from "react";
import { indexCard } from "@/types/indexCard";
import { getCardsByCardSet } from "@/services/card";

interface CardDetailListProps {
  cardSetId: number;
  highlightIndex?: number;
}

const CardDetailList = ({ cardSetId, highlightIndex = -1 }: CardDetailListProps) => {
  const [cards, setCards] = useState<indexCard[]>([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await getCardsByCardSet(cardSetId, 0, 100, "asc");
        setCards(response.result.cards);
      } catch (error) {
        console.error("카드 목록을 불러오는 중 오류 발생:", error);
      }
    };

    fetchCards();
  }, [cardSetId]);

  return (
    <div className="flex flex-col items-center w-full gap-2 p-4">
      {cards.map((card, index) => (
        <div
          key={card.id ?? index}
          className={`flex items-center gap-2 px-4 py-2 rounded-full w-full text-sm font-medium hover:cursor-pointer
            ${index === highlightIndex ? "bg-primary-700 text-white" : "bg-primary-200"}`}
        >
          <span className="font-bold w-12 truncate overflow-hidden whitespace-nowrap">
            {card.concept}
          </span>
          <span className="flex-1 font-bold truncate overflow-hidden whitespace-nowrap">
            {card.description}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CardDetailList;
