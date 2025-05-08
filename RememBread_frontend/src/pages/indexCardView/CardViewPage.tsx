import { useState } from "react";
import { useLocation } from "react-router-dom";
import CardViewHeader from "@/components/indexCardView/CardViewHeader";
import CardSetList from "@/components/indexCardView/CardSetList";
import FolderOrderBar from "@/components/indexCardView/FolderOrderBar";
import IndexCardSearchBar from "@/components/indexCardView/IndexCardSearchBar";

const IndexCardViewPage = () => {
  const location = useLocation();
  const isMyPage = location.pathname.includes("/my");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="px-3 py-2 pt-2 flex flex-col gap-3">
      <CardViewHeader />
      <IndexCardSearchBar />
      <FolderOrderBar
        isEditing={isEditing}
        toggleEditing={toggleEditing}
        onSelectFolder={(id: number) => setSelectedFolderId(id)}
      />
      <CardSetList
        isEditing={isEditing}
        folderId={selectedFolderId ?? 0}
        toggleEditing={toggleEditing}
      />
    </div>
  );
};

export default IndexCardViewPage;
