"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Coffee, Gamepad2, Utensils, Sparkles, BedDouble, Plane } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

const HEALING_ACTIVITIES = [
  { id: 'pcbang', name: 'PC방 밤샘', cost: 10000, relief: 5, icon: <Gamepad2 size={24} className="text-blue-400" />, desc: '친구들과 롤 밤샘팟. 가성비 최고의 스트레스 해소법.' },
  { id: 'delivery', name: '치킨/배달음식', cost: 30000, relief: 15, icon: <Utensils size={24} className="text-orange-400" />, desc: '퇴근 후 맥주와 함께하는 치킨은 국룰이다.' },
  { id: 'massage', name: '마사지/스파', cost: 100000, relief: 40, icon: <Sparkles size={24} className="text-pink-400" />, desc: '뭉친 어깨와 피로를 싹 풀어주는 프리미엄 마사지.' },
  { id: 'hocance', name: '고급 호캉스', cost: 300000, relief: 80, icon: <BedDouble size={24} className="text-purple-400" />, desc: '5성급 호텔에서 즐기는 룸서비스와 꿀잠.' },
  { id: 'travel', name: '해외 여행', cost: 1500000, relief: 100, icon: <Plane size={24} className="text-emerald-400" />, desc: '모든 것을 잊고 떠나는 힐링 여행. 스트레스가 완전히 사라진다.' }
];

export default function HealingApp() {
  const { cash, stress, relieveStress } = useGameStore();
  const [msg, setMsg] = useState("");

  const handleHealing = (activity: typeof HEALING_ACTIVITIES[0]) => {
    if (stress === 0) {
      setMsg("현재 스트레스가 없습니다. 돈을 아끼세요!");
      setTimeout(() => setMsg(""), 2000);
      return;
    }

    const success = relieveStress(activity.cost, activity.relief);
    if (success) {
      setMsg(`'${activity.name}'(으)로 스트레스가 ${activity.relief} 감소했습니다!`);
    } else {
      setMsg("잔액이 부족합니다.");
    }
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col text-white relative">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3 flex items-center shadow-lg z-10 sticky top-0">
        <Link href="/" className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-base font-bold flex items-center flex-1">
          <Coffee size={18} className="mr-1.5" />
          소확행
        </h1>
      </div>

      <div className="px-4 py-4 border-b border-white/5 bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">나의 상태</p>
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">잔액</p>
        </div>
        <div className="flex justify-between items-end">
          <div className="flex-1 mr-4">
            <div className="flex justify-between mb-1">
              <span className="text-xs font-bold text-white/80">스트레스 수치</span>
              <span className={`text-xs font-bold ${stress >= 80 ? 'text-red-400' : stress >= 50 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                {stress} / 100
              </span>
            </div>
            <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${stress >= 80 ? 'bg-red-500' : stress >= 50 ? 'bg-yellow-400' : 'bg-emerald-500'}`}
                style={{ width: `${stress}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold font-mono text-white">
              {cash.toLocaleString()} <span className="text-xs font-normal text-white/30">원</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 stagger-children">
        <p className="text-xs text-white/50 mb-4 font-bold">원하는 힐링 방식을 선택하세요.</p>
        
        {HEALING_ACTIVITIES.map((activity) => (
          <button
            key={activity.id}
            onClick={() => handleHealing(activity)}
            className="w-full text-left bg-zinc-900/80 rounded-2xl p-4 mb-3 flex items-center border border-white/5 active:bg-white/10 transition-colors relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mr-4 flex-shrink-0">
              {activity.icon}
            </div>
            <div className="flex-1 pr-2">
              <h3 className="font-bold text-sm text-white">{activity.name}</h3>
              <p className="text-[10px] text-white/40 mt-1 leading-tight">{activity.desc}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-emerald-400 font-bold text-xs mb-0.5">스트레스 -{activity.relief}</p>
              <p className="font-mono text-xs text-white/70">{activity.cost.toLocaleString()}원</p>
            </div>
          </button>
        ))}
      </div>

      {msg && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-zinc-800/90 backdrop-blur-md text-white text-xs py-3 px-4 rounded-xl shadow-2xl text-center border border-white/10 z-50 animate-fade-in font-bold">
          {msg}
        </div>
      )}
    </div>
  );
}
