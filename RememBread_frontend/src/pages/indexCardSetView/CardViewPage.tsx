import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteCardSet } from "@/services/cardSet";
import MyCardSetPage from "@/pages/indexCardSetView/MyCardSetPage";
import TotalCardSetPage from "@/pages/indexCardSetView/TotalCardSetPage";
import { Toaster } from "@/components/ui/toaster";
import CardViewHeader from "@/components/indexCardView/CardViewHeader";
import ConfirmDeleteModal from "@/components/indexCardView/ConfirmDeleteModal";
import { indexCardSet } from "@/types/indexCard";

const CardViewPage = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [cardSetList, setCardSetList] = useState<indexCardSet[]>([]);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleDropZoneDrop = () => {
    setIsDragging(false);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await Promise.all(selectedItems.map((id) => deleteCardSet(id)));
      setCardSetList((prev) => prev.filter((card) => !selectedItems.includes(card.cardSetId)));
      setSelectedItems([]);
    } catch (err) {
      console.error("삭제 실패:", err);
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen overflow-hidden relative">
      <Toaster />
      <CardViewHeader selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      <div className="relative flex-1 overflow-hidden">
        <div
          className="flex w-[200%] h-full transition-transform duration-300"
          style={{ transform: `translateX(-${selectedTab * 50}%)` }}
        >
          <div className="w-1/2 shrink-0 overflow-y-auto">
            <MyCardSetPage
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              showDeleteModal={showDeleteModal}
              setShowDeleteModal={setShowDeleteModal}
              cardSetList={cardSetList}
              setCardSetList={setCardSetList}
            />
          </div>
          <div className="w-1/2 shrink-0 overflow-y-auto">
            <TotalCardSetPage />
          </div>
        </div>
      </div>

      {selectedTab === 0 && isEditing && selectedItems.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 flex justify-center items-center z-50">
          {isMobile ? (
            <button
              className="w-14 h-14 rounded-full flex items-center justify-center bg-gray-200/90 shadow-md"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 size={28} />
            </button>
          ) : (
            isDragging && (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDropZoneDrop}
                className="w-14 h-14 rounded-full flex items-center justify-center bg-gray-200/90 shadow-md"
              >
                <Trash2 size={28} />
              </div>
            )
          )}
        </div>
      )}

      <ConfirmDeleteModal
        open={showDeleteModal}
        message="선택한 카드셋을 삭제하시겠습니까?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default CardViewPage;
