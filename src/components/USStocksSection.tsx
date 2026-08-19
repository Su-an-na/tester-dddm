import React from 'react';
import { DisplayMode, MarketItem } from '../types';
import { SymbolBadge, USFlagBadge } from './Badges';

interface USStocksSectionProps {
  items: MarketItem[];
  displayMode: DisplayMode;
  onSelectSymbol: (item: MarketItem) => void;
  onSeeAll?: () => void;
  liveTickItemIds?: Set<string>;
}

export const USStocksSection: React.FC<USStocksSectionProps> = ({
  items,
  displayMode,
  onSelectSymbol,
  onSeeAll,
  liveTickItemIds,
}) => {
  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <USFlagBadge size="w-8 h-8" />
        <button
          onClick={onSeeAll}
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer group text-left"
        >
          <h2 className="text-xl md:text-2xl font-bold font-headline text-[#181c21] group-hover:text-[#0049db] transition-colors">
            US stocks
          </h2>
          <span className="material-symbols-outlined text-[#181c21] group-hover:text-[#0049db] transition-colors text-[22px]">
            chevron_right
          </span>
        </button>
      </div>

      {/* Cards View (Exact match for Image 1) */}
      {displayMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => {
            const isLive = liveTickItemIds?.has(item.id);
            const isPositive = item.change >= 0;

            return (
              <div
                key={item.id}
                id={`card-stock-${item.id}`}
                onClick={() => onSelectSymbol(item)}
                className={`bg-[#ffffff] border border-[#c3c5d8] rounded-xl p-4 flex items-center justify-between hover:border-[#0049db] hover:shadow-[0px_4px_16px_rgba(0,0,0,0.06)] transition-all cursor-pointer group ${
                  isLive ? (isPositive ? 'tick-flash-up' : 'tick-flash-down') : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <SymbolBadge item={item} size="md" />
                  <div>
                    <div className="font-bold text-base font-headline text-[#181c21] group-hover:text-[#0049db] transition-colors">
                      {item.name}
                    </div>
                    <div className="text-xs text-[#434656] font-mono-num">
                      {item.symbol} • {item.volume}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold font-mono-num text-sm text-[#181c21]">
                    ${item.price.toFixed(2)}
                  </div>
                  <div
                    className={`text-xs font-mono-num font-semibold ${
                      isPositive ? 'market-up' : 'market-down'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {item.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View (Exact match for Image 3) */
        <div className="bg-[#ffffff] border border-[#c3c5d8] rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto hide-scrollbar">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-[#f7f9ff] border-b border-[#c3c5d8] text-[#434656] font-mono-num text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-medium">Symbol</th>
                  <th className="py-3.5 px-4 font-medium text-right">Price</th>
                  <th className="py-3.5 px-4 font-medium text-right">Change %</th>
                  <th className="py-3.5 px-4 font-medium text-right hidden sm:table-cell">Volume</th>
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
                        {item.price.toFixed(2)}
                      </td>

                      {/* Change % */}
                      <td
                        className={`py-4 px-4 text-right font-mono-num font-semibold text-sm ${
                          isPositive ? 'market-up' : 'market-down'
                        }`}
                      >
                        {isPositive ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                      </td>

                      {/* Volume */}
                      <td className="py-4 px-4 text-right font-mono-num text-sm text-[#434656] hidden sm:table-cell">
                        {item.volume}
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
