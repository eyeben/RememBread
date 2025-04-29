export interface indexCard {
  concept: string;
  description: string;
}

export interface indexCardSet {
  folderId: bigint;
  hashTags: string[];
  breads: indexCard[];
}
