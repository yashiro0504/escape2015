export interface StartingBackground {
  id: string;
  name: string;
  description: string;
  initialCash: number;
  initialJobId: string;
  unlockCondition: string; // 'none', 'clear_1', 'play_3', 'achievement:toto_winner' 등
  perkDescription: string;
}

export const STARTING_BACKGROUNDS: StartingBackground[] = [
  {
    id: 'default',
    name: '기본 흙수저',
    description: '가진 것은 몸뚱이 하나뿐인 평범한 청년입니다.',
    initialCash: 7000000,
    initialJobId: 'startup-intern',
    unlockCondition: 'none',
    perkDescription: '특별한 보너스가 없습니다.',
  },
  {
    id: 'golden_spoon',
    name: '금수저 낙하산',
    description: '아버지의 회사에서 대리로 시작합니다. 시작부터 자본의 격차가 다릅니다.',
    initialCash: 50000000,
    initialJobId: 'mid-company',
    unlockCondition: 'clear_1', // 1회 이상 클리어
    perkDescription: '초기 자본 5,000만 원 및 대리 월급 시작.',
  },
  {
    id: 'fulltime_investor',
    name: '전업투자자',
    description: '직장을 포기하고 주식과 코인에 모든 것을 걸었습니다.',
    initialCash: 15000000,
    initialJobId: 'unemployed',
    unlockCondition: 'play_3', // 3회 이상 플레이
    perkDescription: '월급은 없지만, 매월 고급 찌라시(루머) 1개를 확정적으로 입수합니다.',
  },
  {
    id: 'gambler',
    name: '타짜',
    description: '합법적인 도박과 한탕주의에 미쳐있는 인생입니다.',
    initialCash: 30000000,
    initialJobId: 'unemployed',
    unlockCondition: 'achievement:toto_winner', // 토토 승리 업적 보유
    perkDescription: '매월 로또 1등에 당첨될 확률을 올려주는 신비한 기운을 받습니다.',
  }
];
