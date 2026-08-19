import React, { useState } from 'react';
import { MarketItem } from '../types';
import { SymbolBadge } from './Badges';

interface SymbolDetailModalProps {
  item: MarketItem | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (symbol: string) => void;
  onSetAlert: (symbol: string, currentPrice: number) => void;
}

type Timeframe = '1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL';

export const SymbolDetailModal: React.FC<SymbolDetailModalProps> = ({
  item,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  onSetAlert,
}) => {
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1D');
  const [hoveredPoint, setHoveredPoint] = useState<{ time: string; value: number } | null>(null);
  const [chartType, setChartType] = useState<'line' | 'candles'>('line');

  if (!item) return null;

  const isPositive = item.change >= 0;
  const strokeColor = isPositive ? '#089981' : '#F23645';

  const chartSeries = item.chartData[activeTimeframe] || item.chartData['1D'];
  const minVal = Math.min(...chartSeries.map((p) => p.value));
  const maxVal = Math.max(...chartSeries.map((p) => p.value));
  const valRange = maxVal - minVal === 0 ? 1 : maxVal - minVal;

  const currentDisplayPrice = hoveredPoint ? hoveredPoint.value : item.price;
  const currentDiff = currentDisplayPrice - item.openPrice;
  const currentDiffPct = (currentDiff / item.openPrice) * 100;

  // Compute 52-week position percentage
  const week52Range = item.week52High - item.week52Low;
  const week52Pos = week52Range > 0
    ? Math.max(0, Math.min(100, ((item.price - item.week52Low) / week52Range) * 100))
    : 50;

  return (
    <div
      id="symbol-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="symbol-detail-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#ffffff] border border-[#c3c5d8] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 border-b border-[#c3c5d8] flex items-center justify-between bg-[#f7f9ff]">
          <div className="flex items-center gap-3">
            <SymbolBadge item={item} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-headline text-[#181c21]">
                  {item.symbol}
                </h3>
                <span className="text-xs font-mono-num px-2 py-0.5 rounded bg-[#dfe2e9] text-[#434656] font-semibold">
                  {item.currency}
                </span>
                {item.sector && (
                  <span className="text-xs font-headline px-2 py-0.5 rounded bg-[#0049db]/10 text-[#0049db] font-medium hidden sm:inline-block">
                    {item.sector}
                  </span>
                )}
              </div>
              <div className="text-xs text-[#434656] font-medium">
                {item.name} • {item.subName || item.category.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Quick Actions & Close Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(item.symbol)}
              className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                isWatchlisted
                  ? 'bg-[#0049db] text-white border-[#0049db]'
                  : 'bg-[#ffffff] text-[#434656] border-[#c3c5d8] hover:border-[#0049db] hover:text-[#0049db]'
              }`}
              title="Add to Watchlist"
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: isWatchlisted ? "'FILL' 1" : "'FILL' 0" }}
              >
                star
              </span>
              <span className="hidden sm:inline">{isWatchlisted ? 'Watchlisted' : 'Watchlist'}</span>
            </button>

            <button
              onClick={() => onSetAlert(item.symbol, item.price)}
              className="p-2 rounded-lg border border-[#c3c5d8] bg-[#ffffff] text-[#434656] hover:text-[#0049db] hover:border-[#0049db] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Set Price Alert"
            >
              <span className="material-symbols-outlined text-[18px]">add_alert</span>
              <span className="hidden sm:inline">Alert</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#434656] hover:bg-[#dfe2e9] hover:text-[#181c21] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* Live Price Header */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <div className="text-3xl sm:text-4xl font-bold font-mono-num text-[#181c21] tracking-tight">
                {item.currency === 'USD' ? '$' : item.currency === 'EUR' ? '€' : item.currency === 'GBP' ? '£' : ''}
                {currentDisplayPrice.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`font-mono-num font-bold text-sm ${
                    currentDiff >= 0 ? 'market-up' : 'market-down'
                  }`}
                >
                  {currentDiff >= 0 ? `+${currentDiff.toFixed(2)}` : currentDiff.toFixed(2)} (
                  {currentDiffPct >= 0 ? `+${currentDiffPct.toFixed(2)}%` : `${currentDiffPct.toFixed(2)}%`})
                </span>
                <span className="text-xs text-[#737687]">
                  {hoveredPoint ? `at ${hoveredPoint.time}` : 'Today (Real-time)'}
                </span>
              </div>
            </div>

            {/* Timeframe Selectors */}
            <div className="flex items-center gap-1 bg-[#f1f4fb] p-1 rounded-lg border border-[#c3c5d8]">
              {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    setActiveTimeframe(tf);
                    setHoveredPoint(null);
                  }}
                  className={`px-2.5 py-1 text-xs font-mono-num font-semibold rounded transition-all cursor-pointer ${
                    activeTimeframe === tf
                      ? 'bg-[#0049db] text-white shadow-xs'
                      : 'text-[#434656] hover:text-[#181c21]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chart Canvas */}
          <div className="relative bg-[#f7f9ff] border border-[#c3c5d8] rounded-xl p-4 h-64 sm:h-72 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs text-[#737687] font-mono-num">
              <span>High: {maxVal.toFixed(2)}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setChartType(chartType === 'line' ? 'candles' : 'line')}
                  className="text-xs text-[#0049db] hover:underline flex items-center gap-1 font-sans cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {chartType === 'line' ? 'candlestick_chart' : 'show_chart'}
                  </span>
                  <span>{chartType === 'line' ? 'Candles' : 'Line'}</span>
                </button>
                <span>Low: {minVal.toFixed(2)}</span>
              </div>
            </div>

            {/* SVG Render */}
            <div className="relative flex-1 w-full my-2">
              <svg
                viewBox="0 0 500 180"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <defs>
                  <linearGradient id="modal-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid horizontal dashed lines */}
                <line x1="0" y1="45" x2="500" y2="45" stroke="#dfe2e9" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#dfe2e9" strokeDasharray="3 3" />
                <line x1="0" y1="135" x2="500" y2="135" stroke="#dfe2e9" strokeDasharray="3 3" />

                {/* Line & Area */}
                {(() => {
                  const pts = chartSeries.map((pt, idx) => {
                    const x = (idx / (chartSeries.length - 1)) * 500;
                    const y = 170 - ((pt.value - minVal) / valRange) * 150;
                    return { x, y, pt };
                  });

                  const pathStr = `M ${pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')}`;
                  const areaStr = `${pathStr} L 500,180 L 0,180 Z`;

                  return (
                    <>
                      <path d={areaStr} fill="url(#modal-grad)" stroke="none" />
                      <path
                        d={pathStr}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Interactive hover points */}
                      {pts.map((p, idx) => (
                        <circle
                          key={idx}
                          cx={p.x}
                          cy={p.y}
                          r="6"
                          className="opacity-0 hover:opacity-100 fill-[#0049db] cursor-crosshair transition-opacity"
                          onMouseEnter={() => setHoveredPoint(p.pt)}
                        />
                      ))}
                    </>
                  );
                })()}
              </svg>
            </div>

            <div className="flex justify-between items-center text-[11px] text-[#737687] font-mono-num">
              <span>{chartSeries[0]?.time}</span>
              <span>{chartSeries[Math.floor(chartSeries.length / 2)]?.time}</span>
              <span>{chartSeries[chartSeries.length - 1]?.time}</span>
            </div>
          </div>

          {/* Key Statistics Grid */}
          <div>
            <h4 className="text-sm font-bold font-headline text-[#181c21] mb-3">
              Key Financial Metrics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#f7f9ff] border border-[#c3c5d8] rounded-xl p-3">
                <span className="text-xs text-[#434656] block">Open</span>
                <span className="font-mono-num font-bold text-sm text-[#181c21]">
                  ${item.openPrice.toFixed(2)}
                </span>
              </div>
              <div className="bg-[#f7f9ff] border border-[#c3c5d8] rounded-xl p-3">
                <span className="text-xs text-[#434656] block">Previous Close</span>
                <span className="font-mono-num font-bold text-sm text-[#181c21]">
                  ${item.prevClose.toFixed(2)}
                </span>
              </div>
              <div className="bg-[#f7f9ff] border border-[#c3c5d8] rounded-xl p-3">
                <span className="text-xs text-[#434656] block">Day High / Low</span>
                <span className="font-mono-num font-bold text-xs text-[#181c21]">
                  ${item.high24h.toFixed(2)} / ${item.low24h.toFixed(2)}
                </span>
              </div>
              <div className="bg-[#f7f9ff] border border-[#c3c5d8] rounded-xl p-3">
                <span className="text-xs text-[#434656] block">Volume</span>
                <span className="font-mono-num font-bold text-sm text-[#181c21]">
                  {item.volume}
                </span>
              </div>
              <div className="bg-[#f7f9ff] border border-[#c3c5d8] rounded-xl p-3">
                <span className="text-xs text-[#434656] block">Market Cap</span>
                <span className="font-mono-num font-bold text-sm text-[#181c21]">
                  {item.marketCap || 'N/A'}
                </span>
              </div>
              <div className="bg-[#f7f9ff] border border-[#c3c5d8] rounded-xl p-3">
                <span className="text-xs text-[#434656] block">P/E Ratio</span>
                <span className="font-mono-num font-bold text-sm text-[#181c21]">
                  {item.peRatio || 'N/A'}
                </span>
              </div>
              <div className="bg-[#f7f9ff] border border-[#c3c5d8] rounded-xl p-3">
                <span className="text-xs text-[#434656] block">Div Yield</span>
                <span className="font-mono-num font-bold text-sm text-[#181c21]">
                  {item.dividendYield || 'N/A'}
                </span>
              </div>
              <div className="bg-[#f7f9ff] border border-[#c3c5d8] rounded-xl p-3">
                <span className="text-xs text-[#434656] block">Technical Rating</span>
                <span className="font-mono-num font-bold text-sm text-[#089981]">
                  {item.sentiment}
                </span>
              </div>
            </div>
          </div>

          {/* 52-Week Range Bar */}
          <div className="bg-[#f7f9ff] border border-[#c3c5d8] rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold font-headline text-[#434656]">52-Week Range</span>
              <span className="text-xs font-mono-num text-[#181c21]">
                ${item.week52Low.toFixed(2)} - ${item.week52High.toFixed(2)}
              </span>
            </div>
            <div className="relative w-full bg-[#dfe2e9] rounded-full h-2">
              <div
                className="absolute top-0 bottom-0 bg-[#0049db] rounded-full"
                style={{ width: `${week52Pos}%` }}
              ></div>
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-[#0049db] rounded-full shadow-xs"
                style={{ left: `calc(${week52Pos}% - 7px)` }}
              ></div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-[#c3c5d8] pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#434656] font-mono-num mb-2">
              Overview
            </h4>
            <p className="text-sm text-[#434656] leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#c3c5d8] bg-[#f7f9ff] flex items-center justify-between">
          <span className="text-xs text-[#737687]">
            Exchange status: <strong className="text-[#089981]">Regular Market Open</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#0049db] text-white font-semibold text-xs hover:bg-[#003ab3] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
