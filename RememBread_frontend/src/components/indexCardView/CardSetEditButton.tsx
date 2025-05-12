interface CardSetEditTabsProps {
  isEditing: boolean;
  onToggle: () => void;
}

const CardSetEditTabs = ({ isEditing, onToggle }: CardSetEditTabsProps) => {
  return (
    <button
      onClick={onToggle}
      className="h-8 bg-primary-500 text-white text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 border rounded-md flex items-center justify-center text-center hover:text-white"
    >
      {isEditing ? "편집" : "보기"}
    </button>
  );
};

export default CardSetEditTabs;
