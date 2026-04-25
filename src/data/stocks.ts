export type Sector = 'tech' | 'bio' | 'auto' | 'finance' | 'crypto' | 'game';

export interface Stock {
  id: string;
  name: string;
  sector: Sector;
  basePrice: number;
  volatility: number; // 0.05 ~ 0.3 (기본 월간 변동폭)
  description: string;
}

export const INITIAL_STOCKS: Stock[] = [
  { 
    id: 'samsung', 
    name: '우성전자', 
    sector: 'tech', 
    basePrice: 26000, // 2015년 말 액면분할 환산가 부근
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
    id: 'celltrion', 
    name: '셀파이온', 
    sector: 'bio', 
    basePrice: 28000, 
    volatility: 0.15, 
    description: '바이오시밀러 대장주. 신약 임상 결과 뉴스 하나에 천국과 지옥을 오간다.' 
  },
  { 
    id: 'hyundai', 
    name: '횬다이차', 
    sector: 'auto', 
    basePrice: 160000, 
    volatility: 0.05, 
    description: '국내 자동차 시장의 지배자. 귀족 노조 파업과 환율에 민감하다.' 
  },
  { 
    id: 'ncsoft', 
    name: '엔시소프트', 
    sector: 'game', 
    basePrice: 210000, 
    volatility: 0.07, 
    description: '"리니지 아저씨"들의 든든한 과금력. 하지만 게임의 미래는...?' 
  },
  { 
    id: 'tesla', 
    name: '테슬람', 
    sector: 'auto', 
    basePrice: 15000, // 2015년 액면분할 전/후 감안한 가상 시작가
    volatility: 0.20, 
    description: '화성 갈끄니까~ 미국 주식의 상징이자 광기의 중심이 될 전기차.' 
  },
  { 
    id: 'bitcoin', 
    name: '비트코인', 
    sector: 'crypto', 
    basePrice: 350000, // 2015년 10월 쯤 가격 (약 30~40만원)
    volatility: 0.35, 
    description: '사토시 나카모토가 만든 가상화폐. "그게 돈이 됨?" 이라는 비웃음을 사고 있다.' 
  }
];
