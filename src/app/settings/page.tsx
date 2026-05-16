"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, CheckCircle2, Database, RotateCcw, Settings, Wallet, Volume2, VolumeX, Vibrate, VibrateOff, Trophy, ChevronRight } from "lucide-react";
import { getPortfolioValue, useGameStore } from "@/store/gameStore";

export default function SettingsApp() {
  const router = useRouter();
  const {
    year,
    month,
    week,
    cash,
    deposit,
    loan,
    portfolio,
    marketPrices,
    realEstateAssetValue,
    resetGame,
    soundEnabled,
    hapticEnabled,
    toggleSound,
    toggleHaptic
  } = useGameStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const portfolioValue = getPortfolioValue(portfolio, marketPrices);
  const totalBalance = cash + deposit + portfolioValue + realEstateAssetValue - loan;
  const holdingCount = Object.values(portfolio).filter(item => item.amount > 0).length;

  const handleReset = () => {
    resetGame();
    setShowResetConfirm(false);
    setResetDone(true);
    setTimeout(() => router.push("/"), 700);
  };

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col text-white relative">
      <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 px-4 py-3 flex items-center shadow-lg z-10 sticky top-0 border-b border-white/5">
        <Link href="/" className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-base font-bold flex items-center">
          <Settings size={18} className="mr-2" />
          설정
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 animate-fade-in-up">
          <div className="flex items-center mb-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 mr-3">
              <Database size={22} />
            </div>
            <div>
              <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">저장 상태</p>
              <h2 className="text-lg font-black">자동 저장 활성화</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-[9px] text-white/25 font-bold uppercase mb-1">현재 시점</p>
              <p className="text-sm font-bold">{year}년 {month}월 {week}주차</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-[9px] text-white/25 font-bold uppercase mb-1">보유 종목</p>
              <p className="text-sm font-bold">{holdingCount}개</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 animate-fade-in-up" style={{ animationDelay: "0.08s" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-11 h-11 rounded-xl bg-yellow-500/15 flex items-center justify-center text-yellow-400 mr-3">
                <Wallet size={22} />
              </div>
              <div>
                <p className="text-[9px] text-yellow-400 font-bold uppercase tracking-widest">현재 자산</p>
                <h2 className={`text-xl font-mono font-black ${totalBalance >= 0 ? "text-white" : "text-red-400"}`}>
                  {totalBalance.toLocaleString()}원
                </h2>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between bg-white/5 rounded-lg px-3 py-2">
              <span className="text-white/30 font-bold">현금</span>
              <span className="font-mono">{cash.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between bg-white/5 rounded-lg px-3 py-2">
              <span className="text-white/30 font-bold">예금</span>
              <span className="font-mono text-emerald-400">+{deposit.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between bg-white/5 rounded-lg px-3 py-2">
              <span className="text-white/30 font-bold">투자 평가</span>
              <span className="font-mono text-green-400">+{portfolioValue.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between bg-white/5 rounded-lg px-3 py-2">
              <span className="text-white/30 font-bold">대출</span>
              <span className="font-mono text-red-400">-{loan.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 animate-fade-in-up" style={{ animationDelay: "0.12s" }}>
          <div className="flex items-center mb-4">
            <div className="w-11 h-11 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400 mr-3">
              <Settings size={22} />
            </div>
            <div>
              <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest">기기 설정</p>
              <h2 className="text-lg font-black">사운드 및 진동</h2>
            </div>
          </div>

          <div className="space-y-2">
            <div 
              className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors"
              onClick={toggleSound}
            >
              <div className="flex items-center">
                {soundEnabled ? <Volume2 size={16} className="mr-3 text-white/70" /> : <VolumeX size={16} className="mr-3 text-white/30" />}
                <span className={`font-bold ${soundEnabled ? 'text-white' : 'text-white/40'}`}>효과음</span>
              </div>
              <div className={`w-10 h-6 rounded-full transition-colors flex items-center p-1 ${soundEnabled ? 'bg-emerald-500' : 'bg-white/10'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </div>

            <div 
              className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors"
              onClick={toggleHaptic}
            >
              <div className="flex items-center">
                {hapticEnabled ? <Vibrate size={16} className="mr-3 text-white/70" /> : <VibrateOff size={16} className="mr-3 text-white/30" />}
                <span className={`font-bold ${hapticEnabled ? 'text-white' : 'text-white/40'}`}>햅틱 진동</span>
              </div>
              <div className={`w-10 h-6 rounded-full transition-colors flex items-center p-1 ${hapticEnabled ? 'bg-emerald-500' : 'bg-white/10'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${hapticEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/achievements"
          className="w-full bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-all animate-fade-in-up"
          style={{ animationDelay: "0.16s" }}
        >
          <div className="flex items-center text-left">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-white mr-3 shadow-lg shadow-amber-500/20">
              <Trophy size={22} />
            </div>
            <div>
              <p className="text-sm font-black text-amber-400">명예의 전당 (업적)</p>
              <p className="text-[10px] text-white/50 mt-0.5">내가 달성한 기록과 숨겨진 업적 확인</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-white/30" />
        </Link>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="w-full bg-red-500/15 border border-red-500/30 rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-all animate-fade-in-up"
          style={{ animationDelay: "0.20s" }}
        >
          <div className="flex items-center text-left">
            <div className="w-11 h-11 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 mr-3">
              <RotateCcw size={22} />
            </div>
            <div>
              <p className="text-sm font-black text-red-300">새 게임 시작</p>
              <p className="text-[10px] text-red-200/40 mt-0.5">현재 저장 데이터를 초기 상태로 되돌립니다.</p>
            </div>
          </div>
        </button>
      </div>

      {resetDone && (
        <div className="absolute bottom-6 left-4 right-4 bg-emerald-500/90 text-white p-3 rounded-xl flex items-center text-sm font-bold shadow-2xl z-40 animate-slide-in-bottom">
          <CheckCircle2 size={16} className="mr-2" />
          새 게임을 시작했습니다.
        </div>
      )}

      {showResetConfirm && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-5 shadow-2xl animate-news-flash">
            <div className="flex items-start mb-4">
              <div className="w-11 h-11 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 mr-3 flex-shrink-0">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h2 className="font-black text-lg">진행 상황 초기화</h2>
                <p className="text-xs text-white/45 leading-relaxed mt-1">
                  현재 자산, 직장, 주거지, 보유 종목, 채팅 기록이 시작 상태로 돌아갑니다.
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3.5 bg-white/5 text-white rounded-xl font-bold text-sm active:scale-95 transition-all border border-white/10"
              >
                취소
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3.5 bg-red-600 text-white rounded-xl font-bold text-sm active:scale-95 transition-all shadow-lg shadow-red-600/20"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
