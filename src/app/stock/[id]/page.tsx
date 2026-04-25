"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { calculatePriceChange } from "@/utils/calculatePriceChange";

export default function StockDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { stocks, marketPrices, portfolio, cash, buyStock, sellStock } = useGameStore();

  const stock = stocks.find((s) => s.id === id);
  const currentPriceObj = marketPrices[id];
  const currentItem = portfolio[id];

  const [tradeAmount, setTradeAmount] = useState<number | "">(1);
  const [errorMsg, setErrorMsg] = useState<string>("");

  if (!stock || !currentPriceObj) {
    return (
      <div className="w-full h-full bg-white flex flex-col items-center justify-center text-black">
        <p>종목을 찾을 수 없습니다.</p>
        <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">
          뒤로 가기
        </button>
      </div>
    );
  }

  const price = currentPriceObj.price;
  const history = currentPriceObj.history;
  const { change, changePercent, isUp, isDown } = calculatePriceChange(price, history);

  const amountToTrade = Number(tradeAmount) || 0;
  const maxBuy = Math.floor(cash / price);
  const maxSell = currentItem ? currentItem.amount : 0;

  const handleBuy = () => {
    if (amountToTrade <= 0) return;
    if (amountToTrade > maxBuy) {
      setErrorMsg("매수 가능 금액을 초과했습니다.");
      return;
    }
    const success = buyStock(stock.id, amountToTrade);
    if (success) {
      setErrorMsg("");
      setTradeAmount(1);
    }
  };

  const handleSell = () => {
    if (amountToTrade <= 0) return;
    if (amountToTrade > maxSell) {
      setErrorMsg("매도 가능 수량을 초과했습니다.");
      return;
    }
    const success = sellStock(stock.id, amountToTrade);
    if (success) {
      setErrorMsg("");
      setTradeAmount(1);
    }
  };

  // 간단한 차트 (CSS 막대 그래프)
  const maxHistoryPrice = Math.max(...history, price * 1.1);
  const minHistoryPrice = Math.min(...history, price * 0.9);
  const historyRange = maxHistoryPrice - minHistoryPrice;

  return (
    <div className="w-full h-full bg-white flex flex-col text-black">
      {/* 헤더 */}
      <div className="bg-red-600 text-white px-4 py-3 flex items-center shadow-md z-10">
        <button onClick={() => router.back()} className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">{stock.name}</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {/* 가격 정보 */}
        <div className="px-5 py-6 bg-zinc-50 border-b border-zinc-200">
          <h2 className="text-3xl font-mono font-bold tracking-tight mb-2">
            <span className={isUp ? 'text-red-600' : isDown ? 'text-blue-600' : 'text-zinc-800'}>
              {price.toLocaleString()}
            </span>
            <span className="text-lg font-normal text-zinc-500 ml-1">원</span>
          </h2>
          <div className="flex items-center text-sm font-bold">
            <span className={`flex items-center px-2 py-1 rounded ${isUp ? 'bg-red-100 text-red-600' : isDown ? 'bg-blue-100 text-blue-600' : 'bg-zinc-200 text-zinc-600'}`}>
              {isUp && <TrendingUp size={14} className="mr-1" />}
              {isDown && <TrendingDown size={14} className="mr-1" />}
              {isUp ? '+' : ''}{change.toLocaleString()} ({isUp ? '+' : ''}{changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* 차트 영역 (단순화된 바 차트) */}
        <div className="h-40 px-4 py-4 border-b border-zinc-200 flex items-end justify-between space-x-1">
          {history.slice(-20).map((hPrice, i) => {
            const hRatio = ((hPrice - minHistoryPrice) / historyRange) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col justify-end items-center h-full">
                <div 
                  className={`w-full max-w-[8px] rounded-t-sm ${i > 0 && hPrice >= history[history.length - 20 + i - 1] ? 'bg-red-500' : 'bg-blue-500'}`} 
                  style={{ height: `${Math.max(5, hRatio)}%` }}
                ></div>
              </div>
            );
          })}
        </div>

        {/* 종목 정보 */}
        <div className="px-4 py-4 border-b border-zinc-200">
          <h3 className="text-xs text-zinc-500 font-bold mb-2">기업 개요</h3>
          <p className="text-sm text-zinc-800 leading-relaxed bg-zinc-100 p-3 rounded-lg border border-zinc-200">
            {stock.description}
          </p>
        </div>

        {/* 내 보유 잔고 */}
        <div className="px-4 py-4">
          <h3 className="text-xs text-zinc-500 font-bold mb-2">나의 잔고</h3>
          {currentItem && currentItem.amount > 0 ? (
            <div className="bg-zinc-100 p-4 rounded-xl border border-zinc-200 flex justify-between items-center">
              <div>
                <p className="text-xs text-zinc-500">보유 수량</p>
                <p className="text-lg font-bold font-mono">{currentItem.amount}주</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500">평가 금액 (수익률)</p>
                <p className="text-lg font-bold font-mono">
                  {(price * currentItem.amount).toLocaleString()}원
                </p>
                <p className={`text-xs font-bold ${price >= currentItem.averagePrice ? 'text-red-600' : 'text-blue-600'}`}>
                  {price >= currentItem.averagePrice ? '+' : ''}
                  {(((price - currentItem.averagePrice) / currentItem.averagePrice) * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-center text-sm text-zinc-500">
              보유한 주식이 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* 주문 영역 (하단 고정) */}
      <div className="absolute bottom-0 w-full bg-white border-t border-zinc-200 p-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between text-xs text-zinc-500 mb-2 px-1">
          <span>예수금: {cash.toLocaleString()}원</span>
          <span>최대가능: {maxBuy}주</span>
        </div>
        
        <div className="flex space-x-2 mb-3">
          <button onClick={() => setTradeAmount(Math.max(1, amountToTrade - 1))} className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center font-bold">-</button>
          <input 
            type="number" 
            value={tradeAmount} 
            onChange={(e) => {
              const val = e.target.value;
              setTradeAmount(val === "" ? "" : Number(val));
              setErrorMsg("");
            }}
            className="flex-1 bg-zinc-100 rounded-lg text-center font-mono font-bold outline-none focus:ring-2 focus:ring-red-500"
          />
          <button onClick={() => setTradeAmount(amountToTrade + 1)} className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center font-bold">+</button>
        </div>

        {errorMsg && (
          <p className="text-red-500 text-xs text-center mb-2 font-bold">{errorMsg}</p>
        )}

        <div className="flex space-x-2">
          <button 
            onClick={handleSell}
            disabled={maxSell === 0 || amountToTrade > maxSell || amountToTrade <= 0}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:bg-zinc-400 active:scale-95 transition-transform"
          >
            매도
          </button>
          <button 
            onClick={handleBuy}
            disabled={maxBuy === 0 || amountToTrade > maxBuy || amountToTrade <= 0}
            className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:bg-zinc-400 active:scale-95 transition-transform"
          >
            매수
          </button>
        </div>
      </div>
    </div>
  );
}
