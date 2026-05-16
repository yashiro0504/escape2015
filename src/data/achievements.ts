export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji
  isHidden?: boolean; // 숨겨진 업적인지 여부 (달성 전에는 '???'로 표시)
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_blood",
    title: "개미의 첫걸음",
    description: "주식을 처음으로 매수했습니다. 이제 당신도 주주입니다.",
    icon: "🐜",
  },
  {
    id: "first_salary",
    title: "노동의 쓴맛",
    description: "첫 월급을 받았습니다. 하지만 통장을 스쳐 지나갈 뿐...",
    icon: "💸",
  },
  {
    id: "max_loan",
    title: "영끌족",
    description: "대출 5,000만 원 돌파. 이자는 감당할 수 있겠죠?",
    icon: "💳",
  },
  {
    id: "realestate_owner",
    title: "내 집 마련의 꿈",
    description: "자가 소유의 부동산을 마련했습니다!",
    icon: "🏠",
  },
  {
    id: "toto_winner",
    title: "도박의 쾌감",
    description: "배트맨에서 처음으로 배당금을 따냈습니다.",
    icon: "🎰",
  },
  {
    id: "max_stress",
    title: "번아웃",
    description: "스트레스가 100%에 도달했습니다. 병원비가 나갑니다...",
    icon: "🤯",
    isHidden: true,
  },
  {
    id: "quit_job",
    title: "사직서 제출",
    description: "회사를 때려치우고 백수가 되었습니다.",
    icon: "🚶",
  },
  {
    id: "game_clear",
    title: "흙수저 탈출",
    description: "총 자산 2억 원을 달성하고 게임을 클리어했습니다!",
    icon: "👑",
  },
];
