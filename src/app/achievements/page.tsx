"use client";

import Link from "next/link";
import { ArrowLeft, Trophy, Lock } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { ACHIEVEMENTS } from "@/data/achievements";

export default function AchievementsApp() {
  const { unlockedAchievements } = useGameStore();

  const unlockedCount = unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col text-white relative">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-4 py-3 flex items-center shadow-lg z-10 sticky top-0">
        <Link href="/" className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-base font-bold flex items-center flex-1">
          <Trophy size={18} className="mr-1.5" />
          명예의 전당
        </h1>
        <span className="text-xs font-bold bg-black/20 px-2 py-1 rounded-full">
          {unlockedCount} / {totalCount}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pb-8 p-4">
        {/* 진행도 표시 */}
        <div className="mb-6 glass p-4 rounded-2xl border border-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-white/60">전체 달성도</span>
            <span className="text-sm font-bold text-yellow-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 업적 리스트 */}
        <div className="space-y-3">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            const isHidden = achievement.isHidden && !isUnlocked;

            return (
              <div 
                key={achievement.id}
                className={`relative overflow-hidden rounded-2xl border transition-all ${
                  isUnlocked 
                    ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-amber-500/30 shadow-[0_4px_20px_rgba(245,158,11,0.1)]' 
                    : 'bg-zinc-900/50 border-white/5'
                }`}
              >
                {/* 빗금 배경 패턴 (미달성) */}
                {!isUnlocked && (
                  <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#fff_10px,#fff_20px)]" />
                )}

                <div className="p-4 flex items-center relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-4 shrink-0 shadow-inner ${
                    isUnlocked ? 'bg-amber-500/20 text-amber-100' : 'bg-white/5 text-white/20'
                  }`}>
                    {isHidden ? <Lock size={20} /> : achievement.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`font-bold text-sm mb-0.5 ${isUnlocked ? 'text-amber-400' : 'text-white/40'}`}>
                      {isHidden ? '???' : achievement.title}
                    </h3>
                    <p className={`text-xs leading-relaxed ${isUnlocked ? 'text-white/80' : 'text-white/20'}`}>
                      {isHidden ? '숨겨진 조건을 달성하여 업적을 해제하세요.' : achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
