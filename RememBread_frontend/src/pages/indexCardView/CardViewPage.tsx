import { useState } from "react";
import CardSetList from "@/components/indexCardView/CardSetList";
import FolderOrderBar from "@/components/indexCardView/FolderOrderBar";
import IndexCardSearchBar from "@/components/indexCardView/IndexCardSearchBar";

const IndexCardViewPage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="px-3 py-2 pt-2 flex flex-col gap-3">
      <IndexCardSearchBar />
      <FolderOrderBar isEditing={isEditing} toggleEditing={toggleEditing} />
      <CardSetList isEditing={isEditing} toggleEditing={toggleEditing} />
    </div>
  );
};

export default IndexCardViewPage;
