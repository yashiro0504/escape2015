"use client";

import React, { useState, useEffect } from 'react';
import { Wifi, Signal, BatteryFull } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { useRouter } from 'next/navigation';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function PhoneWrapper({ children }: { children: React.ReactNode }) {
  const [time, setTime] = useState('09:00');
  const router = useRouter();

  useEffect(() => {
    // 임시: 현재 시간을 표시. 추후 게임 내 턴 시간으로 변경 가능.
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[390px] h-[844px] bg-black rounded-[50px] shadow-2xl shadow-black/50 border-[10px] border-zinc-800 overflow-hidden flex flex-col sm:scale-100 scale-95 transition-transform origin-center">
      {/* 화면 상단 스피커/카메라 홀 (2015년경 스마트폰 베젤 느낌) */}
      <div className="absolute top-0 inset-x-0 h-6 flex justify-center items-center z-50 bg-black">
        <div className="w-16 h-1.5 bg-zinc-800 rounded-full"></div>
      </div>

      {/* 2015년 스타일 상태바 (iOS / Android 혼합 느낌) */}
      <div className="flex justify-between items-center px-4 pt-6 pb-2 text-[11px] text-white z-40 relative bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center space-x-1.5">
          <Signal size={12} fill="currentColor" strokeWidth={0} className="mt-0.5" />
          <span className="font-medium tracking-tight">SKT</span>
          <Wifi size={12} strokeWidth={2.5} />
        </div>
        <div className="font-bold tracking-wider absolute left-1/2 -translate-x-1/2">
          {time}
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="font-medium">100%</span>
          <BatteryFull size={14} fill="currentColor" className="opacity-90" />
        </div>
      </div>

      {/* 메인 화면 콘텐츠 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-zinc-900/95" style={{ backgroundImage: 'radial-gradient(circle at center, #27272a 0%, #18181b 100%)' }}>
        {children}
      </div>

      {/* 하단 물리 버튼 (아이폰 홈 버튼 느낌) */}
      <div className="h-16 bg-black flex justify-center items-center z-50 border-t border-zinc-800">
        <button 
          onClick={() => router.push('/')}
          className="w-10 h-10 rounded-full border-2 border-zinc-700/50 flex items-center justify-center active:scale-95 transition-transform hover:bg-zinc-900 cursor-pointer group"
          aria-label="Home Button"
        >
           <div className="w-3 h-3 rounded-sm border border-zinc-600/30 group-hover:border-zinc-500 transition-colors"></div>
        </button>
      </div>
    </div>
  );
}
