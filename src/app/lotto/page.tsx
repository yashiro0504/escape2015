"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Ticket, Shuffle, CheckCircle, AlertCircle } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

export default function LottoApp() {
  const { cash, lottoTickets, lastLottoResult, buyLotto, clearLottoResult } = useGameStore();
  
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

  return (
    <div className="w-full h-full bg-blue-900 flex flex-col text-white relative">
      {/* 로또 앱 헤더 */}
      <div className="bg-blue-950 px-4 py-3 flex items-center shadow-md z-10 sticky top-0 border-b border-blue-800">
        <Link href="/" className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold flex items-center text-yellow-400">
          <Ticket size={20} className="mr-2" />
          일확천금 로또 6/45
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 p-4">
        {/* 잔고 및 보유 티켓 */}
        <div className="bg-blue-800 rounded-xl p-4 mb-4 shadow-lg flex justify-between items-center border border-blue-700">
          <div>
            <span className="text-xs text-blue-300">내 지갑</span>
            <h2 className="text-lg font-mono font-bold">{cash.toLocaleString()} 원</h2>
          </div>
          <div className="text-right">
            <span className="text-xs text-blue-300">이번 달 구매</span>
            <p className="text-lg font-bold text-yellow-400">{lottoTickets.length} 장</p>
          </div>
        </div>

        {/* 이전 턴 당첨 결과 모달/알림 */}
        {lastLottoResult && (
          <div className="bg-yellow-100 text-yellow-900 rounded-xl p-4 mb-6 shadow-xl border-2 border-yellow-400 animate-in fade-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg flex items-center">
                <TrophyIcon className="mr-2" /> 당첨 결과 발표!
              </h3>
              <button onClick={clearLottoResult} className="text-xs bg-yellow-300 px-2 py-1 rounded-md font-bold">닫기</button>
            </div>
            
            <p className="text-sm font-bold mb-2 text-center text-yellow-700">당첨 번호</p>
            <div className="flex justify-center space-x-2 mb-4">
              {lastLottoResult.winningNumbers.map((n, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow">
                  {n}
                </div>
              ))}
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto bg-white/50 p-2 rounded-lg">
              {lastLottoResult.results.length > 0 ? (
                lastLottoResult.results.map((res, i) => (
                  <div key={i} className="flex justify-between text-xs items-center bg-white p-2 rounded shadow-sm border border-yellow-200">
                    <div className="flex space-x-1">
                      {res.numbers.map((n, j) => (
                        <span key={j} className={`font-bold ${lastLottoResult.winningNumbers.includes(n) ? 'text-blue-600' : 'text-zinc-400'}`}>
                          {n.toString().padStart(2, '0')}
                        </span>
                      ))}
                    </div>
                    <span className={`font-bold ${res.prize > 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                      {res.matchCount}개 맞춤 ({res.prize.toLocaleString()}원)
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-xs text-yellow-700 py-2">지난 달에 구매한 내역이 없습니다.</div>
              )}
            </div>
            
            <div className="mt-3 pt-3 border-t border-yellow-300 text-center">
              <span className="text-sm">총 당첨금: </span>
              <span className="text-xl font-black text-red-600">{lastLottoResult.totalPrize.toLocaleString()}원</span>
            </div>
          </div>
        )}

        {/* 번호 선택기 */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-blue-900 font-bold text-lg">번호 선택</h3>
              <p className="text-xs text-blue-600">1~45 중 6개 번호를 고르세요</p>
            </div>
            <div className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-1 rounded-full">
              {selectedNumbers.length} / 6
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 mb-6">
            {Array.from({ length: 45 }, (_, i) => i + 1).map(num => {
              const isSelected = selectedNumbers.includes(num);
              return (
                <button
                  key={num}
                  onClick={() => toggleNumber(num)}
                  className={`w-full aspect-square rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isSelected ? 'bg-blue-600 text-white shadow-md scale-110' : 'bg-zinc-100 text-zinc-600 hover:bg-blue-100'
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
              className="flex-1 flex items-center justify-center py-3 bg-zinc-800 text-white rounded-xl font-bold active:scale-95 transition-transform text-sm"
            >
              <Shuffle size={16} className="mr-1" /> 자동 선택
            </button>
            <button 
              onClick={clearSelection}
              className="flex-1 flex items-center justify-center py-3 bg-zinc-200 text-zinc-800 rounded-xl font-bold active:scale-95 transition-transform text-sm"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 하단 구매 버튼 고정 */}
      <div className="absolute bottom-0 w-full bg-blue-950 p-4 border-t border-blue-800 shadow-[0_-4px_15px_rgba(0,0,0,0.2)]">
        {errorMsg && <div className="text-red-400 text-xs text-center mb-2 font-bold flex items-center justify-center"><AlertCircle size={12} className="mr-1"/>{errorMsg}</div>}
        {successMsg && <div className="text-green-400 text-xs text-center mb-2 font-bold flex items-center justify-center"><CheckCircle size={12} className="mr-1"/>{successMsg}</div>}
        
        <div className="flex items-center justify-between mb-3 text-blue-200 text-sm">
          <span>구매 금액</span>
          <span className="font-bold text-yellow-400">1,000 원</span>
        </div>
        
        <button 
          onClick={handleBuy}
          className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-blue-950 rounded-xl font-black text-lg active:scale-95 transition-transform shadow-[0_0_15px_rgba(250,204,21,0.4)]"
        >
          로또 구매하기
        </button>
      </div>
    </div>
  );
}

function TrophyIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
