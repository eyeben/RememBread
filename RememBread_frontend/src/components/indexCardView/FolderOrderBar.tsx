import FolderStructor from "@/components/indexCardView/FolderStructor";
import CardSetEditButton from "@/components/indexCardView/CardSetEditButton";

interface FolderOrderBarProps {
  isEditing: boolean;
  toggleEditing: () => void;
  onSelectFolder: (id: number) => void;
}

const FolderOrderBar = ({ isEditing, toggleEditing, onSelectFolder }: FolderOrderBarProps) => {
  return (
    <div className="flex justify-between items-center w-full px-2 h-10 gap-4">
      <FolderStructor onSelectFolder={onSelectFolder} />
      <CardSetEditButton isEditing={isEditing} onToggle={toggleEditing} />
    </div>
  );
};

export default FolderOrderBar;
