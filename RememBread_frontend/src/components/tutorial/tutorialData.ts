export interface TutorialPage {
  title: string;
  subTitle: string;
  media: string; // image or video path
  description: string;
}

export const tutorialPages: TutorialPage[] = [
  {
    title: "0. 인덱스카드란?",
    subTitle: "인덱스카드란?",
    media: "/images/tutorial1.png",
    description: "인덱스카드는 나만의 카드로\n반복 학습을 도와주는 도구입니다.",
  },
  {
    title: "1. 인덱스카드 생성하기",
    subTitle: "1. 인덱스카드 생성하기",
    media: "/images/tutorial1.png",
    description: "원하는 방식으로 카드를 만들고 반복 학습을 시작하세요.",
  },
  {
    title: "2. 인덱스카드로 학습 시작하기",
    subTitle: "2. 인덱스카드로 학습 시작하기",
    media: "/images/tutorial1.png",
    description: "원하는 방식으로 카드를 만들고 반복 학습을 시작하세요.",
  },
  {
    title: "2. 인덱스카드로 학습 시작하기",
    subTitle: "2-1. 카드 가져오기",
    media: "/images/tutorial1.png",
    description: "다른 친구가 만든 카드를 가져올 수도 있어요!",
  },
  {
    title: "3. 위치 기반 학습 기록",
    subTitle: "인덱스카드란?",
    media: "/videos/tutorial2.mp4",
    description: "지도에서 나의 학습 빵길을 확인해보세요!.",
  },
  {
    title: "4. 뇌가 말랑해지는 두뇌 게임",
    subTitle: "인덱스카드란?",
    media: "/videos/tutorial2.mp4",
    description: "공부하기 지쳤나요?\n게임으로 머리를 말랑말랑하게 해보세요.",
  },
  // ... 생략
];
