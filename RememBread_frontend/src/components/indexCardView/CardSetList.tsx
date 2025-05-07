import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { indexCardSet } from "@/types/indexCard";
import { getCardSetList } from "@/services/cardSet";
import Button from "@/components/common/Button";
import CardSet from "@/components/svgs/indexCardView/CardSet";
import ConfirmDeleteModal from "@/components/indexCardView/ConfirmDeleteModal";

const CardSetList = () => {
  const navigate = useNavigate();

  const [cardSetList, setcardSetList] = useState<indexCardSet[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCardSetList({
          folderId: 3,
          page: 0,
          size: 12,
          sort: "최신순",
        });
        setcardSetList(response.result.cardSets);
      } catch (error) {
        console.error("카드셋 목록 불러오기 실패:", error);
      }
    };
    fetchData();
  }, []);

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

  const handleCardClick = (cardSetId: number) => {
    if (isEditing) {
      toggleItem(cardSetId);
    } else {
      const selectedCard = cardSetList.find((item) => item.cardSetId === cardSetId);
      navigate(`/card-view/${cardSetId}`, {
        state: { card: selectedCard },
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-2">
      <div className="flex justify-between items-center w-full px-4">
        {isEditing ? (
          <Button
            className="w-1/10"
            variant="negative-outline"
            onClick={() => setShowDeleteModal(true)}
          >
            이동
          </Button>
        ) : (
          <Button
            className="w-1/10 invisible opacity-0 pointer-events-none"
            variant="negative-outline"
          >
            이동
          </Button>
        )}

        <Button
          className="w-1/2 hover:bg-primary-100"
          variant="primary-outline"
          onClick={toggleEditing}
        >
          {isEditing ? "편집 완료" : "편집하기"}
        </Button>

        {isEditing ? (
          <Button
            className="w-1/10"
            variant="negative-outline"
            onClick={() => setShowDeleteModal(true)}
          >
            삭제
          </Button>
        ) : (
          <Button
            className="w-1/10 invisible opacity-0 pointer-events-none"
            variant="negative-outline"
          >
            삭제
          </Button>
        )}
      </div>

      <div className="grid grid-cols-3 pc:grid-cols-4 gap-2 pc:gap-3 w-full mt-2">
        {cardSetList.map((item) => (
          <div key={item.cardSetId} className="relative hover:cursor-pointer">
            <div className="absolute top-2 right-5 z-10">
              <Star
                fill={item.isLike ? "#FDE407" : "none"}
                className="text-yellow-300 hover:cursor-pointer pc:size-6 size-4"
              />
            </div>

            <div
              onClick={() => handleCardClick(item.cardSetId)}
              className={`rounded-md box-border border-2 p-1 h-32 flex flex-col justify-between items-center
                ${isEditing ? "cursor-pointer" : ""}
                ${
                  selectedItems.includes(item.cardSetId)
                    ? "border-primary-700 bg-primary-100"
                    : "border-transparent"
                }
              `}
            >
              <CardSet className="w-full h-full hover:cursor-pointer" />
              <div className="text-center w-full mt-1">
                <span className="block pc:text-xl text-sm truncate overflow-hidden whitespace-nowrap">
                  {item.title}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showDeleteModal && (
        <ConfirmDeleteModal
          open={showDeleteModal}
          message="정말 삭제하시겠습니까?"
          onConfirm={() => setShowDeleteModal(false)}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default CardSetList;
