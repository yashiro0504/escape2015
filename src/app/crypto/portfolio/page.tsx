"use client";

import Link from "next/link";
import { ArrowLeft, PieChart, TrendingDown, TrendingUp, Wallet, Bitcoin } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { calculatePriceChange } from "@/utils/calculatePriceChange";

export default function CryptoPortfolioApp() {
  const { year, month, week, cash, stocks, marketPrices, portfolio } = useGameStore();

  const holdings = Object.values(portfolio).flatMap((item) => {
    const stock = stocks.find((s) => s.id === item.stockId && s.sector === 'crypto');
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
    <div className="w-full h-full bg-zinc-950 flex flex-col text-white relative">
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-3 flex items-center shadow-md z-10 sticky top-0">
        <Link href="/crypto" className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-base font-bold flex items-center flex-1">
          <PieChart size={19} className="mr-2" />
          가상자산 잔고
        </h1>
        <span className="text-[10px] text-white/60 bg-white/10 px-2 py-1 rounded-full">{year}.{String(month).padStart(2, '0')} W{week}</span>
      </div>

      <div className="flex-1 overflow-y-auto pb-16">
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 px-4 py-4 border-b border-white/5">
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">총 코인 평가자산</p>
          <p className="text-2xl font-black font-mono text-white">
            {(cash + totalCurrentValue).toLocaleString()}
            <span className="text-sm font-normal text-white/30 ml-1">원</span>
          </p>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-[10px] text-white/30 mb-1 font-bold">코인 평가액</p>
              <p className="font-mono font-bold text-sm text-orange-400">{totalCurrentValue.toLocaleString()}원</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-[10px] text-white/30 mb-1 font-bold">보유 KRW</p>
              <p className="font-mono font-bold text-sm text-white">{cash.toLocaleString()}원</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-[10px] text-white/30 mb-1 font-bold">평가손익</p>
              <p className={`font-mono font-bold text-sm ${totalProfit >= 0 ? "text-red-400" : "text-blue-400"}`}>
                {totalProfit >= 0 ? "+" : ""}{totalProfit.toLocaleString()}원
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-[10px] text-white/30 mb-1 font-bold">총수익률</p>
              <p className={`font-mono font-bold text-sm ${totalProfitPercent >= 0 ? "text-red-400" : "text-blue-400"}`}>
                {totalProfitPercent >= 0 ? "+" : ""}{totalProfitPercent.toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-[10px] text-white/40 mb-1 font-bold">
              <span>코인 비중</span>
              <span>{stockAssetRatio.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, stockAssetRatio)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="px-4 py-2 border-b border-white/5 bg-zinc-900/50 flex justify-between text-[9px] text-white/20 font-bold uppercase tracking-widest sticky top-0 z-10 backdrop-blur-md">
          <span>보유코인</span>
          <span className="text-right">평가금액 / 손익</span>
        </div>

        {holdings.length === 0 ? (
          <div className="h-[360px] flex flex-col items-center justify-center text-center px-8">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-white/20">
              <Wallet size={28} />
            </div>
            <p className="text-sm font-bold text-white/60 mb-1">보유한 코인이 없습니다.</p>
            <p className="text-xs text-white/30 leading-relaxed">거래소에서 코인을 매수하면 내역이 표시됩니다.</p>
          </div>
        ) : (
          holdings.map((item) => {
            const isProfit = item.profit >= 0;

            return (
              <Link
                key={item.stock.id}
                href={`/stock/${item.stock.id}`}
                className="block px-4 py-3 border-b border-white/5 active:bg-white/5 transition-colors"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-white/90 flex items-center">
                      <span className="truncate">{item.stock.name}</span>
                    </h3>
                    <div className="mt-1 space-y-0.5 text-[10px] text-white/40 font-mono">
                      <p>{item.amount.toLocaleString()}개 보유</p>
                      <p>평단 {Math.floor(item.averagePrice).toLocaleString()}원</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-mono font-bold text-sm text-white">{item.currentValue.toLocaleString()}원</p>
                    <p className={`font-mono text-[11px] font-bold mt-0.5 ${isProfit ? "text-red-400" : "text-blue-400"}`}>
                      {isProfit ? "+" : ""}{item.profit.toLocaleString()}원 ({isProfit ? "+" : ""}{item.profitPercent.toFixed(2)}%)
                    </p>
                    <p className={`text-[10px] font-bold mt-1 inline-flex items-center px-1.5 py-0.5 rounded ${item.isUp ? "bg-red-500/10 text-red-400" : item.isDown ? "bg-blue-500/10 text-blue-400" : "bg-white/5 text-white/30"}`}>
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

      <div className="absolute bottom-0 w-full h-14 bg-zinc-950 border-t border-white/10 flex items-center justify-around text-[10px] text-white/50 pb-1">
        <Link href="/crypto" className="flex flex-col items-center active:scale-95 transition-transform">
          <Bitcoin size={20} className="mb-1" />
          <span>코인목록</span>
        </Link>
        <Link href="/crypto/portfolio" className="flex flex-col items-center text-orange-400 active:scale-95 transition-transform">
          <PieChart size={20} className="mb-1" />
          <span className="font-bold">잔고</span>
        </Link>
      </div>
    </div>
  );
}
