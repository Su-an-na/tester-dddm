import React, { useState } from 'react';
import { MarketItem, PaperPosition, PriceAlert, RightToolbarTool } from '../types';
import { SymbolBadge } from './Badges';

interface RightProToolbarProps {
  activeTool: RightToolbarTool;
  onSelectTool: (tool: RightToolbarTool) => void;
  watchlistSymbols: string[];
  allItems: MarketItem[];
  alerts: PriceAlert[];
  positions: PaperPosition[];
  onSelectSymbol: (item: MarketItem) => void;
  onRemoveWatchlist: (symbol: string) => void;
  onExecuteTrade: (symbol: string, name: string, side: 'BUY' | 'SELL', shares: number, price: number) => void;
  onClosePosition: (id: string) => void;
  paperBalance: number;
}

export const RightProToolbar: React.FC<RightProToolbarProps> = ({
  activeTool,
  onSelectTool,
  watchlistSymbols,
  allItems,
  alerts,
  positions,
  onSelectSymbol,
  onRemoveWatchlist,
  onExecuteTrade,
  onClosePosition,
  paperBalance,
}) => {
  const [selectedTradeSymbol, setSelectedTradeSymbol] = useState<string>('NVDA');
  const [tradeShares, setTradeShares] = useState<number>(10);
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');

  const watchlistedItems = allItems.filter((i) => watchlistSymbols.includes(i.symbol));
  const activeTradeItem = allItems.find((i) => i.symbol === selectedTradeSymbol) || allItems[0];

  const totalPositionsValue = positions.reduce((acc, pos) => {
    const currentItem = allItems.find((i) => i.symbol === pos.symbol);
    const currPrice = currentItem ? currentItem.price : pos.entryPrice;
    return acc + currPrice * pos.shares;
  }, 0);

  const totalUnrealizedPnL = positions.reduce((acc, pos) => {
    const currentItem = allItems.find((i) => i.symbol === pos.symbol);
    const currPrice = currentItem ? currentItem.price : pos.entryPrice;
    const pnl = (currPrice - pos.entryPrice) * pos.shares * (pos.side === 'BUY' ? 1 : -1);
    return acc + pnl;
  }, 0);

  return (
    <aside className="fixed right-0 top-0 bottom-0 z-40 flex select-none pointer-events-none">
      {/* Slide-out Panel Drawer */}
      {activeTool && (
        <div className="w-80 sm:w-96 bg-[#ffffff] border-l border-[#c3c5d8] shadow-2xl flex flex-col h-full pointer-events-auto animate-slideLeft">
          {/* Drawer Header */}
          <div className="p-4 border-b border-[#c3c5d8] bg-[#f7f9ff] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0049db] text-[20px]">
                {activeTool === 'watchlist'
                  ? 'star'
                  : activeTool === 'alerts'
                  ? 'notifications'
                  : activeTool === 'paper-trade'
                  ? 'candlestick_chart'
                  : 'account_balance_wallet'}
              </span>
              <h3 className="font-bold text-sm font-headline text-[#181c21] capitalize">
                {activeTool === 'watchlist'
                  ? 'Quick Watchlist'
                  : activeTool === 'alerts'
                  ? 'Price Alerts'
                  : activeTool === 'paper-trade'
                  ? 'Instant Pro Trading'
                  : 'Portfolio'}
              </h3>
            </div>
            <button
              onClick={() => onSelectTool(null)}
              className="p-1 rounded-md text-[#737687] hover:bg-[#dfe2e9] hover:text-[#181c21] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Watchlist Tab */}
            {activeTool === 'watchlist' && (
              <div className="space-y-2">
                <div className="text-xs text-[#737687] font-mono-num flex justify-between">
                  <span>SYMBOL</span>
                  <span>LAST / CHG</span>
                </div>
                {watchlistedItems.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#737687]">
                    No watchlisted assets.
                  </div>
                ) : (
                  watchlistedItems.map((item) => {
                    const isPos = item.change >= 0;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#f7f9ff] hover:bg-[#f1f4fb] border border-[#c3c5d8] transition-colors group cursor-pointer"
                      >
                        <div
                          onClick={() => onSelectSymbol(item)}
                          className="flex items-center gap-2 flex-1"
                        >
                          <SymbolBadge item={item} size="sm" />
                          <div>
                            <div className="font-bold text-xs text-[#181c21] group-hover:text-[#0049db]">
                              {item.symbol}
                            </div>
                            <div className="text-[10px] text-[#737687] font-mono-num">
                              {item.name}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right font-mono-num">
                            <div className="font-bold text-xs text-[#181c21]">
                              ${item.price.toFixed(2)}
                            </div>
                            <div
                              className={`text-[10px] font-bold ${
                                isPos ? 'market-up' : 'market-down'
                              }`}
                            >
                              {isPos ? '+' : ''}
                              {item.changePercent.toFixed(2)}%
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveWatchlist(item.symbol);
                            }}
                            className="text-[#737687] hover:text-[#F23645] p-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Paper Trading Panel */}
            {activeTool === 'paper-trade' && (
              <div className="space-y-4">
                {/* Account Header */}
                <div className="bg-[#181c21] text-white p-3.5 rounded-xl">
                  <div className="text-[11px] text-[#c3c5d8] flex justify-between">
                    <span>CASH BALANCE</span>
                    <span>ACTIVE P&L</span>
                  </div>
                  <div className="flex justify-between items-baseline mt-1">
                    <span className="font-mono-num font-bold text-base text-[#089981]">
                      ${paperBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`font-mono-num font-bold text-xs ${
                        totalUnrealizedPnL >= 0 ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {totalUnrealizedPnL >= 0 ? '+' : ''}$
                      {totalUnrealizedPnL.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Symbol Selector */}
                <div>
                  <label className="text-xs font-bold text-[#181c21] block mb-1">
                    Select Instrument
                  </label>
                  <select
                    value={selectedTradeSymbol}
                    onChange={(e) => setSelectedTradeSymbol(e.target.value)}
                    className="w-full bg-[#f7f9ff] border border-[#c3c5d8] rounded-lg p-2 text-xs font-mono-num font-bold text-[#181c21] focus:border-[#0049db] focus:outline-none"
                  >
                    {allItems.slice(0, 10).map((it) => (
                      <option key={it.symbol} value={it.symbol}>
                        {it.symbol} (${it.price.toFixed(2)}) - {it.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Shares & Cost */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#181c21] mb-1">
                    <span>Order Quantity</span>
                    <span className="font-mono-num text-[#0049db]">{tradeShares} Shares</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={tradeShares}
                    onChange={(e) => setTradeShares(Number(e.target.value))}
                    className="w-full accent-[#0049db] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#737687] font-mono-num mt-1">
                    <span>Est. Total:</span>
                    <span className="font-bold text-[#181c21]">
                      ${(tradeShares * (activeTradeItem?.price || 100)).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

                {/* Buy / Sell Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() =>
                      activeTradeItem &&
                      onExecuteTrade(
                        activeTradeItem.symbol,
                        activeTradeItem.name,
                        'BUY',
                        tradeShares,
                        activeTradeItem.price
                      )
                    }
                    className="bg-[#089981] hover:bg-[#07806c] text-white py-2.5 rounded-lg font-bold text-xs font-headline shadow-xs active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                    <span>BUY / LONG</span>
                  </button>

                  <button
                    onClick={() =>
                      activeTradeItem &&
                      onExecuteTrade(
                        activeTradeItem.symbol,
                        activeTradeItem.name,
                        'SELL',
                        tradeShares,
                        activeTradeItem.price
                      )
                    }
                    className="bg-[#F23645] hover:bg-[#d82a38] text-white py-2.5 rounded-lg font-bold text-xs font-headline shadow-xs active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                    <span>SELL / SHORT</span>
                  </button>
                </div>

                {/* Open Positions List */}
                <div className="border-t border-[#c3c5d8] pt-3">
                  <h4 className="text-xs font-bold font-headline text-[#181c21] mb-2 flex justify-between items-center">
                    <span>Open Positions ({positions.length})</span>
                    <span className="text-[10px] text-[#737687]">Real-time P&L</span>
                  </h4>

                  {positions.length === 0 ? (
                    <div className="text-center py-4 text-xs text-[#737687] bg-[#f7f9ff] rounded-lg">
                      No active positions open.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {positions.map((pos) => {
                        const currentItem = allItems.find((i) => i.symbol === pos.symbol);
                        const currPrice = currentItem ? currentItem.price : pos.entryPrice;
                        const pnl = (currPrice - pos.entryPrice) * pos.shares * (pos.side === 'BUY' ? 1 : -1);
                        const pnlPct = ((currPrice - pos.entryPrice) / pos.entryPrice) * 100 * (pos.side === 'BUY' ? 1 : -1);

                        return (
                          <div
                            key={pos.id}
                            className="bg-[#f7f9ff] border border-[#c3c5d8] rounded-lg p-2.5 text-xs flex items-center justify-between"
                          >
                            <div>
                              <div className="flex items-center gap-1.5 font-bold text-[#181c21]">
                                <span>{pos.symbol}</span>
                                <span
                                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono-num ${
                                    pos.side === 'BUY'
                                      ? 'bg-[#089981]/20 text-[#089981]'
                                      : 'bg-[#F23645]/20 text-[#F23645]'
                                  }`}
                                >
                                  {pos.side} {pos.shares}x
                                </span>
                              </div>
                              <div className="text-[10px] text-[#737687] font-mono-num mt-0.5">
                                Entry: ${pos.entryPrice.toFixed(2)} → Now: ${currPrice.toFixed(2)}
                              </div>
                            </div>

                            <div className="text-right">
                              <div
                                className={`font-mono-num font-bold ${
                                  pnl >= 0 ? 'market-up' : 'market-down'
                                }`}
                              >
                                {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} ({pnlPct.toFixed(1)}%)
                              </div>
                              <button
                                onClick={() => onClosePosition(pos.id)}
                                className="text-[10px] text-[#F23645] hover:underline font-semibold cursor-pointer"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Alerts Drawer */}
            {activeTool === 'alerts' && (
              <div className="space-y-2">
                <div className="text-xs text-[#737687] font-mono-num">ACTIVE TRIGGERS</div>
                {alerts.map((al) => (
                  <div
                    key={al.id}
                    className="p-3 bg-[#f7f9ff] border border-[#c3c5d8] rounded-lg text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-[#181c21]">{al.symbol}</div>
                      <div className="text-[10px] text-[#737687]">
                        Triggers when &gt; ${al.targetPrice.toFixed(2)}
                      </div>
                    </div>
                    <span className="text-[10px] text-[#089981] font-bold bg-[#089981]/15 px-2 py-0.5 rounded">
                      ARMED
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vertical Icon Strip (Right side TradingView style) */}
      <div className="w-12 bg-[#ffffff] border-l border-[#c3c5d8] shadow-md flex flex-col items-center py-3 gap-3 pointer-events-auto hidden md:flex">
        {[
          { id: 'watchlist', icon: 'star', title: 'Watchlist & Pinned' },
          { id: 'paper-trade', icon: 'candlestick_chart', title: 'Pro Paper Trading' },
          { id: 'alerts', icon: 'notifications', title: 'Price Alerts' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => onSelectTool(activeTool === btn.id ? null : (btn.id as RightToolbarTool))}
            title={btn.title}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              activeTool === btn.id
                ? 'bg-[#0049db] text-white shadow-xs'
                : 'text-[#434656] hover:bg-[#f1f4fb] hover:text-[#0049db]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{btn.icon}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};
