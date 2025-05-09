import { useState } from "react";
import CardViewHeader from "@/components/indexCardView/CardViewHeader";
import MyCardSetList from "@/components/indexCardView/MyCardSetList";
import FolderOrderBar from "@/components/indexCardView/FolderOrderBar";
import CardSetSearchBar from "@/components/indexCardView/CardSetSearchBar";

const MyCardSetPage = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [query, setQuery] = useState<string>("");
  const [sortType, setSortType] = useState<"latest" | "popularity" | "fork">("latest");

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
      />
    </div>
  );
};

export default MyCardSetPage;
