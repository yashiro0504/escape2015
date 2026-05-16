"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase, GraduationCap, Building2, CheckCircle2, AlertCircle, Clock, Zap, Lock } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { JOB_LIST } from "@/data/jobs";

export default function JobSearchApp() {
  const { totalExperience, currentJob, applyJob, quitJob, stress } = useGameStore();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const formatExp = (months: number) => {
    const years = Math.floor(months / 12);
    const m = months % 12;
    if (years === 0) return `${m}개월`;
    if (m === 0) return `${years}년`;
    return `${years}년 ${m}개월`;
  };

  const handleApply = (id: string) => {
    const target = JOB_LIST.find(j => j.id === id);
    if (!target) return;
    if (target.id === currentJob.id) return;

    if (totalExperience < target.requiredExp) {
      setErrorMsg("필요 경력이 부족하여 지원할 수 없습니다.");
      setSuccessMsg("");
      return;
    }

    const success = applyJob(id);
    if (success) {
      setSuccessMsg(`${target.company}에 입사 완료!`);
      setErrorMsg("");
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      setErrorMsg("입사 처리에 실패했습니다.");
    }
  };

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col text-white">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-4 py-3 flex items-center shadow-lg z-10 sticky top-0">
        <Link href="/" className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-base font-bold flex items-center">
          <Briefcase size={18} className="mr-2" />
          사람인 2015
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* 내 프로필 요약 */}
        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 relative overflow-hidden animate-fade-in-up">
          <div className="absolute -top-4 -right-4 opacity-5">
            <GraduationCap size={80} />
          </div>
          <div className="flex items-center mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400 mr-3">
              <GraduationCap size={26} />
            </div>
            <div>
              <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">나의 커리어</span>
              <h2 className="text-xl font-black text-white">김개미 <span className="text-sm font-normal text-white/30">님</span></h2>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <p className="text-[9px] text-white/20 font-bold uppercase mb-1 flex items-center">
                <Clock size={9} className="mr-1" /> 총 경력
              </p>
              <p className="text-base font-bold">{formatExp(totalExperience)}</p>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <p className="text-[9px] text-white/20 font-bold uppercase mb-1 flex items-center">
                <Zap size={9} className="mr-1" /> 스트레스
              </p>
              <p className={`text-base font-bold ${stress > 70 ? 'text-red-400' : stress > 40 ? 'text-orange-400' : 'text-emerald-400'}`}>{stress}%</p>
            </div>
          </div>

          <div className="mt-3 p-3 bg-blue-500/10 rounded-xl border border-blue-500/15">
            <p className="text-[9px] text-blue-400/60 font-bold uppercase mb-1">현재 직장</p>
            <div className="flex justify-between items-center mt-2">
              <span className="font-bold text-white/90 text-sm">{currentJob.company}</span>
              <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-white/40">{currentJob.role}</span>
            </div>
            {currentJob.id !== 'unemployed' && (
              <div className="mt-3 pt-3 border-t border-blue-500/15 flex justify-end">
                <button 
                  onClick={() => {
                    quitJob();
                    setSuccessMsg("퇴사했습니다. 이제 자유입니다!");
                    setTimeout(() => setSuccessMsg(""), 3000);
                  }}
                  className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-red-500/20"
                >
                  퇴사하기
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 채용 공고 목록 */}
        <h3 className="text-[9px] font-bold text-white/20 px-1 uppercase tracking-[0.2em] mt-4">오늘의 추천 채용</h3>
        
        <div className="stagger-children space-y-3">
          {JOB_LIST.filter(job => job.id !== 'unemployed').map((job) => {
            const isCurrent = job.id === currentJob.id;
            const isLocked = totalExperience < job.requiredExp;
            const expProgress = Math.min(100, (totalExperience / Math.max(1, job.requiredExp)) * 100);
            
            return (
              <div 
                key={job.id} 
                className={`bg-white/5 rounded-2xl p-4 border transition-all ${isCurrent ? 'border-blue-500/50 ring-1 ring-blue-500/30' : 'border-white/5'} ${isLocked ? 'opacity-50' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center">
                    <Building2 size={14} className="text-white/20 mr-2" />
                    <h4 className="font-bold text-sm text-white/90">{job.company}</h4>
                  </div>
                  {isCurrent && (
                    <span className="bg-blue-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">재직중</span>
                  )}
                  {isLocked && (
                    <Lock size={12} className="text-white/20" />
                  )}
                </div>
                <p className="text-[10px] font-bold text-blue-400/70 mb-2">{job.role}</p>
                <p className="text-[10px] text-white/30 mb-4 leading-relaxed">{job.description}</p>
                
                <div className="flex justify-between items-end pt-3 border-t border-white/5">
                  <div className="space-y-1.5">
                    <div className="flex items-center text-[10px]">
                      <span className="w-14 text-white/20 font-bold">월급:</span>
                      <span className="font-mono font-bold text-white/70">{job.salary.toLocaleString()}원</span>
                    </div>
                    <div className="flex items-center text-[10px]">
                      <span className="w-14 text-white/20 font-bold">경력:</span>
                      <span className={`font-bold ${isLocked ? 'text-red-400/70' : 'text-emerald-400/70'}`}>
                        {job.requiredExp === 0 ? '신입 가능' : `${formatExp(job.requiredExp)} 이상`}
                      </span>
                    </div>
                    <div className="flex items-center text-[10px]">
                      <span className="w-14 text-white/20 font-bold">업무강도:</span>
                      <span className="font-bold text-orange-400/70 flex items-center">
                        <Zap size={9} className="mr-0.5" /> 주당 +{Math.ceil(job.stress / 4)} 스트레스
                      </span>
                    </div>
                    {/* 경력 프로그레스 */}
                    {!isCurrent && job.requiredExp > 0 && (
                      <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden mt-1">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${isLocked ? 'bg-red-500/50' : 'bg-emerald-500'}`}
                          style={{ width: `${expProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  
                  {!isCurrent && (
                    <button 
                      onClick={() => handleApply(job.id)}
                      disabled={isLocked}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isLocked ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-blue-600 text-white active:scale-95 shadow-lg shadow-blue-600/20'}`}
                    >
                      {isLocked ? '경력 부족' : '지원하기'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 알림 메시지 */}
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
