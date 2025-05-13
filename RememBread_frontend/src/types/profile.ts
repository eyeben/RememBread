export interface Character {
  id: number;
  name: string;
  imageUrl: string;
  isLocked: boolean;
}

export interface CharacterImageProps {
  characterId: number;
  characterImageUrl: string;
  className?: string;
  isGrayscale?: boolean;
}