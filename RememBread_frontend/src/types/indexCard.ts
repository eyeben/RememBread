export interface indexCard {
  concept: string;
  description: string;
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
  viewCnt?: number;
  forkCnt?: number;
  isLike: boolean;
  totalCardCnt: number;
  hashTags: string[];
  createdDate?: string | Date;
  updatedDate?: string | Date;
}
