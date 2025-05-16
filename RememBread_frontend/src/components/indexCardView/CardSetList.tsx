import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import CardSet2 from "@/components/svgs/indexCardView/CardSet2";
import ViewForkCnt from "@/components/indexCardView/ViewForkCnt";
import {
  getCardSetList,
  searchCardSet,
  searchMyCardSet,
  postLikeCardSet,
  deleteLikeCardSet,
} from "@/services/cardSet";
import { indexCardSet } from "@/types/indexCard";

interface CardSetListProps {
  isMyCardSet: boolean;
  folderId: number;
  query: string;
  sortType: "latest" | "popularity" | "fork";
  setNickname: (nickname: string) => void;
  setSelectedCardSetId: (id: number) => void;
}

const sortMap: Record<"latest" | "popularity" | "fork", "최신순" | "인기순" | "포크순"> = {
  latest: "최신순",
  popularity: "인기순",
  fork: "포크순",
};

const CardSetList = ({
  isMyCardSet,
  folderId,
  query,
  sortType,
  setNickname,
  setSelectedCardSetId,
}: CardSetListProps) => {
  const [cardSetList, setCardSetList] = useState<indexCardSet[]>([]);

  const fetchBySearch = async () => {
    const res = await searchMyCardSet({
      query,
      page: 0,
      size: 48,
      cardSetSortType: sortMap[sortType],
    });

    const filtered =
      folderId !== 0
        ? res.result.cardSets.filter((c) => c.folderId === folderId)
        : res.result.cardSets;

    setCardSetList(filtered);
  };

  const fetchByFolder = async () => {
    const res = await getCardSetList({
      folderId,
      page: 0,
      size: 48,
      sort: sortMap[sortType],
    });

    setCardSetList(res.result.cardSets);
  };

  const fetchCardSets = async () => {
    try {
      if (isMyCardSet) {
        if (folderId === 0 || query.trim()) {
          await fetchBySearch();
        } else {
          await fetchByFolder();
        }
      } else {
        const res = await searchCardSet({
          query,
          page: 0,
          size: 96,
          cardSetSortType: sortMap[sortType],
        });

        setCardSetList(res.result.cardSets);
      }
    } catch (e) {
      console.error("카드셋 조회 실패:", e);
    }
  };

  const handleToggleLike = async (cardSetId: number) => {
    try {
      const targetCard = cardSetList.find((item) => item.cardSetId === cardSetId);
      if (!targetCard) return;

      if (targetCard.isLike) {
        await deleteLikeCardSet(cardSetId);
      } else {
        await postLikeCardSet(cardSetId);
      }

      setCardSetList((prev) =>
        prev.map((item) =>
          item.cardSetId === cardSetId ? { ...item, isLike: !item.isLike } : item,
        ),
      );
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
    }
  };

  useEffect(() => {
    fetchCardSets();
  }, [isMyCardSet, folderId, query, sortType]);

  return (
    <div className="flex flex-col items-center w-full px-5 mb-5">
      {cardSetList.length === 0 ? (
        <div className="w-full text-center text-neutral-500">카드셋이 없습니다.</div>
      ) : (
        <div className="grid grid-cols-3 pc:grid-cols-4 gap-2 pc:gap-3 w-full">
          {cardSetList.map((item) => (
            <div
              key={item.cardSetId}
              className="relative"
              onClick={() => {
                if (item.nickname !== undefined) {
                  setNickname(item.nickname);
                }
                setSelectedCardSetId(item.cardSetId);
              }}
            >
              <div className="absolute top-2 right-2 z-10">
                {isMyCardSet ? (
                  <Star
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLike(item.cardSetId);
                    }}
                    fill={item.isLike ? "#FDE407" : "none"}
                    className="text-yellow-300 hover:cursor-pointer pc:size-6 size-4"
                  />
                ) : null}
              </div>

              <div
                className={
                  "rounded-md box-border border-2 p-1 pc:h-48 h-36 flex flex-col justify-between items-center"
                }
              >
                <CardSet2 className="w-full h-full hover:cursor-pointer" />
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
  );
};

export default CardSetList;
