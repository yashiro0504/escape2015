import { useGameStore } from '../gameStore';
import { INITIAL_STOCKS } from '../../data/stocks';

describe('gameStore Core Logic', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    // Assuming `useGameStore.setState` can reset the state, or we can use `resetGame()` if available.
    // If persist is enabled, we might need to clear localStorage.
    localStorage.clear();
    const state = useGameStore.getState();
    if (state.resetGame) {
      state.resetGame();
    }
  });

  it('should initialize with default values', () => {
    const state = useGameStore.getState();
    expect(state.year).toBe(2015);
    expect(state.month).toBe(10);
    expect(state.week).toBe(1);
    expect(state.cash).toBe(7000000);
    expect(state.loan).toBe(0);
    expect(state.portfolio).toEqual({});
  });

  describe('Financial Operations', () => {
    it('should handle buyStock successfully', () => {
      const state = useGameStore.getState();
      const stockId = INITIAL_STOCKS[0].id;
      const initialCash = state.cash;
      const marketPrice = state.marketPrices[stockId]?.price;

      // Make sure the price is positive
      expect(marketPrice).toBeGreaterThan(0);

      const success = state.buyStock(stockId, 10);
      const newState = useGameStore.getState();

      expect(success).toBe(true);
      expect(newState.cash).toBe(initialCash - marketPrice * 10);
      expect(newState.portfolio[stockId]).toBeDefined();
      expect(newState.portfolio[stockId].amount).toBe(10);
    });

    it('should fail buyStock if not enough cash', () => {
      // Set cash to 0
      useGameStore.setState({ cash: 0 });
      const state = useGameStore.getState();
      const stockId = INITIAL_STOCKS[0].id;

      const success = state.buyStock(stockId, 10);
      const newState = useGameStore.getState();

      expect(success).toBe(false);
      expect(newState.portfolio[stockId]).toBeUndefined();
    });

    it('should handle sellStock successfully', () => {
      const stockId = INITIAL_STOCKS[0].id;
      const marketPrice = useGameStore.getState().marketPrices[stockId]?.price;
      
      // Setup portfolio
      useGameStore.setState({
        portfolio: {
          [stockId]: { stockId, amount: 10, averagePrice: marketPrice }
        }
      });
      
      const initialCash = useGameStore.getState().cash;
      const success = useGameStore.getState().sellStock(stockId, 5);
      const newState = useGameStore.getState();

      expect(success).toBe(true);
      expect(newState.cash).toBe(initialCash + marketPrice * 5);
      expect(newState.portfolio[stockId].amount).toBe(5);
    });

    it('should handle takeLoan and repayLoan', () => {
      // Test taking loan
      let state = useGameStore.getState();
      const initialCash = state.cash;
      const loanAmount = 1000000;
      
      // Need salary and credit score to take loan
      useGameStore.setState({ salary: 2000000, creditScore: 800 });
      state = useGameStore.getState();

      const takeSuccess = state.takeLoan(loanAmount);
      let newState = useGameStore.getState();

      expect(takeSuccess).toBe(true);
      expect(newState.cash).toBe(initialCash + loanAmount);
      expect(newState.loan).toBe(loanAmount);

      // Test repaying loan
      const repaySuccess = newState.repayLoan(500000);
      newState = useGameStore.getState();

      expect(repaySuccess).toBe(true);
      expect(newState.cash).toBe(initialCash + loanAmount - 500000);
      expect(newState.loan).toBe(500000);
    });

    it('should block negative amounts', () => {
      const state = useGameStore.getState();
      expect(state.takeLoan(-1000)).toBe(false);
      expect(state.repayLoan(-1000)).toBe(false);
      expect(state.depositMoney(-1000)).toBe(false);
      expect(state.withdrawMoney(-1000)).toBe(false);
    });
  });

  describe('Time Progression (nextTurn)', () => {
    it('should advance time correctly', () => {
      let state = useGameStore.getState();
      
      // Week 1 -> Week 2
      state.nextTurn();
      state = useGameStore.getState();
      expect(state.week).toBe(2);

      // Advance to end of month (Week 2 -> 3 -> 4 -> 1)
      state.nextTurn();
      state.nextTurn();
      state.nextTurn();
      
      state = useGameStore.getState();
      expect(state.week).toBe(1);
      expect(state.month).toBe(11); // Moved from Oct to Nov
    });

    it('should calculate monthly settlement correctly', () => {
      useGameStore.setState({
        week: 4,
        cash: 1000000,
        salary: 2000000,
        livingCost: 500000,
        deposit: 1000000, // For interest
        depositInterestRate: 0.12, // 1% per month
      });

      const state = useGameStore.getState();
      const currentRent = state.isOwnedRealEstate ? 0 : state.currentRealEstate.monthlyRent;
      
      // Calculate expected cash after settlement
      const expectedCash = 1000000 + 2000000 - 500000 - currentRent;
      
      state.nextTurn();
      const newState = useGameStore.getState();

      expect(newState.week).toBe(1);
      expect(newState.month).toBe(11);
      // Since it's month end, salary added, living cost deducted, etc.
      expect(newState.cash).toBe(expectedCash);
      expect(newState.deposit).toBe(1000000 + 10000); // 1% of 1m
    });
  });
});
