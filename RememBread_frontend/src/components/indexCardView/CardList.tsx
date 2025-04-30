import { useState } from "react";
import { Star } from "lucide-react";
import Button from "@/components/common/Button";
import CardSet from "@/components/svgs/indexCardView/CardSet";
import ConfirmDeleteModal from "@/components/indexCardView/ConfirmDeleteModal";

const BreadList = () => {
  const breads = Array.from({ length: 25 }, (_, i) => i + 1);
  const ITEMS_PER_PAGE = 12;
  const [page, setPage] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const currentItems = breads.slice(page * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE + ITEMS_PER_PAGE);

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
        {currentItems.map((item) => (
          <div key={item} className="relative">
            {/* 별 아이콘 */}
            <div className="absolute top-2 right-5 z-10">
              <Star
                fill="#FDE407"
                className="text-yellow-300 hover:cursor-pointer pc:size-6 size-4"
              />
            </div>

            <div
              onClick={() => toggleItem(item)}
              className={`rounded-md box-border border-2 p-1 h-32 flex flex-col justify-between items-center
                ${isEditing ? "cursor-pointer" : ""}
                ${
                  selectedItems.includes(item)
                    ? "border-primary-700 bg-primary-100"
                    : "border-transparent"
                }
              `}
            >
              <CardSet className="w-full h-full" />
              <div className="text-center w-full mt-1">
                <span className="pc:text-xl text-sm">정보처리기사 </span>
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
