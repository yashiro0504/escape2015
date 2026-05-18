"use client";

import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown, PieChart, History } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

export default function StockApp() {
  const { year, month, cash, stocks, marketPrices } = useGameStore();

  return (
    <div className="w-full h-full bg-white flex flex-col text-black relative">
      {/* 증권 앱 헤더 */}
      <div className="bg-red-600 text-white px-4 py-3 flex items-center shadow-md z-10 sticky top-0">
        <Link href="/" className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold">평민문 S ({year}년 {month}월)</h1>
      </div>

      {/* 내 계좌 요약 */}
      <div className="bg-zinc-100 px-4 py-3 border-b border-zinc-200 flex justify-between items-center">
        <div>
          <p className="text-xs text-zinc-500 mb-1">D+2 추정 예수금</p>
          <p className="text-xl font-bold font-mono">
            {cash.toLocaleString()} <span className="text-sm font-normal">원</span>
          </p>
        </div>
      </div>

      {/* 관심종목 리스트 */}
      <div className="flex-1 overflow-y-auto pb-14">
        <div className="px-4 py-2 border-b border-zinc-200 bg-zinc-50 flex justify-between text-xs text-zinc-500 font-medium sticky top-0 z-10">
          <span>종목명</span>
          <span className="text-right">현재가 / 전월대비</span>
        </div>
        
        {stocks.filter(s => s.sector !== 'crypto').map((stock) => {
          const currentPriceObj = marketPrices[stock.id];
          const price = currentPriceObj ? currentPriceObj.price : stock.basePrice;
          
          // 전월 가격 비교 (히스토리에서 확인)
          const history = currentPriceObj ? currentPriceObj.history : [stock.basePrice];
          const prevPrice = history.length > 1 ? history[history.length - 2] : price;
          
          const change = price - prevPrice;
          const changePercent = prevPrice === 0 ? 0 : (change / prevPrice) * 100;
          const isUp = change > 0;
          const isDown = change < 0;

          return (
            <Link key={stock.id} href={`/stock/${stock.id}`} className="block px-4 py-3 border-b border-zinc-100 active:bg-zinc-100 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-sm text-zinc-800">{stock.name}</h3>
                  <span className="text-[10px] text-zinc-400">{stock.sector.toUpperCase()}</span>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className={`font-mono font-bold ${isUp ? 'text-red-600' : isDown ? 'text-blue-600' : 'text-zinc-800'}`}>
                    {price.toLocaleString()}
                  </span>
                  <span className={`text-[11px] font-bold flex items-center mt-0.5 px-1 rounded ${isUp ? 'bg-red-50 text-red-600' : isDown ? 'bg-blue-50 text-blue-600' : 'bg-zinc-100 text-zinc-500'}`}>
                    {isUp && <TrendingUp size={10} className="mr-0.5" />}
                    {isDown && <TrendingDown size={10} className="mr-0.5" />}
                    {isUp ? '+' : ''}{changePercent.toFixed(1)}%
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 하단 탭 (MTS 스타일) */}
      <div className="absolute bottom-0 w-full h-14 bg-white border-t border-zinc-200 flex items-center justify-around text-[10px] text-zinc-500 pb-1">
        <Link href="/stock" className="flex flex-col items-center text-red-600 active:scale-95 transition-transform">
          <TrendingUp size={20} className="mb-1" />
          <span className="font-bold">관심종목</span>
        </Link>
        <Link href="/stock/portfolio" className="flex flex-col items-center active:scale-95 transition-transform">
          <PieChart size={20} className="mb-1" />
          <span>잔고</span>
        </Link>
        <Link href="/stock/history" className="flex flex-col items-center active:scale-95 transition-transform">
          <History size={20} className="mb-1" />
          <span>거래내역</span>
        </Link>
      </div>
    </div>
  );
}
