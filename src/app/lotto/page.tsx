"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Ticket, Shuffle, CheckCircle, AlertCircle, Trophy, Sparkles } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

export default function LottoApp() {
  const { cash, lottoTickets, lastLottoResult, lottoPrizeMultiplier, buyLotto, clearLottoResult } = useGameStore();
  
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const toggleNumber = (num: number) => {
    setErrorMsg("");
    setSuccessMsg("");
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(prev => prev.filter(n => n !== num));
    } else {
      if (selectedNumbers.length >= 6) {
        setErrorMsg("최대 6개까지만 선택할 수 있습니다.");
        return;
      }
      setSelectedNumbers(prev => [...prev, num].sort((a, b) => a - b));
    }
  };

  const autoPick = () => {
    setErrorMsg("");
    setSuccessMsg("");
    const nums: number[] = [];
    while (nums.length < 6) {
      const n = Math.floor(Math.random() * 45) + 1;
      if (!nums.includes(n)) nums.push(n);
    }
    setSelectedNumbers(nums.sort((a, b) => a - b));
  };

  const clearSelection = () => {
    setSelectedNumbers([]);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleBuy = () => {
    if (selectedNumbers.length !== 6) {
      setErrorMsg("6개의 번호를 모두 선택해주세요.");
      return;
    }
    
    if (cash < 1000) {
      setErrorMsg("잔액이 부족합니다.");
      return;
    }

    const success = buyLotto([selectedNumbers]);
    if (success) {
      setSuccessMsg("로또를 구매했습니다! 다음 턴에 결과가 발표됩니다.");
      setSelectedNumbers([]);
    }
  };

  const handleBuyAuto5 = () => {
    if (cash < 5000) {
      setErrorMsg("잔액이 부족합니다. (5,000원 필요)");
      setSuccessMsg("");
      return;
    }

    const tickets: number[][] = [];
    for (let i = 0; i < 5; i++) {
      const nums: number[] = [];
      while (nums.length < 6) {
        const n = Math.floor(Math.random() * 45) + 1;
        if (!nums.includes(n)) nums.push(n);
      }
      tickets.push(nums.sort((a, b) => a - b));
    }

    const success = buyLotto(tickets);
    if (success) {
      setSuccessMsg("로또 5장을 자동 구매했습니다! (5,000원)");
      setErrorMsg("");
      setSelectedNumbers([]);
    }
  };

  // 번호 색상 (로또 스타일)
  const getNumberColor = (num: number) => {
    if (num <= 10) return 'from-yellow-500 to-amber-600';
    if (num <= 20) return 'from-blue-500 to-blue-700';
    if (num <= 30) return 'from-red-500 to-red-700';
    if (num <= 40) return 'from-zinc-400 to-zinc-600';
    return 'from-emerald-500 to-emerald-700';
  };

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col text-white relative">
      {/* 로또 앱 헤더 */}
      <div className="bg-gradient-to-r from-indigo-800 to-blue-700 px-4 py-3 flex items-center shadow-lg z-10 sticky top-0">
        <Link href="/" className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-base font-bold flex items-center text-yellow-300">
          <Ticket size={18} className="mr-2" />
          일확천금 로또 6/45
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 p-4 space-y-4">
        {/* 잔고 및 보유 티켓 */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex justify-between items-center animate-fade-in-up">
          <div>
            <span className="text-[10px] text-white/30 font-bold">내 지갑</span>
            <h2 className="text-lg font-mono font-bold">{cash.toLocaleString()} 원</h2>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-white/30 font-bold">이번 달 구매</span>
            <p className="text-lg font-bold text-yellow-400">{lottoTickets.length} <span className="text-xs text-white/30">장</span></p>
          </div>
        </div>

        {lottoPrizeMultiplier > 1 && (
          <div className="bg-yellow-500/15 border border-yellow-500/30 rounded-xl p-3 text-center animate-news-flash">
            <p className="text-[10px] text-yellow-300/70 font-bold uppercase tracking-widest">조상님 꿈 버프 적용 중</p>
            <p className="text-sm font-black text-yellow-300 mt-0.5">다음 추첨 당첨금 x{lottoPrizeMultiplier.toLocaleString()}</p>
          </div>
        )}

        {/* 이전 턴 당첨 결과 */}
        {lastLottoResult && (
          <div className="bg-gradient-to-b from-yellow-500/20 to-yellow-500/5 rounded-2xl p-4 border-2 border-yellow-500/30 animate-news-flash">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-base flex items-center text-yellow-300">
                <Trophy size={18} className="mr-2" /> 당첨 결과 발표!
              </h3>
              <button onClick={clearLottoResult} className="text-[10px] bg-white/10 px-2.5 py-1 rounded-lg font-bold text-white/60 hover:bg-white/20 transition-colors">닫기</button>
            </div>
            
            <p className="text-[10px] font-bold mb-2 text-center text-yellow-400/70 uppercase tracking-widest">당첨 번호</p>
            <div className="flex justify-center space-x-2 mb-4">
              {lastLottoResult.winningNumbers.map((n, i) => (
                <div key={i} className={`w-9 h-9 rounded-full bg-gradient-to-br ${getNumberColor(n)} flex items-center justify-center font-bold text-sm shadow-lg text-white`}>
                  {n}
                </div>
              ))}
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto bg-black/20 p-3 rounded-xl">
              {lastLottoResult.results.length > 0 ? (
                lastLottoResult.results.map((res, i) => (
                  <div key={i} className="flex justify-between text-[10px] items-center bg-white/5 p-2.5 rounded-lg border border-white/5">
                    <div className="flex space-x-1.5">
                      {res.numbers.map((n, j) => (
                        <span key={j} className={`font-bold font-mono ${lastLottoResult.winningNumbers.includes(n) ? 'text-yellow-400' : 'text-white/30'}`}>
                          {n.toString().padStart(2, '0')}
                        </span>
                      ))}
                    </div>
                    <span className={`font-bold ${res.prize > 0 ? 'text-yellow-400' : 'text-white/20'}`}>
                      {res.matchCount}개 ({res.prize.toLocaleString()}원)
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-[10px] text-white/20 py-2">지난 달 구매 내역 없음</div>
              )}
            </div>
            
            <div className="mt-3 pt-3 border-t border-yellow-500/20 text-center">
              {lastLottoResult.multiplier > 1 && (
                <p className="text-[10px] text-yellow-300 font-bold mb-1">꿈 버프 x{lastLottoResult.multiplier.toLocaleString()} 적용</p>
              )}
              <span className="text-xs text-white/40">총 당첨금: </span>
              <span className={`text-xl font-black ${lastLottoResult.totalPrize > 0 ? 'text-yellow-400' : 'text-white/30'}`}>
                {lastLottoResult.totalPrize.toLocaleString()}원
              </span>
            </div>
          </div>
        )}

        {/* 번호 선택기 */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-white/90 font-bold text-sm">번호 선택</h3>
              <p className="text-[10px] text-white/30">1~45 중 6개 번호를 고르세요</p>
            </div>
            <div className="text-[10px] font-bold text-white/50 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              {selectedNumbers.length} / 6
            </div>
          </div>

          {/* 선택된 번호 미리보기 */}
          {selectedNumbers.length > 0 && (
            <div className="flex justify-center space-x-2 mb-4 py-2">
              {selectedNumbers.map(n => (
                <div key={n} className={`w-8 h-8 rounded-full bg-gradient-to-br ${getNumberColor(n)} flex items-center justify-center font-bold text-xs shadow-lg text-white animate-pop-in`}>
                  {n}
                </div>
              ))}
              {Array.from({ length: 6 - selectedNumbers.length }).map((_, i) => (
                <div key={`empty-${i}`} className="w-8 h-8 rounded-full bg-white/5 border border-dashed border-white/10 flex items-center justify-center text-white/10 text-xs">?</div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-9 gap-1 mb-4">
            {Array.from({ length: 45 }, (_, i) => i + 1).map(num => {
              const isSelected = selectedNumbers.includes(num);
              return (
                <button
                  key={num}
                  onClick={() => toggleNumber(num)}
                  className={`aspect-square rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-150 ${
                    isSelected 
                      ? `bg-gradient-to-br ${getNumberColor(num)} text-white shadow-lg scale-110` 
                      : 'bg-white/5 text-white/40 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          <div className="flex space-x-2">
            <button 
              onClick={autoPick}
              className="flex-1 flex items-center justify-center py-3 bg-white/5 text-white rounded-xl font-bold active:scale-95 transition-all text-xs border border-white/10 hover:bg-white/10"
            >
              <Shuffle size={14} className="mr-1.5" /> 자동 선택
            </button>
            <button 
              onClick={clearSelection}
              className="flex-1 flex items-center justify-center py-3 bg-white/5 text-white/50 rounded-xl font-bold active:scale-95 transition-all text-xs border border-white/5 hover:bg-white/10"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 하단 구매 버튼 고정 */}
      <div className="absolute bottom-0 w-full bg-zinc-900/95 backdrop-blur-lg p-4 border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
        {errorMsg && <div className="text-red-400 text-[10px] text-center mb-2 font-bold flex items-center justify-center"><AlertCircle size={10} className="mr-1"/>{errorMsg}</div>}
        {successMsg && <div className="text-emerald-400 text-[10px] text-center mb-2 font-bold flex items-center justify-center"><CheckCircle size={10} className="mr-1"/>{successMsg}</div>}
        
        <div className="flex items-center justify-between mb-3 text-white/40 text-xs">
          <span>구매 금액</span>
          <span className="font-bold text-yellow-400 font-mono">1,000 원</span>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={handleBuyAuto5}
            className="flex-1 py-4 bg-white/5 text-white/80 border border-white/10 rounded-xl font-bold text-xs active:scale-95 transition-all flex flex-col items-center justify-center"
          >
            <Shuffle size={14} className="mb-1" />
            자동 5개
          </button>
          <button 
            onClick={handleBuy}
            className="flex-[2.5] py-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-zinc-900 rounded-xl font-black text-sm active:scale-95 transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center"
          >
            <Sparkles size={16} className="mr-1.5" />
            로또 구매하기
          </button>
        </div>
      </div>
    </div>
  );
}
