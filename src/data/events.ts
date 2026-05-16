export type EffectTargetType = 'stock' | 'sector' | 'market' | 'interest' | 'cash' | 'salary' | 'livingCost' | 'lotto_buff' | 'realestate_scam' | 'stress';

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
      { targetType: 'sector', targetId: 'ai', multiplier: 1.80 },
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
    id: 'bts_billboard_2017_10',
    year: 2017, month: 10,
    title: '방탄보이즈, 빌보드 앨범차트 1위!',
    description: 'K-POP 역사상 최초로 빌보드 200 1위를 달성했습니다. 엔터 산업의 새 역사가 열립니다.',
    effects: [
      { targetType: 'sector', targetId: 'entertainment', multiplier: 1.50 },
      { targetType: 'stock', targetId: 'hybe', multiplier: 1.80 }
    ]
  },
  {
    id: 'crypto_boom_2017_12',
    year: 2017, month: 12,
    title: '가즈아! 가상화폐 광풍',
    description: '전 국민이 코인판에 뛰어들었습니다. "지금 안 사면 벼락거지 된다"는 포모(FOMO) 현상이 극에 달합니다.',
    effects: [
      { targetType: 'stock', targetId: 'bitcoin', multiplier: 2.50 },
      { targetType: 'stock', targetId: 'ethereum', multiplier: 3.00 }
    ]
  },
  {
    id: 'crypto_crash_2018_01',
    year: 2018, month: 1,
    title: '정부 "가상화폐 거래소 폐쇄 검토" (상기의 난)',
    description: '정부의 강력한 규제 시사와 함께 거품이 꺼지기 시작했습니다. 다들 한강 온도를 검색 중입니다.',
    effects: [
      { targetType: 'stock', targetId: 'bitcoin', multiplier: 0.40 },
      { targetType: 'stock', targetId: 'ethereum', multiplier: 0.35 }
    ]
  },
  {
    id: 'trade_war_2018_07',
    year: 2018, month: 7,
    title: '미·중 무역전쟁 발발',
    description: '미국과 중국이 서로 관세 폭탄을 투하하며 수출 주도형 한국 경제에 큰 타격을 줍니다.',
    effects: [
      { targetType: 'market', multiplier: 0.90 },
      { targetType: 'stock', targetId: 'hyundai', multiplier: 0.85 },
      { targetType: 'sector', targetId: 'tech', multiplier: 0.90 }
    ]
  },
  {
    id: 'pubg_global_2018_12',
    year: 2018, month: 12,
    title: '배틀그라운드 모바일, 글로벌 10억 다운로드',
    description: '크래프톤의 PUBG 모바일이 인도를 중심으로 세계적 인기를 끌고 있습니다.',
    effects: [
      { targetType: 'stock', targetId: 'krafton', multiplier: 1.40 },
      { targetType: 'sector', targetId: 'game', multiplier: 1.15 }
    ]
  },
  {
    id: 'ev_subsidy_2019_06',
    year: 2019, month: 6,
    title: '전기차 보조금 확대, 배터리 산업 부상',
    description: '정부가 전기차 보조금을 대폭 확대하며 2차전지 관련주가 급등합니다.',
    effects: [
      { targetType: 'sector', targetId: 'energy', multiplier: 1.30 },
      { targetType: 'stock', targetId: 'lg-energy', multiplier: 1.40 },
      { targetType: 'sector', targetId: 'auto', multiplier: 1.10 }
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
      { targetType: 'sector', targetId: 'entertainment', multiplier: 0.60 },
      { targetType: 'stock', targetId: 'bitcoin', multiplier: 0.50 },
      { targetType: 'sector', targetId: 'bio', multiplier: 1.50 },
      { targetType: 'sector', targetId: 'food', multiplier: 1.20 },
      { targetType: 'interest', value: 0.02 },
      { targetType: 'livingCost', multiplier: 1.20 }
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
      { targetType: 'stock', targetId: 'tesla', multiplier: 2.20 },
      { targetType: 'sector', targetId: 'energy', multiplier: 1.50 }
    ]
  },
  {
    id: 'tesla_sp500_2020_12',
    year: 2020, month: 12,
    title: '테슬람 S&P 500 편입',
    description: '전기차 대장주가 드디어 주류 시장에 편입되었습니다. 주가가 미친듯이 솟구칩니다.',
    effects: [
      { targetType: 'stock', targetId: 'tesla', multiplier: 1.60 },
      { targetType: 'sector', targetId: 'energy', multiplier: 1.20 }
    ]
  },
  {
    id: 'kpop_nft_2021_06',
    year: 2021, month: 6,
    title: 'K-POP NFT 열풍, 엔터주 급등',
    description: '아이돌 포토카드를 NFT로 만들어 팔겠다는 계획에 엔터 관련주가 폭등합니다.',
    effects: [
      { targetType: 'sector', targetId: 'entertainment', multiplier: 1.40 },
      { targetType: 'stock', targetId: 'hybe', multiplier: 1.30 }
    ]
  },
  {
    id: 'inflation_2022_01',
    year: 2022, month: 1,
    title: '인플레이션의 역습, 금리 인상 사이클 시작',
    description: '풀려난 돈이 물가 폭등을 불렀습니다. 중앙은행이 금리를 무섭게 올리며 거품이 붕괴합니다.',
    effects: [
      { targetType: 'market', multiplier: 0.85 },
      { targetType: 'stock', targetId: 'kakao', multiplier: 0.70 },
      { targetType: 'stock', targetId: 'bitcoin', multiplier: 0.60 },
      { targetType: 'sector', targetId: 'finance', multiplier: 1.20 },
      { targetType: 'interest', value: 0.07 },
      { targetType: 'livingCost', multiplier: 1.50 }
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
      { targetType: 'stock', targetId: 'naver', multiplier: 1.10 },
      { targetType: 'interest', value: 0.09 }
    ]
  },
  {
    id: 'chatgpt_boom_2023_03',
    year: 2023, month: 3,
    title: 'ChatGPT 열풍, AI 르네상스',
    description: '생성형 AI가 세상을 바꿀 것이라는 기대감에 AI 관련주와 반도체주가 미친듯이 솟구칩니다.',
    effects: [
      { targetType: 'sector', targetId: 'ai', multiplier: 2.50 },
      { targetType: 'sector', targetId: 'tech', multiplier: 1.30 },
      { targetType: 'stock', targetId: 'sk-hynix', multiplier: 1.50 },
      { targetType: 'stock', targetId: 'samsung', multiplier: 1.15 }
    ]
  },
  {
    id: 'hbm_boom_2023_08',
    year: 2023, month: 8,
    title: 'AI 반도체 전쟁: HBM이 미래다',
    description: 'AI 학습에 필수적인 고대역폭 메모리(HBM)를 독점 공급하는 SK하이닝스의 주가가 급등합니다.',
    effects: [
      { targetType: 'stock', targetId: 'sk-hynix', multiplier: 1.60 },
      { targetType: 'sector', targetId: 'ai', multiplier: 1.30 }
    ]
  },
  {
    id: 'bitcoin_etf_2024_01',
    year: 2024, month: 1,
    title: '비트코인 현물 ETF 미국 승인',
    description: '제도권 편입! 비트코인이 드디어 합법적인 자산으로 인정받으며 거대한 자금이 유입됩니다.',
    effects: [
      { targetType: 'stock', targetId: 'bitcoin', multiplier: 1.80 },
      { targetType: 'stock', targetId: 'ethereum', multiplier: 1.50 }
    ]
  },
  {
    id: 'nvidia_bubble_2024_06',
    year: 2024, month: 6,
    title: 'AI 거품론 확산, "이미 다 반영됐다"',
    description: '너무 빠르게 오른 AI주에 대한 경계심이 커지며 차익 실현 매물이 쏟아집니다.',
    effects: [
      { targetType: 'sector', targetId: 'ai', multiplier: 0.65 },
      { targetType: 'sector', targetId: 'tech', multiplier: 0.90 }
    ]
  },
  {
    id: 'rate_cut_2024_09',
    year: 2024, month: 9,
    title: '미국 기준금리 인하 시작',
    description: '드디어 금리 인하가 시작되었습니다. 성장주와 부동산이 다시 기지개를 켭니다.',
    effects: [
      { targetType: 'market', multiplier: 1.10 },
      { targetType: 'interest', value: 0.045 },
      { targetType: 'sector', targetId: 'finance', multiplier: 0.90 }
    ]
  },
  {
    id: 'trump_tariff_2025_04',
    year: 2025, month: 4,
    title: '트럼프 관세 폭탄, 글로벌 공급망 충격',
    description: '미국이 전방위 관세를 때리며 수출 기업들이 직격탄을 맞습니다. 환율이 급등하고 증시가 출렁입니다.',
    effects: [
      { targetType: 'market', multiplier: 0.85 },
      { targetType: 'sector', targetId: 'auto', multiplier: 0.80 },
      { targetType: 'sector', targetId: 'tech', multiplier: 0.85 },
      { targetType: 'livingCost', multiplier: 1.10 }
    ]
  }
];

