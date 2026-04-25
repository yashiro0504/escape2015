"use client";

import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown, Bitcoin } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { calculatePriceChange } from "@/utils/calculatePriceChange";

export default function CryptoApp() {
  const { year, month, cash, stocks, marketPrices } = useGameStore();

  const cryptoStocks = stocks.filter((s) => s.sector === 'crypto');

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col text-white relative">
      {/* 거래소 헤더 */}
      <div className="bg-blue-900 text-white px-4 py-3 flex items-center shadow-md z-10 sticky top-0">
        <Link href="/" className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold flex items-center">
          <Bitcoin size={20} className="mr-1" />
          비트고수 ({year}년 {month}월)
        </h1>
      </div>

      {/* 내 계좌 요약 */}
      <div className="bg-zinc-900 px-4 py-4 border-b border-zinc-800 flex justify-between items-center shadow-inner">
        <div>
          <p className="text-xs text-zinc-400 mb-1">보유 KRW</p>
          <p className="text-xl font-bold font-mono text-zinc-100">
            {cash.toLocaleString()} <span className="text-sm font-normal text-zinc-500">원</span>
          </p>
        </div>
      </div>

      {/* 코인 리스트 */}
      <div className="flex-1 overflow-y-auto pb-14">
        <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900 flex justify-between text-xs text-zinc-400 font-medium sticky top-0 z-10">
          <span>코인명</span>
          <span className="text-right">현재가 / 전월대비</span>
        </div>
        
        {cryptoStocks.map((stock) => {
          const currentPriceObj = marketPrices[stock.id];
          const price = currentPriceObj ? currentPriceObj.price : stock.basePrice;
          
          const history = currentPriceObj ? currentPriceObj.history : [stock.basePrice];
          
          const { changePercent, isUp, isDown } = calculatePriceChange(price, history);

          return (
            <Link key={stock.id} href={`/stock/${stock.id}`} className="block px-4 py-4 border-b border-zinc-800/50 active:bg-zinc-800 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center mr-3 text-white font-bold text-xs shadow-[0_0_10px_rgba(249,115,22,0.4)]">
                    {stock.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-100">{stock.name}</h3>
                    <span className="text-[10px] text-zinc-500">{stock.id.toUpperCase()}/KRW</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className={`font-mono font-bold ${isUp ? 'text-red-500' : isDown ? 'text-blue-500' : 'text-zinc-300'}`}>
                    {price.toLocaleString()}
                  </span>
                  <span className={`text-[11px] font-bold mt-0.5 ${isUp ? 'text-red-500' : isDown ? 'text-blue-500' : 'text-zinc-500'}`}>
                    {isUp ? '+' : ''}{changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
        
        {cryptoStocks.length === 0 && (
          <div className="text-center p-8 text-zinc-500 text-sm">
            상장된 코인이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
