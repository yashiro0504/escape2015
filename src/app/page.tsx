"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { MessageCircle, LineChart, Bitcoin, Landmark, Gamepad2, Settings, CalendarDays, Ticket, Building, Briefcase, Heart, Zap, TrendingUp, TrendingDown, ChevronRight, Coffee, BarChart3 } from "lucide-react";
import { useGameStore, getPortfolioValue, getTargetGoal, getTargetGoalLabel } from "@/store/gameStore";
import StartScreen from "@/components/StartScreen";
import EndScreen from "@/components/EndScreen";
export default function Home() {
  const { year, month, week, nextTurn, skipToNextMonth, currentNews, chatMessages, cash, deposit, depositInterestRate, loan, portfolio, marketPrices, interestRate, livingCost, salary, currentRealEstate, isOwnedRealEstate, realEstateAssetValue, stress, currentJob, stocks, hasReadNews, markNewsAsRead, isGameStarted, isGameOver, isGameWon, endGameReason, clearedCount } = useGameStore();
  const [showTurnTransition, setShowTurnTransition] = useState(false);

  const handleNextTurn = useCallback(() => {
    setShowTurnTransition(true);
    setTimeout(() => {
      nextTurn();
      setShowTurnTransition(false);
    }, 600);
  }, [nextTurn]);

  const handleSkipToNextMonth = useCallback(() => {
    setShowTurnTransition(true);
    setTimeout(() => {
      skipToNextMonth();
      setShowTurnTransition(false);
    }, 600);
  }, [skipToNextMonth]);

  if (!isGameStarted) {
    return <StartScreen />;
  }

  if (isGameOver) {
    return <EndScreen isWon={isGameWon} reason={endGameReason} />;
  }

  const portfolioValue = getPortfolioValue(portfolio, marketPrices);

  const totalBalance = cash + deposit + portfolioValue + realEstateAssetValue - loan;

  // 월간 현금흐름 계산
  const monthlyLoanInterest = Math.floor(loan * (interestRate / 12));
  const monthlyDividends = Math.floor(portfolioValue * 0.001);
  const monthlySavingsInterest = Math.floor(deposit * (depositInterestRate / 12));
  const totalMonthlyIncome = salary + monthlyDividends + monthlySavingsInterest;
  const actualMonthlyRent = isOwnedRealEstate ? 0 : currentRealEstate.monthlyRent;
  const totalMonthlyExpense = livingCost + actualMonthlyRent + monthlyLoanInterest;
  const monthlyNetProfit = totalMonthlyIncome - totalMonthlyExpense;

  const unreadChatCount = chatMessages.filter(m => !m.isRead).length;

  // 목표 자산 (다회차 비례)
  const targetAsset = getTargetGoal(clearedCount);
  const targetLabel = getTargetGoalLabel(clearedCount);
  const progressPercent = Math.min(100, Math.max(0, (totalBalance / targetAsset) * 100));

  // 주식 티커 데이터
  const tickerData = stocks.map(stock => {
    const mp = marketPrices[stock.id];
    if (!mp) return null;
    const prevPrice = mp.history.length > 1 ? mp.history[mp.history.length - 2] : mp.price;
    const change = ((mp.price - prevPrice) / prevPrice) * 100;
    return { name: stock.name, price: mp.price, change };
  }).filter((v): v is NonNullable<typeof v> => v != null);

  const apps = [
    {
      name: "평민문S",
      icon: <LineChart size={28} className="text-white" />,
      gradient: "from-red-600 to-rose-700",
      href: "/stock",
    },
    {
      name: "비트고수",
      icon: <Bitcoin size={28} className="text-white" />,
      gradient: "from-orange-500 to-amber-600",
      href: "/crypto",
    },
    {
      name: "배트맨",
      icon: <Gamepad2 size={28} className="text-white" />,
      gradient: "from-emerald-500 to-green-700",
      href: "/toto",
    },
    {
      name: "흙수저은행",
      icon: <Landmark size={28} className="text-white" />,
      gradient: "from-zinc-600 to-zinc-800",
      href: "/bank",
    },
    {
      name: "일확천금",
      icon: <Ticket size={28} className="text-white" />,
      gradient: "from-indigo-600 to-blue-800",
      href: "/lotto",
    },
    {
      name: "복덕방",
      icon: <Building size={28} className="text-white" />,
      gradient: "from-teal-500 to-emerald-700",
      href: "/realestate",
    },
    {
      name: "사람인",
      icon: <Briefcase size={28} className="text-white" />,
      gradient: "from-blue-500 to-blue-700",
      href: "/jobs",
    },
    {
      name: "소확행",
      icon: <Coffee size={28} className="text-white" />,
      gradient: "from-emerald-400 to-teal-600",
      href: "/healing",
    },
  ];

  const dockApps = [
    {
      name: "전화",
      icon: <span className="text-2xl">📞</span>,
      gradient: "from-green-500 to-green-600",
      href: "#",
    },
    {
      name: "까톡",
      icon: <MessageCircle size={28} className="text-amber-900 fill-amber-900" />,
      gradient: "from-yellow-400 to-yellow-500",
      href: "/chat",
      badge: unreadChatCount > 0 ? unreadChatCount : undefined,
    },
    {
      name: "내 자산",
      icon: <BarChart3 size={28} className="text-white" />,
      gradient: "from-violet-600 to-indigo-700",
      href: "/assets",
    },
    {
      name: "설정",
      icon: <Settings size={28} className="text-white" />,
      gradient: "from-zinc-500 to-zinc-700",
      href: "/settings",
    },
  ];

  // 스트레스 레벨에 따른 색상
  const stressColor = stress > 70 ? 'text-red-400' : stress > 40 ? 'text-orange-400' : 'text-emerald-400';

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      <div className="flex-1 overflow-y-auto pt-4 sm:pt-6 px-4 pb-28 sm:pb-36">
      {/* ─── 상단 날짜 & 스트레스 ─── */}
      <div className="w-full mb-4 flex items-center justify-between animate-fade-in">
        {/* 좌측: 날짜 및 스트레스 */}
        <div className="flex flex-col">
          <div className="flex items-baseline space-x-2">
            <p className="text-xl font-black text-white tracking-wide">{year}년 {month}월</p>
            <p className="text-sm font-bold text-white/60">{week}주차</p>
          </div>
          <div className="flex items-center mt-1">
            <Heart size={11} className={`${stressColor} mr-1`} />
            <span className={`text-[10px] font-bold ${stressColor}`}>스트레스 {stress}%</span>
          </div>
        </div>
        
        {/* 우측: 턴 넘기기 버튼들 */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleSkipToNextMonth}
            className="flex items-center px-2.5 py-1.5 bg-white/10 text-white/80 rounded-full text-[10px] font-bold active:scale-95 transition-all hover:bg-white/20 border border-white/5"
          >
            <CalendarDays size={10} className="mr-1" />
            다음 달
          </button>
          <button 
            onClick={handleNextTurn}
            className="flex items-center px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full text-[10px] font-bold active:scale-95 transition-all shadow-[0_0_10px_rgba(249,115,22,0.3)]"
          >
            다음 주
            <ChevronRight size={10} className="ml-0.5" />
          </button>
        </div>
      </div>

      {/* ─── 자산 요약 카드 (글래스모피즘) ─── */}
      <div className="w-full mb-3 glass rounded-2xl p-4 shadow-2xl animate-fade-in-up relative overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-full blur-2xl" />
        
        <div className="flex justify-between items-start mb-3 relative z-10">
          <div>
            <p className="text-[9px] text-white/40 font-bold tracking-widest uppercase mb-1">순 자산</p>
            <p className={`text-2xl font-mono font-black ${totalBalance >= 0 ? 'text-white' : 'text-red-400'}`}>
              {totalBalance >= 0 ? '' : '-'}{Math.abs(totalBalance).toLocaleString()}
              <span className="text-sm text-white/40 ml-0.5">원</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-white/40 font-bold tracking-widest uppercase mb-1">직장</p>
            <p className="text-xs font-bold text-white/70">{currentJob.company}</p>
            <p className="text-[10px] text-white/40">{currentJob.role}</p>
          </div>
        </div>

        {/* 프로그레스 바 (목표 자산 대비) */}
        <div className="mb-3 relative z-10">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] text-white/30 font-bold">탈출 목표 ({targetLabel})</span>
            <span className="text-[9px] text-yellow-400 font-bold">{progressPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-green-400 rounded-full animate-progress-fill shadow-[0_0_10px_rgba(250,204,21,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 자산 그리드 */}
        <div className="grid grid-cols-4 gap-2 relative z-10">
          <div className="bg-white/5 rounded-xl p-2.5">
            <span className="text-[8px] text-white/30 font-bold block mb-0.5">현금</span>
            <span className="text-[10px] font-mono font-bold text-white/90">{cash >= 0 ? cash.toLocaleString() : '-' + Math.abs(cash).toLocaleString()}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5">
            <span className="text-[8px] text-emerald-400/60 font-bold block mb-0.5">예금</span>
            <span className="text-[10px] font-mono font-bold text-emerald-400">+{deposit.toLocaleString()}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5">
            <span className="text-[8px] text-green-400/60 font-bold block mb-0.5">주식</span>
            <span className="text-[10px] font-mono font-bold text-green-400">+{portfolioValue.toLocaleString()}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5">
            <span className="text-[8px] text-red-400/60 font-bold block mb-0.5">대출</span>
            <span className="text-[10px] font-mono font-bold text-red-400">-{loan.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ─── 주식 티커 (실시간 느낌) ─── */}
      <div className="w-full mb-3 overflow-hidden rounded-lg bg-black/30 border border-white/5">
        <div className="flex items-center py-1.5 ticker-tape whitespace-nowrap">
          {[...tickerData, ...tickerData].map((t, i) => (
            t && (
              <span key={i} className="inline-flex items-center mx-4 text-[10px]">
                <span className="font-bold text-white/60 mr-1.5">{t.name}</span>
                <span className={`font-mono font-bold ${t.change >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
                  {t.change >= 0 ? '▲' : '▼'}{Math.abs(t.change).toFixed(1)}%
                </span>
              </span>
            )
          ))}
        </div>
      </div>

      {/* ─── 월간 현금흐름 (컴팩트) ─── */}
      <div className="w-full mb-4 glass-dark rounded-xl p-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1.5">
            <Zap size={10} className="text-yellow-400" />
            <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest">월간 현금흐름 (월말 정산)</span>
          </div>
          <span className={`text-xs font-mono font-bold ${monthlyNetProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {monthlyNetProfit >= 0 ? '+' : ''}{monthlyNetProfit.toLocaleString()}원
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 mt-2">
          <div className="flex justify-between text-[9px]">
            <span className="text-white/25">월급</span>
            <span className="text-white/60 font-mono">{salary.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[9px]">
            <span className="text-white/25">대출이자</span>
            <span className="text-red-400/60 font-mono">-{monthlyLoanInterest.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[9px]">
            <span className="text-white/25">배당+이자</span>
            <span className="text-white/60 font-mono">{(monthlyDividends + monthlySavingsInterest).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[9px]">
            <span className="text-white/25">생활비+월세</span>
            <span className="text-red-400/60 font-mono">-{(livingCost + actualMonthlyRent).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ─── 메인 앱 그리드 ─── */}
      <div className="grid grid-cols-4 gap-y-5 gap-x-2 stagger-children mb-4">
        {apps.map((app) => (
          <Link href={app.href!} key={app.name} className="flex flex-col items-center group">
            <div className={`w-[56px] h-[56px] rounded-[14px] bg-gradient-to-br ${app.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow relative overflow-hidden`}>
              {app.icon}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors rounded-[14px]" />
            </div>
            <span className="text-white/80 text-[10px] mt-1.5 font-medium drop-shadow-md text-center leading-tight">
              {app.name}
            </span>
          </Link>
        ))}
      </div>

      </div>

      {/* ─── 하단 독 (Dock) ─── */}
      <div className="absolute bottom-0 left-0 right-0 z-40 animate-slide-in-bottom" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 8px), 8px)' }}>
        <div className="mx-3 mb-2 h-[72px] glass rounded-3xl flex items-center justify-around px-4 shadow-2xl">
        {dockApps.map((app) => (
          <Link href={app.href} key={app.name} className="flex flex-col items-center relative group">
            <div className={`w-[50px] h-[50px] rounded-[14px] bg-gradient-to-br ${app.gradient} flex items-center justify-center shadow-lg`}>
              {app.icon}
            </div>
            {app.badge && (
              <div className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#1a1a2e] shadow-lg animate-pop-in">
                {app.badge}
              </div>
            )}
          </Link>
        ))}
        </div>
      </div>

      {/* ─── 턴 전환 오버레이 ─── */}
      {showTurnTransition && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center animate-fade-in">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/20 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60 text-sm font-bold">시간이 흐르고 있습니다...</p>
            <p className="text-yellow-400 text-xs mt-1">📅 다음 주로 이동 중</p>
          </div>
        </div>
      )}

      {/* ─── 속보 모달 ─── */}
      {currentNews && currentNews.length > 0 && !hasReadNews && (
        <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-2xl w-full max-w-[320px] overflow-hidden shadow-2xl border border-white/10 animate-news-flash">
            {/* 속보 헤더 */}
            <div className="bg-gradient-to-r from-red-700 to-red-600 text-white p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(255,255,255,0.03)_10px,rgba(255,255,255,0.03)_20px)]" />
              <div className="relative z-10 flex items-center justify-center space-x-2">
                <Zap size={16} className="text-yellow-300 fill-yellow-300" />
                <span className="font-black text-lg tracking-wider">속 보</span>
                <Zap size={16} className="text-yellow-300 fill-yellow-300" />
              </div>
              <p className="text-center text-[10px] text-white/60 mt-1 relative z-10">{year}년 {month}월 {week}주차</p>
            </div>
            
            {/* 뉴스 내용 */}
            <div className="p-4 max-h-[50vh] overflow-y-auto space-y-3">
              {currentNews.map((news, idx) => (
                <div key={news.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <h3 className="font-black text-base text-white mb-1.5 leading-snug">{news.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">{news.description}</p>
                  {/* 이펙트 태그 */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {news.effects.map((eff, i) => {
                      const isPositive = eff.targetType === 'stress'
                        ? (eff.value ?? 0) < 0
                        : eff.targetType === 'realestate_scam'
                          ? false
                          : eff.targetType === 'lotto_buff'
                            ? true
                            : Boolean((eff.multiplier && eff.multiplier > 1) || (eff.value && eff.value > 0));
                      const effectLabel =
                        eff.targetType === 'stock' ? `${eff.targetId}` :
                        eff.targetType === 'sector' ? `${eff.targetId} 섹터` :
                        eff.targetType === 'market' ? '시장 전체' :
                        eff.targetType === 'interest' ? '금리 변동' :
                        eff.targetType === 'cash' ? '보너스/손실' :
                        eff.targetType === 'salary' ? '월급 변동' :
                        eff.targetType === 'livingCost' ? '물가 변동' :
                        eff.targetType === 'stress' ? '스트레스 변동' :
                        eff.targetType === 'lotto_buff' ? '로또 운 상승' :
                        eff.targetType === 'realestate_scam' ? '보증금 위험' :
                        '특수 이벤트';
                      return (
                        <span key={i} className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${isPositive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                          {effectLabel}
                          {' '}
                          {eff.multiplier && (isPositive ? <TrendingUp size={8} className="inline" /> : <TrendingDown size={8} className="inline" />)}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => {
                markNewsAsRead();
              }}
              className="w-full p-4 bg-white/5 text-white font-bold active:bg-white/10 transition-colors text-sm border-t border-white/5 hover:bg-white/8"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
