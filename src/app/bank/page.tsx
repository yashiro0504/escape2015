"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Landmark, CreditCard, Coins, AlertTriangle } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

export default function BankApp() {
  const { cash, loan, interestRate, creditScore, takeLoan, repayLoan } = useGameStore();
  const [amount, setAmount] = useState<number | "">(1000000); // 기본 100만 원
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const maxLoanLimit = creditScore * 100000;
  const availableLoan = Math.max(0, maxLoanLimit - loan);

  const amountToTrade = Number(amount) || 0;

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

  return (
    <div className="w-full h-full bg-zinc-900 flex flex-col text-white">
      {/* 은행 앱 헤더 */}
      <div className="bg-zinc-800 px-4 py-3 flex items-center shadow-md z-10 sticky top-0 border-b border-zinc-700">
        <Link href="/" className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold flex items-center">
          <Landmark size={20} className="mr-2" />
          흙수저은행
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-6 p-4">
        {/* 내 자산 요약 */}
        <div className="bg-zinc-800 rounded-2xl p-5 mb-4 shadow-lg border border-zinc-700">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-zinc-400 flex items-center">
              <Coins size={16} className="mr-1" /> 입출금 통장 잔액
            </span>
            <span className="text-xs bg-zinc-700 px-2 py-1 rounded text-zinc-300">
              신용점수: {creditScore}점
            </span>
          </div>
          <h2 className="text-3xl font-mono font-bold">
            {cash.toLocaleString()} <span className="text-lg font-normal text-zinc-400">원</span>
          </h2>
          {cash < 0 && (
            <div className="mt-3 bg-red-900/30 text-red-400 p-2 rounded-lg text-xs flex items-center border border-red-900">
              <AlertTriangle size={14} className="mr-1" />
              잔액이 마이너스입니다! 이자 연체 및 신용 하락 주의
            </div>
          )}
        </div>

        {/* 대출 현황 */}
        <div className="bg-zinc-800 rounded-2xl p-5 mb-6 shadow-lg border border-zinc-700">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-zinc-400 flex items-center">
              <CreditCard size={16} className="mr-1" /> 마이너스 통장 (대출)
            </span>
            <span className="text-xs bg-red-900/40 text-red-300 px-2 py-1 rounded border border-red-800/50">
              연 이율: {(interestRate * 100).toFixed(1)}%
            </span>
          </div>
          <h2 className="text-2xl font-mono font-bold text-red-400 mb-2">
            {loan.toLocaleString()} <span className="text-base font-normal">원</span>
          </h2>
          <div className="text-xs text-zinc-500 flex justify-between">
            <span>대출 한도: {maxLoanLimit.toLocaleString()}원</span>
            <span>가능 금액: {availableLoan.toLocaleString()}원</span>
          </div>
          
          {/* 매월 예상 이자액 */}
          <div className="mt-4 pt-3 border-t border-zinc-700 flex justify-between items-center text-sm">
            <span className="text-zinc-400">매월 납입 예상 이자</span>
            <span className="font-mono text-red-400">{Math.floor(loan * (interestRate / 12)).toLocaleString()}원</span>
          </div>
        </div>

        {/* 대출 / 상환 컨트롤 */}
        <div className="bg-zinc-800 rounded-2xl p-5 shadow-lg border border-zinc-700">
          <h3 className="text-sm font-bold mb-4 text-zinc-300">대출 및 상환하기</h3>
          
          <div className="flex flex-col space-y-3 mb-5">
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => {
                const val = e.target.value;
                setAmount(val === "" ? "" : Number(val));
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-right font-mono text-lg outline-none focus:border-zinc-500 transition-colors"
            />
            <div className="flex space-x-2">
              {[100000, 1000000, 10000000].map((val) => (
                <button 
                  key={val} 
                  onClick={() => setAmount(prev => (Number(prev) || 0) + val)}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 rounded-lg py-2 text-xs font-bold transition-colors"
                >
                  +{(val / 10000).toLocaleString()}만
                </button>
              ))}
            </div>
          </div>

          {errorMsg && <p className="text-red-400 text-xs text-center mb-3 font-bold">{errorMsg}</p>}
          {successMsg && <p className="text-green-400 text-xs text-center mb-3 font-bold">{successMsg}</p>}

          <div className="flex space-x-3">
            <button 
              onClick={handleRepayLoan}
              disabled={loan === 0 || amountToTrade > loan || amountToTrade <= 0}
              className="flex-1 py-4 bg-zinc-700 text-white rounded-xl font-bold disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-transform"
            >
              상환하기
            </button>
            <button 
              onClick={handleTakeLoan}
              disabled={availableLoan === 0 || amountToTrade > availableLoan || amountToTrade <= 0}
              className="flex-1 py-4 bg-red-700 text-white rounded-xl font-bold disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-transform shadow-[0_0_15px_rgba(185,28,28,0.4)]"
            >
              대출받기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
