"use client";

import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Home, BarChart3, Coins, Wallet, PiggyBank, CreditCard } from "lucide-react";
import { useGameStore, getPortfolioValue } from "@/store/gameStore";

export default function AssetsPage() {
  const { cash, deposit, loan, portfolio, marketPrices, stocks, realEstateAssetValue, isOwnedRealEstate, currentRealEstate } = useGameStore();

  // 주식과 코인 분리
  const stockItems = Object.values(portfolio).filter(item => {
    const stock = stocks.find(s => s.id === item.stockId);
    return stock && stock.sector !== 'crypto';
  });

  const cryptoItems = Object.values(portfolio).filter(item => {
    const stock = stocks.find(s => s.id === item.stockId);
    return stock && stock.sector === 'crypto';
  });

  // 총 평가액 계산
  const stockValue = stockItems.reduce((sum, item) => {
    const price = marketPrices[item.stockId]?.price || 0;
    return sum + price * item.amount;
  }, 0);

  const cryptoValue = cryptoItems.reduce((sum, item) => {
    const price = marketPrices[item.stockId]?.price || 0;
    return sum + price * item.amount;
  }, 0);

  const totalPortfolioValue = getPortfolioValue(portfolio, marketPrices);
  const totalAsset = cash + deposit + totalPortfolioValue + realEstateAssetValue;
  const netAsset = totalAsset - loan;

  // 총 투자 원금 계산
  const stockCost = stockItems.reduce((sum, item) => sum + item.averagePrice * item.amount, 0);
  const cryptoCost = cryptoItems.reduce((sum, item) => sum + item.averagePrice * item.amount, 0);
  const totalInvestCost = stockCost + cryptoCost;
  const totalInvestGain = totalPortfolioValue - totalInvestCost;
  const totalInvestGainRate = totalInvestCost > 0 ? ((totalPortfolioValue - totalInvestCost) / totalInvestCost) * 100 : 0;

  const renderChangeRate = (rate: number) => {
    if (rate > 0) return <span className="text-red-400 font-mono font-bold text-[11px]">+{rate.toFixed(2)}%</span>;
    if (rate < 0) return <span className="text-blue-400 font-mono font-bold text-[11px]">{rate.toFixed(2)}%</span>;
    return <span className="text-white/40 font-mono font-bold text-[11px]">0.00%</span>;
  };

  const renderChangeIcon = (rate: number) => {
    if (rate > 0) return <TrendingUp size={10} className="text-red-400" />;
    if (rate < 0) return <TrendingDown size={10} className="text-blue-400" />;
    return <Minus size={10} className="text-white/30" />;
  };

  const renderPortfolioItem = (item: typeof portfolio[string]) => {
    const stock = stocks.find(s => s.id === item.stockId);
    const mp = marketPrices[item.stockId];
    if (!stock || !mp) return null;

    const currentValue = mp.price * item.amount;
    const costBasis = item.averagePrice * item.amount;
    const gainLoss = currentValue - costBasis;
    const gainLossRate = item.averagePrice > 0 ? ((mp.price - item.averagePrice) / item.averagePrice) * 100 : 0;
    const isDelisted = mp.delisted;

    return (
      <div key={item.stockId} className={`flex items-center justify-between py-3 px-3 rounded-xl transition-colors ${isDelisted ? 'opacity-40' : 'hover:bg-white/5'}`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1.5">
            <span className="text-[12px] font-bold text-white/90 truncate">{stock.name}</span>
            {isDelisted && <span className="text-[8px] px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded-full font-bold">상폐</span>}
          </div>
          <div className="flex items-center space-x-2 mt-0.5">
            <span className="text-[9px] text-white/30">{item.amount.toLocaleString()}주</span>
            <span className="text-[9px] text-white/20">·</span>
            <span className="text-[9px] text-white/30">평단 {item.averagePrice.toLocaleString()}원</span>
          </div>
        </div>
        <div className="text-right ml-2">
          <p className="text-[12px] font-mono font-bold text-white/90">{currentValue.toLocaleString()}<span className="text-white/30 text-[9px] ml-0.5">원</span></p>
          <div className="flex items-center justify-end space-x-1 mt-0.5">
            {renderChangeIcon(gainLossRate)}
            {renderChangeRate(gainLossRate)}
            <span className={`text-[9px] font-mono ${gainLoss >= 0 ? 'text-red-400/60' : 'text-blue-400/60'}`}>
              ({gainLoss >= 0 ? '+' : ''}{gainLoss.toLocaleString()})
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col text-white">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-violet-800 to-indigo-700 px-4 py-3 flex items-center shadow-lg z-10 sticky top-0">
        <Link href="/" className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-base font-bold flex items-center text-violet-200">
          <BarChart3 size={18} className="mr-2" />
          내 자산 현황
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-6 p-4 space-y-3">
        {/* ─── 순자산 요약 카드 ─── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900/50 to-indigo-900/50 border border-white/10 p-5 animate-fade-in-up">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <p className="text-[9px] text-white/40 font-bold tracking-widest uppercase mb-1">순 자산 (총자산 - 대출)</p>
            <p className={`text-3xl font-mono font-black ${netAsset >= 0 ? 'text-white' : 'text-red-400'}`}>
              {netAsset >= 0 ? '' : '-'}{Math.abs(netAsset).toLocaleString()}
              <span className="text-sm text-white/30 ml-1">원</span>
            </p>
            {totalInvestCost > 0 && (
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-[9px] text-white/30">투자 수익률</span>
                {renderChangeIcon(totalInvestGainRate)}
                {renderChangeRate(totalInvestGainRate)}
                <span className={`text-[9px] font-mono ${totalInvestGain >= 0 ? 'text-red-400/70' : 'text-blue-400/70'}`}>
                  ({totalInvestGain >= 0 ? '+' : ''}{totalInvestGain.toLocaleString()}원)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ─── 자산 구성 그리드 ─── */}
        <div className="grid grid-cols-2 gap-2 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="flex items-center space-x-1.5 mb-1.5">
              <Wallet size={11} className="text-white/40" />
              <span className="text-[8px] text-white/40 font-bold uppercase tracking-wider">현금</span>
            </div>
            <p className={`text-sm font-mono font-bold ${cash >= 0 ? 'text-white/90' : 'text-red-400'}`}>
              {cash >= 0 ? cash.toLocaleString() : '-' + Math.abs(cash).toLocaleString()}
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="flex items-center space-x-1.5 mb-1.5">
              <PiggyBank size={11} className="text-emerald-400/60" />
              <span className="text-[8px] text-emerald-400/60 font-bold uppercase tracking-wider">예금</span>
            </div>
            <p className="text-sm font-mono font-bold text-emerald-400">{deposit.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="flex items-center space-x-1.5 mb-1.5">
              <Home size={11} className="text-cyan-400/60" />
              <span className="text-[8px] text-cyan-400/60 font-bold uppercase tracking-wider">
                {isOwnedRealEstate ? '자가 주택' : '보증금'}
              </span>
            </div>
            <p className="text-sm font-mono font-bold text-cyan-400">{realEstateAssetValue.toLocaleString()}</p>
            <p className="text-[8px] text-white/20 mt-0.5 truncate">{currentRealEstate.name}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="flex items-center space-x-1.5 mb-1.5">
              <CreditCard size={11} className="text-red-400/60" />
              <span className="text-[8px] text-red-400/60 font-bold uppercase tracking-wider">대출</span>
            </div>
            <p className="text-sm font-mono font-bold text-red-400">-{loan.toLocaleString()}</p>
          </div>
        </div>

        {/* ─── 보유 주식 섹션 ─── */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center space-x-1.5">
              <BarChart3 size={12} className="text-green-400" />
              <h3 className="text-[10px] text-white/40 font-bold uppercase tracking-widest">보유 주식</h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold text-green-400">{stockValue.toLocaleString()}원</span>
              {stockCost > 0 && renderChangeRate(stockCost > 0 ? ((stockValue - stockCost) / stockCost) * 100 : 0)}
            </div>
          </div>
          <div className="bg-white/[0.03] rounded-xl border border-white/5 overflow-hidden">
            {stockItems.length === 0 ? (
              <div className="py-6 text-center text-[11px] text-white/20">보유 주식 없음</div>
            ) : (
              <div className="divide-y divide-white/5">
                {stockItems.map(renderPortfolioItem)}
              </div>
            )}
          </div>
        </div>

        {/* ─── 보유 코인 섹션 ─── */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center space-x-1.5">
              <Coins size={12} className="text-amber-400" />
              <h3 className="text-[10px] text-white/40 font-bold uppercase tracking-widest">보유 코인</h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold text-amber-400">{cryptoValue.toLocaleString()}원</span>
              {cryptoCost > 0 && renderChangeRate(cryptoCost > 0 ? ((cryptoValue - cryptoCost) / cryptoCost) * 100 : 0)}
            </div>
          </div>
          <div className="bg-white/[0.03] rounded-xl border border-white/5 overflow-hidden">
            {cryptoItems.length === 0 ? (
              <div className="py-6 text-center text-[11px] text-white/20">보유 코인 없음</div>
            ) : (
              <div className="divide-y divide-white/5">
                {cryptoItems.map(renderPortfolioItem)}
              </div>
            )}
          </div>
        </div>

        {/* ─── 자산 비중 바 ─── */}
        {totalAsset > 0 && (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2 px-1">자산 구성 비중</h3>
            <div className="bg-white/[0.03] rounded-xl border border-white/5 p-4">
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-black/30">
                {cash > 0 && <div className="h-full bg-white/60" style={{ width: `${(cash / totalAsset) * 100}%` }} title="현금" />}
                {deposit > 0 && <div className="h-full bg-emerald-500" style={{ width: `${(deposit / totalAsset) * 100}%` }} title="예금" />}
                {realEstateAssetValue > 0 && <div className="h-full bg-cyan-500" style={{ width: `${(realEstateAssetValue / totalAsset) * 100}%` }} title="부동산" />}
                {stockValue > 0 && <div className="h-full bg-green-500" style={{ width: `${(stockValue / totalAsset) * 100}%` }} title="주식" />}
                {cryptoValue > 0 && <div className="h-full bg-amber-500" style={{ width: `${(cryptoValue / totalAsset) * 100}%` }} title="코인" />}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                {[
                  { label: '현금', value: cash, color: 'bg-white/60' },
                  { label: '예금', value: deposit, color: 'bg-emerald-500' },
                  { label: isOwnedRealEstate ? '자가' : '보증금', value: realEstateAssetValue, color: 'bg-cyan-500' },
                  { label: '주식', value: stockValue, color: 'bg-green-500' },
                  { label: '코인', value: cryptoValue, color: 'bg-amber-500' },
                ].filter(item => item.value > 0).map(item => (
                  <div key={item.label} className="flex items-center space-x-1.5">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-[9px] text-white/40">{item.label}</span>
                    <span className="text-[9px] font-mono text-white/60">{((item.value / totalAsset) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
