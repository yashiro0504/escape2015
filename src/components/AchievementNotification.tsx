"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { ACHIEVEMENTS } from "@/data/achievements";

export default function AchievementNotification() {
  const { newlyUnlockedAchievements, clearNewlyUnlockedAchievements } = useGameStore();
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    if (newlyUnlockedAchievements.length > 0 && !current) {
      const nextId = newlyUnlockedAchievements[0];
      setCurrent(nextId);
      
      // Wait for 3 seconds then remove it
      setTimeout(() => {
        setCurrent(null);
        clearNewlyUnlockedAchievements(); // In a real app we might pop them one by one, but here we just clear all after showing the first one (or we could show them in sequence)
      }, 3500);
    }
  }, [newlyUnlockedAchievements, current, clearNewlyUnlockedAchievements]);

  if (!current) return null;

  const achievement = ACHIEVEMENTS.find(a => a.id === current);
  if (!achievement) return null;

  return (
    <div className="absolute top-12 left-4 right-4 z-[100] animate-slide-in-top pointer-events-none">
      <div className="bg-gradient-to-r from-amber-500/90 to-yellow-600/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-yellow-300/30 flex items-center">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl shadow-inner mr-4">
          {achievement.icon}
        </div>
        <div className="flex-1">
          <p className="text-[10px] text-yellow-100 font-bold uppercase tracking-widest mb-0.5">업적 달성!</p>
          <h4 className="text-white font-black text-sm">{achievement.title}</h4>
        </div>
      </div>
    </div>
  );
}
