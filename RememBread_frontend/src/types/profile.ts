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

export interface StudyHistoryDay {
  day: string;
  total_correct: number;
  total_solved: number;
}

export interface StudyHistoryMonth {
  month: number;
  total_correct: number;
  total_solved: number;
  days: StudyHistoryDay[];
}

export interface StudyHistoryYear {
  year: number;
  total_correct: number;
  total_solved: number;
  months: StudyHistoryMonth[];
}