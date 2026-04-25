import { create } from 'zustand';
import { INITIAL_STOCKS, Stock } from '../data/stocks';
import { HISTORICAL_EVENTS, RANDOM_EVENTS, GameEvent } from '../data/events';
import { RealEstate, REAL_ESTATE_OPTIONS } from '../data/realEstate';
import { Job, JOB_LIST } from '../data/jobs';

interface ChatMessage {
  id: number;
  sender: string;
  text: string;
  isRead: boolean;
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
}

interface LottoResult {
  winningNumbers: number[];
  results: { numbers: number[]; matchCount: number; prize: number }[];
  totalPrize: number;
}

interface GameState {
  year: number;
  month: number;
  cash: number;
  stress: number;
  
  // 재정 상태
  salary: number; // 월급
  livingCost: number; // 기본 생활비
  loan: number; // 대출 원금
  interestRate: number; // 연 이자율
  creditScore: number; // 신용 점수

  stocks: Stock[];
  marketPrices: Record<string, MarketPrice>;
  portfolio: Record<string, PortfolioItem>;
  currentRealEstate: RealEstate;
  currentJob: Job;
  totalExperience: number; // 개월 수
  currentNews: GameEvent[];
  lottoTickets: number[][];
  lastLottoResult: LottoResult | null;
  // 채팅 시스템
  chatMessages: ChatMessage[];

  nextTurn: () => void;
  buyStock: (stockId: string, amount: number) => boolean;
  sellStock: (stockId: string, amount: number) => boolean;
  applyJob: (id: string) => boolean;
  changeRealEstate: (id: string) => boolean;
  takeLoan: (amount: number) => boolean;
  repayLoan: (amount: number) => boolean;
  playToto: (betAmount: number, isWin: boolean, odds: number) => boolean;
  buyLotto: (tickets: number[][]) => boolean;
  clearLottoResult: () => void;
  markChatAsRead: () => void;
}

// 초기 가격 설정
const initialMarketPrices: Record<string, MarketPrice> = {};
INITIAL_STOCKS.forEach(stock => {
  initialMarketPrices[stock.id] = {
    stockId: stock.id,
    price: stock.basePrice,
    history: [stock.basePrice]
  };
});

