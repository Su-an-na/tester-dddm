import React, { useState } from 'react';
import { DisplayMode, MarketItem } from '../types';
import { SymbolBadge } from './Badges';
import { Sparkline } from './Sparkline';

interface WorldIndicesSectionProps {
  items: MarketItem[];
  displayMode: DisplayMode;
  onSelectSymbol: (item: MarketItem) => void;
  onSeeAll?: () => void;
  liveTickItemIds?: Set<string>;
}

export const WorldIndicesSection: React.FC<WorldIndicesSectionProps> = ({
  items,
  displayMode,
  onSelectSymbol,
  onSeeAll,
  liveTickItemIds,
}) => {
  const [showLiveMetricsInCards, setShowLiveMetricsInCards] = useState(true);

  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onSeeAll}
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer group text-left"
        >
          <h2 className="text-xl md:text-2xl font-bold font-headline text-[#181c21] group-hover:text-[#0049db] transition-colors">
            World indices
          </h2>
          <span className="material-symbols-outlined text-[#181c21] group-hover:text-[#0049db] transition-colors text-[22px]">
            chevron_right
          </span>
        </button>

        {displayMode === 'cards' && (
          <button
            onClick={() => setShowLiveMetricsInCards(!showLiveMetricsInCards)}
            className="text-xs text-[#0049db] hover:underline font-medium cursor-pointer"
          >
            {showLiveMetricsInCards ? 'Show screenshot placeholders' : 'Show live preview charts'}
          </button>
        )}
      </div>

      {/* Cards View (Exact match for Image 1) */}
      {displayMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, index) => {
            const isLive = liveTickItemIds?.has(item.id);
            const isPositive = item.change >= 0;
            // The screenshot showed "No data here yet" for S&P 500 and Nasdaq 100 when cards are in initial state
            const hasExplicitPlaceholder = !showLiveMetricsInCards && index < 2;

            return (
              <div
                key={item.id}
                id={`card-index-${item.id}`}
                onClick={() => onSelectSymbol(item)}
                className={`bg-[#ffffff] border border-[#c3c5d8] rounded-xl p-4 flex flex-col h-44 hover:border-[#0049db] hover:shadow-[0px_4px_16px_rgba(0,0,0,0.06)] transition-all cursor-pointer group relative overflow-hidden ${
                  isLive ? (isPositive ? 'tick-flash-up' : 'tick-flash-down') : ''
                }`}
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-2">
                  <SymbolBadge item={item} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-base font-headline text-[#181c21] group-hover:text-[#0049db] transition-colors truncate">
                      {item.symbol}
                    </div>
                    {item.subName && (
                      <div className="text-[#434656] text-xs font-mono-num truncate">
                        {item.subName}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                {hasExplicitPlaceholder ? (
                  <div className="flex-grow flex items-center justify-center text-[#434656]/50 text-sm font-medium">
                    No data here yet
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col justify-between pt-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-bold font-mono-num text-[#181c21]">
                        {item.price.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span
                        className={`text-xs font-mono-num font-semibold ${
                          isPositive ? 'market-up' : 'market-down'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </span>
                    </div>

                    <div className="h-10 w-full flex items-center justify-center">
                      <Sparkline
                        data={item.sparkline}
                        isPositive={isPositive}
                        width="100%"
                        height={36}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View (Exact match for Image 3) */
        <div className="bg-[#ffffff] border border-[#c3c5d8] rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto hide-scrollbar">
            <table className="w-full text-left border-collapse min-w-[580px]">
              <thead>
                <tr className="bg-[#f7f9ff] border-b border-[#c3c5d8] text-[#434656] font-mono-num text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-medium">Symbol</th>
                  <th className="py-3.5 px-4 font-medium text-right">Price</th>
                  <th className="py-3.5 px-4 font-medium text-right">Change</th>
                  <th className="py-3.5 px-4 font-medium text-right">Change %</th>
                  <th className="py-3.5 px-4 font-medium text-center hidden md:table-cell">1D Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c3c5d8]/70">
                {items.map((item) => {
                  const isPositive = item.change >= 0;
                  const isLive = liveTickItemIds?.has(item.id);

                  return (
                    <tr
                      key={item.id}
                      id={`table-row-${item.id}`}
                      onClick={() => onSelectSymbol(item)}
                      className={`hover:bg-[#f1f4fb] transition-colors cursor-pointer group ${
                        isLive ? (isPositive ? 'tick-flash-up' : 'tick-flash-down') : ''
                      }`}
                    >
                      {/* Symbol */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <SymbolBadge item={item} size="md" />
                          <div>
                            <div className="font-bold text-[15px] font-headline text-[#181c21] group-hover:text-[#0049db] transition-colors">
                              {item.symbol}
                            </div>
                            <div className="text-[#434656] text-xs font-mono-num hidden sm:block">
                              {item.subName || item.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 text-right font-mono-num font-semibold text-[15px] text-[#181c21]">
                        {item.price.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      {/* Change */}
                      <td
                        className={`py-4 px-4 text-right font-mono-num font-semibold text-sm ${
                          isPositive ? 'market-up' : 'market-down'
                        }`}
                      >
                        {isPositive ? `+${item.change.toFixed(2)}` : item.change.toFixed(2)}
                      </td>

                      {/* Change % */}
                      <td
                        className={`py-4 px-4 text-right font-mono-num font-semibold text-sm ${
                          isPositive ? 'market-up' : 'market-down'
                        }`}
                      >
                        {isPositive ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                      </td>

                      {/* 1D Trend Sparkline */}
                      <td className="py-4 px-4 text-center hidden md:table-cell align-middle">
                        <div className="flex items-center justify-center">
                          <Sparkline
                            data={item.sparkline}
                            isPositive={isPositive}
                            width={96}
                            height={30}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
