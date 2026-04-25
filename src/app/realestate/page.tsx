"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Home, Building, CheckCircle2, AlertCircle } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { REAL_ESTATE_OPTIONS } from "@/data/realEstate";

export default function RealEstateApp() {
  const { cash, currentRealEstate, changeRealEstate } = useGameStore();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleMove = (id: string) => {
    const target = REAL_ESTATE_OPTIONS.find(r => r.id === id);
    if (!target) return;

    if (target.id === currentRealEstate.id) return;

    const depositDiff = target.deposit - currentRealEstate.deposit;
    if (cash < depositDiff) {
      setErrorMsg("보증금 차액을 지불할 현금이 부족합니다.");
      setSuccessMsg("");
      return;
    }

    const confirmMove = confirm(`${target.name}(으)로 이사하시겠습니까?\n보증금 차액: ${depositDiff.toLocaleString()}원\n월세: ${target.monthlyRent.toLocaleString()}원`);
    
    if (confirmMove) {
      const success = changeRealEstate(id);
      if (success) {
        setSuccessMsg(`${target.name}(으)로 이사 완료!`);
        setErrorMsg("");
      }
    }
  };

  return (
    <div className="w-full h-full bg-zinc-50 flex flex-col text-black">
      {/* 헤더 */}
      <div className="bg-emerald-600 text-white px-4 py-3 flex items-center shadow-md z-10 sticky top-0">
        <Link href="/" className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold flex items-center">
          <Building size={20} className="mr-2" />
          복덕방 부동산
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* 현재 주거지 정보 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-100">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-3">
              <Home size={24} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">현재 거주지</span>
              <h2 className="text-xl font-bold">{currentRealEstate.name}</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-zinc-100">
            <div>
              <p className="text-[10px] text-zinc-400 font-bold uppercase">보증금</p>
              <p className="text-lg font-mono font-bold">{currentRealEstate.deposit.toLocaleString()}원</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-zinc-400 font-bold uppercase">월세</p>
              <p className="text-lg font-mono font-bold text-red-500">{currentRealEstate.monthlyRent.toLocaleString()}원</p>
            </div>
          </div>
        </div>

        {/* 이사 가능한 매물 목록 */}
        <h3 className="text-xs font-bold text-zinc-400 px-1 uppercase tracking-widest mt-6">추천 매물 목록</h3>
        
        {REAL_ESTATE_OPTIONS.map((item) => {
          const isCurrent = item.id === currentRealEstate.id;
          const depositDiff = item.deposit - currentRealEstate.deposit;
          
          return (
            <div 
              key={item.id} 
              className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${isCurrent ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-zinc-200 hover:border-emerald-300'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg">{item.name}</h4>
                {isCurrent && (
                  <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">거주중</span>
                )}
              </div>
              <p className="text-xs text-zinc-500 mb-4 leading-relaxed">{item.description}</p>
              
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <div className="flex items-center text-xs">
                    <span className="w-12 text-zinc-400">보증금:</span>
                    <span className="font-mono font-bold">{item.deposit.toLocaleString()}원</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="w-12 text-zinc-400">월세:</span>
                    <span className="font-mono font-bold text-red-500">{item.monthlyRent.toLocaleString()}원</span>
                  </div>
                  {item.stressRelief > 0 && (
                    <div className="flex items-center text-xs text-emerald-600 font-bold">
                      <span className="w-12 text-emerald-600/60 font-normal">힐링:</span>
                      <span>스트레스 -{item.stressRelief}/월</span>
                    </div>
                  )}
                </div>
                
                {!isCurrent && (
                  <button 
                    onClick={() => handleMove(item.id)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform shadow-sm"
                  >
                    이사하기
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 상태 메시지 하단 고정 */}
      {(successMsg || errorMsg) && (
        <div className="absolute bottom-4 left-4 right-4 animate-in fade-in slide-in-from-bottom-4">
          {successMsg && (
            <div className="bg-emerald-100 text-emerald-800 p-3 rounded-xl flex items-center text-sm font-bold shadow-lg border border-emerald-200">
              <CheckCircle2 size={16} className="mr-2" /> {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="bg-red-100 text-red-800 p-3 rounded-xl flex items-center text-sm font-bold shadow-lg border border-red-200">
              <AlertCircle size={16} className="mr-2" /> {errorMsg}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
