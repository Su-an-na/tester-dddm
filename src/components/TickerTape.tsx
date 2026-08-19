import React, { useState, useEffect } from 'react';
import { GLOBAL_TICKER_TAPE } from '../data/mockMarkets';

interface TickerTapeProps {
  onSelectSymbol: (symbol: string) => void;
}

export const TickerTape: React.FC<TickerTapeProps> = ({ onSelectSymbol }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [tapeItems, setTapeItems] = useState(GLOBAL_TICKER_TAPE);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'America/New_York',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' EDT'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Subtle live micro changes
  useEffect(() => {
    const interval = setInterval(() => {
      setTapeItems((prev) => {
        const next = [...prev];
        const randIdx = Math.floor(Math.random() * next.length);
        const item = { ...next[randIdx] };
        const delta = (Math.random() - 0.49) * 0.04;
        item.changePercent = parseFloat((item.changePercent + delta).toFixed(2));
        item.isPositive = item.changePercent >= 0;
        next[randIdx] = item;
        return next;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="global-ticker-tape"
      className="bg-[#111418] text-[#e0e3eb] border-b border-[#2d3139] text-[11px] font-mono-num h-8.5 flex items-center overflow-hidden select-none"
    >
      {/* Market Status Pill */}
      <div className="flex items-center gap-2 px-3 py-1 bg-[#1c2026] border-r border-[#2d3139] z-10 shrink-0 shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#089981] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#089981]"></span>
        </span>
        <span className="font-bold text-[#ffffff] tracking-wider uppercase text-[10px]">
          NYSE OPEN
        </span>
        <span className="text-[#8b90a0] text-[10px] hidden sm:inline">
          {currentTime || '14:32:00 EDT'}
        </span>
      </div>

      {/* Marquee Track */}
      <div className="flex-1 overflow-x-auto hide-scrollbar flex items-center gap-6 px-4 animate-marquee whitespace-nowrap">
        {/* Render twice for seamless continuous look */}
        {[...tapeItems, ...tapeItems].map((item, idx) => {
          const isPos = item.changePercent >= 0;
          return (
            <div
              key={`${item.symbol}-${idx}`}
              onClick={() => onSelectSymbol(item.symbol)}
              className="inline-flex items-center gap-2 hover:bg-[#1f242c] px-2 py-0.5 rounded cursor-pointer transition-colors"
            >
              <span className="font-bold text-[#ffffff] tracking-tight font-headline text-xs">
                {item.symbol}
              </span>
              <span className="text-[#c3c5d8]">
                {item.price.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span
                className={`font-semibold ${
                  isPos ? 'text-[#089981]' : 'text-[#F23645]'
                }`}
              >
                {isPos ? '+' : ''}
                {item.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Pro Badge indicator on right */}
      <div className="hidden lg:flex items-center gap-1.5 px-3 bg-[#1c2026] border-l border-[#2d3139] shrink-0 text-[#8b90a0] text-[10px] font-headline">
        <span className="w-1.5 h-1.5 rounded-full bg-[#2962FF]"></span>
        <span>PRO ULTRA FEED</span>
      </div>
    </div>
  );
};
