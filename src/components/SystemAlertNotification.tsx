"use client";

import React, { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { AlertTriangle, Info, XCircle, CheckCircle2 } from "lucide-react";
import { soundManager } from "@/utils/soundManager";
import { hapticManager } from "@/utils/hapticManager";

export default function SystemAlertNotification() {
  const { systemAlerts, removeSystemAlert } = useGameStore();
  const [currentAlert, setCurrentAlert] = useState<typeof systemAlerts[0] | null>(null);

  useEffect(() => {
    if (systemAlerts.length > 0 && !currentAlert) {
      const nextAlert = systemAlerts[0];
      setCurrentAlert(nextAlert);
      
      // 알림 종류에 따른 사운드/진동
      if (nextAlert.type === "bad") {
        soundManager.playError();
        hapticManager.error();
      } else if (nextAlert.type === "good") {
        soundManager.playCash();
        hapticManager.success();
      } else {
        soundManager.playClick();
        hapticManager.selection();
      }
    }
  }, [systemAlerts, currentAlert]);

  const handleClose = () => {
    if (currentAlert) {
      removeSystemAlert(currentAlert.id);
      setCurrentAlert(null);
      soundManager.playClick();
      hapticManager.selection();
    }
  };

  if (!currentAlert) return null;

  const isBad = currentAlert.type === "bad";
  const isGood = currentAlert.type === "good";

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className={`px-5 py-4 text-white flex items-center ${isBad ? "bg-red-600" : isGood ? "bg-emerald-600" : "bg-blue-600"}`}>
          {isBad ? <AlertTriangle size={24} className="mr-3" /> : isGood ? <CheckCircle2 size={24} className="mr-3" /> : <Info size={24} className="mr-3" />}
          <h2 className="font-bold text-lg leading-tight">{currentAlert.title}</h2>
        </div>
        
        <div className="p-6">
          <p className="text-zinc-700 whitespace-pre-wrap leading-relaxed">
            {currentAlert.message}
          </p>
        </div>
        
        <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex justify-end">
          <button
            onClick={handleClose}
            className={`px-6 py-2.5 rounded-xl font-bold text-white active:scale-95 transition-transform ${
              isBad ? "bg-red-600 hover:bg-red-700" : isGood ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
