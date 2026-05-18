"use client";

import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown, Bitcoin, PieChart, History } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { calculatePriceChange } from "@/utils/calculatePriceChange";

export default function CryptoApp() {
  const { year, month, week, cash, stocks, marketPrices, portfolio } = useGameStore();

  const cryptoStocks = stocks.filter((s) => s.sector === 'crypto');
  
  const cryptoPortfolioValue = cryptoStocks.reduce((acc, stock) => {
    const amount = portfolio[stock.id]?.amount || 0;
    const price = marketPrices[stock.id]?.price || stock.basePrice;
    return acc + (amount * price);
  }, 0);

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col text-white relative">
      {/* 거래소 헤더 */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-3 flex items-center shadow-lg z-10 sticky top-0">
        <Link href="/" className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-base font-bold flex items-center flex-1">
          <Bitcoin size={18} className="mr-1.5" />
          비트고수
        </h1>
        <span className="text-[10px] text-white/60 bg-white/10 px-2 py-1 rounded-full">{year}.{String(month).padStart(2, '0')} W{week}</span>
      </div>

      {/* 내 계좌 요약 */}
      <div className="px-4 py-4 border-b border-white/5 bg-gradient-to-b from-zinc-900 to-zinc-950 flex justify-between items-center">
        <div>
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">보유 KRW</p>
          <p className="text-xl font-bold font-mono text-white">
            {cash.toLocaleString()} <span className="text-xs font-normal text-white/30">원</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">코인 평가액</p>
          <p className="text-lg font-bold font-mono text-orange-400">
            {cryptoPortfolioValue.toLocaleString()} <span className="text-xs font-normal text-orange-400/50">원</span>
          </p>
        </div>
      </div>

      {/* 코인 리스트 */}
      <div className="flex-1 overflow-y-auto pb-14">
        <div className="px-4 py-2 border-b border-white/5 bg-zinc-900/50 flex justify-between text-[9px] text-white/20 font-bold uppercase tracking-widest sticky top-0 z-10 backdrop-blur-md">
          <span>코인명</span>
          <span className="text-right">현재가 / 전월대비</span>
        </div>
        
        <div className="stagger-children">
          {cryptoStocks.map((stock) => {
            const currentPriceObj = marketPrices[stock.id];
            const price = currentPriceObj ? currentPriceObj.price : stock.basePrice;
            const history = currentPriceObj ? currentPriceObj.history : [stock.basePrice];
            const { changePercent, isUp, isDown } = calculatePriceChange(price, history);
            const held = portfolio[stock.id];

            const content = (
              <Link key={stock.id} href={`/stock/${stock.id}`} className="block px-4 py-4 border-b border-white/5 active:bg-white/5 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mr-3 text-white font-bold text-xs shadow-lg shadow-orange-500/20">
                      {stock.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white/90 flex items-center space-x-1.5">
                        <span>{stock.name}</span>
                        {currentPriceObj?.delisted && (
                          <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30 font-bold tracking-wider">상장폐지</span>
                        )}
                      </h3>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <span className="text-[9px] text-white/20">{stock.id.toUpperCase()}/KRW</span>
                        {held && held.amount > 0 && (
                          <span className="text-[8px] bg-orange-400/15 text-orange-400 px-1.5 py-0.5 rounded font-bold">{held.amount}개 보유</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className={`font-mono font-bold text-sm ${isUp ? 'text-red-400' : isDown ? 'text-blue-400' : 'text-white/60'}`}>
                      {price.toLocaleString()}
                    </span>
                    <span className={`text-[10px] font-bold mt-0.5 px-1.5 py-0.5 rounded-md ${isUp ? 'bg-red-500/10 text-red-400' : isDown ? 'bg-blue-500/10 text-blue-400' : 'bg-white/5 text-white/30'}`}>
                      {isUp && <TrendingUp size={9} className="inline mr-0.5" />}
                      {isDown && <TrendingDown size={9} className="inline mr-0.5" />}
                      {isUp ? '+' : ''}{changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </Link>
            );
            
            if (currentPriceObj?.delisted) {
              return (
                <div key={stock.id} className="opacity-50 grayscale pointer-events-none">
                  {content}
                </div>
              );
            }
            
            return content;
          })}
        </div>
        
        {cryptoStocks.length === 0 && (
          <div className="text-center p-8 text-white/20 text-sm">
            상장된 코인이 없습니다.
          </div>
        )}
      </div>

      {/* 하단 탭 */}
      <div className="absolute bottom-0 w-full h-14 bg-zinc-950 border-t border-white/10 flex items-center justify-around text-[10px] text-white/50 pb-1">
        <Link href="/crypto" className="flex flex-col items-center text-orange-400 active:scale-95 transition-transform">
          <Bitcoin size={20} className="mb-1" />
          <span className="font-bold">코인목록</span>
        </Link>
        <Link href="/crypto/portfolio" className="flex flex-col items-center active:scale-95 transition-transform">
          <PieChart size={20} className="mb-1" />
          <span>잔고</span>
        </Link>
        <Link href="/crypto/history" className="flex flex-col items-center active:scale-95 transition-transform">
          <History size={20} className="mb-1" />
          <span>거래내역</span>
        </Link>
      </div>
    </div>
  );
}
