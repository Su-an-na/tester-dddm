import React, { useState } from 'react';
import { HEATMAP_DATA } from '../data/mockMarkets';
import { HeatmapItem } from '../types';

interface HeatmapViewProps {
  onSelectSymbol: (symbol: string) => void;
}

export const HeatmapView: React.FC<HeatmapViewProps> = ({ onSelectSymbol }) => {
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [colorMetric, setColorMetric] = useState<'change' | 'cap'>('change');

  const sectors = ['All', 'Semiconductors', 'Software & Internet', 'Healthcare', 'Financials', 'Energy'];

  const filteredItems = HEATMAP_DATA.filter((item) => {
    if (selectedSector === 'All') return true;
    if (selectedSector === 'Semiconductors') return item.sector.toLowerCase().includes('semi');
    if (selectedSector === 'Software & Internet') return item.sector.toLowerCase().includes('software') || item.sector.toLowerCase().includes('internet');
    if (selectedSector === 'Healthcare') return item.sector.toLowerCase().includes('health');
    if (selectedSector === 'Financials') return item.sector.toLowerCase().includes('finan');
    if (selectedSector === 'Energy') return item.sector.toLowerCase().includes('energy');
    return true;
  });

  // Calculate background color based on percentage change
  const getHeatmapColor = (pct: number) => {
    if (pct >= 3.0) return 'bg-[#089981] text-white';
    if (pct >= 1.5) return 'bg-[#0bb598] text-white';
    if (pct > 0.0) return 'bg-[#26a69a]/80 text-white';
    if (pct === 0) return 'bg-[#5a5e6b] text-white';
    if (pct >= -1.5) return 'bg-[#ef5350]/80 text-white';
    if (pct >= -3.0) return 'bg-[#f23645] text-white';
    return 'bg-[#c62828] text-white';
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#ffffff] border border-[#c3c5d8] rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold font-headline text-[#181c21]">
              S&P 500 Market Heatmap
            </h1>
            <span className="text-[10px] font-mono-num font-bold bg-[#0049db] text-white px-2 py-0.5 rounded-full">
              PRO MAP
            </span>
          </div>
          <p className="text-xs text-[#434656] mt-1">
            Visualizing performance & relative market capitalization across major US equities.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-[#f1f4fb] p-1 rounded-lg border border-[#c3c5d8] text-xs font-semibold">
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  selectedSector === sec
                    ? 'bg-[#0049db] text-white shadow-xs'
                    : 'text-[#434656] hover:text-[#181c21]'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-[#ffffff] border border-[#c3c5d8] rounded-xl px-4 py-2.5">
        <span className="text-[#434656] font-semibold">Performance Scale:</span>
        <div className="flex items-center gap-1.5 font-mono-num text-[11px]">
          <span className="px-2 py-0.5 rounded bg-[#c62828] text-white font-bold">&lt; -3%</span>
          <span className="px-2 py-0.5 rounded bg-[#f23645] text-white">-2%</span>
          <span className="px-2 py-0.5 rounded bg-[#ef5350]/80 text-white">-1%</span>
          <span className="px-2 py-0.5 rounded bg-[#5a5e6b] text-white">0%</span>
          <span className="px-2 py-0.5 rounded bg-[#26a69a]/80 text-white">+1%</span>
          <span className="px-2 py-0.5 rounded bg-[#0bb598] text-white">+2%</span>
          <span className="px-2 py-0.5 rounded bg-[#089981] text-white font-bold">&gt; +3%</span>
        </div>
      </div>

      {/* Heatmap Grid Layout */}
      <div className="bg-[#ffffff] border border-[#c3c5d8] rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 auto-rows-[140px]">
          {filteredItems.map((stock) => {
            const isMega = stock.marketCapVal > 1500;
            const isLarge = stock.marketCapVal > 500;
            const spanClass = isMega
              ? 'col-span-2 row-span-2'
              : isLarge
              ? 'col-span-1 row-span-1 sm:col-span-2 sm:row-span-1'
              : 'col-span-1 row-span-1';

            return (
              <div
                key={stock.symbol}
                onClick={() => onSelectSymbol(stock.symbol)}
                className={`${spanClass} ${getHeatmapColor(
                  stock.changePercent
                )} rounded-xl p-3.5 flex flex-col justify-between cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all duration-200 border border-white/10 group`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-headline text-base sm:text-lg tracking-tight group-hover:underline">
                      {stock.symbol}
                    </span>
                    <span className="text-[11px] font-mono-num opacity-90">
                      {stock.marketCapFormatted}
                    </span>
                  </div>
                  <div className="text-xs opacity-90 truncate max-w-[90%] mt-0.5 font-medium">
                    {stock.name}
                  </div>
                  <div className="text-[10px] opacity-75 truncate">{stock.sector}</div>
                </div>

                <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-white/20">
                  <span className="font-mono-num font-bold text-sm sm:text-base">
                    ${stock.price.toFixed(2)}
                  </span>
                  <span className="font-mono-num font-bold text-xs sm:text-sm px-1.5 py-0.5 bg-black/20 rounded">
                    {stock.changePercent >= 0 ? '+' : ''}
                    {stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
