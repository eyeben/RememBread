import FolderStructor from "@/components/indexCardView/FolderStructor";
import CardSetEditButton from "@/components/indexCardView/CardSetEditButton";

interface FolderOrderBarProps {
  isEditing: boolean;
  toggleEditing: () => void;
}

const FolderOrderBar = ({ isEditing, toggleEditing }: FolderOrderBarProps) => {
  return (
    <div className="flex justify-between items-center w-full px-3 h-10">
      <FolderStructor />
      <CardSetEditButton isEditing={isEditing} onToggle={toggleEditing} />
    </div>
  );
};

export default FolderOrderBar;
