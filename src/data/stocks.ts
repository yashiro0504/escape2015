export type Sector = 'tech' | 'bio' | 'auto' | 'finance' | 'crypto' | 'game' | 'ai' | 'entertainment' | 'energy' | 'food';

export interface Stock {
  id: string;
  name: string;
  sector: Sector;
  basePrice: number;
  volatility: number; // 0.05 ~ 0.3 (기본 월간 변동폭)
  description: string;
}

export const INITIAL_STOCKS: Stock[] = [
  // ─── TECH (IT/플랫폼) ───
  { 
    id: 'samsung', 
    name: '우성전자', 
    sector: 'tech', 
    basePrice: 26000,
    volatility: 0.04, 
    description: '대한민국 시가총액 1위. "망할 일은 없다"는 믿음으로 적금 대신 사는 주식.' 
  },
  { 
    id: 'kakao', 
    name: '까똑', 
    sector: 'tech', 
    basePrice: 23000, 
    volatility: 0.08, 
    description: '전 국민이 쓰는 메신저. 문어발식 사업 확장의 귀재. 미래가 밝아 보인다.' 
  },
  { 
    id: 'naver', 
    name: '네이놈', 
    sector: 'tech', 
    basePrice: 42000, 
    volatility: 0.06, 
    description: '검색은 네이놈, 쇼핑도 네이놈. 한국 인터넷의 지배자. 라인 메신저로 일본도 접수.' 
  },
  { 
    id: 'sk-hynix', 
    name: 'SK하이닝스', 
    sector: 'tech', 
    basePrice: 32000, 
    volatility: 0.10, 
    description: '반도체 메모리의 숨은 강자. AI 서버에 필수인 HBM을 독점 공급하는 그날이 올까?' 
  },

  // ─── AI (인공지능) ───
  { 
    id: 'openai-etf', 
    name: '오픈AI ETF', 
    sector: 'ai', 
    basePrice: 5000, 
    volatility: 0.25, 
    description: 'AI 혁명의 수혜주를 모은 ETF. ChatGPT 이후 관심이 폭증하지만 아직은 먼 미래 얘기.' 
  },
  { 
    id: 'deepmind-ai', 
    name: '딥러닝로보', 
    sector: 'ai', 
    basePrice: 3500, 
    volatility: 0.30, 
    description: '자율주행과 로봇 기술의 선두주자. 매출은 없지만 꿈은 가득한 테마주.' 
  },

  // ─── BIO (바이오/제약) ───
  { 
    id: 'celltrion', 
    name: '셀파이온', 
    sector: 'bio', 
    basePrice: 28000, 
    volatility: 0.15, 
    description: '바이오시밀러 대장주. 신약 임상 결과 뉴스 하나에 천국과 지옥을 오간다.' 
  },
  { 
    id: 'samsung-bio', 
    name: '우성바이오', 
    sector: 'bio', 
    basePrice: 120000, 
    volatility: 0.10, 
    description: '글로벌 바이오 위탁생산(CMO)의 떠오르는 강자. 코로나 백신 생산으로 대박.' 
  },

  // ─── AUTO (자동차/전기차) ───
  { 
    id: 'hyundai', 
    name: '횬다이차', 
    sector: 'auto', 
    basePrice: 160000, 
    volatility: 0.05, 
    description: '국내 자동차 시장의 지배자. 귀족 노조 파업과 환율에 민감하다.' 
  },
  { 
    id: 'tesla', 
    name: '테슬람', 
    sector: 'auto', 
    basePrice: 15000,
    volatility: 0.20, 
    description: '화성 갈끄니까~ 미국 주식의 상징이자 광기의 중심이 될 전기차.' 
  },
  { 
    id: 'kia', 
    name: '기어자동차', 
    sector: 'auto', 
    basePrice: 45000, 
    volatility: 0.06, 
    description: '만년 2등이었으나 EV6로 디자인 혁신. 2020년대에 주가가 미쳐 날뛰게 된다.' 
  },

  // ─── FINANCE (금융) ───
  { 
    id: 'kb-finance', 
    name: 'KB금융', 
    sector: 'finance', 
    basePrice: 38000, 
    volatility: 0.04, 
    description: '국민은행의 지주사. 금리가 오르면 웃고, 내리면 울고. 배당은 꼬박꼬박.' 
  },
  { 
    id: 'shinhan', 
    name: '신한지주', 
    sector: 'finance', 
    basePrice: 42000, 
    volatility: 0.03, 
    description: '안정적인 은행주의 대표. 경기에 둔감하고 배당 수익률이 높은 가치주.' 
  },

  // ─── GAME (게임/엔터) ───
  { 
    id: 'ncsoft', 
    name: '엔시소프트', 
    sector: 'game', 
    basePrice: 210000, 
    volatility: 0.07, 
    description: '"리니지 아저씨"들의 든든한 과금력. 하지만 게임의 미래는...?' 
  },
  { 
    id: 'krafton', 
    name: '크래프톤', 
    sector: 'game', 
    basePrice: 180000, 
    volatility: 0.09, 
    description: '배틀그라운드 하나로 글로벌 시장을 제패. 인도에서 국민게임 등극.' 
  },

  // ─── ENTERTAINMENT (엔터테인먼트) ───
  { 
    id: 'hybe', 
    name: 'HYPE엔터', 
    sector: 'entertainment', 
    basePrice: 8000, 
    volatility: 0.12, 
    description: '방탄보이즈의 소속사. K-POP의 세계 정복이 시작되려는 참이다.' 
  },
  { 
    id: 'jyp', 
    name: 'JYP엔터', 
    sector: 'entertainment', 
    basePrice: 5000, 
    volatility: 0.10, 
    description: '"박진영의 솔직한 노래" 그 회사. TWICE와 함께 글로벌 진출 중.' 
  },

  // ─── ENERGY (에너지/2차전지) ───
  { 
    id: 'lg-energy', 
    name: 'LG에너지', 
    sector: 'energy', 
    basePrice: 60000, 
    volatility: 0.08, 
    description: '전기차 배터리 세계 1위. 테슬람에 배터리를 납품하며 폭풍 성장 중.' 
  },
  { 
    id: 'hanwha-solar', 
    name: '한화솔라', 
    sector: 'energy', 
    basePrice: 25000, 
    volatility: 0.12, 
    description: '태양광 에너지의 꿈. 친환경 정책에 따라 운명이 결정되는 정책 테마주.' 
  },

  // ─── FOOD (식품/필수소비재) ───
  { 
    id: 'cj', 
    name: 'CJ제이', 
    sector: 'food', 
    basePrice: 85000, 
    volatility: 0.03, 
    description: '비비고 만두로 세계를 정복 중인 식품 대장. 경기가 어려워도 밥은 먹어야 한다.' 
  },

  // ─── CRYPTO (가상화폐) ───
  { 
    id: 'bitcoin', 
    name: '비트코인', 
    sector: 'crypto', 
    basePrice: 350000,
    volatility: 0.35, 
    description: '사토시 나카모토가 만든 가상화폐. "그게 돈이 됨?" 이라는 비웃음을 사고 있다.' 
  },
  { 
    id: 'ethereum', 
    name: '이더리움', 
    sector: 'crypto', 
    basePrice: 1500, 
    volatility: 0.30, 
    description: '스마트 컨트랙트의 원조. 비트코인 다음으로 큰 코인이지만 2015년엔 아무도 모른다.' 
  },
  { 
    id: 'ripple', 
    name: '리플', 
    sector: 'crypto', 
    basePrice: 200, 
    volatility: 0.25, 
    description: '은행 간 송금을 위한 코인. "리플은 10달러 간다"는 믿음을 가진 리또속들의 성지.' 
  },
  { 
    id: 'dogecoin', 
    name: '도지코인', 
    sector: 'crypto', 
    basePrice: 50, 
    volatility: 0.40, 
    description: '귀여운 시바견 얼굴이 박힌 밈코인. 테슬람 CEO 머스크의 한마디에 달나라로 간다.' 
  },
  { 
    id: 'solana', 
    name: '솔라나', 
    sector: 'crypto', 
    basePrice: 1500, 
    volatility: 0.35, 
    description: '속도가 엄청나게 빠른 이더리움 킬러. 네트워크가 가끔 멈추는 건 애교.' 
  },
  { 
    id: 'cardano', 
    name: '에이다', 
    sector: 'crypto', 
    basePrice: 100, 
    volatility: 0.20, 
    description: '수학자와 과학자들이 철저하게 검증해서 만든 코인. 개발 속도가 나무늘보급.' 
  },
  { 
    id: 'shiba', 
    name: '시바이누', 
    sector: 'crypto', 
    basePrice: 10, 
    volatility: 0.45, 
    description: '도지코인을 잡겠다며 나타난 제2의 개 코인. 가격 변동성이 그야말로 롤러코스터다.' 
  },
  { 
    id: 'pepe', 
    name: '페페코인', 
    sector: 'crypto', 
    basePrice: 5, 
    volatility: 0.50, 
    description: '인터넷 밈 개구리 페페를 딴 코인. 이딴 게 왜 오르는지 아무도 모른다. 그냥 광기.' 
  },
  { 
    id: 'luna', 
    name: '루나', 
    sector: 'crypto', 
    basePrice: 1000, 
    volatility: 0.35, 
    description: '한국인이 개발한 코인 생태계의 자존심. 하지만 치명적인 데스 스파이럴 폭탄을 안고 있다...' 
  },
  { 
    id: 'polkadot', 
    name: '폴카닷', 
    sector: 'crypto', 
    basePrice: 800, 
    volatility: 0.22, 
    description: '서로 다른 블록체인을 연결해준다는 거창한 꿈을 가진 코인.' 
  },
  { 
    id: 'chainlink', 
    name: '체인링크', 
    sector: 'crypto', 
    basePrice: 500, 
    volatility: 0.25, 
    description: '현실의 데이터를 블록체인으로 가져오는 오라클 대장주. 나름 뼈대 있는 코인.' 
  },
  { 
    id: 'eos', 
    name: '이오스', 
    sector: 'crypto', 
    basePrice: 300, 
    volatility: 0.28, 
    description: '한때 이더리움을 잡겠다고 큰소리치며 자금을 끌어모았던 과거의 영광.' 
  }
];
