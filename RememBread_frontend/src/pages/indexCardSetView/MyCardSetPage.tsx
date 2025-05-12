import { useState, Dispatch, SetStateAction } from "react";
import { indexCardSet } from "@/types/indexCard";
import FolderOrderBar from "@/components/indexCardView/FolderOrderBar";
import CardSetSearchBar from "@/components/indexCardView/CardSetSearchBar";
import MyCardSetList from "@/components/indexCardView/MyCardSetList";

interface MyCardSetPageProps {
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  selectedItems: number[];
  setSelectedItems: Dispatch<SetStateAction<number[]>>;
  isDragging: boolean;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
  showDeleteModal: boolean;
  setShowDeleteModal: Dispatch<SetStateAction<boolean>>;
  cardSetList: indexCardSet[];
  setCardSetList: Dispatch<SetStateAction<indexCardSet[]>>;
}

const MyCardSetPage = ({
  isEditing,
  setIsEditing,
  selectedItems,
  setSelectedItems,
  isDragging,
  setIsDragging,
  showDeleteModal,
  setShowDeleteModal,
  cardSetList,
  setCardSetList,
}: MyCardSetPageProps) => {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [query, setQuery] = useState<string>("");
  const [sortType, setSortType] = useState<"latest" | "popularity" | "fork">("latest");

  const toggleEditing = () => setIsEditing((prev) => !prev);

  return (
    <div className="px-3 py-2 pt-2 flex flex-col gap-3">
      <CardSetSearchBar
        query={query}
        setQuery={setQuery}
        sortType={sortType}
        setSortType={setSortType}
      />
      <FolderOrderBar
        isEditing={isEditing}
        toggleEditing={toggleEditing}
        onSelectFolder={(id: number) => setSelectedFolderId(id)}
      />
      <MyCardSetList
        isEditing={isEditing}
        folderId={selectedFolderId ?? 0}
        query={query}
        sortType={sortType}
        toggleEditing={toggleEditing}
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
  );
};

export default MyCardSetPage;
