"use client";

import Link from "next/link";
import { ArrowLeft, Bitcoin, History, PieChart } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

export default function CryptoHistoryApp() {
  const { tradeHistory, stocks } = useGameStore();

  // 코인 내역만 필터링
  const cryptoHistory = tradeHistory.filter((record) => {
    const stock = stocks.find((s) => s.id === record.stockId);
    return stock && stock.sector === "crypto";
  });

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col text-white relative">
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-3 flex items-center shadow-lg z-10 sticky top-0">
        <Link href="/crypto" className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-base font-bold flex items-center">
          <History size={18} className="mr-1.5" />
          거래내역
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-16">
        {cryptoHistory.length === 0 ? (
          <div className="h-[360px] flex flex-col items-center justify-center text-center px-8">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center mb-4 text-white/20">
              <History size={28} />
            </div>
            <p className="text-sm font-bold text-white/70 mb-1">거래 내역이 없습니다.</p>
            <p className="text-xs text-white/40 leading-relaxed">코인을 매수하거나 매도하면 여기에 기록됩니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {cryptoHistory.map((record) => {
              const isBuy = record.type === "buy";
              const isProfit = record.realizedProfit ? record.realizedProfit > 0 : false;
              const isLoss = record.realizedProfit ? record.realizedProfit < 0 : false;

              return (
                <div key={record.id} className="px-4 py-4 hover:bg-white/5 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-white/30 font-bold tracking-wide mb-1">{record.date}</span>
                      <h3 className="font-bold text-sm text-white/90">{record.stockName}</h3>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isBuy ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {isBuy ? "매수" : "매도"}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mt-2">
                    <div className="text-[11px] font-mono text-white/50">
                      <p>{record.price.toLocaleString()}원 × {record.amount.toLocaleString()}개</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold font-mono text-white">
                        {record.totalAmount.toLocaleString()}원
                      </p>
                      {!isBuy && record.realizedProfit !== undefined && (
                        <p
                          className={`text-[11px] font-bold mt-0.5 ${
                            isProfit ? "text-red-400" : isLoss ? "text-blue-400" : "text-white/40"
                          }`}
                        >
                          손익: {isProfit ? "+" : ""}{record.realizedProfit.toLocaleString()}원
                          {record.realizedProfitRate !== undefined &&
                            ` (${isProfit ? "+" : ""}${record.realizedProfitRate.toFixed(2)}%)`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 w-full h-14 bg-zinc-950 border-t border-white/10 flex items-center justify-around text-[10px] text-white/50 pb-1">
        <Link href="/crypto" className="flex flex-col items-center active:scale-95 transition-transform">
          <Bitcoin size={20} className="mb-1" />
          <span>코인목록</span>
        </Link>
        <Link href="/crypto/portfolio" className="flex flex-col items-center active:scale-95 transition-transform">
          <PieChart size={20} className="mb-1" />
          <span>잔고</span>
        </Link>
        <Link href="/crypto/history" className="flex flex-col items-center text-orange-400 active:scale-95 transition-transform">
          <History size={20} className="mb-1" />
          <span className="font-bold">거래내역</span>
        </Link>
      </div>
    </div>
  );
}
