export interface TutorialPage {
  title: string;
  subTitle: string;
  media: string; // image or video path
  description: string;
}

export const tutorialPages: TutorialPage[] = [
  // {
  //   title: "0. 인덱스카드란?",
  //   subTitle: "인덱스카드란?",
  //   media: "/src/assets/카드생성.png",
  //   description: "인덱스카드는 나만의 카드로\n반복 학습을 도와주는 도구입니다.",
  // },
  {
    title: "1. 인덱스카드 생성하기",
    subTitle: "1. 인덱스카드 생성하기",
    media: "/src/assets/카드생성.png",
    description: "원하는 방식으로 카드를 만들어보세요!",
  },
  {
    title: "2. 인덱스카드로 학습 시작하기",
    subTitle: "2. 인덱스카드로 학습 시작하기",
    media: "/src/assets/카드생성.png",
    description: "원하는 방식으로 카드를 만들고 반복 학습을 시작하세요.",
  },
  {
    title: "2. 인덱스카드로 학습 시작하기",
    subTitle: "2-1. 카드 가져오기",
    media: "/src/assets/카드생성.png",
    description: "다른 친구가 만든 카드를 가져올 수도 있어요!",
  },
  {
    title: "3. 학습 지도",
    subTitle: "인덱스카드란?",
    media: "/src/assets/학습지도.png",
    description: "학습 지도를 통해 나의 학습 빵길을 확인할 수 있어요.",
  },
  {
    title: "3. 학습 지도",
    subTitle: "알람설정",
    media: "/src/assets/알람설정.png",
    description: "학습 알람을 설정하여 원하는 위치에서 알람을 받을 수 있어요.",
  },
  {
    title: "4. 두뇌 게임",
    subTitle: "인덱스카드란?",
    media: "/src/assets/두뇌게임.png",
    description: "공부하기 지쳤나요? 게임으로 머리를 말랑말랑하게 해보세요!",
  },
  {
    title: "5. 프로필",
    subTitle: "인덱스카드란?",
    media: "/src/assets/프로필.png",
    description: "나의 프로필을 설정하고 학습기록을 확인해보세요.",
  },
  {
    title: "5. 프로필",
    subTitle: "인덱스카드란?",
    media: "/src/assets/캐릭터선택.png",
    description: " 쉿 비밀인데 캐릭터가 6종이나 있다는 사실!",
  },
  {
    title: "4. 뇌가 말랑해지는 두뇌 게임",
    subTitle: "인덱스카드란?",
    media: "/videos/tutorial2.mp4",
    description: "공부하기 지쳤나요?\n게임으로 머리를 말랑말랑하게 해보세요.",
  },
  // ... 생략
];
