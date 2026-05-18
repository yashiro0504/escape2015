"use client";

import Link from "next/link";
import { ArrowLeft, PieChart, TrendingDown, TrendingUp, Wallet, History } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { calculatePriceChange } from "@/utils/calculatePriceChange";

export default function StockPortfolioApp() {
  const { cash, stocks, marketPrices, portfolio } = useGameStore();

  const holdings = Object.values(portfolio).flatMap((item) => {
    const stock = stocks.find((s) => s.id === item.stockId);
    const marketPrice = marketPrices[item.stockId];

    if (!stock || !marketPrice || item.amount <= 0) {
      return [];
    }

    const currentValue = marketPrice.price * item.amount;
    const investmentValue = item.averagePrice * item.amount;
    const profit = currentValue - investmentValue;
    const profitPercent = investmentValue > 0 ? (profit / investmentValue) * 100 : 0;
    const { changePercent, isUp, isDown } = calculatePriceChange(marketPrice.price, marketPrice.history);

    return [{
      stock,
      marketPrice,
      amount: item.amount,
      averagePrice: item.averagePrice,
      currentValue,
      investmentValue,
      profit,
      profitPercent,
      changePercent,
      isUp,
      isDown
    }];
  }).sort((a, b) => b.currentValue - a.currentValue);

  const totalInvestment = holdings.reduce((sum, item) => sum + item.investmentValue, 0);
  const totalCurrentValue = holdings.reduce((sum, item) => sum + item.currentValue, 0);
  const totalProfit = totalCurrentValue - totalInvestment;
  const totalProfitPercent = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;
  const stockAssetRatio = totalCurrentValue + cash > 0 ? (totalCurrentValue / (totalCurrentValue + cash)) * 100 : 0;

  return (
    <div className="w-full h-full bg-white flex flex-col text-black relative">
      <div className="bg-red-600 text-white px-4 py-3 flex items-center shadow-md z-10 sticky top-0">
        <Link href="/stock" className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold flex items-center">
          <PieChart size={19} className="mr-2" />
          잔고
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-16">
        <div className="bg-zinc-100 px-4 py-4 border-b border-zinc-200">
          <p className="text-xs text-zinc-500 mb-1 font-medium">총 평가자산</p>
          <p className="text-2xl font-black font-mono text-zinc-900">
            {(cash + totalCurrentValue).toLocaleString()}
            <span className="text-sm font-normal text-zinc-500 ml-1">원</span>
          </p>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-white rounded-lg p-3 border border-zinc-200">
              <p className="text-[10px] text-zinc-400 mb-1 font-bold">주식/코인 평가</p>
              <p className="font-mono font-bold text-sm">{totalCurrentValue.toLocaleString()}원</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-zinc-200">
              <p className="text-[10px] text-zinc-400 mb-1 font-bold">예수금</p>
              <p className="font-mono font-bold text-sm">{cash.toLocaleString()}원</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-zinc-200">
              <p className="text-[10px] text-zinc-400 mb-1 font-bold">평가손익</p>
              <p className={`font-mono font-bold text-sm ${totalProfit >= 0 ? "text-red-600" : "text-blue-600"}`}>
                {totalProfit >= 0 ? "+" : ""}{totalProfit.toLocaleString()}원
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-zinc-200">
              <p className="text-[10px] text-zinc-400 mb-1 font-bold">총수익률</p>
              <p className={`font-mono font-bold text-sm ${totalProfitPercent >= 0 ? "text-red-600" : "text-blue-600"}`}>
                {totalProfitPercent >= 0 ? "+" : ""}{totalProfitPercent.toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-[10px] text-zinc-500 mb-1 font-bold">
              <span>위험자산 비중</span>
              <span>{stockAssetRatio.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, stockAssetRatio)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="px-4 py-2 border-b border-zinc-200 bg-zinc-50 flex justify-between text-xs text-zinc-500 font-medium sticky top-0 z-10">
          <span>보유종목</span>
          <span className="text-right">평가금액 / 손익</span>
        </div>

        {holdings.length === 0 ? (
          <div className="h-[360px] flex flex-col items-center justify-center text-center px-8">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4 text-zinc-400">
              <Wallet size={28} />
            </div>
            <p className="text-sm font-bold text-zinc-700 mb-1">보유한 자산이 없습니다.</p>
            <p className="text-xs text-zinc-400 leading-relaxed">관심종목에서 매수하면 잔고와 수익률이 여기에 표시됩니다.</p>
          </div>
        ) : (
          holdings.map((item) => {
            const unitLabel = item.stock.sector === "crypto" ? "개" : "주";
            const isProfit = item.profit >= 0;

            return (
              <Link
                key={item.stock.id}
                href={`/stock/${item.stock.id}`}
                className="block px-4 py-3 border-b border-zinc-100 active:bg-zinc-100 transition-colors"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-zinc-800 truncate">{item.stock.name}</h3>
                    <div className="mt-1 space-y-0.5 text-[10px] text-zinc-400 font-mono">
                      <p>{item.amount.toLocaleString()} {unitLabel} 보유</p>
                      <p>평단 {Math.floor(item.averagePrice).toLocaleString()}원</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-mono font-bold text-sm text-zinc-900">{item.currentValue.toLocaleString()}원</p>
                    <p className={`font-mono text-[11px] font-bold mt-0.5 ${isProfit ? "text-red-600" : "text-blue-600"}`}>
                      {isProfit ? "+" : ""}{item.profit.toLocaleString()}원 ({isProfit ? "+" : ""}{item.profitPercent.toFixed(2)}%)
                    </p>
                    <p className={`text-[10px] font-bold mt-1 inline-flex items-center px-1.5 py-0.5 rounded ${item.isUp ? "bg-red-50 text-red-600" : item.isDown ? "bg-blue-50 text-blue-600" : "bg-zinc-100 text-zinc-500"}`}>
                      {item.isUp && <TrendingUp size={10} className="mr-0.5" />}
                      {item.isDown && <TrendingDown size={10} className="mr-0.5" />}
                      {item.isUp ? "+" : ""}{item.changePercent.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <div className="absolute bottom-0 w-full h-14 bg-white border-t border-zinc-200 flex items-center justify-around text-[10px] text-zinc-500 pb-1">
        <Link href="/stock" className="flex flex-col items-center active:scale-95 transition-transform">
          <TrendingUp size={20} className="mb-1" />
          <span>관심종목</span>
        </Link>
        <Link href="/stock/portfolio" className="flex flex-col items-center text-red-600 active:scale-95 transition-transform">
          <PieChart size={20} className="mb-1" />
          <span className="font-bold">잔고</span>
        </Link>
        <Link href="/stock/history" className="flex flex-col items-center active:scale-95 transition-transform">
          <History size={20} className="mb-1" />
          <span>거래내역</span>
        </Link>
      </div>
    </div>
  );
}
