"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Flame, AlertCircle, Zap } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

interface Match {
  id: number;
  teamA: string;
  teamB: string;
  oddsA: number;
  oddsDraw: number;
  oddsB: number;
  winProbabilityA: number;
  allowDraw?: boolean;
}

const generateMatches = (): Match[] => {
  const matchSet = [
    { id: 1, teamA: "레알 마드리드", teamB: "바르셀로나", allowDraw: true },
    { id: 2, teamA: "맨체스터 UTD", teamB: "리버풀", allowDraw: true },
    { id: 3, teamA: "대한민국", teamB: "일본", allowDraw: true },
    { id: 4, teamA: "T1", teamB: "젠지", allowDraw: false },
  ];

  return matchSet.map(m => {
    // 승률 랜덤 생성 (15% ~ 85%)
    const winProbabilityA = 0.15 + Math.random() * 0.7;
    const drawProbability = m.allowDraw ? (1 - winProbabilityA) * 0.3 : 0;
    const winProbabilityB = 1 - winProbabilityA - drawProbability;

    // 배당률 계산 (하우스 엣지 10% 적용)
    const houseEdge = 1.1;
    const oddsA = Math.max(1.01, Math.round((1 / winProbabilityA / houseEdge) * 100) / 100);
    const oddsDraw = m.allowDraw ? Math.max(1.01, Math.round((1 / drawProbability / houseEdge) * 100) / 100) : 0;
    const oddsB = Math.max(1.01, Math.round((1 / winProbabilityB / houseEdge) * 100) / 100);

    return {
      ...m,
      oddsA,
      oddsDraw,
      oddsB,
      winProbabilityA
    };
  });
};

