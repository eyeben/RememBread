import Button from "@/components/common/Button";

interface CardSetEditButtonProps {
  isEditing: boolean;
  onToggle: () => void;
}

const CardSetEditButton = ({ isEditing, onToggle }: CardSetEditButtonProps) => {
  return (
    <Button className="w-1/2 hover:bg-primary-100" variant="primary-outline" onClick={onToggle}>
      {isEditing ? "편집 완료" : "편집하기"}
    </Button>
  );
};

export default CardSetEditButton;
