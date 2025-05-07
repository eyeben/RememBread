export interface indexCard {
  id: number;
  cardSetId: number;
  number: number;
  concept: string;
  description: string;
  correctCount?: number;
  solvedCount?: number;
  retentionRate?: number;
  stability?: number;
  lastCorrectAt?: string | Date;
  conceptImageUrl?: string;
  descriptionImageUrl?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface indexCardSet {
  cardSetId: number;
  userId?: number;
  folderId?: number;
  lastViewCardId?: number;
  title: string;
  correctCardCnt?: number;
  solvedCardCnt?: number;
  isPublic?: number;
  viewCount?: number;
  forkCount?: number;
  isLike?: boolean;
  totalCardCnt?: number;
  hashTags?: string[];
  createdDate?: string | Date;
  updatedDate?: string | Date;
}