export default function TotoApp() {
  const { cash, playToto } = useGameStore();
  const [matches, setMatches] = useState<Match[]>(() => generateMatches());
  const [betAmount, setBetAmount] = useState<number>(100000);
  const [selectedBet, setSelectedBet] = useState<{ matchId: number; choice: 'A' | 'Draw' | 'B'; odds: number } | null>(null);
  const [resultMsg, setResultMsg] = useState<string | null>(null);
  const [isWin, setIsWin] = useState(false);

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
    
    const random = Math.random();
    let actualResult: 'A' | 'Draw' | 'B';
    
    const drawProb = match.allowDraw ? (1 - match.winProbabilityA) * 0.3 : 0;

    if (random < match.winProbabilityA) {
      actualResult = 'A';
    } else if (random < match.winProbabilityA + drawProb) {
      actualResult = 'Draw';
    } else {
      actualResult = 'B';
    }

    const win = selectedBet.choice === actualResult;
    setIsWin(win);
    const success = playToto(betAmount, win, selectedBet.odds);

    if (success) {
      let scoreA = 0;
      let scoreB = 0;
      if (!match.allowDraw) {
        // e스포츠(Bo3) 점수
        if (actualResult === 'A') {
          scoreA = 2;
          scoreB = Math.floor(Math.random() * 2);
        } else {
          scoreB = 2;
          scoreA = Math.floor(Math.random() * 2);
        }
      } else {
        // 축구 점수
        if (actualResult === 'A') {
          scoreA = Math.floor(Math.random() * 3) + 1;
          scoreB = Math.floor(Math.random() * scoreA);
        } else if (actualResult === 'B') {
          scoreB = Math.floor(Math.random() * 3) + 1;
          scoreA = Math.floor(Math.random() * scoreB);
        } else {
          scoreA = Math.floor(Math.random() * 3);
          scoreB = scoreA;
        }
      }
      const scoreStr = `${scoreA} : ${scoreB}`;

      if (win) {
        setResultMsg(`🎉 적중! [경기 결과: ${actualResult === 'A' ? match.teamA + ' 승' : actualResult === 'B' ? match.teamB + ' 승' : '무승부'} (${scoreStr})]\n${Math.floor(betAmount * selectedBet.odds).toLocaleString()}원을 획득하셨습니다!`);
      } else {
        setResultMsg(`💀 미적중... [경기 결과: ${actualResult === 'A' ? match.teamA + ' 승' : actualResult === 'B' ? match.teamB + ' 승' : '무승부'} (${scoreStr})]\n${betAmount.toLocaleString()}원을 잃었습니다.`);
      }
      setSelectedBet(null);
      setMatches(generateMatches());
    }
  };

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col text-white">
      {/* 토토 앱 헤더 */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 px-4 py-3 flex items-center shadow-lg z-10 sticky top-0">
        <Link href="/" className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-base font-bold flex items-center text-emerald-300">
          <Trophy size={18} className="mr-2" />
          배트맨 (불법 아님)
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-6 p-4 space-y-4">
        {/* 내 잔고 */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex justify-between items-center animate-fade-in-up">
          <span className="text-xs text-white/30 font-bold">나의 보유 캐시</span>
          <h2 className="text-xl font-mono font-bold text-white">
            {cash.toLocaleString()} <span className="text-xs font-normal text-white/30">원</span>
          </h2>
        </div>

        {/* 결과 알림 */}
        {resultMsg && (
          <div className={`p-4 rounded-xl text-sm font-bold whitespace-pre-wrap leading-relaxed animate-news-flash ${isWin ? 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30' : 'bg-red-500/15 text-red-300 border border-red-500/30'}`}>
            {resultMsg}
          </div>
        )}

        <div>
          <h3 className="text-white/40 text-[10px] font-bold flex items-center mb-3 uppercase tracking-widest">
            <Flame size={12} className="mr-1 text-orange-400" /> 금주의 빅매치 승부예측
          </h3>
          
          <div className="space-y-3 stagger-children">
            {matches.map((match) => (
              <div key={match.id} className="bg-white/5 rounded-xl overflow-hidden border border-white/5">
                <div className="text-center py-2.5 text-[10px] font-bold text-white/40 border-b border-white/5 bg-white/[0.02]">
                  {match.teamA} <span className="text-white/20 mx-1">VS</span> {match.teamB}
                </div>
                <div className="flex divide-x divide-white/5">
                  {[
                    { label: '승', choice: 'A' as const, odds: match.oddsA },
                    { label: '무', choice: 'Draw' as const, odds: match.oddsDraw },
                    { label: '패', choice: 'B' as const, odds: match.oddsB },
                  ]
                  .filter(opt => match.allowDraw || opt.choice !== 'Draw')
                  .map(opt => (
                    <button 
                      key={opt.choice}
                      onClick={() => setSelectedBet({ matchId: match.id, choice: opt.choice, odds: opt.odds })}
                      className={`flex-1 py-3.5 flex flex-col items-center transition-all ${
                        selectedBet?.matchId === match.id && selectedBet.choice === opt.choice 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : 'hover:bg-white/5 text-white/50'
                      }`}
                    >
                      <span className="text-[10px] mb-0.5 font-bold">{opt.label}</span>
                      <span className="font-mono font-bold text-sm">{opt.odds.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 배팅 금액 설정 구역 */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <div className="flex justify-between items-end mb-3">
            <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">배팅 금액</span>
            {selectedBet && (
              <span className="text-[10px] font-bold text-yellow-400 flex items-center">
                <Zap size={9} className="mr-1" />
                예상 당첨금: {Math.floor(betAmount * selectedBet.odds).toLocaleString()}원
              </span>
            )}
          </div>
          
          <div className="flex flex-col space-y-3 mb-4">
            <input 
              type="number" 
              value={betAmount} 
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-right font-mono text-lg text-white outline-none focus:border-white/30 transition-colors"
            />
            <div className="flex space-x-2">
              {[50000, 100000, 1000000, cash].map((val, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setBetAmount(val)}
                  className="flex-1 bg-white/5 hover:bg-white/10 rounded-lg py-2 text-[10px] font-bold transition-colors border border-white/5"
                >
                  {val === cash ? '전액' : (val / 10000).toLocaleString() + '만'}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleBet}
            disabled={!selectedBet || betAmount <= 0}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-bold disabled:opacity-20 active:scale-95 transition-all shadow-lg shadow-emerald-600/20 text-sm"
          >
            배팅하기
          </button>
          <div className="mt-2 text-center text-[9px] text-white/15 flex items-center justify-center">
            <AlertCircle size={9} className="mr-1" />
            과도한 배팅은 패가망신의 지름길입니다.
          </div>
        </div>
      </div>
    </div>
  );
}
