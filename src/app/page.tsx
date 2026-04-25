"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, LineChart, Bitcoin, Landmark, Gamepad2, Settings, CalendarDays, Ticket, Building, Briefcase } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

// moved inside Home component

export default function Home() {
  const { year, month, nextTurn, currentNews, chatMessages, cash, loan, portfolio, marketPrices, interestRate, livingCost, salary, currentRealEstate } = useGameStore();
  const [showNews, setShowNews] = useState(false);
  const [currentTime, setCurrentTime] = useState("13:25");

  const portfolioValue = Object.values(portfolio).reduce((total, item) => {
    const currentPrice = marketPrices[item.stockId]?.price || 0;
    return total + (currentPrice * item.amount);
  }, 0);

  const totalBalance = cash + portfolioValue - loan;

  // 월간 현금흐름 계산
  const monthlyLoanInterest = Math.floor(loan * (interestRate / 12));
  const monthlyDividends = Math.floor(portfolioValue * 0.001); // 시가총액의 0.1% 가상 배당
  const monthlySavingsInterest = Math.floor(cash * 0.001); // 현금의 0.1% 가상 이자 (2015년 기준)
  const totalMonthlyIncome = salary + monthlyDividends + monthlySavingsInterest;
  const totalMonthlyExpense = livingCost + currentRealEstate.monthlyRent + monthlyLoanInterest;
  const monthlyNetProfit = totalMonthlyIncome - totalMonthlyExpense;

  const unreadChatCount = chatMessages.filter(m => !m.isRead).length;

  const dockApps = [
    {
      name: "전화",
      icon: <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-xl">📞</div>,
      color: "bg-green-500",
      href: "#",
    },
    {
      name: "까톡",
      icon: <MessageCircle size={32} className="text-amber-900 fill-amber-900" />,
      color: "bg-yellow-400",
      href: "/chat",
      badge: unreadChatCount > 0 ? unreadChatCount : undefined,
    },
    {
      name: "설정",
      icon: <Settings size={32} className="text-white" />,
      color: "bg-zinc-600",
      href: "#",
    },
  ];

  useEffect(() => {
    // 실제 시간을 보여주도록 설정
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 60); // 1분마다 업데이트
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentNews && currentNews.length > 0) {
      setShowNews(true);
    }
  }, [currentNews]);

  const apps = [
    {
      name: "평민문S",
      icon: <LineChart size={32} className="text-white" />,
      color: "bg-red-600",
      href: "/stock",
    },
    {
      name: "비트고수",
      icon: <Bitcoin size={32} className="text-white" />,
      color: "bg-blue-600",
      href: "/crypto",
    },
    {
      name: "배트맨",
      icon: <Gamepad2 size={32} className="text-white" />,
      color: "bg-green-600",
      href: "/toto",
    },
    {
      name: "흙수저은행",
      icon: <Landmark size={32} className="text-white" />,
      color: "bg-zinc-700",
      href: "/bank",
    },
    {
      name: "일확천금",
      icon: <Ticket size={32} className="text-white" />,
      color: "bg-blue-800",
      href: "/lotto",
    },
    {
      name: "복덕방",
      icon: <Building size={32} className="text-white" />,
      color: "bg-emerald-600",
      href: "/realestate",
    },
    {
      name: "사람인",
      icon: <Briefcase size={32} className="text-white" />,
      color: "bg-blue-600",
      href: "/jobs",
    },
    {
      name: "턴 종료",
      icon: <CalendarDays size={32} className="text-white" />,
      color: "bg-orange-500",
      action: nextTurn,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col pt-8 pb-4 px-4 relative overflow-hidden">
      {/* 상단 대시보드 (자산 요약) */}
      <div className="w-full mb-6 flex flex-col items-center">
        <div className="flex flex-col items-center mb-4 text-white/90">
          <p className="text-lg font-black tracking-widest uppercase drop-shadow-md">{year}년 {month}월</p>
        </div>

        {/* 자산 요약 카드 (Glassmorphism) */}
        <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/60 font-bold">보유 현금</span>
              <span className="text-sm font-mono font-bold text-white">{cash.toLocaleString()}원</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-white/60 font-bold">주식 평가액</span>
              <span className="text-sm font-mono font-bold text-green-400">+{portfolioValue.toLocaleString()}원</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-white/60 font-bold">대출 원금</span>
              <span className="text-sm font-mono font-bold text-red-400">-{loan.toLocaleString()}원</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-white/60 font-bold">순 자산</span>
              <span className="text-base font-mono font-black text-yellow-400">{totalBalance.toLocaleString()}원</span>
            </div>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
             <div 
               className="h-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]" 
               style={{ width: `${Math.min(100, Math.max(0, (totalBalance / 20000000) * 100))}%` }}
             ></div>
          </div>
        </div>

        {/* 월간 현금흐름 요약 */}
        <div className="w-full mt-3 bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/5 shadow-lg">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/10">
            <h3 className="text-xs font-black text-white/40 uppercase tracking-widest">월간 현금 흐름 (예상)</h3>
            <span className={`text-xs font-bold ${monthlyNetProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {monthlyNetProfit >= 0 ? '+' : ''}{monthlyNetProfit.toLocaleString()}원
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {/* 수입 컬럼 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/40">월급</span>
                <span className="text-white/80 font-mono">{salary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-white/40">배당금</span>
                <span className="text-white/80 font-mono">{monthlyDividends.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-white/40">예금이자</span>
                <span className="text-white/80 font-mono">{monthlySavingsInterest.toLocaleString()}</span>
              </div>
            </div>

            {/* 지출 컬럼 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/40">대출이자</span>
                <span className="text-red-400/80 font-mono">-{monthlyLoanInterest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-white/40">월세 ({currentRealEstate.name})</span>
                <span className="text-red-400/80 font-mono">-{currentRealEstate.monthlyRent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-white/40">기본생활비</span>
                <span className="text-red-400/80 font-mono">-{livingCost.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 앱 그리드 */}
      <div className="grid grid-cols-4 gap-y-6 gap-x-2">
        {apps.map((app) => {
          if (app.action) {
            return (
              <button key={app.name} onClick={app.action} className="flex flex-col items-center group active:scale-95 transition-transform bg-transparent border-none p-0">
                <div className={`w-[60px] h-[60px] rounded-[14px] flex items-center justify-center shadow-md ${app.color}`}>
                  {app.icon}
                </div>
                <span className="text-white text-[11px] mt-1.5 font-medium drop-shadow-md">
                  {app.name}
                </span>
              </button>
            );
          }
          return (
            <Link href={app.href!} key={app.name} className="flex flex-col items-center group active:scale-95 transition-transform">
              <div className={`w-[60px] h-[60px] rounded-[14px] flex items-center justify-center shadow-md ${app.color}`}>
                {app.icon}
              </div>
              <span className="text-white text-[11px] mt-1.5 font-medium drop-shadow-md">
                {app.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* 하단 독 (Dock) */}
      <div className="absolute bottom-4 left-4 right-4 h-[84px] bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-around px-2 shadow-lg border border-white/10">
        {dockApps.map((app) => (
          <Link href={app.href} key={app.name} className="flex flex-col items-center relative group active:scale-95 transition-transform">
            <div className={`w-[60px] h-[60px] rounded-[16px] flex items-center justify-center shadow-md ${app.color}`}>
              {app.icon}
            </div>
            {app.badge && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-black shadow-sm">
                {app.badge}
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* 속보 모달 */}
      {showNews && currentNews && currentNews.length > 0 && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[300px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="bg-red-600 text-white p-3 font-bold text-center">
              긴급 속보
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {currentNews.map((news) => (
                <div key={news.id} className="mb-4 last:mb-0">
                  <h3 className="font-bold text-lg text-zinc-800 mb-1">{news.title}</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed bg-zinc-100 p-2 rounded">{news.description}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowNews(false)}
              className="w-full p-4 bg-zinc-100 text-zinc-800 font-bold active:bg-zinc-200 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
