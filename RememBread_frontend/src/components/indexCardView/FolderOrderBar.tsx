import FolderStructor from "@/components/indexCardView/FolderStructor";
import CardSetEditButton from "@/components/indexCardView/CardSetEditButton";

interface FolderOrderBarProps {
  isEditing: boolean;
  toggleEditing: () => void;
  onSelectFolder: (id: number) => void;
}

const FolderOrderBar = ({ isEditing, toggleEditing, onSelectFolder }: FolderOrderBarProps) => {
  return (
    <div className="flex justify-between items-center w-full pl-2 h-10 gap-4">
      <div className="flex-1 min-w-0">
        <FolderStructor onSelectFolder={onSelectFolder} />
      </div>
      <CardSetEditButton isEditing={isEditing} onToggle={toggleEditing} />
    </div>
  );
};

export default FolderOrderBar;
