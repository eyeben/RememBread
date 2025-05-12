import { useEffect, DragEvent, Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { indexCardSet } from "@/types/indexCard";
import {
  getCardSetList,
  deleteCardSet,
  searchMyCardSet,
  postLikeCardSet,
  deleteLikeCardSet,
} from "@/services/cardSet";
import ViewForkCnt from "@/components/indexCardView/ViewForkCnt";
import CardSet2 from "@/components/svgs/indexCardView/CardSet2";
import ConfirmDeleteModal from "@/components/indexCardView/ConfirmDeleteModal";

interface MyCardSetListProps {
  isEditing: boolean;
  folderId: number;
  query: string;
  sortType: "latest" | "popularity" | "fork";
  toggleEditing: () => void;
  selectedItems: number[];
  setSelectedItems: Dispatch<SetStateAction<number[]>>;
  isDragging: boolean;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
  showDeleteModal: boolean;
  setShowDeleteModal: Dispatch<SetStateAction<boolean>>;
  cardSetList: indexCardSet[];
  setCardSetList: Dispatch<SetStateAction<indexCardSet[]>>;
}

const MyCardSetList = ({
  isEditing,
  folderId,
  query,
  sortType,
  selectedItems,
  setSelectedItems,
  setIsDragging,
  setShowDeleteModal,
  cardSetList,
  setCardSetList,
}: MyCardSetListProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEditing) {
      setSelectedItems([]);
    }
  }, [isEditing]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sortMap: Record<"latest" | "popularity" | "fork", "최신순" | "인기순" | "포크순"> = {
          latest: "최신순",
          popularity: "인기순",
          fork: "포크순",
        };

        if (folderId === 0 || query.trim()) {
          const res = await searchMyCardSet({
            query,
            page: 0,
            size: 12,
            cardSetSortType: sortMap[sortType],
          });

          const filtered =
            folderId !== 0
              ? res.result.cardSets.filter((c) => c.folderId === folderId)
              : res.result.cardSets;

          setCardSetList(filtered);
        } else {
          const res = await getCardSetList({
            folderId,
            page: 0,
            size: 12,
            sort: sortMap[sortType],
          });
          setCardSetList(res.result.cardSets);
        }
      } catch (error) {
        console.error("카드셋 목록 조회 실패:", error);
      }
    };

    fetchData();
  }, [folderId, query, sortType]);

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
      const selectedCard = cardSetList.find((item) => item.cardSetId === cardSetId);
      navigate(`/card-view/${cardSetId}`, { state: { card: selectedCard } });
    }
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, cardSetId: number) => {
    if (!selectedItems.includes(cardSetId)) {
      e.preventDefault();
      return;
    }
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await Promise.all(selectedItems.map((id) => deleteCardSet(id)));
      setCardSetList((prev) => prev.filter((c) => !selectedItems.includes(c.cardSetId)));
      setSelectedItems([]);
    } catch (error) {
      console.error("삭제 에러:", error);
    } finally {
      setShowDeleteModal(false);
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

  return (
    <>
      <div className="flex flex-col items-center w-full px-2">
        <div className="grid grid-cols-3 pc:grid-cols-4 gap-2 pc:gap-3 w-full mt-2">
          {cardSetList.map((item) => (
            <div key={item.cardSetId} className="relative">
              <div className="absolute top-2 right-2 z-10">
                <Star
                  onClick={() => handleToggleLike(item.cardSetId)}
                  fill={item.isLike ? "#FDE407" : "none"}
                  className="text-yellow-300 hover:cursor-pointer pc:size-6 size-4"
                />
              </div>

              <div
                draggable={isEditing && selectedItems.includes(item.cardSetId)}
                onDragStart={(e) => handleDragStart(e, item.cardSetId)}
                onDragEnd={handleDragEnd}
                onClick={() => handleCardClick(item.cardSetId)}
                className={`
                  rounded-md box-border border-2 p-1 pc:h-48 h-36 flex flex-col justify-between items-center
                  ${isEditing ? "cursor-pointer" : ""}
                  ${
                    selectedItems.includes(item.cardSetId)
                      ? "border-primary-700 bg-primary-100"
                      : "border-transparent"
                  }
                `}
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
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmDeleteModal
        open={false} // 외부에서 열림 제어
        message="선택한 카드셋을 삭제하시겠습니까?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
};

export default MyCardSetList;
