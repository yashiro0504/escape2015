"use client";

import Link from "next/link";
import { ArrowLeft, History, PieChart, TrendingUp } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

export default function StockHistoryApp() {
  const { tradeHistory, stocks } = useGameStore();

  // 주식 내역만 필터링
  const stockHistory = tradeHistory.filter((record) => {
    const stock = stocks.find((s) => s.id === record.stockId);
    return stock && stock.sector !== "crypto";
  });

  return (
    <div className="w-full h-full bg-white flex flex-col text-black relative">
      <div className="bg-red-600 text-white px-4 py-3 flex items-center shadow-md z-10 sticky top-0">
        <Link href="/stock" className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold flex items-center">
          <History size={19} className="mr-2" />
          거래내역
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-16">
        {stockHistory.length === 0 ? (
          <div className="h-[360px] flex flex-col items-center justify-center text-center px-8">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4 text-zinc-400">
              <History size={28} />
            </div>
            <p className="text-sm font-bold text-zinc-700 mb-1">거래 내역이 없습니다.</p>
            <p className="text-xs text-zinc-400 leading-relaxed">주식을 매수하거나 매도하면 여기에 기록됩니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {stockHistory.map((record) => {
              const isBuy = record.type === "buy";
              const isProfit = record.realizedProfit ? record.realizedProfit > 0 : false;
              const isLoss = record.realizedProfit ? record.realizedProfit < 0 : false;

              return (
                <div key={record.id} className="px-4 py-3 bg-white">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-400 mb-0.5">{record.date}</span>
                      <h3 className="font-bold text-sm text-zinc-800">{record.stockName}</h3>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isBuy ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {isBuy ? "매수" : "매도"}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mt-2">
                    <div className="text-[11px] font-mono text-zinc-500">
                      <p>{record.price.toLocaleString()}원 × {record.amount.toLocaleString()}주</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold font-mono text-zinc-900">
                        {record.totalAmount.toLocaleString()}원
                      </p>
                      {!isBuy && record.realizedProfit !== undefined && (
                        <p
                          className={`text-[11px] font-bold mt-0.5 ${
                            isProfit ? "text-red-600" : isLoss ? "text-blue-600" : "text-zinc-500"
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

      <div className="absolute bottom-0 w-full h-14 bg-white border-t border-zinc-200 flex items-center justify-around text-[10px] text-zinc-500 pb-1">
        <Link href="/stock" className="flex flex-col items-center active:scale-95 transition-transform">
          <TrendingUp size={20} className="mb-1" />
          <span>관심종목</span>
        </Link>
        <Link href="/stock/portfolio" className="flex flex-col items-center active:scale-95 transition-transform">
          <PieChart size={20} className="mb-1" />
          <span>잔고</span>
        </Link>
        <Link href="/stock/history" className="flex flex-col items-center text-red-600 active:scale-95 transition-transform">
          <History size={20} className="mb-1" />
          <span className="font-bold">거래내역</span>
        </Link>
      </div>
    </div>
  );
}