export const useGameStore = create<GameState>((set, get) => ({
  year: 2015,
  month: 10,
  cash: 10000000, // 시작 금액: 1000만원
  stress: 0,
  
  salary: 1500000, // 시작 월급 150만원
  livingCost: 1000000, // 기본 생활비 100만원
  loan: 0, // 대출 없음
  interestRate: 0.05, // 초기 대출 이자율 5%
  creditScore: 800, // 신용 점수 (최대 1000)

  stocks: INITIAL_STOCKS,
  marketPrices: initialMarketPrices,
  portfolio: {},
  currentRealEstate: REAL_ESTATE_OPTIONS.find(r => r.id === 'one-room-300-30')!,
  currentJob: JOB_LIST.find(j => j.id === 'startup-intern')!,
  totalExperience: 0,
  currentNews: [],
  lottoTickets: [],
  lastLottoResult: null,
  chatMessages: [
    { id: 1, sender: "김팀장", text: "어이 신입, 이번 달 실적 알지? 잔말 말고 일해.", isRead: false }
  ],

  nextTurn: () => {
    const state = get();
    let nextMonth = state.month + 1;
    let nextYear = state.year;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }

    const news = HISTORICAL_EVENTS.filter(e => e.year === nextYear && e.month === nextMonth);
    
    // 랜덤 이벤트 추첨 (30% 확률)
    const activeEvents = [...news];
    if (Math.random() < 0.3) {
      const randomEvt = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
      activeEvents.push(randomEvt);
    }

    // 까톡 메시지 도착 (40% 확률)
    const nextChatMessages = [...state.chatMessages];
    if (Math.random() < 0.4) {
      const rumors = [
        "야 내 친구가 횬다이차 다니는데 담달에 대박 터진대ㅋㅋ",
        "비트코인 지금 안사면 벼락거지 됨 ㄱㄱ",
        "셀파이온 임상 통과했다는 찌라시 돔. 풀매수 가자",
        "은행 금리 또 오른다더라.. 대출 빨리 갚아라",
        "요즘 테슬람 안 타면 바보라며? 화성 갈끄니까~~",
        "우성전자 폰 또 터졌대 ㅋㅋㅋㅋ 빨리 팔아"
      ];
      nextChatMessages.push({
        id: Date.now(),
        sender: "동창 이재용",
        text: rumors[Math.floor(Math.random() * rumors.length)],
        isRead: false
      });
    }

    // 개인 재정 이펙트 적용 (월급 증감, 생활비 증감, 현금 직접 증감)
    let nextSalary = state.salary;
    let nextLivingCost = state.livingCost;
    let extraCash = 0;

    activeEvents.forEach(n => {
      n.effects.forEach(eff => {
        if (eff.targetType === 'salary' && eff.multiplier) nextSalary = Math.floor(nextSalary * eff.multiplier);
        if (eff.targetType === 'livingCost' && eff.multiplier) nextLivingCost = Math.floor(nextLivingCost * eff.multiplier);
        if (eff.targetType === 'cash' && eff.value) extraCash += eff.value;
      });
    });

    // 로또 추첨 (이전 턴에 구매한 티켓)
    let lottoTotalPrize = 0;
    let lottoRes = null;
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
        if (matchCount === 6) prize = 2000000000;
        else if (matchCount === 5) prize = 50000000;
        else if (matchCount === 4) prize = 50000;
        else if (matchCount === 3) prize = 5000;
        lottoTotalPrize += prize;
        return { numbers: ticket, matchCount, prize };
      });
      lottoRes = { winningNumbers: winNumbers, results, totalPrize: lottoTotalPrize };
    }

    // 이자 및 고정 지출 계산, 로또 당첨금 및 이벤트 추가금 합산
    const monthlyInterest = Math.floor(state.loan * (state.interestRate / 12));
    const monthlyRent = state.currentRealEstate.monthlyRent;
    let nextCash = state.cash + nextSalary - nextLivingCost - monthlyRent - monthlyInterest + lottoTotalPrize + extraCash;
    
    // 현금이 마이너스가 되면 스트레스 증가 및 신용 점수 하락
    let nextStress = state.stress + state.currentJob.stress; // 직장 스트레스 추가
    let nextCredit = state.creditScore;
    
    // 경력 쌓임 (한 턴 당 1개월)
    let nextExp = state.totalExperience + 1;
    
    // 주거지에 따른 스트레스 완화 기본치 적용
    nextStress = Math.max(0, nextStress - state.currentRealEstate.stressRelief);
    if (nextCash < 0) {
      nextStress = Math.min(100, state.stress + 20); // 빚 독촉 스트레스
      nextCredit = Math.max(0, state.creditScore - 50); // 연체로 인한 신용 하락
    } else {
      nextStress = Math.max(0, state.stress - 2); // 여유가 있으면 스트레스 완화
      if (state.loan > 0 && nextCash > monthlyInterest * 3) {
        nextCredit = Math.min(1000, state.creditScore + 5); // 빚을 갚을 여력이 꾸준하면 신용 회복
      }
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
    
    INITIAL_STOCKS.forEach(stock => {
      const prevPrice = state.marketPrices[stock.id].price;
      
      // 1. 기본 변동성 (랜덤)
      const randomVol = 1 + (Math.random() * stock.volatility * 2 - stock.volatility);
      
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

      let nextPrice = prevPrice * randomVol * marketMultiplier * eventMultiplier;
      nextPrice = Math.floor(nextPrice); // 정수화

      // 상장폐지 방지 (최소 100원)
      if (nextPrice < 100) nextPrice = 100;

      newMarketPrices[stock.id] = {
        ...state.marketPrices[stock.id],
        price: nextPrice,
        history: [...state.marketPrices[stock.id].history, nextPrice]
      };
    });

    set({
      year: nextYear,
      month: nextMonth,
      cash: nextCash,
      salary: nextSalary,
      livingCost: nextLivingCost,
      stress: nextStress,
      creditScore: nextCredit,
      interestRate: nextInterestRate,
      marketPrices: newMarketPrices,
      currentNews: activeEvents,
      totalExperience: nextExp,
      lottoTickets: [], // 다음 턴으로 넘어가면 기존 티켓 초기화
      lastLottoResult: lottoRes,
      chatMessages: nextChatMessages
    });
  },

  applyJob: (id) => {
    const state = get();
    const target = JOB_LIST.find(j => j.id === id);
    if (!target) return false;

    if (state.totalExperience >= target.requiredExp) {
      set({
        currentJob: target,
        salary: target.salary
      });
      return true;
    }
    return false;
  },

  buyStock: (stockId, amount) => {
    const state = get();
    const price = state.marketPrices[stockId].price;
    const totalCost = price * amount;
    
    if (state.cash >= totalCost) {
      const currentItem = state.portfolio[stockId] || { stockId, amount: 0, averagePrice: 0 };
      const newAmount = currentItem.amount + amount;
      const newAveragePrice = ((currentItem.averagePrice * currentItem.amount) + totalCost) / newAmount;
      
      set({
        cash: state.cash - totalCost,
        portfolio: {
          ...state.portfolio,
          [stockId]: { stockId, amount: newAmount, averagePrice: newAveragePrice }
        }
      });
      return true;
    }
    return false;
  },

  changeRealEstate: (id) => {
    const state = get();
    const target = REAL_ESTATE_OPTIONS.find(r => r.id === id);
    if (!target) return false;

    const currentDeposit = state.currentRealEstate.deposit;
    const targetDeposit = target.deposit;
    const depositDiff = targetDeposit - currentDeposit;

    if (state.cash >= depositDiff) {
      set({
        cash: state.cash - depositDiff,
        currentRealEstate: target
      });
      return true;
    }
    return false;
  },

  sellStock: (stockId, amount) => {
    const state = get();
    const currentItem = state.portfolio[stockId];
    
    if (currentItem && currentItem.amount >= amount) {
      const price = state.marketPrices[stockId].price;
      const totalRevenue = price * amount;
      
      const newAmount = currentItem.amount - amount;
      const newPortfolio = { ...state.portfolio };
      
      if (newAmount === 0) {
        delete newPortfolio[stockId];
      } else {
        newPortfolio[stockId] = { ...currentItem, amount: newAmount };
      }
      
      set({
        cash: state.cash + totalRevenue,
        portfolio: newPortfolio
      });
      return true;
    }
    return false;
  },

  takeLoan: (amount) => {
    const state = get();
    // 대출 한도: 신용 점수와 기존 대출에 따라 다름 (단순화: 신용점수 * 10만원)
    const maxLoan = state.creditScore * 100000;
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

  playToto: (betAmount, isWin, odds) => {
    const state = get();
    if (state.cash >= betAmount) {
      if (isWin) {
        // 배팅금 차감 후, 당첨금(배팅금 * 배당률) 지급
        set({ cash: state.cash - betAmount + Math.floor(betAmount * odds) });
      } else {
        // 배팅금만 차감
        set({ cash: state.cash - betAmount });
      }
      return true;
    }
    return false;
  },

  buyLotto: (tickets) => {
    const state = get();
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

  markChatAsRead: () => {
    set(state => ({
      chatMessages: state.chatMessages.map(m => ({ ...m, isRead: true }))
    }));
  }
}));
