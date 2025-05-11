import { useEffect, useState } from "react";
import { searchCardSet } from "@/services/cardSet";
import { indexCardSet } from "@/types/indexCard";
import { Toaster } from "@/components/ui/toaster";
import CardViewHeader from "@/components/indexCardView/CardViewHeader";
import TotalCardSetList from "@/components/indexCardView/TotalCardSetList";
import CardSetSearchBar from "@/components/indexCardView/CardSetSearchBar";

const TotalCardSetPage = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [sortType, setSortType] = useState<"latest" | "popularity" | "fork">("latest");
  const [cardSetList, setCardSetList] = useState<indexCardSet[] | undefined>(undefined);

  useEffect(() => {
    const fetchCardSets = async () => {
      try {
        const sortMap: Record<"latest" | "popularity" | "fork", "최신순" | "인기순" | "포크순"> = {
          latest: "최신순",
          popularity: "인기순",
          fork: "포크순",
        };

        const params = {
          query,
          page: 0,
          size: 12,
          cardSetSortType: sortMap[sortType],
        };

        const res = await searchCardSet(params);
        setCardSetList(res.result.cardSets);
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
      <Toaster />
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
