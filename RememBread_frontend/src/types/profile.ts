export interface Character {
  id: number;
  name: string;
  imageUrl: string;
  isLocked: boolean;
  description: string;
}

export interface CharacterImageProps {
  characterId: number;
  characterImageUrl: string;
  className?: string;
  isGrayscale?: boolean;
}

export interface StudyHistoryDay {
  day: string;
  totalCorrect: number;
  totalSolved: number;
}

export interface StudyHistoryMonth {
  month: number;
  totalCorrect: number;
  totalSolved: number;
  days: StudyHistoryDay[];
}

export interface StudyHistoryYear {
  year: number;
  totalCorrect: number;
  totalSolved: number;
  months: StudyHistoryMonth[];
}