export interface indexCard {
  concept: string;
  description: string;
}

export interface indexCardSet {
  folderId: number;
  title: string;
  hashTags: string[];
  isFavorite: boolean;
  breads: indexCard[];
}
