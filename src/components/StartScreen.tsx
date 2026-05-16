"use client";

import { useState } from "react";
import { useGameStore, getTargetGoalLabel } from "@/store/gameStore";
import { TrendingUp, Landmark, Building, Gamepad2, Lock } from "lucide-react";
import { STARTING_BACKGROUNDS, StartingBackground } from "@/data/backgrounds";

export default function StartScreen() {
  const { startGame, playCount, clearedCount, unlockedAchievements } = useGameStore();
  const [name, setName] = useState("");
  const [selectedBgId, setSelectedBgId] = useState<string>("default");

  const checkUnlock = (condition: string) => {
    if (condition === 'none') return true;
    if (condition === 'clear_1') return clearedCount >= 1;
    if (condition === 'play_3') return playCount >= 3;
    if (condition.startsWith('achievement:')) {
      const achId = condition.split(':')[1];
      return unlockedAchievements.includes(achId);
    }
    return false;
  };

  const handleStart = () => {
    startGame(name || "개미", selectedBgId);
  };

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col relative text-white font-sans overflow-y-auto overflow-x-hidden">
      {/* 배경 데코 */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-start p-6 relative z-10 animate-fade-in-up pb-12 pt-12">
        {/* 타이틀 로고 영역 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-6 border border-white/10">
            <TrendingUp size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-transparent bg-clip-text">
            흙수저 탈출
          </h1>
          <h2 className="text-2xl font-black text-white/90 font-mono tracking-widest">2015</h2>
          <p className="text-white/50 text-xs mt-4 max-w-[240px] mx-auto leading-relaxed">
            자본금 700만 원. 목표는 {getTargetGoalLabel(clearedCount)}. 당신의 선택이 운명을 결정합니다.
          </p>
        </div>

        {/* 폼 영역 */}
        <div className="w-full max-w-[320px] glass p-6 rounded-3xl border border-white/5 shadow-2xl mb-6">
          <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2 ml-1">
            플레이어 이름
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="개미"
            maxLength={10}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-bold text-center mb-6"
          />

          <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2 ml-1">
            시작 배경 (특성)
          </label>
          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
            {STARTING_BACKGROUNDS.map((bg) => {
              const isUnlocked = checkUnlock(bg.unlockCondition);
              const isSelected = selectedBgId === bg.id;

              return (
                <div
                  key={bg.id}
                  onClick={() => isUnlocked && setSelectedBgId(bg.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    !isUnlocked 
                      ? 'bg-black/30 border-white/5 opacity-50 cursor-not-allowed' 
                      : isSelected
                        ? 'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-bold ${isSelected ? 'text-emerald-400' : 'text-white/80'}`}>
                      {bg.name}
                    </span>
                    {!isUnlocked && <Lock size={12} className="text-white/40" />}
                  </div>
                  <p className="text-[9px] text-white/50 leading-relaxed">
                    {bg.description}
                  </p>
                  {isUnlocked && (
                    <p className="text-[9px] text-emerald-400/80 font-bold mt-1.5">
                      ✨ {bg.perkDescription}
                    </p>
                  )}
                  {!isUnlocked && (
                    <p className="text-[9px] text-red-400/80 font-bold mt-1.5">
                      해금 조건: {
                        bg.unlockCondition === 'clear_1' ? '1회 이상 게임 클리어' :
                        bg.unlockCondition === 'play_3' ? '3회 이상 게임 플레이' :
                        bg.unlockCondition.startsWith('achievement:') ? '특정 업적 달성 필요' : '알 수 없음'
                      }
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 아이콘 장식 */}
        <div className="flex space-x-6 mb-8 opacity-40">
          <Landmark size={20} />
          <Building size={20} />
          <Gamepad2 size={20} />
        </div>

        {/* 시작 버튼 */}
        <button
          onClick={handleStart}
          className="relative group w-full max-w-[280px] active:scale-95 transition-all"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-200" />
          <div className="relative w-full bg-zinc-900 rounded-2xl px-6 py-4 flex items-center justify-center border border-white/10">
            <span className="text-white font-black text-lg tracking-wide">시뮬레이션 시작</span>
          </div>
        </button>
      </div>
    </div>
  );
}
