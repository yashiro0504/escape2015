"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";

export default function StoreHydrator() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubFinishHydration = useGameStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    try {
      useGameStore.persist.rehydrate();
    } catch (e) {
      console.warn("Hydration failed:", e);
      setHydrated(true);
    }
    
    // 이미 하이드레이션이 끝난 경우
    if (useGameStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    // 무한 로딩을 방지하기 위한 강제 해제 타임아웃 (0.5초)
    const timeoutId = setTimeout(() => {
      setHydrated(true);
    }, 500);

    return () => {
      unsubFinishHydration();
      clearTimeout(timeoutId);
    };
  }, []);

  if (!hydrated) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-white/20 border-t-yellow-400 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-white/40 text-xs">로딩 중...</p>
        </div>
      </div>
    );
  }

  return null;
}
