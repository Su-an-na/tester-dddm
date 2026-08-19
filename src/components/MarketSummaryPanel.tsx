import React, { useState } from 'react';
import { MarketItem, MarketSummaryStats, TopMover } from '../types';

interface MarketSummaryPanelProps {
  stats: MarketSummaryStats;
  gainers: TopMover[];
  losers: TopMover[];
  onSelectMover: (symbol: string) => void;
  onOpenNews?: () => void;
}

export const MarketSummaryPanel: React.FC<MarketSummaryPanelProps> = ({
  stats,
  gainers,
  losers,
  onSelectMover,
}) => {
  const [moverTab, setMoverTab] = useState<'gainers' | 'losers'>('gainers');
  const activeMovers = moverTab === 'gainers' ? gainers : losers;

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Market Summary Card */}
      <div className="bg-[#ffffff] border border-[#c3c5d8] rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold font-headline text-[#181c21]">Market Summary</h3>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono-num font-semibold text-[#089981] bg-[#089981]/10 px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#089981] animate-pulse"></span>
            LIVE
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-[#c3c5d8] pb-3">
            <span className="text-sm text-[#434656]">Global Market Cap</span>
            <div className="text-right">
              <span className="font-mono-num font-semibold text-sm text-[#181c21] block">
                {stats.globalMarketCap}
              </span>
              <span className="font-mono-num text-[11px] market-up">
                {stats.globalMarketCapChange}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center border-b border-[#c3c5d8] pb-3">
            <span className="text-sm text-[#434656]">24h Vol</span>
            <div className="text-right">
              <span className="font-mono-num font-semibold text-sm text-[#181c21] block">
                {stats.volume24h}
              </span>
              <span className="font-mono-num text-[11px] market-up">
                {stats.volume24hChange}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center border-b border-[#c3c5d8] pb-3">
            <span className="text-sm text-[#434656]">Active Markets</span>
            <span className="font-mono-num font-semibold text-sm text-[#0049db]">
              {stats.activeMarkets}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-[#434656]">VIX Volatility</span>
            <div className="text-right">
              <span className="font-mono-num font-semibold text-sm text-[#181c21]">
                {stats.vixIndex.toFixed(2)}
              </span>
              <span className="font-mono-num text-[11px] market-up ml-1.5">
                ({stats.vixChange.toFixed(2)})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Gainers / Losers Card */}
      <div className="bg-[#ffffff] border border-[#c3c5d8] rounded-xl p-6 shadow-xs flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMoverTab('gainers')}
              className={`text-sm font-bold font-headline transition-colors cursor-pointer ${
                moverTab === 'gainers'
                  ? 'text-[#181c21] border-b-2 border-[#0049db] pb-0.5'
                  : 'text-[#434656] hover:text-[#181c21]'
              }`}
            >
              Top Gainers
            </button>
            <span className="text-[#c3c5d8]">|</span>
            <button
              onClick={() => setMoverTab('losers')}
              className={`text-sm font-bold font-headline transition-colors cursor-pointer ${
                moverTab === 'losers'
                  ? 'text-[#181c21] border-b-2 border-[#F23645] pb-0.5'
                  : 'text-[#434656] hover:text-[#181c21]'
              }`}
            >
              Top Losers
            </button>
          </div>

          <span className="text-[11px] font-mono-num text-[#737687]">US Tech & Large Cap</span>
        </div>

        <div className="flex flex-col gap-3.5">
          {activeMovers.map((mover) => {
            const isPos = mover.changePercent >= 0;
            return (
              <div
                key={mover.symbol}
                onClick={() => onSelectMover(mover.symbol)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f1f4fb] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#dfe2e9] text-[#181c21] rounded flex items-center justify-center font-mono-num font-bold text-xs group-hover:bg-[#0049db] group-hover:text-white transition-colors">
                    {mover.symbol.slice(0, 4)}
                  </div>
                  <div>
                    <div className="font-bold text-sm font-headline text-[#181c21] group-hover:text-[#0049db] transition-colors">
                      {mover.name}
                    </div>
                    <div className="text-[11px] font-mono-num text-[#434656]">
                      ${mover.price.toFixed(2)}
                    </div>
                  </div>
                </div>
                <span
                  className={`font-mono-num font-semibold text-sm ${
                    isPos ? 'market-up' : 'market-down'
                  }`}
                >
                  {isPos ? '+' : ''}
                  {mover.changePercent.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sector Performance mini bar */}
      <div className="bg-[#ffffff] border border-[#c3c5d8] rounded-xl p-5 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#434656] font-mono-num mb-3">
          Sector Performance (1D)
        </h4>
        <div className="space-y-2 text-xs">
          <div>
            <div className="flex justify-between text-[#181c21] font-medium mb-1">
              <span>Technology</span>
              <span className="market-up font-mono-num font-semibold">+1.84%</span>
            </div>
            <div className="w-full bg-[#ebeef5] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#089981] h-1.5 rounded-full" style={{ width: '84%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[#181c21] font-medium mb-1">
              <span>Communications</span>
              <span className="market-up font-mono-num font-semibold">+1.12%</span>
            </div>
            <div className="w-full bg-[#ebeef5] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#089981] h-1.5 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[#181c21] font-medium mb-1">
              <span>Energy & Commodities</span>
              <span className="market-down font-mono-num font-semibold">-0.42%</span>
            </div>
            <div className="w-full bg-[#ebeef5] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#F23645] h-1.5 rounded-full" style={{ width: '35%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
