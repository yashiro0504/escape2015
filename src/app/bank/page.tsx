"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Landmark, CreditCard, Coins, AlertTriangle, ShieldCheck, TrendingDown, TrendingUp, PiggyBank } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

export default function BankApp() {
  const { cash, loan, interestRate, deposit, depositInterestRate, creditScore, takeLoan, repayLoan, depositMoney, withdrawMoney, salary } = useGameStore();
  const [activeTab, setActiveTab] = useState<'deposit' | 'loan'>('deposit');
  const [amount, setAmount] = useState<number | "">(1000000);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const maxLoanLimit = Math.floor((salary * 12) * (creditScore / 1000));
  const availableLoan = Math.max(0, maxLoanLimit - loan);
  const amountToTrade = Number(amount) || 0;

  const formatKoreanCurrency = (val: number) => {
    if (val === 0) return '0';
    const isNegative = val < 0;
    const absVal = Math.abs(val);
    
    if (absVal >= 100000000) {
      const eok = Math.floor(absVal / 100000000);
      const man = Math.floor((absVal % 100000000) / 10000);
      return `${isNegative ? '-' : ''}${eok}억${man > 0 ? ` ${man.toLocaleString()}만` : ''}`;
    }
    if (absVal >= 10000) {
      return `${isNegative ? '-' : ''}${Math.floor(absVal / 10000).toLocaleString()}만`;
    }
    return val.toLocaleString();
  };

  const handleTakeLoan = () => {
    if (amountToTrade <= 0) return;
    if (amountToTrade > availableLoan) {
      setErrorMsg("대출 한도를 초과했습니다.");
      setSuccessMsg("");
      return;
    }
    const success = takeLoan(amountToTrade);
    if (success) {
      setSuccessMsg(`${amountToTrade.toLocaleString()}원을 대출받았습니다.`);
      setErrorMsg("");
      setAmount("");
    }
  };

  const handleRepayLoan = () => {
    if (amountToTrade <= 0) return;
    if (amountToTrade > loan) {
      setErrorMsg("대출 잔액보다 많은 금액을 상환할 수 없습니다.");
      setSuccessMsg("");
      return;
    }
    if (amountToTrade > cash) {
      setErrorMsg("현금이 부족합니다.");
      setSuccessMsg("");
      return;
    }
    const success = repayLoan(amountToTrade);
    if (success) {
      setSuccessMsg(`${amountToTrade.toLocaleString()}원을 상환했습니다.`);
      setErrorMsg("");
      setAmount("");
    }
  };

  const handleDeposit = () => {
    if (amountToTrade <= 0) return;
    if (amountToTrade > cash) {
      setErrorMsg("현금이 부족합니다.");
      setSuccessMsg("");
      return;
    }
    const success = depositMoney(amountToTrade);
    if (success) {
      setSuccessMsg(`${amountToTrade.toLocaleString()}원을 예금했습니다.`);
      setErrorMsg("");
      setAmount("");
    }
  };

  const handleWithdraw = () => {
    if (amountToTrade <= 0) return;
    if (amountToTrade > deposit) {
      setErrorMsg("예금 잔액보다 많은 금액을 출금할 수 없습니다.");
      setSuccessMsg("");
      return;
    }
    const success = withdrawMoney(amountToTrade);
    if (success) {
      setSuccessMsg(`${amountToTrade.toLocaleString()}원을 출금했습니다.`);
      setErrorMsg("");
      setAmount("");
    }
  };

  // 신용 등급 계산
  const creditGrade = creditScore >= 900 ? '1등급' : creditScore >= 800 ? '2등급' : creditScore >= 700 ? '3등급' : creditScore >= 600 ? '4등급' : creditScore >= 500 ? '5등급' : '6등급 이하';
  const creditColor = creditScore >= 800 ? 'text-emerald-400' : creditScore >= 600 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col text-white">
      {/* 은행 앱 헤더 */}
      <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 px-4 py-3 flex items-center shadow-lg z-10 sticky top-0 border-b border-white/5">
        <Link href="/" className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-base font-bold flex items-center">
          <Landmark size={18} className="mr-2" />
          흙수저은행
        </h1>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex border-b border-white/10">
        <button 
          onClick={() => { setActiveTab('deposit'); setAmount(""); setErrorMsg(""); setSuccessMsg(""); }}
          className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'deposit' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-white/40'}`}
        >
          예금통장
        </button>
        <button 
          onClick={() => { setActiveTab('loan'); setAmount(""); setErrorMsg(""); setSuccessMsg(""); }}
          className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'loan' ? 'text-red-400 border-b-2 border-red-400' : 'text-white/40'}`}
        >
          마이너스통장
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-6 p-4 space-y-4">
        {/* 내 자산 요약 (입출금 통장) */}
        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 relative overflow-hidden animate-fade-in-up">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-xl" />
          <div className="flex justify-between items-center mb-4 relative z-10">
            <span className="text-xs text-white/30 flex items-center font-bold">
              <Coins size={14} className="mr-1.5" /> 입출금 통장 잔액
            </span>
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${creditColor} border-current/20 bg-white/5`}>
              <ShieldCheck size={10} className="inline mr-1" />
              신용 {creditGrade} ({creditScore}점)
            </span>
          </div>
          <h2 className="text-3xl font-mono font-black relative z-10">
            {cash.toLocaleString()} <span className="text-base font-normal text-white/30">원</span>
          </h2>
          {cash < 0 && (
            <div className="mt-3 bg-red-500/10 text-red-400 p-3 rounded-xl text-xs flex items-center border border-red-500/20 font-bold animate-fade-in">
              <AlertTriangle size={14} className="mr-2 flex-shrink-0" />
              잔액이 마이너스입니다! 이자 연체 및 신용 하락 주의
            </div>
          )}
        </div>

        {activeTab === 'deposit' && (
          <>
            {/* 예금 현황 */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-white/30 flex items-center font-bold">
                  <PiggyBank size={14} className="mr-1.5" /> 정기 예금
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold">
                  <TrendingUp size={9} className="inline mr-1" />
                  연 이율: {(depositInterestRate * 100).toFixed(1)}%
                </span>
              </div>
              <h2 className="text-2xl font-mono font-bold text-emerald-400 mb-3">
                {deposit.toLocaleString()} <span className="text-sm font-normal">원</span>
              </h2>
              <div className="pt-3 border-t border-white/5 flex justify-between items-center text-sm">
                <span className="text-white/30 text-xs">매월 예상 이자 수익</span>
                <span className="font-mono text-emerald-400 font-bold">+{Math.floor(deposit * (depositInterestRate / 12)).toLocaleString()}원</span>
              </div>
            </div>

            {/* 예금 컨트롤 */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xs font-bold mb-4 text-white/40 uppercase tracking-widest">예금 및 출금</h3>
              
              <div className="flex flex-col space-y-3 mb-4">
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => {
                    const val = e.target.value;
                    setAmount(val === "" ? "" : Number(val));
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-right font-mono text-lg outline-none focus:border-white/30 transition-colors"
                />
                <div className="flex space-x-2 mb-2">
                  {[100000, 1000000, 10000000].map((val) => (
                    <button 
                      key={val} 
                      onClick={() => setAmount(prev => (Number(prev) || 0) + val)}
                      className="flex-1 bg-white/5 hover:bg-white/10 rounded-lg py-2 text-xs font-bold transition-colors border border-white/5"
                    >
                      +{(val / 10000).toLocaleString()}만
                    </button>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setAmount(cash > 0 ? cash : 0)}
                    className="flex-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg py-2 text-xs font-bold transition-colors border border-emerald-500/20"
                  >
                    전액 입금
                  </button>
                  <button 
                    onClick={() => setAmount(deposit > 0 ? deposit : 0)}
                    className="flex-1 bg-white/10 text-white/80 hover:bg-white/20 rounded-lg py-2 text-xs font-bold transition-colors border border-white/20"
                  >
                    전액 출금
                  </button>
                </div>
              </div>

              {errorMsg && <p className="text-red-400 text-xs text-center mb-3 font-bold">{errorMsg}</p>}
              {successMsg && <p className="text-emerald-400 text-xs text-center mb-3 font-bold">{successMsg}</p>}

              <div className="flex space-x-3">
                <button 
                  onClick={handleWithdraw}
                  disabled={deposit === 0 || amountToTrade > deposit || amountToTrade <= 0}
                  className="flex-1 py-4 bg-white/5 text-white rounded-xl font-bold disabled:opacity-20 active:scale-95 transition-all border border-white/10 hover:bg-white/10"
                >
                  출금하기
                </button>
                <button 
                  onClick={handleDeposit}
                  disabled={cash <= 0 || amountToTrade > cash || amountToTrade <= 0}
                  className="flex-1 py-4 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white rounded-xl font-bold disabled:opacity-20 active:scale-95 transition-all shadow-lg shadow-emerald-600/20"
                >
                  예금하기
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'loan' && (
          <>
            {/* 대출 현황 */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-white/30 flex items-center font-bold">
                  <CreditCard size={14} className="mr-1.5" /> 마이너스 통장 (대출)
                </span>
                <span className="text-[10px] bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full border border-red-500/20 font-bold">
                  <TrendingDown size={9} className="inline mr-1" />
                  연 이율: {(interestRate * 100).toFixed(1)}%
                </span>
              </div>
              <h2 className="text-2xl font-mono font-bold text-red-400 mb-3">
                {loan.toLocaleString()} <span className="text-sm font-normal">원</span>
              </h2>
              
              {/* 대출 게이지 */}
              <div className="mb-3">
                <div className="flex justify-between text-[10px] text-white/40 mb-1 font-bold">
                  <span>대출 한도 = 연봉 × (신용도/1000)</span>
                  <span>한도: {maxLoanLimit.toLocaleString()}원 ({formatKoreanCurrency(maxLoanLimit)}원)</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${maxLoanLimit > 0 ? (loan / maxLoanLimit) * 100 : 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-white/20 mt-1 font-mono">
                  <span>사용: {loan.toLocaleString()}원 ({formatKoreanCurrency(loan)}원)</span>
                  <span>잔여: {availableLoan.toLocaleString()}원 ({formatKoreanCurrency(availableLoan)}원)</span>
                </div>
              </div>
              
              <div className="pt-3 border-t border-white/5 flex justify-between items-center text-sm">
                <span className="text-white/30 text-xs">매월 예상 이자 비용</span>
                <span className="font-mono text-red-400 font-bold">-{Math.floor(loan * (interestRate / 12)).toLocaleString()}원</span>
              </div>
            </div>

            {/* 대출 컨트롤 */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xs font-bold mb-4 text-white/40 uppercase tracking-widest">대출 및 상환</h3>
              
              <div className="flex flex-col space-y-3 mb-4">
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => {
                    const val = e.target.value;
                    setAmount(val === "" ? "" : Number(val));
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-right font-mono text-lg outline-none focus:border-white/30 transition-colors"
                />
                <div className="flex space-x-2 mb-2">
                  {[100000, 1000000, 10000000].map((val) => (
                    <button 
                      key={val} 
                      onClick={() => setAmount(prev => (Number(prev) || 0) + val)}
                      className="flex-1 bg-white/5 hover:bg-white/10 rounded-lg py-2 text-xs font-bold transition-colors border border-white/5"
                    >
                      +{(val / 10000).toLocaleString()}만
                    </button>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setAmount(availableLoan > 0 ? availableLoan : 0)}
                    className="flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg py-2 text-xs font-bold transition-colors border border-red-500/20"
                  >
                    풀대출
                  </button>
                  <button 
                    onClick={() => setAmount(Math.min(cash, loan))}
                    className="flex-1 bg-white/10 text-white/80 hover:bg-white/20 rounded-lg py-2 text-xs font-bold transition-colors border border-white/20"
                  >
                    전액 상환
                  </button>
                </div>
              </div>

              {errorMsg && <p className="text-red-400 text-xs text-center mb-3 font-bold">{errorMsg}</p>}
              {successMsg && <p className="text-emerald-400 text-xs text-center mb-3 font-bold">{successMsg}</p>}

              <div className="flex space-x-3">
                <button 
                  onClick={handleRepayLoan}
                  disabled={loan === 0 || amountToTrade > loan || amountToTrade <= 0}
                  className="flex-1 py-4 bg-white/5 text-white rounded-xl font-bold disabled:opacity-20 active:scale-95 transition-all border border-white/10 hover:bg-white/10"
                >
                  상환하기
                </button>
                <button 
                  onClick={handleTakeLoan}
                  disabled={availableLoan === 0 || amountToTrade > availableLoan || amountToTrade <= 0}
                  className="flex-1 py-4 bg-gradient-to-r from-red-700 to-red-600 text-white rounded-xl font-bold disabled:opacity-20 active:scale-95 transition-all shadow-lg shadow-red-600/20"
                >
                  대출받기
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
