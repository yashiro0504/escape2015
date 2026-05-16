"use client";

import { useGameStore, getPortfolioValue } from "@/store/gameStore";
import { Trophy, Skull, RefreshCw, CalendarDays, Wallet } from "lucide-react";

interface EndScreenProps {
  isWon: boolean;
  reason: string;
}

export default function EndScreen({ isWon, reason }: EndScreenProps) {
  const { resetGame, year, month, week, cash, deposit, portfolio, marketPrices, realEstateAssetValue, loan } = useGameStore();

  const handleReset = () => {
    resetGame();
  };

  const portfolioValue = getPortfolioValue(portfolio, marketPrices);
  const totalBalance = cash + deposit + portfolioValue + realEstateAssetValue - loan;

  const durationStr = `${year - 2015}년 ${month}개월`;

  return (
    <div className={`w-full h-full flex flex-col relative overflow-hidden text-white font-sans ${isWon ? 'bg-zinc-950' : 'bg-black'}`}>
      {/* 배경 데코 */}
      <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[100px] ${isWon ? 'bg-amber-500/20' : 'bg-red-900/30'}`} />
      <div className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-[100px] ${isWon ? 'bg-emerald-500/20' : 'bg-zinc-800/50'}`} />

      {/* 축하 파티클 (승리 시) - 심플하게 CSS로 구현하거나 생략, 여기서는 배경색으로 느낌만 */}
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 animate-fade-in-up">
        {/* 아이콘 */}
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 shadow-2xl border-4 ${
          isWon 
            ? 'bg-gradient-to-br from-yellow-400 to-amber-600 border-yellow-200/30 shadow-[0_0_50px_rgba(251,191,36,0.4)]' 
            : 'bg-gradient-to-br from-zinc-800 to-zinc-950 border-zinc-700/50 shadow-[0_0_50px_rgba(239,68,68,0.2)]'
        }`}>
          {isWon ? <Trophy size={48} className="text-white" /> : <Skull size={48} className="text-red-500" />}
        </div>

        {/* 타이틀 */}
        <h1 className={`text-4xl font-black tracking-tight mb-4 text-center ${
          isWon 
            ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 text-transparent bg-clip-text' 
            : 'text-white'
        }`}>
          {isWon ? "탈출 성공!" : "게임 오버"}
        </h1>

        <p className={`text-sm text-center mb-10 leading-relaxed px-4 ${isWon ? 'text-amber-100/80' : 'text-zinc-400'}`}>
          {reason}
        </p>

        {/* 통계 요약 카드 */}
        <div className="w-full max-w-[300px] glass p-5 rounded-3xl border border-white/10 shadow-2xl mb-10">
          <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 text-center">최종 기록</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-white/70">
                <CalendarDays size={14} className="mr-2 opacity-50" />
                <span className="text-sm font-medium">소요 시간</span>
              </div>
              <span className="text-sm font-bold">{durationStr}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center text-white/70">
                <Wallet size={14} className="mr-2 opacity-50" />
                <span className="text-sm font-medium">최종 자산</span>
              </div>
              <span className={`text-sm font-bold font-mono ${totalBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {totalBalance.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* 리셋 버튼 */}
        <button
          onClick={handleReset}
          className="group relative flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 active:bg-white/5 border border-white/20 rounded-2xl px-8 py-4 transition-all"
        >
          <RefreshCw size={18} className="text-white group-active:-rotate-180 transition-transform duration-500" />
          <span className="text-white font-bold tracking-wide">새로운 인생 시작하기</span>
        </button>
      </div>
    </div>
  );
}
