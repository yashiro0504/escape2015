export type EffectTargetType = 'stock' | 'sector' | 'market' | 'interest' | 'cash' | 'salary' | 'livingCost';

export interface EventEffect {
  targetType: EffectTargetType;
  targetId?: string; 
  multiplier?: number; // 주가 변동률, 월급/생활비 변동률 (1.5 = +50%)
  value?: number;      // 직접 변경 (이자율 등) 혹은 직접 증감액 (보너스 등)
}

export interface GameEvent {
  id: string;
  year?: number; // 특정 연/월 고정 이벤트용
  month?: number;
  title: string;
  description: string;
  effects: EventEffect[];
}

export const HISTORICAL_EVENTS: GameEvent[] = [
  {
    id: 'alphago_2016_03',
    year: 2016, month: 3,
    title: '알파고 쇼크: 인공지능 시대의 서막',
    description: '구글의 알파고가 이세돌 9단을 꺾었습니다. AI와 반도체 테마가 폭등합니다.',
    effects: [
      { targetType: 'sector', targetId: 'tech', multiplier: 1.25 },
      { targetType: 'stock', targetId: 'samsung', multiplier: 1.10 }
    ]
  },
  {
    id: 'samsung_note7_2016_08',
    year: 2016, month: 8,
    title: '우성전자 스마트폰 폭발 사고',
    description: '야심차게 출시한 신형 스마트폰이 비행기 등에서 잇따라 폭발하여 전량 리콜됩니다.',
    effects: [
      { targetType: 'stock', targetId: 'samsung', multiplier: 0.85 }
    ]
  },
  {
    id: 'impeachment_2017_03',
    year: 2017, month: 3,
    title: '사상 첫 대통령 탄핵 인용',
    description: '정치적 불확실성이 해소되며 외국인 자본이 유입, 코스피가 상승 랠리를 시작합니다.',
    effects: [
      { targetType: 'market', multiplier: 1.08 }
    ]
  },
  {
    id: 'crypto_boom_2017_12',
    year: 2017, month: 12,
    title: '가즈아! 가상화폐 광풍',
    description: '전 국민이 코인판에 뛰어들었습니다. "지금 안 사면 벼락거지 된다"는 포모(FOMO) 현상이 극에 달합니다.',
    effects: [
      { targetType: 'stock', targetId: 'bitcoin', multiplier: 2.50 }
    ]
  },
  {
    id: 'crypto_crash_2018_01',
    year: 2018, month: 1,
    title: '정부 "가상화폐 거래소 폐쇄 검토" (상기의 난)',
    description: '정부의 강력한 규제 시사와 함께 거품이 꺼지기 시작했습니다. 다들 한강 온도를 검색 중입니다.',
    effects: [
      { targetType: 'stock', targetId: 'bitcoin', multiplier: 0.40 }
    ]
  },
  {
    id: 'trade_war_2018_07',
    year: 2018, month: 7,
    title: '미·중 무역전쟁 발발',
    description: '미국과 중국이 서로 관세 폭탄을 투하하며 수출 주도형 한국 경제에 큰 타격을 줍니다.',
    effects: [
      { targetType: 'market', multiplier: 0.90 },
      { targetType: 'stock', targetId: 'hyundai', multiplier: 0.85 }
    ]
  },
  {
    id: 'covid19_2020_03',
    year: 2020, month: 3,
    title: 'COVID-19 팬데믹 선언',
    description: '전염병이 전 세계를 강타했습니다. 글로벌 증시가 대폭락합니다. 마스크와 손소독제 가격이 천정부지로 솟습니다.',
    effects: [
      { targetType: 'market', multiplier: 0.65 },
      { targetType: 'sector', targetId: 'auto', multiplier: 0.50 },
      { targetType: 'stock', targetId: 'bitcoin', multiplier: 0.50 },
      { targetType: 'sector', targetId: 'bio', multiplier: 1.50 }, // 코로나 수혜
      { targetType: 'interest', value: 0.02 }, // 제로금리
      { targetType: 'livingCost', multiplier: 1.20 } // 물가 상승 시작
    ]
  },
  {
    id: 'liquidity_party_2020_08',
    year: 2020, month: 8,
    title: '유동성 파티와 동학개미운동',
    description: '정부가 돈을 쏟아붓고 빚투(빚내서 투자)가 성행합니다. 개인 투자자들이 증시를 떠받치며 V자 반등이 시작됩니다.',
    effects: [
      { targetType: 'market', multiplier: 1.30 },
      { targetType: 'sector', targetId: 'tech', multiplier: 1.40 },
      { targetType: 'stock', targetId: 'kakao', multiplier: 1.60 },
      { targetType: 'stock', targetId: 'tesla', multiplier: 2.20 }
    ]
  },
  {
    id: 'tesla_sp500_2020_12',
    year: 2020, month: 12,
    title: '테슬람 S&P 500 편입',
    description: '전기차 대장주가 드디어 주류 시장에 편입되었습니다. 주가가 미친듯이 솟구칩니다.',
    effects: [
      { targetType: 'stock', targetId: 'tesla', multiplier: 1.60 }
    ]
  },
  {
    id: 'inflation_2022_01',
    year: 2022, month: 1,
    title: '인플레이션의 역습, 금리 인상 사이클 시작',
    description: '풀려난 돈이 물가 폭등을 불렀습니다. 중앙은행이 금리를 무섭게 올리며 거품이 붕괴합니다. 대출 이자와 생활비가 끔찍하게 오릅니다.',
    effects: [
      { targetType: 'market', multiplier: 0.85 },
      { targetType: 'stock', targetId: 'kakao', multiplier: 0.70 },
      { targetType: 'stock', targetId: 'bitcoin', multiplier: 0.60 },
      { targetType: 'interest', value: 0.07 },
      { targetType: 'livingCost', multiplier: 1.50 } // 인플레이션
    ]
  },
  {
    id: 'luna_crash_2022_05',
    year: 2022, month: 5,
    title: '루나 코인 99.9% 폭락 사태',
    description: '안전하다고 믿었던 한국산 코인이 하루아침에 휴지조각이 되며 코인 시장 전체에 빙하기가 찾아옵니다.',
    effects: [
      { targetType: 'sector', targetId: 'crypto', multiplier: 0.30 }
    ]
  },
  {
    id: 'kakao_fire_2022_10',
    year: 2022, month: 10,
    title: '판교 데이터센터 화재 사태',
    description: '데이터센터 화재로 까똑이 먹통이 되었습니다. 전 국민이 불편을 겪으며 독점에 대한 비판이 커집니다.',
    effects: [
      { targetType: 'stock', targetId: 'kakao', multiplier: 0.75 },
      { targetType: 'interest', value: 0.09 }
    ]
  },
  {
    id: 'chatgpt_boom_2023_03',
    year: 2023, month: 3,
    title: 'ChatGPT 열풍, AI 르네상스',
    description: '생성형 AI가 세상을 바꿀 것이라는 기대감에 기술주가 다시 한번 미친듯이 솟구칩니다.',
    effects: [
      { targetType: 'sector', targetId: 'tech', multiplier: 1.40 },
      { targetType: 'stock', targetId: 'samsung', multiplier: 1.20 }
    ]
  },
  {
    id: 'bitcoin_etf_2024_01',
    year: 2024, month: 1,
    title: '비트코인 현물 ETF 미국 승인',
    description: '제도권 편입! 비트코인이 드디어 합법적인 자산으로 인정받으며 거대한 자금이 유입됩니다.',
    effects: [
      { targetType: 'stock', targetId: 'bitcoin', multiplier: 1.80 }
    ]
  }
];

