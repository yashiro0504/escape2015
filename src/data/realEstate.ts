export interface RealEstate {
  id: string;
  name: string;
  deposit: number;
  monthlyRent: number;
  description: string;
  stressRelief: number; // 매달 감소하는 스트레스 수치
  purchasePrice: number; // 매매가 (0이면 매매 불가)
  livingCost: number; // 해당 주거지 거주 시 기본 생활비
}

export const REAL_ESTATE_OPTIONS: RealEstate[] = [
  {
    id: 'gosiwon',
    name: '신림동 고시원',
    deposit: 0,
    monthlyRent: 250000,
    description: '창문 없는 방. 밥과 김치는 무료. 숨이 턱턱 막힌다.',
    stressRelief: 0,
    purchasePrice: 0,
    livingCost: 300000
  },
  {
    id: 'one-room-300-30',
    name: '평범한 원룸',
    deposit: 3000000,
    monthlyRent: 300000,
    description: '반지하를 겨우 면한 원룸. 채광은 별로지만 나만의 공간이다.',
    stressRelief: 2,
    purchasePrice: 100000000,
    livingCost: 500000
  },
  {
    id: 'one-room-high',
    name: '역세권 오피스텔',
    deposit: 10000000,
    monthlyRent: 600000,
    description: '강남역 도보 5분. 깔끔한 빌트인 가구와 통창이 매력적이다.',
    stressRelief: 5,
    purchasePrice: 300000000,
    livingCost: 800000
  },
  {
    id: 'apartment-small',
    name: '20평형 오래된 아파트',
    deposit: 50000000,
    monthlyRent: 1200000,
    description: '녹물이 조금 나오지만 넓다. 이제야 좀 사람 사는 것 같다.',
    stressRelief: 10,
    purchasePrice: 800000000,
    livingCost: 1500000
  },
  {
    id: 'penthouse',
    name: '한남동 펜트하우스',
    deposit: 500000000,
    monthlyRent: 5000000,
    description: '한강이 한눈에 보이는 최고의 입지. 성공의 냄새가 난다.',
    stressRelief: 25,
    purchasePrice: 3000000000,
    livingCost: 5000000
  }
];
