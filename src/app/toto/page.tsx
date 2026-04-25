"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Flame, AlertCircle } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

interface Match {
  id: number;
  teamA: string;
  teamB: string;
  oddsA: number;
  oddsDraw: number;
  oddsB: number;
  winProbabilityA: number; // 0 ~ 1
}

const generateMatches = (): Match[] => [
  { id: 1, teamA: "레알 마드리드", teamB: "바르셀로나", oddsA: 2.1, oddsDraw: 3.0, oddsB: 2.8, winProbabilityA: 0.45 },
  { id: 2, teamA: "맨체스터 UTD", teamB: "리버풀", oddsA: 3.5, oddsDraw: 3.2, oddsB: 1.8, winProbabilityA: 0.25 },
  { id: 3, teamA: "대한민국", teamB: "일본", oddsA: 2.5, oddsDraw: 3.1, oddsB: 2.5, winProbabilityA: 0.5 },
  { id: 4, teamA: "T1", teamB: "젠지", oddsA: 1.9, oddsDraw: 1.0, oddsB: 1.9, winProbabilityA: 0.5 }, // e-sports (no draw usually, dummy odds)
];

export default function TotoApp() {
  const { cash, playToto } = useGameStore();
  const [matches, setMatches] = useState<Match[]>([]);
  const [betAmount, setBetAmount] = useState<number>(100000);
  const [selectedBet, setSelectedBet] = useState<{ matchId: number; choice: 'A' | 'Draw' | 'B'; odds: number } | null>(null);
  const [resultMsg, setResultMsg] = useState<string | null>(null);

  useEffect(() => {
    // 임시로 진입 시마다 랜덤하게 새 매치 생성 (실제로는 턴마다 갱신하는 것이 더 좋음)
    setMatches(generateMatches());
  }, []);

  const handleBet = () => {
    if (!selectedBet) {
      alert("배팅할 항목을 선택해주세요.");
      return;
    }
    if (betAmount <= 0) return;
    if (betAmount > cash) {
      alert("잔액이 부족합니다. (대출을 받아보시는 건 어떨까요?)");
      return;
    }

    const match = matches.find(m => m.id === selectedBet.matchId)!;
    
    // 단순 확률 계산 로직 (난수 생성)
    const random = Math.random();
    let actualResult: 'A' | 'Draw' | 'B';
    
    if (random < match.winProbabilityA) {
      actualResult = 'A';
    } else if (random < match.winProbabilityA + (1 - match.winProbabilityA) * 0.3) {
      actualResult = 'Draw';
    } else {
      actualResult = 'B';
    }

    const isWin = selectedBet.choice === actualResult;
    const success = playToto(betAmount, isWin, selectedBet.odds);

    if (success) {
      if (isWin) {
        setResultMsg(`🎉 적중! [경기 결과: ${actualResult === 'A' ? match.teamA + ' 승' : actualResult === 'B' ? match.teamB + ' 승' : '무승부'}]\n${(betAmount * selectedBet.odds).toLocaleString()}원을 획득하셨습니다!`);
      } else {
        setResultMsg(`💀 미적중... [경기 결과: ${actualResult === 'A' ? match.teamA + ' 승' : actualResult === 'B' ? match.teamB + ' 승' : '무승부'}]\n${betAmount.toLocaleString()}원을 잃었습니다.`);
      }
      setSelectedBet(null); // 초기화
    }
  };

  return (
    <div className="w-full h-full bg-emerald-900 flex flex-col text-white">
      {/* 토토 앱 헤더 */}
      <div className="bg-emerald-950 px-4 py-3 flex items-center shadow-md z-10 sticky top-0 border-b border-emerald-800">
        <Link href="/" className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold flex items-center text-emerald-400">
          <Trophy size={20} className="mr-2" />
          배트맨 (불법 아님)
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-6 p-4">
        {/* 내 잔고 */}
        <div className="bg-emerald-950 rounded-xl p-4 mb-4 shadow-lg border border-emerald-800 flex justify-between items-center">
          <span className="text-sm text-emerald-200">나의 보유 캐시</span>
          <h2 className="text-xl font-mono font-bold text-white">
            {cash.toLocaleString()} <span className="text-sm font-normal text-emerald-400">원</span>
          </h2>
        </div>

        {/* 결과 알림 */}
        {resultMsg && (
          <div className={`p-4 rounded-xl mb-4 text-sm font-bold whitespace-pre-wrap leading-relaxed ${resultMsg.includes('적중!') ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50' : 'bg-red-500/20 text-red-300 border border-red-500/50'}`}>
            {resultMsg}
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-emerald-300 text-sm font-bold flex items-center mb-3">
            <Flame size={16} className="mr-1" /> 금주의 빅매치 승부예측
          </h3>
          
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="bg-emerald-950 rounded-xl overflow-hidden border border-emerald-800">
                <div className="bg-emerald-900/50 text-center py-2 text-xs font-bold text-emerald-300 border-b border-emerald-800">
                  {match.teamA} VS {match.teamB}
                </div>
                <div className="flex divide-x divide-emerald-800">
                  <button 
                    onClick={() => setSelectedBet({ matchId: match.id, choice: 'A', odds: match.oddsA })}
                    className={`flex-1 py-3 flex flex-col items-center transition-colors ${selectedBet?.matchId === match.id && selectedBet.choice === 'A' ? 'bg-emerald-500 text-white' : 'hover:bg-emerald-800/50 text-emerald-100'}`}
                  >
                    <span className="text-xs mb-1">승</span>
                    <span className="font-mono font-bold">{match.oddsA.toFixed(2)}</span>
                  </button>
                  <button 
                    onClick={() => setSelectedBet({ matchId: match.id, choice: 'Draw', odds: match.oddsDraw })}
                    className={`flex-1 py-3 flex flex-col items-center transition-colors ${selectedBet?.matchId === match.id && selectedBet.choice === 'Draw' ? 'bg-emerald-500 text-white' : 'hover:bg-emerald-800/50 text-emerald-100'}`}
                  >
                    <span className="text-xs mb-1">무</span>
                    <span className="font-mono font-bold">{match.oddsDraw.toFixed(2)}</span>
                  </button>
                  <button 
                    onClick={() => setSelectedBet({ matchId: match.id, choice: 'B', odds: match.oddsB })}
                    className={`flex-1 py-3 flex flex-col items-center transition-colors ${selectedBet?.matchId === match.id && selectedBet.choice === 'B' ? 'bg-emerald-500 text-white' : 'hover:bg-emerald-800/50 text-emerald-100'}`}
                  >
                    <span className="text-xs mb-1">패</span>
                    <span className="font-mono font-bold">{match.oddsB.toFixed(2)}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 배팅 금액 설정 구역 */}
        <div className="bg-emerald-950 rounded-xl p-4 shadow-lg border border-emerald-800 sticky bottom-4">
          <div className="flex justify-between items-end mb-3">
            <span className="text-xs text-emerald-400">배팅 금액 (KRW)</span>
            {selectedBet && (
              <span className="text-xs font-bold text-yellow-400">
                예상 당첨금: {Math.floor(betAmount * selectedBet.odds).toLocaleString()}원
              </span>
            )}
          </div>
          
          <div className="flex flex-col space-y-3 mb-4">
            <input 
              type="number" 
              value={betAmount} 
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="w-full bg-emerald-900 border border-emerald-700 rounded-lg p-3 text-right font-mono text-lg text-white outline-none focus:border-emerald-400"
            />
            <div className="flex space-x-2">
              {[50000, 100000, 1000000, cash].map((val, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setBetAmount(val)}
                  className="flex-1 bg-emerald-800 hover:bg-emerald-700 rounded py-2 text-xs font-bold transition-colors"
                >
                  {val === cash ? '전액' : (val / 10000).toLocaleString() + '만'}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleBet}
            disabled={!selectedBet || betAmount <= 0}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]"
          >
            배팅하기
          </button>
          <div className="mt-2 text-center text-[10px] text-emerald-500/70 flex items-center justify-center">
            <AlertCircle size={10} className="mr-1" />
            과도한 배팅은 패가망신의 지름길입니다.
          </div>
        </div>
      </div>
    </div>
  );
}