export const RANDOM_EVENTS: GameEvent[] = [
  {
    id: 'bonus_1',
    title: '회사 특별 상여금 지급!',
    description: '열심히 일한 당신, 회사에서 깜짝 성과급을 지급했습니다.',
    effects: [{ targetType: 'cash', value: 2000000 }]
  },
  {
    id: 'scam_1',
    title: '보이스피싱 피해',
    description: '검사를 사칭한 전화에 속아 통장에서 돈이 빠져나갔습니다. 스트레스가 극에 달합니다.',
    effects: [{ targetType: 'cash', value: -3000000 }]
  },
  {
    id: 'salary_up',
    title: '연봉 인상 확정',
    description: '뛰어난 업무 성과를 인정받아 이번 달부터 월급이 인상됩니다.',
    effects: [{ targetType: 'salary', multiplier: 1.1 }]
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
  },
  {
    id: 'ai_startup_hype',
    title: 'AI 스타트업 투자 열풍',
    description: '"ChatGPT 같은 걸 만들겠다"는 스타트업들에 벤처 자금이 쏟아집니다. AI 관련주가 동반 상승합니다.',
    effects: [
      { targetType: 'sector', targetId: 'ai', multiplier: 1.40 },
      { targetType: 'stock', targetId: 'sk-hynix', multiplier: 1.15 }
    ]
  },
  {
    id: 'ai_regulation',
    title: 'EU, AI 규제법안 발의',
    description: '유럽연합이 AI 사용을 강력히 규제하는 법안을 발의하며 관련주에 찬물을 끼얹습니다.',
    effects: [
      { targetType: 'sector', targetId: 'ai', multiplier: 0.75 }
    ]
  },
  {
    id: 'solar_policy',
    title: '정부 태양광 보조금 확대',
    description: '친환경 에너지 정책 강화에 따라 태양광 관련주가 급등합니다.',
    effects: [
      { targetType: 'stock', targetId: 'hanwha-solar', multiplier: 1.35 },
      { targetType: 'sector', targetId: 'energy', multiplier: 1.15 }
    ]
  },
  {
    id: 'kpop_scandal',
    title: 'K-POP 소속 아이돌 대형 스캔들',
    description: '인기 아이돌의 사생활 논란이 터지며 소속사 주가가 급락합니다.',
    effects: [
      { targetType: 'sector', targetId: 'entertainment', multiplier: 0.75 }
    ]
  },
  {
    id: 'bank_dividend',
    title: '금융주, 사상 최대 배당 발표',
    description: '주요 은행들이 역대 최대 배당금을 발표하며 금융주가 일제히 급등합니다.',
    effects: [
      { targetType: 'sector', targetId: 'finance', multiplier: 1.25 },
      { targetType: 'cash', value: 500000 }
    ]
  },
  {
    id: 'food_inflation',
    title: '라면값 또 올랐다! 물가 상승',
    description: '원자재 가격 상승으로 식품 가격이 일제히 인상됩니다. 식품주는 웃고 서민은 울고.',
    effects: [
      { targetType: 'sector', targetId: 'food', multiplier: 1.20 },
      { targetType: 'livingCost', multiplier: 1.05 }
    ]
  },
  {
    id: 'battery_fire',
    title: '전기차 배터리 화재 사고 발생',
    description: '전기차 배터리 결함으로 대규모 리콜이 발생했습니다. 2차전지주가 급락합니다.',
    effects: [
      { targetType: 'sector', targetId: 'energy', multiplier: 0.75 },
      { targetType: 'stock', targetId: 'lg-energy', multiplier: 0.70 }
    ]
  },
  {
    id: 'naver_webtoon',
    title: '네이놈 웹툰, 미국 앱스토어 1위',
    description: '한국 웹툰이 글로벌 콘텐츠 시장을 장악하기 시작합니다.',
    effects: [
      { targetType: 'stock', targetId: 'naver', multiplier: 1.25 }
    ]
  },
  {
    id: 'crypto_whale',
    title: '비트코인 고래, 대량 매도',
    description: '익명의 대형 투자자가 수천억 규모의 비트코인을 시장에 쏟아냈습니다.',
    effects: [
      { targetType: 'sector', targetId: 'crypto', multiplier: 0.80 }
    ]
  },
  {
    id: 'musk_tweet_doge',
    title: '머스크 "도지 투더문!" 트윗',
    description: '테슬람 CEO의 한마디에 도지코인이 미친듯이 폭등합니다. 도지 보유자들은 환호합니다!',
    effects: [{ targetType: 'stock', targetId: 'dogecoin', multiplier: 3.5 }]
  },
  {
    id: 'musk_snl_crash',
    title: '머스크 SNL에서 "도지코인은 사기" 발언',
    description: '방송에서 던진 농담 한마디에 도지코인이 수직 낙하합니다. 개미들의 비명소리가 들립니다.',
    effects: [{ targetType: 'stock', targetId: 'dogecoin', multiplier: 0.4 }]
  },
  {
    id: 'realestate_scam_event',
    title: '빌라왕 전세 사기 사건 발생',
    description: '뉴스에서 보던 일이 나에게 일어났습니다. 집주인이 보증금을 들고 잠적했습니다. 눈앞이 깜깜해집니다.',
    effects: [
      { targetType: 'realestate_scam' },
      { targetType: 'stress', value: 80 }
    ]
  },
  {
    id: 'ancestor_dream',
    title: '조상님이 꿈에 나오시다',
    description: '돌아가신 할아버지께서 맑은 얼굴로 숫자를 불러주셨습니다. 이번 달 로또는 무조건 사야 합니다!',
    effects: [{ targetType: 'lotto_buff', multiplier: 100 }]
  },
  {
    id: 'medical_emergency',
    title: '갑작스러운 맹장염 수술',
    description: '새벽에 배가 너무 아파 응급실에 갔더니 맹장이 터지기 직전이랍니다. 예상치 못한 수술비가 깨졌습니다.',
    effects: [
      { targetType: 'cash', value: -2500000 },
      { targetType: 'stress', value: 20 }
    ]
  },
  {
    id: 'crypto_ceo_runaway',
    title: '가상화폐 거래소 대표 해외 도피',
    description: '중소 거래소 대표가 고객 예치금을 들고 해외로 튀었습니다. 코인 시장 전체에 패닉 셀링이 나옵니다.',
    effects: [{ targetType: 'sector', targetId: 'crypto', multiplier: 0.4 }]
  },
  {
    id: 'youtube_algorithm',
    title: '장난으로 올린 숏츠 대박',
    description: '반려견이 춤추는 영상을 올렸는데 알고리즘을 타고 조회수 1000만을 찍었습니다. 구글에서 엄청난 정산금이 들어왔습니다.',
    effects: [
      { targetType: 'cash', value: 7000000 },
      { targetType: 'stress', value: -30 }
    ]
  },
  {
    id: 'ex_wedding',
    title: '전 연인의 결혼 소식',
    description: '카톡 프로필에 올라온 전 애인의 웨딩 사진을 봐버렸습니다. 나는 이렇게 궁상맞게 사는데... 멘탈이 박살납니다.',
    effects: [{ targetType: 'stress', value: 40 }]
  },
  {
    id: 'tax_bomb',
    title: '건보료 폭탄 고지서',
    description: '생각지도 못했던 건강보험료 정산 고지서가 날아왔습니다. 통장 잔고가 살살 녹습니다.',
    effects: [{ targetType: 'cash', value: -800000 }]
  },
  {
    id: 'apple_inflation',
    title: '금사과 파동, 체감 물가 폭등',
    description: '사과 한 개에 만 원? 식탁 물가가 미쳐 날뜁니다. 매월 생활비 지출이 크게 늘어납니다.',
    effects: [{ targetType: 'livingCost', multiplier: 1.25 }]
  },
  {
    id: 'pepe_moon',
    title: '밈코인 열풍, 페페코인 떡상',
    description: '인터넷 밈에서 시작된 코인이 이유도 없이 5배나 올랐습니다. 펀더멘털 따위는 장식입니다.',
    effects: [{ targetType: 'stock', targetId: 'pepe', multiplier: 5.0 }]
  },
  {
    id: 'subway_strike',
    title: '출근길 지하철 파업',
    description: '지하철이 멈췄습니다. 지옥철에서 2시간을 갇혀 있다 겨우 출근하니 상사에게 깨졌습니다.',
    effects: [{ targetType: 'stress', value: 20 }]
  },
  {
    id: 'lucky_money',
    title: '길가다 돈을 줍다!',
    description: '길을 걷다 만 원짜리 뭉치를 주웠습니다. 소소한 행복에 스트레스가 풀립니다.',
    effects: [
      { targetType: 'cash', value: 150000 },
      { targetType: 'stress', value: -10 }
    ]
  },
  {
    id: 'wedding_relay',
    title: '지옥의 축의금 릴레이',
    description: '이번 달에만 친구 3명이 연달아 결혼합니다. 축의금 내느라 허리가 휩니다.',
    effects: [
      { targetType: 'cash', value: -450000 },
      { targetType: 'stress', value: 15 }
    ]
  },
  {
    id: 'broken_phone',
    title: '스마트폰 액정 박살',
    description: '길에서 넘어지면서 폰을 떨어뜨렸습니다. 액정 수리비 고지서를 보니 마음도 박살납니다.',
    effects: [
      { targetType: 'cash', value: -300000 },
      { targetType: 'stress', value: 20 }
    ]
  },
  {
    id: 'work_lupin',
    title: '완벽한 월급 루팡',
    description: '부장님이 출장 간 틈을 타 일주일 내내 유튜브만 봤습니다. 꿀을 빨아 스트레스가 크게 감소합니다.',
    effects: [{ targetType: 'stress', value: -30 }]
  },
  {
    id: 'used_market_scam',
    title: '중고거래 사기 피해',
    description: '중고 장터에서 싼 맛에 샀는데 벽돌이 배송되었습니다. 경찰에 신고해도 돈은 못 돌려받는다고 합니다.',
    effects: [
      { targetType: 'cash', value: -500000 },
      { targetType: 'stress', value: 35 }
    ]
  },
  {
    id: 'rent_up',
    title: '집주인의 월세 인상 통보',
    description: '"계약 기간 끝났으니 다음 달부터 월세 15% 올릴게요." 피도 눈물도 없는 세상입니다.',
    effects: [{ targetType: 'livingCost', multiplier: 1.15 }]
  },
  {
    id: 'tax_return_good',
    title: '13월의 월급, 연말정산 환급',
    description: '알뜰살뜰 모은 영수증 덕에 연말정산에서 꽤 많은 환급금이 들어왔습니다.',
    effects: [{ targetType: 'cash', value: 850000 }]
  },
  {
    id: 'tax_return_bad',
    title: '13월의 세금 폭탄',
    description: '오히려 세금을 더 토해내라는 연락을 받았습니다. 월급날이 두렵습니다.',
    effects: [
      { targetType: 'cash', value: -600000 },
      { targetType: 'stress', value: 25 }
    ]
  },
  {
    id: 'dental_implant',
    title: '치과 신경치료 및 임플란트',
    description: '이가 시려 치과에 갔더니 견적이 150만 원이 나왔습니다. 치아 관리 안 한 과거를 후회합니다.',
    effects: [
      { targetType: 'cash', value: -1500000 },
      { targetType: 'stress', value: 30 }
    ]
  },
  {
    id: 'noise_hell',
    title: '층간소음 지옥',
    description: '윗집에 아이 셋을 키우는 가족이 이사 왔습니다. 밤낮없는 발망치 소리에 노이로제가 걸릴 것 같습니다.',
    effects: [{ targetType: 'stress', value: 45 }]
  },
  {
    id: 'weekend_workshop',
    title: '끔찍한 주말 워크샵',
    description: '금요일 저녁부터 일요일까지 회사 워크샵에 끌려가 등산을 했습니다. 월요일 출근이 지옥 같습니다.',
    effects: [{ targetType: 'stress', value: 35 }]
  },
  {
    id: 'foreign_buy',
    title: '외국인 순매수 랠리',
    description: '외국인 자본이 한국 증시로 대거 유입되며 코스피 전체가 기분 좋은 상승을 이어갑니다.',
    effects: [{ targetType: 'market', multiplier: 1.15 }]
  },
  {
    id: 'geopolitical_risk',
    title: '북한 미사일 발사, 지정학적 리스크',
    description: '지정학적 긴장이 고조되며 코스피 시장 전체가 얼어붙고 투자 심리가 급격히 위축됩니다.',
    effects: [{ targetType: 'market', multiplier: 0.85 }]
  },
  {
    id: 'samsung_contract',
    title: '우성전자, 글로벌 반도체 수주 잭팟',
    description: '우성전자가 글로벌 IT 기업으로부터 초대형 HBM 납품 계약을 따냈습니다.',
    effects: [{ targetType: 'stock', targetId: 'samsung', multiplier: 1.25 }]
  },
  {
    id: 'idol_disband',
    title: '초대형 아이돌 그룹 해체설',
    description: 'K-POP을 이끌던 대형 그룹의 불화설과 해체설이 돌면서 엔터주 전반이 크게 흔들립니다.',
    effects: [{ targetType: 'sector', targetId: 'entertainment', multiplier: 0.75 }]
  }
];
