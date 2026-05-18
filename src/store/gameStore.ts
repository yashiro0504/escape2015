import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { INITIAL_STOCKS, Stock } from '../data/stocks';
import { HISTORICAL_EVENTS, RANDOM_EVENTS, GameEvent } from '../data/events';
import { RealEstate, REAL_ESTATE_OPTIONS } from '../data/realEstate';
import { Job, JOB_LIST } from '../data/jobs';
import { FRIEND_MESSAGES, BOSS_MESSAGES, MOM_MESSAGES } from '../data/chatMessages';

interface Rumor {
  id: string;
  stockId: string;
  isTrue: boolean;
  isPositive: boolean;
  multiplier: number;
  message: string;
  sourceName: string;
  truthRate: number;
}

interface ChatMessage {
  id: number;
  sender: string;
  text: string;
  isRead: boolean;
  room: 'mom' | 'boss' | 'friend' | 'secret' | 'system' | 'news' | 'bank' | 'rumor';
  date?: string;
}

interface PortfolioItem {
  stockId: string;
  amount: number;
  averagePrice: number;
}

interface MarketPrice {
  stockId: string;
  price: number;
  history: number[];
  delisted?: boolean;
}

export interface SystemAlert {
  id: number;
  title: string;
  message: string;
  type: 'good' | 'bad' | 'info';
}

interface LottoResult {
  winningNumbers: number[];
  results: { numbers: number[]; matchCount: number; prize: number }[];
  totalPrize: number;
  multiplier: number;
}

export interface TradeRecord {
  id: number;
  date: string;
  stockId: string;
  stockName: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  totalAmount: number;
  realizedProfit?: number;
  realizedProfitRate?: number;
}

interface GameState {
  year: number;
  month: number;
  week: number;
  cash: number;
  stress: number;
  
  // 재정 상태
  salary: number; // 월급
  livingCost: number; // 기본 생활비
  loan: number; // 대출 원금
  interestRate: number; // 연 이자율
  deposit: number; // 예금 잔액
  depositInterestRate: number; // 예금 이자율
  creditScore: number; // 신용 점수

  stocks: Stock[];
  marketPrices: Record<string, MarketPrice>;
  portfolio: Record<string, PortfolioItem>;
  currentRealEstate: RealEstate;
  isOwnedRealEstate: boolean; // 자가 여부
  realEstateAssetValue: number; // 실제 환불/매각 가능한 주거 자산
  currentJob: Job;
  currentJobExperience: number; // 현 직장 근속 개월 수
  totalExperience: number; // 개월 수
  currentNews: GameEvent[];
  lottoTickets: number[][];
  lastLottoResult: LottoResult | null;
  lottoPrizeMultiplier: number;
  activeRumors: Rumor[];
  // 채팅 시스템
  chatMessages: ChatMessage[];
  hasReadNews: boolean;
  isGameStarted: boolean;
  isGameOver: boolean;
  isGameWon: boolean;
  playerName: string;
  endGameReason: string;

  tradeHistory: TradeRecord[];
  systemAlerts: SystemAlert[];

  playCount: number;
  clearedCount: number;
  currentBackgroundId: string;

  unlockedAchievements: string[];
  newlyUnlockedAchievements: string[];
  
  soundEnabled: boolean;
  hapticEnabled: boolean;

  startGame: (name: string, backgroundId?: string) => void;
  unlockAchievement: (id: string) => void;
  clearNewlyUnlockedAchievements: () => void;
  nextTurn: () => void;
  skipToNextMonth: () => void;
  buyStock: (stockId: string, amount: number) => boolean;
  sellStock: (stockId: string, amount: number) => boolean;
  applyJob: (id: string) => boolean;
  quitJob: () => void;
  changeRealEstate: (id: string, isPurchase?: boolean) => boolean;
  takeLoan: (amount: number) => boolean;
  repayLoan: (amount: number) => boolean;
  depositMoney: (amount: number) => boolean;
  withdrawMoney: (amount: number) => boolean;
  playToto: (betAmount: number, isWin: boolean, odds: number) => boolean;
  buyLotto: (tickets: number[][]) => boolean;
  clearLottoResult: () => void;
  relieveStress: (cost: number, reliefAmount: number) => boolean;
  markChatAsRead: (roomId?: string) => void;
  markNewsAsRead: () => void;
  resetGame: () => void;
  toggleSound: () => void;
  toggleHaptic: () => void;
  removeSystemAlert: (id: number) => void;
}

type GameData = Omit<
  GameState,
  | 'startGame'
  | 'nextTurn'
  | 'skipToNextMonth'
  | 'buyStock'
  | 'sellStock'
  | 'applyJob'
  | 'quitJob'
  | 'changeRealEstate'
  | 'takeLoan'
  | 'repayLoan'
  | 'depositMoney'
  | 'withdrawMoney'
  | 'playToto'
  | 'buyLotto'
  | 'clearLottoResult'
  | 'relieveStress'
  | 'markChatAsRead'
  | 'markNewsAsRead'
  | 'resetGame'
  | 'unlockAchievement'
  | 'clearNewlyUnlockedAchievements'
  | 'toggleSound'
  | 'toggleHaptic'
  | 'removeSystemAlert'
>;

import { STARTING_BACKGROUNDS } from '../data/backgrounds';
import { soundManager } from '../utils/soundManager';
import { hapticManager } from '../utils/hapticManager';

// 초기 가격 설정
const createInitialMarketPrices = () => {
  const prices: Record<string, MarketPrice> = {};
  INITIAL_STOCKS.forEach(stock => {
    prices[stock.id] = {
      stockId: stock.id,
      price: stock.basePrice,
      history: [stock.basePrice]
    };
  });
  return prices;
};

