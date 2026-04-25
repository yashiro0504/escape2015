"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase, User, GraduationCap, Building2, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { JOB_LIST } from "@/data/jobs";

export default function JobSearchApp() {
  const { totalExperience, currentJob, applyJob, stress } = useGameStore();
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

    const confirmApply = confirm(`${target.company}(${target.role})에 지원하시겠습니까?\n월급: ${target.salary.toLocaleString()}원`);
    
    if (confirmApply) {
      const success = applyJob(id);
      if (success) {
        setSuccessMsg(`${target.company}에 입사 완료!`);
        setErrorMsg("");
      }
    }
  };

  return (
    <div className="w-full h-full bg-[#f8f9fd] flex flex-col text-black">
      {/* 헤더 */}
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center shadow-md z-10 sticky top-0">
        <Link href="/" className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold flex items-center">
          <Briefcase size={20} className="mr-2" />
          사람인 2015
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* 내 프로필 요약 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <User size={80} />
          </div>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
              <GraduationCap size={28} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">나의 커리어 프로필</span>
              <h2 className="text-xl font-bold">김개미 <span className="text-sm font-normal text-zinc-400">님</span></h2>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-zinc-50 p-3 rounded-xl">
              <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1 flex items-center">
                <Clock size={10} className="mr-1" /> 총 경력
              </p>
              <p className="text-base font-bold">{formatExp(totalExperience)}</p>
            </div>
            <div className="bg-zinc-50 p-3 rounded-xl">
              <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1 flex items-center">
                <AlertCircle size={10} className="mr-1" /> 스트레스
              </p>
              <p className="text-base font-bold text-orange-600">{stress}%</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-[10px] text-blue-600 font-bold uppercase mb-1">현재 직장</p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-zinc-800">{currentJob.company}</span>
              <span className="text-xs bg-white px-2 py-0.5 rounded text-zinc-500">{currentJob.role}</span>
            </div>
          </div>
        </div>

        {/* 채용 공고 목록 */}
        <h3 className="text-xs font-bold text-zinc-400 px-1 uppercase tracking-widest mt-6">오늘의 추천 채용</h3>
        
        {JOB_LIST.map((job) => {
          const isCurrent = job.id === currentJob.id;
          const isLocked = totalExperience < job.requiredExp;
          
          return (
            <div 
              key={job.id} 
              className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${isCurrent ? 'border-blue-500 ring-1 ring-blue-500' : 'border-zinc-200'} ${isLocked ? 'opacity-70 grayscale-[0.5]' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center">
                  <Building2 size={16} className="text-zinc-400 mr-2" />
                  <h4 className="font-bold text-base text-zinc-800">{job.company}</h4>
                </div>
                {isCurrent && (
                  <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">재직중</span>
                )}
              </div>
              <p className="text-xs font-bold text-blue-600 mb-2">{job.role}</p>
              <p className="text-xs text-zinc-500 mb-4 leading-relaxed">{job.description}</p>
              
              <div className="flex justify-between items-end pt-3 border-t border-zinc-50">
                <div className="space-y-1">
                  <div className="flex items-center text-xs">
                    <span className="w-14 text-zinc-400 font-bold">월급:</span>
                    <span className="font-mono font-bold text-zinc-800">{job.salary.toLocaleString()}원</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="w-14 text-zinc-400 font-bold">필요경력:</span>
                    <span className={`font-bold ${isLocked ? 'text-red-500' : 'text-emerald-600'}`}>
                      {job.requiredExp === 0 ? '신입 지원가능' : `${formatExp(job.requiredExp)} 이상`}
                    </span>
                  </div>
                </div>
                
                {!isCurrent && (
                  <button 
                    onClick={() => handleApply(job.id)}
                    disabled={isLocked}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isLocked ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' : 'bg-blue-600 text-white active:scale-95 shadow-sm'}`}
                  >
                    지원하기
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 알림 메시지 */}
      {(successMsg || errorMsg) && (
        <div className="absolute bottom-4 left-4 right-4 animate-in fade-in slide-in-from-bottom-4">
          {successMsg && (
            <div className="bg-emerald-600 text-white p-3 rounded-xl flex items-center text-sm font-bold shadow-lg">
              <CheckCircle2 size={16} className="mr-2" /> {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="bg-red-600 text-white p-3 rounded-xl flex items-center text-sm font-bold shadow-lg">
              <AlertCircle size={16} className="mr-2" /> {errorMsg}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
