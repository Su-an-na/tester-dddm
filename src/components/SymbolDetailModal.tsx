import React, { useState } from 'react';
import { MarketItem } from '../types';
import { SymbolBadge } from './Badges';
import { generateCandleData } from '../data/mockMarkets';

interface SymbolDetailModalProps {
  item: MarketItem | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (symbol: string) => void;
  onSetAlert: (symbol: string, currentPrice: number) => void;
  onQuickTrade?: (symbol: string, name: string, side: 'BUY' | 'SELL', shares: number, price: number) => void;
}

type Timeframe = '1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL';

export const SymbolDetailModal: React.FC<SymbolDetailModalProps> = ({
  item,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  onSetAlert,
  onQuickTrade,
}) => {
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1D');
  const [hoveredPoint, setHoveredPoint] = useState<{ time: string; value: number } | null>(null);
  const [chartType, setChartType] = useState<'line' | 'candles'>('candles');

  // Technical Indicators
  const [showEMA20, setShowEMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(false);
  const [showRSI, setShowRSI] = useState(true);
  const [hoveredCandle, setHoveredCandle] = useState<any | null>(null);

  if (!item) return null;

  const isPositive = item.change >= 0;
  const strokeColor = isPositive ? '#089981' : '#F23645';

  const chartSeries = item.chartData[activeTimeframe] || item.chartData['1D'];
  const minVal = Math.min(...chartSeries.map((p) => p.value));
  const maxVal = Math.max(...chartSeries.map((p) => p.value));
  const valRange = maxVal - minVal === 0 ? 1 : maxVal - minVal;

  const currentDisplayPrice = hoveredCandle ? hoveredCandle.close : (hoveredPoint ? hoveredPoint.value : item.price);
  const currentDiff = currentDisplayPrice - item.openPrice;
  const currentDiffPct = (currentDiff / item.openPrice) * 100;

  // Compute 52-week position percentage
  const week52Range = item.week52High - item.week52Low;
  const week52Pos = week52Range > 0
    ? Math.max(0, Math.min(100, ((item.price - item.week52Low) / week52Range) * 100))
    : 50;

  const candleList = item.candleData || generateCandleData(item.price, isPositive);
  const candleMin = Math.min(...candleList.map((c) => c.low));
  const candleMax = Math.max(...candleList.map((c) => c.high));
  const candleRange = candleMax - candleMin === 0 ? 1 : candleMax - candleMin;

  return (
    <div
      id="symbol-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm select-none animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="symbol-detail-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#ffffff] border border-[#c3c5d8] rounded-2xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-[#c3c5d8] flex items-center justify-between bg-[#f7f9ff]">
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
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
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
                  {hoveredCandle ? `Candle: ${hoveredCandle.time}` : 'Real-time Feed'}
                </span>
              </div>
            </div>

            {/* Pro Indicators & Timeframe Selectors */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-[#f1f4fb] p-1 rounded-lg border border-[#c3c5d8]">
                {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => {
                      setActiveTimeframe(tf);
                      setHoveredPoint(null);
                      setHoveredCandle(null);
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

              {/* Chart Style Switcher */}
              <div className="flex items-center bg-[#f1f4fb] p-1 rounded-lg border border-[#c3c5d8] text-xs">
                <button
                  onClick={() => setChartType('candles')}
                  className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    chartType === 'candles' ? 'bg-[#0049db] text-white' : 'text-[#434656]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">candlestick_chart</span>
                  <span>Candles</span>
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    chartType === 'line' ? 'bg-[#0049db] text-white' : 'text-[#434656]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">show_chart</span>
                  <span>Line</span>
                </button>
              </div>
            </div>
          </div>

          {/* Pro Indicator Pills Bar */}
          <div className="flex items-center gap-2 text-xs font-mono-num bg-[#f7f9ff] p-2 rounded-lg border border-[#c3c5d8]">
            <span className="text-[#434656] font-semibold mr-1 font-headline">Indicators:</span>
            <button
              onClick={() => setShowEMA20(!showEMA20)}
              className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                showEMA20
                  ? 'bg-[#ff9800]/20 text-[#e65100] border border-[#ff9800]/40 font-bold'
                  : 'bg-[#dfe2e9] text-[#737687]'
              }`}
            >
              EMA 20
            </button>
            <button
              onClick={() => setShowSMA50(!showSMA50)}
              className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                showSMA50
                  ? 'bg-[#2962ff]/20 text-[#2962ff] border border-[#2962ff]/40 font-bold'
                  : 'bg-[#dfe2e9] text-[#737687]'
              }`}
            >
              SMA 50
            </button>
            <button
              onClick={() => setShowRSI(!showRSI)}
              className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                showRSI
                  ? 'bg-[#7b1fa2]/20 text-[#7b1fa2] border border-[#7b1fa2]/40 font-bold'
                  : 'bg-[#dfe2e9] text-[#737687]'
              }`}
            >
              RSI (14)
            </button>

            {hoveredCandle && (
              <div className="ml-auto text-[11px] text-[#181c21] hidden md:flex items-center gap-2">
                <span>O: <strong className="font-bold">{hoveredCandle.open}</strong></span>
                <span>H: <strong className="font-bold text-[#089981]">{hoveredCandle.high}</strong></span>
                <span>L: <strong className="font-bold text-[#F23645]">{hoveredCandle.low}</strong></span>
                <span>C: <strong className="font-bold">{hoveredCandle.close}</strong></span>
                <span>V: <strong className="font-bold">{hoveredCandle.volume.toLocaleString()}</strong></span>
              </div>
            )}
          </div>

          {/* Interactive Chart Canvas */}
          <div className="relative bg-[#ffffff] border border-[#c3c5d8] rounded-xl p-4 h-72 sm:h-80 flex flex-col justify-between shadow-xs">
            <div className="flex justify-between items-center text-xs text-[#737687] font-mono-num">
              <span>High: {(chartType === 'candles' ? candleMax : maxVal).toFixed(2)}</span>
              <span className="text-[#0049db] font-semibold">Institutional Engine</span>
              <span>Low: {(chartType === 'candles' ? candleMin : minVal).toFixed(2)}</span>
            </div>

            {/* SVG Render */}
            <div className="relative flex-1 w-full my-2">
              <svg
                viewBox="0 0 600 200"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
                onMouseLeave={() => {
                  setHoveredPoint(null);
                  setHoveredCandle(null);
                }}
              >
                {/* Horizontal grid lines */}
                <line x1="0" y1="50" x2="600" y2="50" stroke="#f1f4fb" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="600" y2="100" stroke="#f1f4fb" strokeDasharray="3 3" />
                <line x1="0" y1="150" x2="600" y2="150" stroke="#f1f4fb" strokeDasharray="3 3" />

                {chartType === 'candles' ? (
                  /* Candlestick & Volume Bars Rendering */
                  (() => {
                    const candleWidth = 600 / candleList.length;
                    const bodyWidth = Math.max(3, candleWidth * 0.65);

                    return (
                      <>
                        {candleList.map((c, i) => {
                          const xCenter = i * candleWidth + candleWidth / 2;
                          const isGreen = c.close >= c.open;
                          const candleColor = isGreen ? '#089981' : '#F23645';

                          // High/Low Wick
                          const yHigh = 160 - ((c.high - candleMin) / candleRange) * 140;
                          const yLow = 160 - ((c.low - candleMin) / candleRange) * 140;

                          // Open/Close Body
                          const yOpen = 160 - ((c.open - candleMin) / candleRange) * 140;
                          const yClose = 160 - ((c.close - candleMin) / candleRange) * 140;
                          const bodyTop = Math.min(yOpen, yClose);
                          const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

                          // Volume bar at bottom
                          const volHeight = (c.volume / 300000) * 35;

                          return (
                            <g
                              key={i}
                              className="cursor-crosshair group"
                              onMouseEnter={() => setHoveredCandle(c)}
                            >
                              {/* Volume bar */}
                              <rect
                                x={xCenter - bodyWidth / 2}
                                y={200 - volHeight}
                                width={bodyWidth}
                                height={volHeight}
                                fill={isGreen ? '#089981' : '#F23645'}
                                opacity="0.25"
                              />

                              {/* Wick */}
                              <line
                                x1={xCenter}
                                y1={yHigh}
                                x2={xCenter}
                                y2={yLow}
                                stroke={candleColor}
                                strokeWidth="1.5"
                              />

                              {/* Body */}
                              <rect
                                x={xCenter - bodyWidth / 2}
                                y={bodyTop}
                                width={bodyWidth}
                                height={bodyHeight}
                                fill={candleColor}
                                rx="1"
                              />
                            </g>
                          );
                        })}

                        {/* EMA 20 Overlay Line */}
                        {showEMA20 && (() => {
                          const emaPoints = candleList.map((c, i) => {
                            const xCenter = i * candleWidth + candleWidth / 2;
                            const y = 160 - (((c.close + c.open) / 2 - candleMin) / candleRange) * 140;
                            return `${xCenter.toFixed(1)},${y.toFixed(1)}`;
                          });
                          return (
                            <polyline
                              fill="none"
                              stroke="#ff9800"
                              strokeWidth="2"
                              strokeDasharray="4 2"
                              points={emaPoints.join(' ')}
                            />
                          );
                        })()}
                      </>
                    );
                  })()
                ) : (
                  /* Standard Area Line Chart */
                  (() => {
                    const pts = chartSeries.map((pt, idx) => {
                      const x = (idx / (chartSeries.length - 1)) * 600;
                      const y = 170 - ((pt.value - minVal) / valRange) * 150;
                      return { x, y, pt };
                    });

                    const pathStr = `M ${pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')}`;
                    const areaStr = `${pathStr} L 600,200 L 0,200 Z`;

                    return (
                      <>
                        <path d={areaStr} fill={`url(#modal-grad-${item.id})`} stroke="none" />
                        <path
                          d={pathStr}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {pts.map((p, idx) => (
                          <circle
                            key={idx}
                            cx={p.x}
                            cy={p.y}
                            r="5"
                            className="opacity-0 hover:opacity-100 fill-[#0049db] cursor-crosshair transition-opacity"
                            onMouseEnter={() => setHoveredPoint(p.pt)}
                          />
                        ))}
                      </>
                    );
                  })()
                )}
              </svg>
            </div>

            {/* RSI Sub-Oscillator if enabled */}
            {showRSI && (
              <div className="pt-2 border-t border-[#c3c5d8] flex items-center justify-between text-[10px] font-mono-num text-[#737687]">
                <span>RSI (14): <strong className="text-[#7b1fa2] font-bold">58.42</strong> (Neutral Bullish)</span>
                <span className="flex items-center gap-2">
                  <span>Overbought: 70</span>
                  <span>Oversold: 30</span>
                </span>
              </div>
            )}
          </div>

          {/* Quick Trade Trigger Row */}
          {onQuickTrade && (
            <div className="bg-[#f7f9ff] border border-[#c3c5d8] rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="font-bold text-xs text-[#181c21] block">Instant Simulation Execution</span>
                <span className="text-[11px] text-[#434656]">Execute 10 shares paper order at current market rate</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onQuickTrade(item.symbol, item.name, 'BUY', 10, item.price)}
                  className="flex-1 sm:flex-none bg-[#089981] hover:bg-[#07806c] text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  Quick BUY
                </button>
                <button
                  onClick={() => onQuickTrade(item.symbol, item.name, 'SELL', 10, item.price)}
                  className="flex-1 sm:flex-none bg-[#F23645] hover:bg-[#d82a38] text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  Quick SELL
                </button>
              </div>
            </div>
          )}

          {/* Key Statistics Grid */}
          <div>
            <h4 className="text-sm font-bold font-headline text-[#181c21] mb-3">
              Key Financial Metrics & Ratios
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
