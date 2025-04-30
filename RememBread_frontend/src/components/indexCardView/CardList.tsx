import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { indexCardSet } from "@/types/indexCard";
import Button from "@/components/common/Button";
import CardSet from "@/components/svgs/indexCardView/CardSet";
import ConfirmDeleteModal from "@/components/indexCardView/ConfirmDeleteModal";

const BreadList = () => {
  const navigate = useNavigate();

  const breadList: indexCardSet[] = Array.from({ length: 25 }, (_, i) => ({
    folderId: i + 1,
    title: `SQLD ${i + 1}`,
    isFavorite: false,
    hashTags: ["정보처리기사", "실기", i % 2 === 0 ? "네트워크" : "운영체제"],
    breads: [],
  }));
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

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

  const handleCardClick = (folderId: number) => {
    if (isEditing) {
      toggleItem(folderId);
    } else {
      const selectedCard = breadList.find((item) => item.folderId === folderId);
      navigate(`/card-view/${folderId}`, {
        state: { id: selectedCard?.folderId, tags: selectedCard?.hashTags ?? [] },
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

      <div className="grid grid-cols-3 pc:grid-cols-4 gap-2 pc:gap-4 w-full mt-2">
        {breadList.map((item) => (
          <div key={item.folderId.toString()} className="relative hover:cursor-pointer ">
            <div className="absolute top-2 right-5 z-10">
              <Star
                fill={item.isFavorite ? "#FDE407" : "none"}
                className="text-yellow-300 hover:cursor-pointer pc:size-6 size-4"
              />
            </div>

            <div
              onClick={() => handleCardClick(item.folderId)}
              className={`rounded-md box-border border-2 p-1 h-32 flex flex-col justify-between items-center
                  ${isEditing ? "cursor-pointer" : ""}
                  ${
                    selectedItems.includes(item.folderId)
                      ? "border-primary-700 bg-primary-100"
                      : "border-transparent"
                  }
                `}
            >
              <CardSet className="w-full h-full hover:cursor-pointer" />
              <div className="text-center w-full mt-1">
                <span className="pc:text-xl text-sm">{item.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showDeleteModal && (
        <ConfirmDeleteModal
          open={showDeleteModal}
          message="정말 삭제하시겠습니까?"
          onConfirm={() => {
            setShowDeleteModal(false);
          }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default BreadList;