export const RANDOM_EVENTS: GameEvent[] = [
  {
    id: 'bonus_1',
    title: '회사 특별 상여금 지급!',
    description: '열심히 일한 당신, 회사에서 깜짝 성과급을 지급했습니다.',
    effects: [{ targetType: 'cash', value: 2000000 }] // 200만원 보너스
  },
  {
    id: 'scam_1',
    title: '보이스피싱 피해',
    description: '검사를 사칭한 전화에 속아 통장에서 돈이 빠져나갔습니다. 스트레스가 극에 달합니다.',
    effects: [{ targetType: 'cash', value: -3000000 }] // 300만원 손실
  },
  {
    id: 'salary_up',
    title: '연봉 인상 확정',
    description: '뛰어난 업무 성과를 인정받아 이번 달부터 월급이 인상됩니다.',
    effects: [{ targetType: 'salary', multiplier: 1.1 }] // 월급 10% 인상
  },
  {
    id: 'bio_breakthrough',
    title: '국내 제약사, 난치병 신약 임상 3상 성공 루머',
    description: '온라인 커뮤니티를 중심으로 셀파이온의 신약이 엄청난 효과를 보였다는 소문이 돕니다.',
    effects: [{ targetType: 'stock', targetId: 'celltrion', multiplier: 1.5 }]
  },
  {
    id: 'auto_strike',
    title: '횬다이차 강성 노조, 전면 파업 선언',
    description: '임금 인상을 요구하며 생산 라인이 완전히 멈췄습니다. 수출에 차질이 예상됩니다.',
    effects: [{ targetType: 'stock', targetId: 'hyundai', multiplier: 0.8 }]
  },
  {
    id: 'game_success',
    title: '엔시소프트 신작 대박 행진',
    description: '출시 전 우려를 딛고 "이게임M"이 양대 마켓 매출 1위를 달성했습니다.',
    effects: [{ targetType: 'stock', targetId: 'ncsoft', multiplier: 1.3 }]
  }
];
