export interface Character {
  id: number;
  name: string;
  isLocked: boolean;
}

export interface ImageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (characterId: number) => void;
  currentCharacterId: number;
} 