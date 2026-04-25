export const calculatePriceChange = (price: number, history: number[]) => {
  const prevPrice = history.length > 1 ? history[history.length - 2] : price;
  const change = price - prevPrice;
  const changePercent = prevPrice === 0 ? 0 : (change / prevPrice) * 100;
  
  return {
    change,
    changePercent,
    isUp: change > 0,
    isDown: change < 0
  };
};