const createInitialGameData = (backgroundId: string = 'default'): GameData => {
  const bg = STARTING_BACKGROUNDS.find(b => b.id === backgroundId) || STARTING_BACKGROUNDS[0];
  const initialRealEstate = REAL_ESTATE_OPTIONS.find(r => r.id === 'one-room-300-30')!;
  const initialJob = JOB_LIST.find(j => j.id === bg.initialJobId) || JOB_LIST[1];

  return {
    year: 2015,
    month: 10,
    week: 1,
    cash: bg.initialCash,
    stress: 0,
    salary: initialJob.salary,
    livingCost: 500000,
    loan: 0, // 대출 없음
    interestRate: 0.05, // 초기 대출 이자율 5%
    deposit: 0, // 초기 예금 0원
    depositInterestRate: 0.03, // 초기 예금 이자율 3%
    creditScore: 800, // 신용 점수 (최대 1000)
    stocks: INITIAL_STOCKS,
    marketPrices: createInitialMarketPrices(),
    portfolio: {},
    currentRealEstate: initialRealEstate,
    isOwnedRealEstate: false,
    realEstateAssetValue: initialRealEstate.deposit,
    currentJob: initialJob,
    currentJobExperience: 0,
    totalExperience: 0,
    currentNews: [],
    lottoTickets: [],
    lastLottoResult: null,
    lottoPrizeMultiplier: 1,
    activeRumors: [],
    chatMessages: [
      { id: 1, sender: "김팀장", text: "어이 신입, 이번 달 실적 알지? 잔말 말고 일해.", isRead: false, room: 'boss', date: '2015년 10월 1주차' },
      { id: 2, sender: "엄마", text: "밥은 먹고 다니니? 항상 건강 조심해라.", isRead: false, room: 'mom', date: '2015년 10월 1주차' }
    ],
    hasReadNews: false,
    isGameStarted: false,
    isGameOver: false,
    isGameWon: false,
    playerName: '',
    endGameReason: '',
    playCount: 0,
    clearedCount: 0,
    currentBackgroundId: 'default',
    unlockedAchievements: [],
    newlyUnlockedAchievements: [],
    soundEnabled: true,
    hapticEnabled: true,
    tradeHistory: [],
    systemAlerts: [],
  };
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const isPositiveWholeAmount = (amount: number) => Number.isFinite(amount) && Number.isInteger(amount) && amount > 0;
const isNonNegativeWholeAmount = (amount: number) => Number.isFinite(amount) && Number.isInteger(amount) && amount >= 0;

const isValidLottoTicket = (ticket: number[]) => {
  if (ticket.length !== 6) return false;
  const uniqueNumbers = new Set(ticket);
  return uniqueNumbers.size === 6 && ticket.every(n => Number.isInteger(n) && n >= 1 && n <= 45);
};

// ─── 헬퍼 함수들 ───

/** 가격 히스토리 최대 길이 (메모리 관리) */
const MAX_HISTORY_LENGTH = 52;

export const getTargetGoal = (clearedCount: number) => {
  if (clearedCount >= 3) return 10000000000; // 100억
  if (clearedCount === 2) return 5000000000; // 50억
  if (clearedCount === 1) return 1000000000; // 10억
  return 200000000; // 2억
};

export const getTargetGoalLabel = (clearedCount: number) => {
  if (clearedCount >= 3) return "100억";
  if (clearedCount === 2) return "50억";
  if (clearedCount === 1) return "10억";
  return "2억";
};

/** 포트폴리오 총 평가액 계산 */
export const getPortfolioValue = (
  portfolio: Record<string, PortfolioItem>,
  marketPrices: Record<string, MarketPrice>
) => {
  return Object.values(portfolio).reduce((total, item) => {
    const currentPrice = marketPrices[item.stockId]?.price || 0;
    return total + (currentPrice * item.amount);
  }, 0);
};

/** 고유 메시지 ID 생성기 */
let messageIdCounter = 100;
const getNextMessageId = () => messageIdCounter++;

const syncMessageCounterFromState = (state?: Pick<GameState, 'chatMessages' | 'activeRumors'>) => {
  if (!state) return;

  const chatMessages = state.chatMessages ?? [];
  const activeRumors = state.activeRumors ?? [];
  const maxChatId = chatMessages.reduce((max, message) => Math.max(max, message.id), 0);
  const maxRumorId = activeRumors.reduce((max, rumor) => {
    const numericId = Number(rumor.id.replace('rumor-', ''));
    return Number.isFinite(numericId) ? Math.max(max, numericId) : max;
  }, 0);

  messageIdCounter = Math.max(messageIdCounter, maxChatId + 1, maxRumorId + 1);
};

const isDelistingRisk = (stock: Stock, marketPrice?: MarketPrice) => {
  if (!marketPrice || marketPrice.delisted || marketPrice.price <= 0) return true;
  const lowerLimit = Math.max(1, Math.floor(stock.basePrice * 0.02));
  return marketPrice.price <= lowerLimit;
};

const getRumorTruthRate = (job: Job, stock: Stock) => {
  let truthRate = 0.3;

  if (job.id === 'it-giant' && ['tech', 'ai', 'game'].includes(stock.sector)) {
    truthRate += 0.2;
  }
  if (job.id === 'big-company' && ['tech', 'finance', 'auto', 'energy'].includes(stock.sector)) {
    truthRate += 0.15;
  }
  if (job.id === 'mid-company' || job.id === 'small-company') {
    truthRate += 0.07;
  }
  if (job.id === 'part-time' || job.id === 'unemployed') {
    truthRate -= 0.06;
  }
  if (stock.sector === 'crypto') {
    truthRate -= 0.05;
  }

  return clamp(truthRate, 0.15, 0.65);
};

const pickRumorStock = (
  stocks: Stock[],
  portfolio: Record<string, PortfolioItem>,
  currentJob: Job
) => {
  const weightedStocks = stocks.map(stock => {
    const holdingWeight = portfolio[stock.id]?.amount > 0 ? 4 : 0;
    const jobSectorWeight =
      (currentJob.id === 'it-giant' && ['tech', 'ai', 'game'].includes(stock.sector)) ||
      (currentJob.id === 'big-company' && ['tech', 'finance', 'auto', 'energy'].includes(stock.sector))
        ? 2
        : 0;

    return {
      stock,
      weight: 1 + holdingWeight + jobSectorWeight
    };
  });

  const totalWeight = weightedStocks.reduce((sum, item) => sum + item.weight, 0);
  let cursor = Math.random() * totalWeight;

  for (const item of weightedStocks) {
    cursor -= item.weight;
    if (cursor <= 0) return item.stock;
  }

  return weightedStocks[weightedStocks.length - 1]?.stock;
};

export const useGameStore = create<GameState>()(persist((set, get) => ({
  ...createInitialGameData(),

  startGame: (name: string, backgroundId: string = 'default') => set((state) => ({
    ...createInitialGameData(backgroundId),
    playCount: state.playCount + 1,
    clearedCount: state.clearedCount,
    unlockedAchievements: state.unlockedAchievements,
    soundEnabled: state.soundEnabled,
    hapticEnabled: state.hapticEnabled,
    newlyUnlockedAchievements: [],
    isGameStarted: true,
    playerName: name,
  })),

  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  toggleHaptic: () => set((state) => ({ hapticEnabled: !state.hapticEnabled })),

  unlockAchievement: (id: string) => set((state) => {
    if (state.unlockedAchievements.includes(id)) return {};
    
    soundManager.playAchievement();
    hapticManager.achievement();
    
    return {
      unlockedAchievements: [...state.unlockedAchievements, id],
      newlyUnlockedAchievements: [...state.newlyUnlockedAchievements, id],
    };
  }),

  clearNewlyUnlockedAchievements: () => set({
    newlyUnlockedAchievements: []
  }),

  nextTurn: () => {
    const state = get();
    if (state.isGameOver) return;
    
    let nextWeek = state.week + 1;
    let nextMonth = state.month;
    let nextYear = state.year;
    
    let isNewMonth = false;

    if (nextWeek > 4) {
      nextWeek = 1;
      nextMonth += 1;
      isNewMonth = true;
      if (nextMonth > 12) {
        nextMonth = 1;
        nextYear += 1;
      }
    }
    
    const currentDateStr = `${nextYear}년 ${nextMonth}월 ${nextWeek}주차`;

    // 뉴스 이벤트는 매월 첫째 주에만 발생
    const news = isNewMonth && nextWeek === 1 
      ? HISTORICAL_EVENTS.filter(e => e.year === nextYear && e.month === nextMonth)
      : [];
    
    // 랜덤 이벤트 추첨 (주간 10% 확률)
    const activeEvents = [...news];
    if (Math.random() < 0.1) {
      const randomEvt = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
      activeEvents.push(randomEvt);
    }

    // 까톡 메시지 도착
    const nextChatMessages = [...state.chatMessages];
    const nextSystemAlerts: SystemAlert[] = [];
    
    // 찌라시(Rumor) 팩트체크 결과 알림 (지난주 찌라시)
    state.activeRumors.forEach(rumor => {
      const stock = INITIAL_STOCKS.find(s => s.id === rumor.stockId);
      const stockName = stock ? stock.name : '어떤 종목';
      const wasDelisted = state.marketPrices[rumor.stockId]?.delisted;
      const sourceLine = `\n\n출처: ${rumor.sourceName}\n원문: "${rumor.message}"\n정보 신뢰도: ${Math.round(rumor.truthRate * 100)}%`;

      if (wasDelisted) {
        nextChatMessages.push({
          id: getNextMessageId(),
          sender: "찌라시 팩트체크",
          text: `[검증불가] '${stockName}'은(는) 상장폐지되어 지난주 찌라시의 시장 영향을 확인할 수 없습니다.${sourceLine}`,
          isRead: false,
          room: 'secret',
          date: currentDateStr
        });
      } else if (rumor.isTrue) {
        nextChatMessages.push({
          id: getNextMessageId(),
          sender: "찌라시 팩트체크",
          text: `[적중] 지난주 '${stockName}' 관련 찌라시는 사실로 밝혀졌습니다! 시장에 강력한 영향을 주었습니다.${sourceLine}`,
          isRead: false,
          room: 'secret',
          date: currentDateStr
        });
      } else {
        nextChatMessages.push({
          id: getNextMessageId(),
          sender: "찌라시 팩트체크",
          text: `[거짓] 지난주 '${stockName}' 찌라시는 완전한 가짜 뉴스로 판명되었습니다. 개미들의 무덤이 되었습니다.${sourceLine}`,
          isRead: false,
          room: 'secret',
          date: currentDateStr
        });
      }
    });

    const nextActiveRumors: Rumor[] = [];
    
    // 신규 찌라시 생성 (주간 15% 확률)
    if (Math.random() < 0.15) {
      const isPositive = Math.random() < 0.6; // 60% 확률로 호재
      const multiplier = isPositive ? (1.3 + Math.random() * 0.7) : (0.5 + Math.random() * 0.3); 
      
      const availableStocks = INITIAL_STOCKS.filter(s => !isDelistingRisk(s, state.marketPrices[s.id]));
      if (availableStocks.length > 0) {
        const randomStock = pickRumorStock(availableStocks, state.portfolio, state.currentJob);
        
        if (randomStock) {
          const truthRate = getRumorTruthRate(state.currentJob, randomStock);
          const isTrue = Math.random() < truthRate;
          const upDownTxt = isPositive ? "내부자 정보인데 다음 주에 무조건 떡상한대" : "대표 횡령 터졌대, 다음 주 떡락 확정임";
          const actionTxt = isPositive ? "풀대출 땡겨서 매수 가즈아!!" : "지금 당장 손절 쳐라!!";
          const rumorMessage = `[은밀한 찌라시] 야 '${randomStock.name}' ${upDownTxt}. ${actionTxt}`;
          const rumorId = `rumor-${getNextMessageId()}`;
        
          nextActiveRumors.push({
            id: rumorId,
            stockId: randomStock.id,
            isTrue,
            isPositive,
            multiplier,
            message: rumorMessage,
            sourceName: "비밀정보방(찌라시)",
            truthRate
          });
        
          nextChatMessages.push({
            id: getNextMessageId(),
            sender: "비밀정보방(찌라시)",
            text: `${rumorMessage}\n\n정보 신뢰도: ${Math.round(truthRate * 100)}%`,
            isRead: false,
            room: 'secret',
            date: currentDateStr
          });
        }
      }
    }
    
    // 친구 (주식/투자 찌라시, 주간 15% 확률)
    if (Math.random() < 0.15) {
      nextChatMessages.push({
        id: getNextMessageId(),
        sender: "동창 이재용",
        text: FRIEND_MESSAGES[Math.floor(Math.random() * FRIEND_MESSAGES.length)],
        isRead: false,
        room: 'friend',
        date: currentDateStr
      });
    }

    // 직장 상사 (스트레스, 주간 10% 확률)
    let bossStressDelta = 0;
    if (Math.random() < 0.1) {
      bossStressDelta = 5;
      nextChatMessages.push({
        id: getNextMessageId(),
        sender: "김팀장",
        text: BOSS_MESSAGES[Math.floor(Math.random() * BOSS_MESSAGES.length)],
        isRead: false,
        room: 'boss',
        date: currentDateStr
      });
    }

    // 엄마 (잔소리/걱정, 주간 8% 확률)
    let extraCash = 0;
    if (Math.random() < 0.08) {
      const selectedMomMsg = MOM_MESSAGES[Math.floor(Math.random() * MOM_MESSAGES.length)];
      if (selectedMomMsg.includes("10만원 입금")) {
        extraCash += 100000;
        nextSystemAlerts.push({
          id: getNextMessageId(),
          title: "엄마의 용돈",
          message: `${selectedMomMsg}\n\n💰 현금: +100,000원`,
          type: 'good'
        });
      }
      nextChatMessages.push({
        id: getNextMessageId(),
        sender: "엄마",
        text: selectedMomMsg,
        isRead: false,
        room: 'mom',
        date: currentDateStr
      });
    }

    // 개인 재정 이펙트 적용 (월급 증감, 생활비 증감, 현금 직접 증감)
    let nextSalary = state.salary;
    let nextLivingCost = state.livingCost;
    let nextRealEstateAssetValue = state.realEstateAssetValue;
    let extraStress = 0;
    let eventLottoPrizeMultiplier = 1;

    activeEvents.forEach(n => {
      let effectSummary = "";
      n.effects.forEach(eff => {
        if (eff.targetType === 'cash' && eff.value) {
          effectSummary += `\n💰 현금: ${eff.value > 0 ? '+' : ''}${eff.value.toLocaleString()}원`;
        } else if (eff.targetType === 'salary' && eff.multiplier) {
          effectSummary += `\n💼 월급: ${eff.multiplier > 1 ? '+' : ''}${Math.round((eff.multiplier - 1) * 100)}%`;
        } else if (eff.targetType === 'livingCost' && eff.multiplier) {
          effectSummary += `\n💸 생활비: ${eff.multiplier > 1 ? '+' : ''}${Math.round((eff.multiplier - 1) * 100)}%`;
        } else if (eff.targetType === 'stress' && eff.value) {
          effectSummary += `\n🤯 스트레스: ${eff.value > 0 ? '+' : ''}${eff.value}`;
        }
      });

      // 뉴스 속보 카톡 전송
      nextChatMessages.push({
        id: getNextMessageId(),
        sender: "속보알리미",
        text: `[${n.title}]\n${n.description}${effectSummary ? '\n' + effectSummary : ''}`,
        isRead: false,
        room: 'news',
        date: currentDateStr
      });
      
      n.effects.forEach(eff => {
        if (eff.targetType === 'salary' && eff.multiplier) nextSalary = Math.floor(nextSalary * eff.multiplier);
        if (eff.targetType === 'livingCost' && eff.multiplier) nextLivingCost = Math.floor(nextLivingCost * eff.multiplier);
        if (eff.targetType === 'cash' && eff.value) extraCash += eff.value;
        if (eff.targetType === 'stress' && eff.value) extraStress += eff.value;
        if (eff.targetType === 'lotto_buff' && eff.multiplier) eventLottoPrizeMultiplier = Math.max(eventLottoPrizeMultiplier, eff.multiplier);
        if (eff.targetType === 'realestate_scam') {
           if (!state.isOwnedRealEstate && nextRealEstateAssetValue > 0) {
             const lostDeposit = nextRealEstateAssetValue;
             nextRealEstateAssetValue = 0;
             nextChatMessages.push({
               id: getNextMessageId(),
               sender: "주택도시보증공사",
               text: `[전세사기 피해 알림] 안타깝게도 거주 중인 주택의 임대인이 파산하여 보증금을 잃게 되었습니다.\n\n💰 현금: -${lostDeposit.toLocaleString()}원`,
               isRead: false,
               room: 'system',
               date: currentDateStr
             });
           }
        }
      });

      // 돈 관련 이벤트(랜덤 이벤트) 알림 띄우기
      const isRandomEvent = RANDOM_EVENTS.some(re => re.id === n.id);
      const isFinancialScam = n.id === 'realestate_scam_event';
      if (isRandomEvent || isFinancialScam) {
        if (effectSummary || isFinancialScam) {
           nextSystemAlerts.push({
             id: getNextMessageId(),
             title: `[알림] ${n.title}`,
             message: `${n.description}${effectSummary ? '\n' + effectSummary : ''}`,
             type: effectSummary.includes('-') || isFinancialScam ? 'bad' : 'good'
           });
        }
      }
    });

    // 로또 추첨 (이전 턴에 구매한 티켓)
    let lottoTotalPrize = 0;
    let lottoRes = null;
    const appliedLottoPrizeMultiplier = state.lottoPrizeMultiplier;
    let nextLottoPrizeMultiplier = eventLottoPrizeMultiplier > 1 ? eventLottoPrizeMultiplier : state.lottoPrizeMultiplier;
    if (state.lottoTickets.length > 0) {
      const winNumbers: number[] = [];
      while (winNumbers.length < 6) {
        const n = Math.floor(Math.random() * 45) + 1;
        if (!winNumbers.includes(n)) winNumbers.push(n);
      }
      winNumbers.sort((a, b) => a - b);

      const results = state.lottoTickets.map(ticket => {
        const matchCount = ticket.filter(n => winNumbers.includes(n)).length;
        let prize = 0;
        if (matchCount === 6) prize = 2000000000 * appliedLottoPrizeMultiplier;
        else if (matchCount === 5) prize = 50000000 * appliedLottoPrizeMultiplier;
        else if (matchCount === 4) prize = 50000 * appliedLottoPrizeMultiplier;
        else if (matchCount === 3) prize = 5000 * appliedLottoPrizeMultiplier;
        lottoTotalPrize += prize;
        return { numbers: ticket, matchCount, prize };
      });
      lottoRes = { winningNumbers: winNumbers, results, totalPrize: lottoTotalPrize, multiplier: appliedLottoPrizeMultiplier };

      if (state.lottoPrizeMultiplier > 1) {
        nextLottoPrizeMultiplier = eventLottoPrizeMultiplier > 1 ? eventLottoPrizeMultiplier : 1;
      }
    }

    // 이자 및 고정 지출 계산 (매월 정산)
    const monthlyInterest = Math.floor(state.loan * (state.interestRate / 12));
    const monthlyRent = state.isOwnedRealEstate ? 0 : state.currentRealEstate.monthlyRent;
    const monthlyDepositInterest = Math.floor(state.deposit * (state.depositInterestRate / 12));
    const portfolioValue = getPortfolioValue(state.portfolio, state.marketPrices);
    const monthlyDividends = Math.floor(portfolioValue * 0.001);
    
    let nextCash = state.cash + lottoTotalPrize + extraCash;
    let nextDeposit = state.deposit;
    let nextCredit = state.creditScore;
    let nextExp = state.totalExperience;
    let nextJobExp = state.currentJobExperience;

    // 주간 스트레스 계산
    let nextStress = state.stress + bossStressDelta + extraStress;

    const weeklyJobStress = Math.ceil(state.currentJob.stress / 4);
    nextStress += weeklyJobStress;
    
    const weeklyRelief = Math.ceil(state.currentRealEstate.stressRelief / 4);
    nextStress = Math.max(0, nextStress - weeklyRelief);

    if (isNewMonth) {
      if (state.isOwnedRealEstate && (nextMonth === 7 || nextMonth === 9)) {
        const propertyTax = Math.floor(state.currentRealEstate.deposit * 0.0015);
        if (propertyTax > 0) {
           nextCash -= propertyTax;
           nextSystemAlerts.push({
             id: getNextMessageId(),
             title: "재산세 납부 알림",
             message: `보유하신 자가 주택에 대한 재산세가 청구되었습니다.\n\n💰 현금: -${propertyTax.toLocaleString()}원`,
             type: 'bad'
           });
           nextChatMessages.push({
             id: getNextMessageId(),
             sender: "국세청",
             text: `[재산세 납부 안내] 보유하신 주택에 대한 재산세 ${propertyTax.toLocaleString()}원이 자동 납부되었습니다.`,
             isRead: false,
             room: 'system',
             date: currentDateStr
           });
        }
      }

      nextCash = nextCash + nextSalary + monthlyDividends - nextLivingCost - monthlyRent - monthlyInterest;
      nextDeposit += monthlyDepositInterest;
      
      // 월말 정산 내역 카톡 발송
      nextChatMessages.push({
        id: getNextMessageId(),
        sender: "흙수저은행",
        text: `[월말 정산 내역]\n\n입금: +${(nextSalary + monthlyDividends + monthlyDepositInterest).toLocaleString()}원\n- 급여: ${nextSalary.toLocaleString()}원\n- 배당금: ${monthlyDividends.toLocaleString()}원\n- 예금 이자: ${monthlyDepositInterest.toLocaleString()}원\n\n지출: -${(nextLivingCost + monthlyRent + monthlyInterest).toLocaleString()}원\n- 생활비: ${nextLivingCost.toLocaleString()}원\n- 월세: ${monthlyRent.toLocaleString()}원\n- 대출 이자: ${monthlyInterest.toLocaleString()}원\n\n잔액: ${nextCash.toLocaleString()}원`,
        isRead: false,
        room: 'bank',
        date: currentDateStr
      });
      
      // 경력 쌓임 (월 1회, 백수가 아닐 때만)
      if (state.currentJob.id !== 'unemployed') {
        nextExp += 1;
        nextJobExp += 1;
        
        if (nextJobExp > 0 && nextJobExp % 12 === 0) {
          const raiseAmount = Math.floor(nextSalary * state.currentJob.raiseRate);
          nextSalary += raiseAmount;
          nextChatMessages.push({
            id: getNextMessageId(),
            sender: "인사팀",
            text: `[연봉 인상 안내] 근속 1년 보상으로 월급이 ${(state.currentJob.raiseRate * 100).toFixed(0)}% 인상되었습니다. (+${raiseAmount.toLocaleString()}원)`,
            isRead: false,
            room: 'system',
            date: currentDateStr
          });
        }
      }
      
      if (state.deposit > 0) {
        nextCredit = Math.min(1000, nextCredit + 2); // 예금 유지 시 신용 점수 상승
      }

      if (nextCash < 0) {
        nextStress = Math.min(100, nextStress + 20); // 빚 독촉 스트레스
        nextCredit = Math.max(0, state.creditScore - 50); // 연체로 인한 신용 하락
      } else {
        nextStress = Math.max(0, nextStress - 2); // 월말 흑자면 스트레스 약간 완화
        if (state.loan > 0 && nextCash > monthlyInterest * 3) {
          nextCredit = Math.min(1000, state.creditScore + 5); // 빚 갚을 여력
        }
      }
    }

    // 입원 체크 (스트레스 100 도달)
    if (nextStress >= 100) {
      nextCash -= 1000000;
      nextStress = 0;
      nextChatMessages.push({
        id: getNextMessageId(),
        sender: "병원 원무과",
        text: `[응급실 내원 안내] 극심한 스트레스로 쓰러져 응급실로 이송되었습니다. 입원 치료를 받아 스트레스가 0으로 초기화되었습니다.\n\n💰 현금: -1,000,000원\n🤯 스트레스: -100`,
        isRead: false,
        room: 'system',
        date: currentDateStr
      });
    }

    // 시장 전체 이펙트 및 금리 변경
    let marketMultiplier = 1.0;
    let nextInterestRate = state.interestRate;

    activeEvents.forEach(n => {
      n.effects.forEach(eff => {
        if (eff.targetType === 'market' && eff.multiplier) {
          marketMultiplier *= eff.multiplier;
        }
        if (eff.targetType === 'interest' && eff.value !== undefined) {
          nextInterestRate = eff.value; // 금리 변경 반영
        }
      });
    });

    // 가격 계산
    const newMarketPrices = { ...state.marketPrices };
    const newlyDelisted: string[] = [];
    
    INITIAL_STOCKS.forEach(stock => {
      let isDelisted = state.marketPrices[stock.id].delisted || false;
      
      if (isDelisted) {
        newMarketPrices[stock.id] = {
          ...state.marketPrices[stock.id],
          price: 0,
          history: [...state.marketPrices[stock.id].history, 0].slice(-MAX_HISTORY_LENGTH)
        };
        return;
      }

      const prevPrice = state.marketPrices[stock.id].price;
      
      // 1. 기본 변동성 (로그 정규 분포 유사 적용 - 기하평균 하락 방지)
      // weeklyDrift: 주당 약 +0.2% 상승장 효과 (연 +10%)
      const weeklyDrift = 0.002; 
      // Math.random() * 2 - 1 은 -1.0 ~ +1.0 사이의 값
      const randomFactor = (Math.random() * 2 - 1) * stock.volatility;
      const randomVolMultiplier = Math.exp(weeklyDrift + randomFactor);
      
      // 2. 이벤트 이펙트
      let eventMultiplier = 1.0;
      activeEvents.forEach(n => {
        n.effects.forEach(eff => {
          if (eff.targetType === 'sector' && eff.targetId === stock.sector && eff.multiplier) {
            eventMultiplier *= eff.multiplier;
          }
          if (eff.targetType === 'stock' && eff.targetId === stock.id && eff.multiplier) {
            eventMultiplier *= eff.multiplier;
          }
        });
      });

      // 3. 찌라시(Rumor) 이펙트 적용
      let rumorMultiplier = 1.0;
      state.activeRumors.forEach(rumor => {
        if (rumor.stockId === stock.id) {
          if (rumor.isTrue) {
            rumorMultiplier *= rumor.multiplier;
          } else {
            // 가짜 뉴스일 경우 반대 효과 (호재라 뻥쳤으면 실망 매물로 하락)
            rumorMultiplier *= rumor.isPositive ? 0.8 : 1.2; 
          }
        }
      });

      let nextPrice = prevPrice * randomVolMultiplier * marketMultiplier * eventMultiplier * rumorMultiplier;

      // 동전주/잡코인 탈출 로직 (소수점 버림으로 인해 1원에 영원히 갇히는 현상 방지)
      // 가격이 10원 미만일 때 15% 확률로 세력이 개입하여 1~10원 무작위 펌핑
      if (nextPrice < 10 && Math.random() < 0.15) {
        nextPrice += Math.random() * 10;
      }
      
      nextPrice = Math.max(1, Math.floor(nextPrice)); // 정수화 및 최소 1원 보장

      // 상장폐지 로직: 하한가(기본가의 2%) 이하로 12주 연속 유지 시 상폐 (조건 대폭 완화)
      const lowerLimit = Math.max(1, Math.floor(stock.basePrice * 0.02));
      if (nextPrice <= lowerLimit) {
        const history = state.marketPrices[stock.id].history;
        const consecutiveWeeks = 12; // 3개월 연속 하한가
        
        if (history.length >= consecutiveWeeks - 1) {
          let isAllLowerLimit = true;
          for (let i = 1; i < consecutiveWeeks; i++) {
            if (history[history.length - i] > lowerLimit) {
              isAllLowerLimit = false;
              break;
            }
          }
          
          if (isAllLowerLimit) {
            isDelisted = true;
            nextPrice = 0;
            newlyDelisted.push(stock.id);
            
            const sender = stock.sector === 'crypto' ? "비트고수 거래소" : "한국거래소";
            nextChatMessages.push({
              id: getNextMessageId(),
              sender,
              text: `[상장폐지 안내] '${stock.name}' 종목이 장기간 하한가(${lowerLimit}원) 지속으로 상장폐지되었습니다. 보유 수량은 전량 소각(0원) 처리됩니다.`,
              isRead: false,
              room: 'system',
              date: currentDateStr
            });
          }
        }
      }

      newMarketPrices[stock.id] = {
        ...state.marketPrices[stock.id],
        price: nextPrice,
        history: [...state.marketPrices[stock.id].history, nextPrice].slice(-MAX_HISTORY_LENGTH),
        delisted: isDelisted
      };
    });

    // 상폐된 종목 포트폴리오에서 삭제 (소각)
    const newPortfolio = { ...state.portfolio };
    newlyDelisted.forEach(stockId => {
      if (newPortfolio[stockId]) {
        delete newPortfolio[stockId];
      }
    });

    // 재산세 납부 (매년 6월, 자가 소유시)
    if (isNewMonth && nextMonth === 6 && state.isOwnedRealEstate) {
      const propertyTax = Math.floor(state.currentRealEstate.purchasePrice * 0.005);
      if (propertyTax > 0) {
        nextCash -= propertyTax;
        nextChatMessages.push({
          id: getNextMessageId(),
          sender: "국세청",
          text: `[재산세 납부 안내] 자가 주택 소유에 따른 재산세 ${propertyTax.toLocaleString()}원이 자동 납부되었습니다.`,
          isRead: false,
          room: 'system',
          date: currentDateStr
        });
      }
    }

    // 파산 위기 및 반대매매, 사채 전환 로직
    let nextLoan = state.loan;
    if (nextCash < 0) {
      // 1. 예금 자동 출금으로 방어
      if (nextDeposit > 0) {
        const needed = Math.abs(nextCash);
        const withdrawAmount = Math.min(nextDeposit, needed);
        nextDeposit -= withdrawAmount;
        nextCash += withdrawAmount;
        
        if (withdrawAmount > 0) {
          nextChatMessages.push({
            id: getNextMessageId(),
            sender: "흙수저은행",
            text: `[예금 자동 출금] 계좌 잔액 부족으로 마이너스 통장을 방어하기 위해 예금에서 ${withdrawAmount.toLocaleString()}원이 자동 출금되었습니다.`,
            isRead: false,
            room: 'bank',
            date: currentDateStr
          });
        }
      }

      // 2. 보유 주식/코인 강제 청산 (반대매매)
      if (nextCash < 0) {
        let liquidated = false;
        let liquidatedText = "";
        
        for (const stockId of Object.keys(newPortfolio)) {
        if (nextCash >= 0) break;
        const item = newPortfolio[stockId];
        const currentPrice = newMarketPrices[stockId]?.price || 0;
        if (currentPrice > 0 && item.amount > 0) {
          const sellValue = item.amount * currentPrice;
          nextCash += sellValue;
          liquidatedText += `- ${INITIAL_STOCKS.find(s=>s.id===stockId)?.name} ${item.amount}주 (총 ${sellValue.toLocaleString()}원)\n`;
          delete newPortfolio[stockId];
          liquidated = true;
        }
      }

      if (liquidated) {
        nextChatMessages.push({
          id: getNextMessageId(),
          sender: "증권사",
          text: `[반대매매 통보] 고객님의 계좌 잔고가 마이너스 상태여서 보유 중인 자산이 시장가로 강제 청산되었습니다.\n\n[청산 내역]\n${liquidatedText}`,
          isRead: false,
          room: 'system',
          date: currentDateStr
        });
      }
      }

      // 3. 청산 후에도 여전히 마이너스라면? 사채 강제 이용
      if (nextCash < 0) {
        const requiredAmount = Math.abs(nextCash) + 3000000; // 마이너스 메꾸고 당장 쓸 돈 300만 원 추가 대출
        nextCash += requiredAmount;
        nextLoan += requiredAmount;
        nextInterestRate = 0.36; // 연 36% 살인적인 금리
        nextStress = Math.min(100, nextStress + 50);

        nextChatMessages.push({
          id: getNextMessageId(),
          sender: "김상도(사채업자)",
          text: `[긴급 자금 대출] 어이 형씨, 신용도 바닥에 빚더미네? 내가 마이너스 메꿔주고 300 더 넣어줬어. 대신 이자는 연 36%니까 꼬박꼬박 갚아. 안 갚으면 알지?`,
          isRead: false,
          room: 'boss',
          date: currentDateStr
        });
      }
    }

    // 게임 종료 (승리/패배) 조건 검사
    const newPortfolioValue = getPortfolioValue(newPortfolio, newMarketPrices);
    const totalBalance = nextCash + nextDeposit + newPortfolioValue + nextRealEstateAssetValue - nextLoan;

    let nextIsGameOver: boolean = state.isGameOver;
    let nextIsGameWon: boolean = state.isGameWon;
    let nextEndGameReason = state.endGameReason;

    if (!nextIsGameOver) {
      const targetGoal = getTargetGoal(state.clearedCount);
      if (totalBalance >= targetGoal) {
        nextIsGameOver = true;
        nextIsGameWon = true;
        nextEndGameReason = `축하합니다! 총 자산 ${targetGoal.toLocaleString()}원을 달성하여 흙수저 탈출에 성공했습니다!`;
      } else if (totalBalance <= -50000000) {
        nextIsGameOver = true;
        nextIsGameWon = false;
        nextEndGameReason = `순자산이 -5,000만 원 이하로 떨어져 파산했습니다... 더 이상 회복이 불가능합니다.`;
        soundManager.playError();
        hapticManager.error();
      } else if (nextLoan >= 100000000) {
        nextIsGameOver = true;
        nextIsGameWon = false;
        nextEndGameReason = `사채 빚이 1억 원을 넘어 야반도주했습니다. 게임 오버.`;
        soundManager.playError();
        hapticManager.error();
      }
    }

    let nextClearedCount = state.clearedCount;
    if (nextIsGameWon && !state.isGameWon) {
      nextClearedCount += 1;
      get().unlockAchievement('game_clear');
    }

    if (nextStress >= 100) get().unlockAchievement('max_stress');
    if (nextLoan >= 50000000) get().unlockAchievement('max_loan');
    if (nextWeek === 1 && nextMonth !== state.month) {
      get().unlockAchievement('first_salary');
      // 배경 특전: 전업투자자일 경우 매월 초 찌라시 1개 무조건 제공
      if (state.currentBackgroundId === 'fulltime_investor') {
        const fakeRumor: GameEvent = {
          id: `rumor-${Date.now()}`,
          title: '[고급 정보] 내부자 찌라시',
          description: '전업투자자의 정보망에 은밀한 루머가 포착되었습니다.',
          effects: [{ targetType: 'stock', targetId: 'samsung', multiplier: 1.1 }]
        };
        activeEvents.push(fakeRumor);
        nextChatMessages.push({
          id: getNextMessageId(),
          sender: "정보방",
          text: `[단독] 은밀한 고급 정보를 하나 입수했습니다. 이번 달은 기대하셔도 좋습니다.`,
          isRead: false,
          room: 'rumor',
          date: currentDateStr
        });
      }
      // 배경 특전: 도박꾼일 경우 로또 당첨 배율 증가
      if (state.currentBackgroundId === 'gambler') {
        nextLottoPrizeMultiplier = 3;
      }
    }

    // ──────── 카톡 메시지 최적화 (방별로 최근 30개만 유지) ────────
    const MAX_MESSAGES_PER_ROOM = 30;
    const messagesByRoom: Record<string, typeof nextChatMessages> = {};
    nextChatMessages.forEach(msg => {
      if (!messagesByRoom[msg.room]) messagesByRoom[msg.room] = [];
      messagesByRoom[msg.room].push(msg);
    });
    
    const optimizedChatMessages: typeof nextChatMessages = [];
    Object.values(messagesByRoom).forEach(roomMessages => {
      optimizedChatMessages.push(...roomMessages.slice(-MAX_MESSAGES_PER_ROOM));
    });
    optimizedChatMessages.sort((a, b) => a.id - b.id);

    set({
      year: nextYear,
      month: nextMonth,
      week: nextWeek,
      cash: nextCash,
      deposit: nextDeposit,
      loan: nextLoan,
      salary: nextSalary,
      livingCost: nextLivingCost,
      stress: nextStress,
      creditScore: nextCredit,
      interestRate: nextInterestRate,
      marketPrices: newMarketPrices,
      portfolio: newPortfolio,
      currentNews: activeEvents,
      hasReadNews: false,
      totalExperience: nextExp,
      currentJobExperience: nextJobExp,
      isOwnedRealEstate: state.isOwnedRealEstate, // 불변 유지
      realEstateAssetValue: nextRealEstateAssetValue,
      lottoTickets: [], // 다음 턴으로 넘어가면 기존 티켓 초기화
      lastLottoResult: lottoRes,
      lottoPrizeMultiplier: nextLottoPrizeMultiplier,
      chatMessages: optimizedChatMessages,
      activeRumors: nextActiveRumors,
      isGameOver: nextIsGameOver,
      isGameWon: nextIsGameWon,
      clearedCount: nextClearedCount,
      endGameReason: nextEndGameReason,
      systemAlerts: [...state.systemAlerts, ...nextSystemAlerts]
    });

    if (!nextIsGameOver) {
      soundManager.playNextTurn();
      hapticManager.selection();
    }
  },

  skipToNextMonth: () => {
    const currentWeek = get().week;
    const jumps = 5 - currentWeek;
    for (let i = 0; i < jumps; i++) {
      get().nextTurn();
    }
  },

  applyJob: (id) => {
    const state = get();
    const target = JOB_LIST.find(j => j.id === id);
    if (!target) return false;

    if (state.totalExperience >= target.requiredExp) {
      set({
        currentJob: target,
        currentJobExperience: 0,
        salary: target.salary
      });
      return true;
    }
    return false;
  },

  quitJob: () => {
    const target = JOB_LIST.find(j => j.id === 'unemployed')!;
    set({
      currentJob: target,
      currentJobExperience: 0,
      salary: target.salary
    });
    get().unlockAchievement('quit_job');
  },

  buyStock: (stockId, amount) => {
    const state = get();
    const marketPrice = state.marketPrices[stockId];
    if (
      !marketPrice ||
      marketPrice.delisted ||
      marketPrice.price <= 0 ||
      !isPositiveWholeAmount(amount)
    ) {
      return false;
    }

    const price = marketPrice.price;
    const totalCost = price * amount;
    
    if (state.cash >= totalCost) {
      const currentItem = state.portfolio[stockId] || { stockId, amount: 0, averagePrice: 0 };
      const newAmount = currentItem.amount + amount;
      const newAveragePrice = ((currentItem.averagePrice * currentItem.amount) + totalCost) / newAmount;
      
      const newTrade: TradeRecord = {
        id: Date.now(),
        date: `${state.year}년 ${state.month}월 ${state.week}주차`,
        stockId,
        stockName: INITIAL_STOCKS.find(s => s.id === stockId)?.name || stockId,
        type: 'buy',
        amount,
        price,
        totalAmount: totalCost
      };

      set({
        cash: state.cash - totalCost,
        portfolio: {
          ...state.portfolio,
          [stockId]: { stockId, amount: newAmount, averagePrice: newAveragePrice }
        },
        tradeHistory: [newTrade, ...state.tradeHistory].slice(0, 200)
      });
      get().unlockAchievement('first_blood');
      soundManager.playClick();
      hapticManager.selection();
      return true;
    }
    soundManager.playError();
    hapticManager.error();
    return false;
  },

  changeRealEstate: (id, isPurchase = false) => {
    const state = get();
    const target = REAL_ESTATE_OPTIONS.find(r => r.id === id);
    if (!target) return false;

    const currentRefund = state.realEstateAssetValue;
    const targetCost = isPurchase ? target.purchasePrice : target.deposit;

    if (isPurchase && target.purchasePrice <= 0) {
      return false;
    }
    
    // 만약 제자리에서 자가 전환하는 경우
    if (state.currentRealEstate.id === target.id && state.isOwnedRealEstate === isPurchase) {
      return false;
    }

    if (state.cash + currentRefund >= targetCost) {
      set({
        cash: state.cash + currentRefund - targetCost,
        currentRealEstate: target,
        isOwnedRealEstate: isPurchase,
        realEstateAssetValue: targetCost,
        livingCost: target.livingCost
      });
    
    if (isPurchase) get().unlockAchievement('realestate_owner');
    
    soundManager.playCash();
    hapticManager.success();
    return true;
    }
    return false;
  },

  sellStock: (stockId, amount) => {
    const state = get();
    const currentItem = state.portfolio[stockId];
    const marketPrice = state.marketPrices[stockId];
    if (
      !marketPrice ||
      marketPrice.delisted ||
      marketPrice.price <= 0 ||
      !isPositiveWholeAmount(amount)
    ) {
      return false;
    }
    
    if (currentItem && currentItem.amount >= amount) {
      const price = marketPrice.price;
      const totalRevenue = price * amount;
      
      const newAmount = currentItem.amount - amount;
      const newPortfolio = { ...state.portfolio };
      
      if (newAmount === 0) {
        delete newPortfolio[stockId];
      } else {
        newPortfolio[stockId] = { ...currentItem, amount: newAmount };
      }
      
      const realizedProfit = totalRevenue - (currentItem.averagePrice * amount);
      const realizedProfitRate = currentItem.averagePrice > 0 ? ((price - currentItem.averagePrice) / currentItem.averagePrice) * 100 : 0;

      const newTrade: TradeRecord = {
        id: Date.now(),
        date: `${state.year}년 ${state.month}월 ${state.week}주차`,
        stockId,
        stockName: INITIAL_STOCKS.find(s => s.id === stockId)?.name || stockId,
        type: 'sell',
        amount,
        price,
        totalAmount: totalRevenue,
        realizedProfit,
        realizedProfitRate
      };

      set({
        cash: state.cash + totalRevenue,
        portfolio: newPortfolio,
        tradeHistory: [newTrade, ...state.tradeHistory].slice(0, 200)
      });
      soundManager.playCash();
      hapticManager.success();
      return true;
    }
    soundManager.playError();
    hapticManager.error();
    return false;
  },

  takeLoan: (amount) => {
    const state = get();
    if (!isPositiveWholeAmount(amount)) return false;

    // 대출 한도: 연봉 * (신용도/1000)
    const maxLoan = Math.floor((state.salary * 12) * (state.creditScore / 1000));
    if (state.loan + amount <= maxLoan) {
      set({
        cash: state.cash + amount,
        loan: state.loan + amount
      });
      return true;
    }
    return false;
  },

  repayLoan: (amount) => {
    const state = get();
    if (!isPositiveWholeAmount(amount)) return false;

    // 갚을 돈이 현금보다 작고 대출액보다 작아야 함
    if (state.cash >= amount && state.loan >= amount) {
      set({
        cash: state.cash - amount,
        loan: state.loan - amount
      });
      return true;
    }
    return false;
  },

  depositMoney: (amount) => {
    const state = get();
    if (isPositiveWholeAmount(amount) && state.cash >= amount) {
      set({
        cash: state.cash - amount,
        deposit: state.deposit + amount
      });
      return true;
    }
    return false;
  },

  withdrawMoney: (amount) => {
    const state = get();
    if (isPositiveWholeAmount(amount) && state.deposit >= amount) {
      set({
        cash: state.cash + amount,
        deposit: state.deposit - amount
      });
      return true;
    }
    return false;
  },

  playToto: (betAmount, isWin, odds) => {
    const state = get();
    if (!isPositiveWholeAmount(betAmount) || !Number.isFinite(odds) || odds <= 0) return false;

    if (state.cash >= betAmount) {
      if (isWin) {
        // 배팅금 차감 후, 당첨금(배팅금 * 배당률) 지급
        set({ cash: state.cash - betAmount + Math.floor(betAmount * odds) });
        get().unlockAchievement('toto_winner');
        soundManager.playCash();
        hapticManager.success();
      } else {
        // 배팅금만 차감
        set({ cash: state.cash - betAmount });
        soundManager.playError();
        hapticManager.error();
      }
      return true;
    }
    return false;
  },

  buyLotto: (tickets) => {
    const state = get();
    if (tickets.length === 0 || !tickets.every(isValidLottoTicket)) return false;

    const cost = tickets.length * 1000;
    if (state.cash >= cost) {
      set({
        cash: state.cash - cost,
        lottoTickets: [...state.lottoTickets, ...tickets]
      });
      return true;
    }
    return false;
  },

  clearLottoResult: () => {
    set({ lastLottoResult: null });
  },

  relieveStress: (cost, reliefAmount) => {
    const state = get();
    if (!isNonNegativeWholeAmount(cost) || !isPositiveWholeAmount(reliefAmount)) return false;

    if (state.cash >= cost) {
      set({
        cash: state.cash - cost,
        stress: Math.max(0, state.stress - reliefAmount)
      });
      return true;
    }
    return false;
  },

  markChatAsRead: (roomId?: string) => {
    set(state => ({
      chatMessages: state.chatMessages.map(m => 
        (roomId ? m.room === roomId : true) ? { ...m, isRead: true } : m
      )
    }));
  },

  markNewsAsRead: () => {
    set({ hasReadNews: true });
  },

  removeSystemAlert: (id: number) => {
    set(state => ({
      systemAlerts: state.systemAlerts.filter(a => a.id !== id)
    }));
  },

  resetGame: () => {
    messageIdCounter = 100;
    const state = get();
    // Preserve meta-progression
    set({
      ...createInitialGameData(),
      playCount: state.playCount + 1,
      clearedCount: state.clearedCount,
      unlockedAchievements: state.unlockedAchievements,
      soundEnabled: state.soundEnabled,
      hapticEnabled: state.hapticEnabled,
      isGameStarted: false,
    });
  },
}), {
  name: 'escape2015-game-state',
  version: 1,
  storage: createJSONStorage(() => ({
    getItem: (name) => {
      try { return localStorage.getItem(name); } catch (e) { return null; }
    },
    setItem: (name, value) => {
      try { localStorage.setItem(name, value); } catch (e) { /* ignore */ }
    },
    removeItem: (name) => {
      try { localStorage.removeItem(name); } catch (e) { /* ignore */ }
    }
  })),
  skipHydration: true,
  partialize: (state) => ({
    year: state.year,
    month: state.month,
    week: state.week,
    cash: state.cash,
    stress: state.stress,
    salary: state.salary,
    livingCost: state.livingCost,
    loan: state.loan,
    interestRate: state.interestRate,
    deposit: state.deposit,
    depositInterestRate: state.depositInterestRate,
    creditScore: state.creditScore,
    marketPrices: state.marketPrices,
    portfolio: state.portfolio,
    currentRealEstate: state.currentRealEstate,
    isOwnedRealEstate: state.isOwnedRealEstate,
    realEstateAssetValue: state.realEstateAssetValue,
    currentJob: state.currentJob,
    currentJobExperience: state.currentJobExperience,
    totalExperience: state.totalExperience,
    currentNews: state.currentNews,
    lottoTickets: state.lottoTickets,
    lastLottoResult: state.lastLottoResult,
    lottoPrizeMultiplier: state.lottoPrizeMultiplier,
    activeRumors: state.activeRumors,
    chatMessages: state.chatMessages,
    hasReadNews: state.hasReadNews,
    isGameStarted: state.isGameStarted,
    isGameOver: state.isGameOver,
    isGameWon: state.isGameWon,
    playerName: state.playerName,
    endGameReason: state.endGameReason,
    playCount: state.playCount,
    clearedCount: state.clearedCount,
    currentBackgroundId: state.currentBackgroundId,
    soundEnabled: state.soundEnabled,
    hapticEnabled: state.hapticEnabled,
    tradeHistory: state.tradeHistory
  }),
  merge: (persistedState, currentState) => {
    const savedState = persistedState as Partial<GameState>;
    const marketPrices = {
      ...currentState.marketPrices,
      ...savedState.marketPrices
    };

    return {
      ...currentState,
      ...savedState,
      stocks: currentState.stocks,
      marketPrices
    };
  },
  onRehydrateStorage: () => (state) => {
    syncMessageCounterFromState(state);
  }
}));
