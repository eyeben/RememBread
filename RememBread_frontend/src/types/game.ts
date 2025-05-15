export interface Bread {
    name: string;
    price: number;
    type: string;
  }
  
export interface LeaderboardType {
    nickname: string;
    rank: number;
    maxScore: number;
    playedAt: string;
    profileImage: string;
  }

export interface GameHistoryType {
  gameName: string;
  score: number;
  createdAt: string;
}