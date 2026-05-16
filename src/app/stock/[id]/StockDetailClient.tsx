"use client";

import { useState, use, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Plus } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { calculatePriceChange } from "@/utils/calculatePriceChange";
import StockChart from "@/components/StockChart";

export default function StockDetailClient({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { stocks, marketPrices, portfolio, cash, buyStock, sellStock } = useGameStore();

  const stock = stocks.find((s) => s.id === id);
  const currentPriceObj = marketPrices[id];
  const currentItem = portfolio[id];

  const [tradeAmount, setTradeAmount] = useState<number | "">(1);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  if (!stock || !currentPriceObj) {
    return (
      <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center text-white">
        <p className="text-white/60 mb-4">종목을 찾을 수 없습니다.</p>
        <button onClick={() => router.back()} className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold">
          뒤로 가기
        </button>
      </div>
    );
  }

  const price = currentPriceObj.price;
  const history = currentPriceObj.history;
  const isTradable = !currentPriceObj.delisted && price > 0;
  const { change, changePercent, isUp, isDown } = calculatePriceChange(price, history);

  const amountToTrade = Number(tradeAmount) || 0;
  const isWholeAmount = Number.isInteger(amountToTrade);
  const maxBuy = isTradable ? Math.floor(cash / price) : 0;
  const maxSell = currentItem ? currentItem.amount : 0;

  const handleBuy = () => {
    if (!isTradable) {
      setErrorMsg("거래가 중지된 종목입니다.");
      return;
    }
    if (amountToTrade <= 0) return;
    if (!isWholeAmount) {
      setErrorMsg("정수 수량만 거래할 수 있습니다.");
      return;
    }
    if (amountToTrade > maxBuy) {
      setErrorMsg("매수 가능 금액을 초과했습니다.");
      return;
    }
    const success = buyStock(stock.id, amountToTrade);
    if (success) {
      setErrorMsg("");
      setSuccessMsg(`${stock.name} ${amountToTrade}주 매수 완료!`);
      setTradeAmount(1);
      setTimeout(() => setSuccessMsg(""), 2000);
    }
  };

  const handleSell = () => {
    if (!isTradable) {
      setErrorMsg("거래가 중지된 종목입니다.");
      return;
    }
    if (amountToTrade <= 0) return;
    if (!isWholeAmount) {
      setErrorMsg("정수 수량만 거래할 수 있습니다.");
      return;
    }
    if (amountToTrade > maxSell) {
      setErrorMsg("매도 가능 수량을 초과했습니다.");
      return;
    }
    const success = sellStock(stock.id, amountToTrade);
    if (success) {
      setErrorMsg("");
      setSuccessMsg(`${stock.name} ${amountToTrade}주 매도 완료!`);
      setTradeAmount(1);
      setTimeout(() => setSuccessMsg(""), 2000);
    }
  };

  const profitPercent = currentItem && currentItem.averagePrice > 0 
    ? ((price - currentItem.averagePrice) / currentItem.averagePrice) * 100 
    : 0;
  
  const profitAmount = currentItem ? Math.floor((price - currentItem.averagePrice) * currentItem.amount) : 0;

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col text-white relative">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-red-700 to-red-600 text-white px-4 py-3 flex items-center shadow-lg z-10 relative">
        <button onClick={() => router.back()} className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={22} />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-bold">{stock.name}</h1>
          <span className="text-[10px] text-white/60">{stock.sector.toUpperCase()}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-64">
        {/* 가격 정보 */}
        <div className="px-5 py-5 border-b border-white/5">
          <h2 className="text-3xl font-mono font-black tracking-tight mb-1">
            <span className={isUp ? 'text-red-400' : isDown ? 'text-blue-400' : 'text-white'}>
              {price.toLocaleString()}
            </span>
            <span className="text-sm font-normal text-white/30 ml-1">원</span>
          </h2>
          <div className="flex items-center text-sm font-bold space-x-2">
            <span className={`flex items-center px-2.5 py-1 rounded-lg text-xs ${isUp ? 'bg-red-500/15 text-red-400' : isDown ? 'bg-blue-500/15 text-blue-400' : 'bg-white/10 text-white/60'}`}>
              {isUp && <TrendingUp size={12} className="mr-1" />}
              {isDown && <TrendingDown size={12} className="mr-1" />}
              {isUp ? '+' : ''}{change.toLocaleString()} ({isUp ? '+' : ''}{changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="border-b border-white/5 pb-2 pt-2 bg-[#12121e]">
          <StockChart history={history} isUp={isUp} />
        </div>

        {/* 내 보유 잔고 */}
        <div className="px-4 py-4">
          <h3 className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-2">나의 잔고</h3>
          {currentItem && currentItem.amount > 0 ? (
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-white/30 mb-1">보유 수량</p>
                <p className="text-xl font-bold font-mono">{currentItem.amount}<span className="text-xs text-white/30">주</span></p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/30 mb-1">평가 금액</p>
                <p className="text-lg font-bold font-mono">{(price * currentItem.amount).toLocaleString()}<span className="text-xs text-white/30 ml-0.5">원</span></p>
                <p className={`text-xs font-bold mt-0.5 ${profitPercent >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
                  {profitAmount >= 0 ? '+' : ''}{profitAmount.toLocaleString()}원 ({profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%)
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center text-sm text-white/30">
              보유한 주식이 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* 성공/오류 메시지 */}
      {successMsg && (
        <div className="absolute top-16 left-4 right-4 z-20 bg-emerald-500/90 text-white p-3 rounded-xl text-xs font-bold text-center animate-slide-in-bottom shadow-lg">
          ✅ {successMsg}
        </div>
      )}

      {/* 주문 영역 (하단 고정) */}
      <div className="absolute bottom-0 w-full bg-zinc-900/95 backdrop-blur-lg border-t border-white/10 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between text-[10px] text-white/30 mb-2 px-1">
            <span>예수금: {cash.toLocaleString()}원</span>
          <span>{isTradable ? `최대매수: ${maxBuy}주` : '거래정지'}</span>
        </div>
        
        {/* 수량 컨트롤 */}
        <div className="flex items-center space-x-2 mb-3">
          <button 
            onClick={() => setTradeAmount(Math.max(1, amountToTrade - 1))} 
            className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center font-bold active:scale-95 transition-transform border border-white/10 hover:bg-white/10"
          >
            <Minus size={16} />
          </button>
          <input 
            type="number" 
            min={1}
            step={1}
            value={tradeAmount} 
            onChange={(e) => {
              const val = e.target.value;
              setTradeAmount(val === "" ? "" : Number(val));
              setErrorMsg("");
            }}
            className="flex-1 bg-white/5 rounded-xl text-center font-mono font-bold text-lg outline-none border border-white/10 focus:border-white/30 transition-colors h-10"
          />
          <button 
            onClick={() => setTradeAmount(amountToTrade + 1)} 
            className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center font-bold active:scale-95 transition-transform border border-white/10 hover:bg-white/10"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* 빠른 수량 선택 */}
        <div className="flex space-x-1.5 mb-2">
          {[1, 10, 50, 100].map((val, idx) => (
            <button 
              key={idx} 
              onClick={() => setTradeAmount(prev => (Number(prev) || 0) + val)}
              className="flex-1 bg-white/5 rounded-lg py-1.5 text-[10px] font-bold text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors border border-white/5"
            >
              +{val}주
            </button>
          ))}
        </div>
        
        <div className="flex space-x-1.5 mb-3">
          <button 
            onClick={() => setTradeAmount(maxSell > 0 ? maxSell : 0)}
            className="flex-1 bg-blue-500/10 text-blue-400 rounded-lg py-2 text-[11px] font-bold hover:bg-blue-500/20 transition-colors border border-blue-500/20"
          >
            전량 매도
          </button>
          <button 
            onClick={() => setTradeAmount(maxBuy > 0 ? maxBuy : 0)}
            className="flex-1 bg-red-500/10 text-red-400 rounded-lg py-2 text-[11px] font-bold hover:bg-red-500/20 transition-colors border border-red-500/20"
          >
            전량 매수
          </button>
        </div>

        {errorMsg && (
          <p className="text-red-400 text-[10px] text-center mb-2 font-bold">{errorMsg}</p>
        )}

        <div className="flex space-x-2">
          <button 
            onClick={handleSell}
            disabled={!isTradable || !isWholeAmount || maxSell === 0 || amountToTrade > maxSell || amountToTrade <= 0}
            className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm disabled:opacity-20 active:scale-95 transition-all shadow-lg shadow-blue-600/20"
          >
            매도
          </button>
          <button 
            onClick={handleBuy}
            disabled={!isTradable || !isWholeAmount || maxBuy === 0 || amountToTrade > maxBuy || amountToTrade <= 0}
            className="flex-1 py-3.5 bg-red-600 text-white rounded-xl font-bold text-sm disabled:opacity-20 active:scale-95 transition-all shadow-lg shadow-red-600/20"
          >
            매수
          </button>
        </div>
      </div>
    </div>
  );
}
