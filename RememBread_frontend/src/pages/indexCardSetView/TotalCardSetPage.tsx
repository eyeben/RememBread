import { useEffect, useState } from "react";
import { getCardSetList, searchCardSet } from "@/services/cardSet";
import { indexCardSet } from "@/types/indexCard";
import CardViewHeader from "@/components/indexCardView/CardViewHeader";
import TotalCardSetList from "@/components/indexCardView/TotalCardSetList";
import CardSetSearchBar from "@/components/indexCardView/CardSetSearchBar";

const TotalCardSetPage = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [sortType, setSortType] = useState<"latest" | "popularity" | "fork">("latest");
  const [cardSetList, setCardSetList] = useState<indexCardSet[]>([]);

  useEffect(() => {
    const fetchCardSets = async () => {
      try {
        const sortMap: Record<"latest" | "popularity" | "fork", "최신순" | "인기순" | "포크순"> = {
          latest: "최신순",
          popularity: "인기순",
          fork: "포크순",
        };

        const sortValue = sortMap[sortType];

        if (query.trim()) {
          const params = {
            query,
            page: 0,
            size: 12,
            cardSetSortType: sortValue,
          };
          console.log("🔍 searchCardSet params:", params);

          const res = await searchCardSet(params);
          setCardSetList(res.result.cardSets);
        } else {
          const params = {
            page: 0,
            size: 12,
            sort: sortValue,
          };
          console.log("📁 getCardSetList params:", params);

          const res = await getCardSetList(params);
          setCardSetList(res.result.cardSets);
        }
      } catch (e) {
        console.error("카드셋 조회 실패:", e);
      }
    };

    fetchCardSets();
  }, [query, sortType]);

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="px-3 py-2 pt-2 flex flex-col gap-3">
      <CardViewHeader />
      <CardSetSearchBar
        query={query}
        setQuery={setQuery}
        sortType={sortType}
        setSortType={setSortType}
      />
      <TotalCardSetList
        isEditing={isEditing}
        query={query}
        sortType={sortType}
        toggleEditing={toggleEditing}
        cardSets={cardSetList}
      />
    </div>
  );
};

export default TotalCardSetPage;
