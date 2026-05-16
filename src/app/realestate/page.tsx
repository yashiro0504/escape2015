"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Home, Building, CheckCircle2, AlertCircle, Sparkles, MapPin, Key } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { REAL_ESTATE_OPTIONS } from "@/data/realEstate";

export default function RealEstateApp() {
  const { cash, currentRealEstate, isOwnedRealEstate, realEstateAssetValue, changeRealEstate } = useGameStore();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleMove = (id: string, isPurchase: boolean) => {
    const target = REAL_ESTATE_OPTIONS.find(r => r.id === id);
    if (!target) return;
    
    // 현재 집의 환불액
    const currentRefund = realEstateAssetValue;
    // 새 집의 비용
    const targetCost = isPurchase ? target.purchasePrice : target.deposit;

    if (cash + currentRefund < targetCost) {
      setErrorMsg(isPurchase ? "매매 자금이 부족합니다." : "보증금 자금이 부족합니다.");
      setSuccessMsg("");
      return;
    }

    const success = changeRealEstate(id, isPurchase);
    if (success) {
      setSuccessMsg(`${target.name} ${isPurchase ? '(자가 매매)' : '(전/월세)'}(으)로 이사 완료!`);
      setErrorMsg("");
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      setErrorMsg("이미 해당 주거 형태로 거주중입니다.");
    }
  };

  // 등급 아이콘/이모지
  const getGradeEmoji = (idx: number) => {
    const emojis = ['🏚️', '🏠', '🏢', '🏘️', '🏙️'];
    return emojis[idx] || '🏠';
  };

  const currentAssetValue = realEstateAssetValue;

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col text-white">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-600 text-white px-4 py-3 flex items-center shadow-lg z-10 sticky top-0">
        <Link href="/" className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-base font-bold flex items-center">
          <Building size={18} className="mr-2" />
          복덕방 부동산
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* 현재 주거지 정보 */}
        <div className="bg-white/5 rounded-2xl p-5 border border-emerald-500/20 relative overflow-hidden animate-fade-in-up">
          <div className="absolute -top-4 -right-4 text-5xl opacity-10">🏠</div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 mr-3">
                <Home size={22} />
              </div>
              <div>
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">현재 거주지</span>
                <h2 className="text-lg font-black">{currentRealEstate.name}</h2>
              </div>
            </div>
            <span className={`text-[10px] px-2 py-1 rounded-full font-bold border ${isOwnedRealEstate ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-white/10 text-white/50 border-white/10'}`}>
              {isOwnedRealEstate ? '자가 (매매)' : '전/월세'}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-white/5 relative z-10">
            <div>
              <p className="text-[9px] text-white/20 font-bold uppercase">{isOwnedRealEstate ? '매매가 (자산)' : '보증금 (자산)'}</p>
              <p className={`text-sm font-mono font-bold ${!isOwnedRealEstate && currentRealEstate.deposit > 0 && currentAssetValue === 0 ? 'text-red-400' : 'text-emerald-400'}`}>{currentAssetValue.toLocaleString()}</p>
              {!isOwnedRealEstate && currentRealEstate.deposit > 0 && currentAssetValue === 0 && (
                <p className="text-[8px] text-red-400/80 font-bold mt-0.5">보증금 손실</p>
              )}
            </div>
            <div className="text-center">
              <p className="text-[9px] text-white/20 font-bold uppercase">월세</p>
              <p className={`text-sm font-mono font-bold ${isOwnedRealEstate ? 'text-white/30' : 'text-red-400'}`}>
                {isOwnedRealEstate ? '0 (면제)' : currentRealEstate.monthlyRent.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-white/20 font-bold uppercase">힐링</p>
              <p className="text-sm font-bold text-emerald-400">-{currentRealEstate.stressRelief}/월</p>
            </div>
          </div>
        </div>

        {/* 잔고 요약 */}
        <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex justify-between items-center px-4">
          <span className="text-xs text-white/40 font-bold">사용 가능 현금</span>
          <span className="font-mono text-lg font-bold">{cash.toLocaleString()}원</span>
        </div>

        {/* 이사 가능한 매물 목록 */}
        <h3 className="text-[9px] font-bold text-white/20 px-1 uppercase tracking-[0.2em] mt-4 flex items-center">
          <MapPin size={9} className="mr-1" /> 추천 매물 목록
        </h3>
        
        <div className="stagger-children space-y-3">
          {REAL_ESTATE_OPTIONS.map((item, idx) => {
            const isCurrentRent = item.id === currentRealEstate.id && !isOwnedRealEstate;
            const isCurrentOwned = item.id === currentRealEstate.id && isOwnedRealEstate;
            
            const targetRentCost = item.deposit;
            const targetBuyCost = item.purchasePrice;
            
            const canAffordRent = (cash + currentAssetValue) >= targetRentCost;
            const canAffordBuy = item.purchasePrice > 0 && (cash + currentAssetValue) >= targetBuyCost;
            
            return (
              <div 
                key={item.id} 
                className={`bg-white/5 rounded-2xl p-4 border transition-all ${item.id === currentRealEstate.id ? 'border-emerald-500/40 ring-1 ring-emerald-500/20' : 'border-white/5'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{getGradeEmoji(idx)}</span>
                    <h4 className="font-bold text-sm">{item.name}</h4>
                  </div>
                  {item.id === currentRealEstate.id && (
                    <span className="bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center">
                      <Sparkles size={8} className="mr-1" /> 거주중
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-white/30 mb-4 leading-relaxed">{item.description}</p>
                
                <div className="space-y-2.5">
                  {/* 월세 옵션 */}
                  <div className={`p-2.5 rounded-xl border flex justify-between items-center ${isCurrentRent ? 'bg-white/10 border-white/20' : 'bg-black/20 border-white/5'}`}>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-white/50 block">전/월세</span>
                      <div className="text-xs font-mono font-bold">보증금 {item.deposit.toLocaleString()}</div>
                      <div className="text-[10px] font-mono text-red-400">월세 {item.monthlyRent.toLocaleString()}</div>
                    </div>
                    {isCurrentRent ? (
                      <span className="text-[10px] text-white/30 font-bold px-3 py-1">현재 거주중</span>
                    ) : (
                      <button 
                        onClick={() => handleMove(item.id, false)}
                        disabled={!canAffordRent}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${canAffordRent ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                      >
                        계약하기
                      </button>
                    )}
                  </div>

                  {/* 매매 옵션 */}
                  {item.purchasePrice > 0 && (
                    <div className={`p-2.5 rounded-xl border flex justify-between items-center ${isCurrentOwned ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-black/20 border-white/5'}`}>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-yellow-500 flex items-center">
                          <Key size={10} className="mr-1" /> 매매 (자가)
                        </span>
                        <div className="text-xs font-mono font-bold text-yellow-400">매매가 {item.purchasePrice.toLocaleString()}</div>
                        <div className="text-[10px] font-bold text-emerald-400">월세 면제 혜택</div>
                      </div>
                      {isCurrentOwned ? (
                        <span className="text-[10px] text-yellow-400/50 font-bold px-3 py-1">현재 소유중</span>
                      ) : (
                        <button 
                          onClick={() => handleMove(item.id, true)}
                          disabled={!canAffordBuy}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${canAffordBuy ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                        >
                          매수하기
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 상태 메시지 */}
      {successMsg && (
        <div className="absolute bottom-4 left-4 right-4 animate-slide-in-bottom z-20">
          <div className="bg-emerald-500/90 text-white p-3 rounded-xl flex items-center text-sm font-bold shadow-2xl backdrop-blur-md">
            <CheckCircle2 size={16} className="mr-2" /> {successMsg}
          </div>
        </div>
      )}
      {errorMsg && (
        <div className="absolute bottom-4 left-4 right-4 animate-slide-in-bottom z-20">
          <div className="bg-red-500/90 text-white p-3 rounded-xl flex items-center text-sm font-bold shadow-2xl backdrop-blur-md">
            <AlertCircle size={16} className="mr-2" /> {errorMsg}
          </div>
        </div>
      )}
    </div>
  );
}
