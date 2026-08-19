/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  DisplayMode,
  MainView,
  MarketItem,
  PaperPosition,
  PriceAlert,
  RightToolbarTool,
  TabCategory,
} from './types';
import {
  INITIAL_MARKET_ITEMS,
  MARKET_NEWS,
  MARKET_SUMMARY,
  TOP_GAINERS,
  TOP_LOSERS,
  TRADE_IDEAS,
} from './data/mockMarkets';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { TabsHeader } from './components/TabsHeader';
import { WorldIndicesSection } from './components/WorldIndicesSection';
import { USStocksSection } from './components/USStocksSection';
import { MarketSummaryPanel } from './components/MarketSummaryPanel';
import { SymbolDetailModal } from './components/SymbolDetailModal';
import { NewsView } from './components/NewsView';
import { IdeasView } from './components/IdeasView';
import { ProfileView } from './components/ProfileView';
import { SearchModal } from './components/SearchModal';
import { GetStartedModal } from './components/GetStartedModal';
import { Sparkline } from './components/Sparkline';
import { SymbolBadge } from './components/Badges';
import { TickerTape } from './components/TickerTape';
import { HeatmapView } from './components/HeatmapView';
import { EconomicCalendarView } from './components/EconomicCalendarView';
import { RightProToolbar } from './components/RightProToolbar';

export default function App() {
  const [activeView, setActiveView] = useState<MainView>('markets');
  const [activeTab, setActiveTab] = useState<TabCategory>('indices');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('table');
  const [marketItems, setMarketItems] = useState<MarketItem[]>(INITIAL_MARKET_ITEMS);
  const [liveTickItemIds, setLiveTickItemIds] = useState<Set<string>>(new Set());

  // Pro Right Toolbar & Drawer
  const [activeRightTool, setActiveRightTool] = useState<RightToolbarTool>(null);

  // Dropdown for "Markets, everywhere"
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<'All' | 'US' | 'Europe' | 'Asia'>('All');

  // Modals and Drawers
  const [selectedSymbol, setSelectedSymbol] = useState<MarketItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);

  // Paper Trading Account ($100,000 Starting Pro Balance)
  const [paperBalance, setPaperBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('pm_balance');
      return saved ? parseFloat(saved) : 100000;
    } catch {
      return 100000;
    }
  });

  const [positions, setPositions] = useState<PaperPosition[]>(() => {
    try {
      const saved = localStorage.getItem('pm_positions');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'pos-1',
              symbol: 'NVDA',
              name: 'NVIDIA Corp',
              side: 'BUY',
              shares: 20,
              entryPrice: 790.0,
              currentPrice: 822.79,
              pnl: 655.8,
              pnlPercent: 4.15,
              timestamp: 'Today 09:30',
            },
          ];
    } catch {
      return [];
    }
  });

  // Watchlist & Alerts
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pm_watchlist');
      return saved ? JSON.parse(saved) : ['S&P 500', 'Nasdaq 100', 'NVDA', 'AAPL', 'BTC/USD'];
    } catch {
      return ['S&P 500', 'Nasdaq 100', 'NVDA', 'AAPL', 'BTC/USD'];
    }
  });

  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: 'alt-1',
      symbol: 'NVDA',
      targetPrice: 850.0,
      condition: 'above',
      isActive: true,
      createdAt: 'Today',
    },
    {
      id: 'alt-2',
      symbol: 'S&P 500',
      targetPrice: 5200.0,
      condition: 'above',
      isActive: true,
      createdAt: 'Yesterday',
    },
  ]);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  const handleToggleWatchlist = (symbol: string) => {
    setWatchlist((prev) => {
      let next: string[];
      if (prev.includes(symbol)) {
        next = prev.filter((s) => s !== symbol);
        showToast(`Removed ${symbol} from watchlist`);
      } else {
        next = [...prev, symbol];
        showToast(`Added ${symbol} to watchlist`);
      }
      try {
        localStorage.setItem('pm_watchlist', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleSetAlert = (symbol: string, currentPrice: number) => {
    const target = currentPrice * 1.05;
    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      symbol,
      targetPrice: parseFloat(target.toFixed(2)),
      condition: 'above',
      isActive: true,
      createdAt: 'Just now',
    };
    setAlerts((prev) => [newAlert, ...prev]);
    showToast(`Price alert created for ${symbol} at $${target.toFixed(2)}`);
  };

  const handleRemoveAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast('Alert dismissed');
  };

  // Execute Paper Order
  const handleExecuteTrade = (
    symbol: string,
    name: string,
    side: 'BUY' | 'SELL',
    shares: number,
    price: number
  ) => {
    const totalCost = price * shares;
    if (side === 'BUY' && totalCost > paperBalance) {
      showToast('Insufficient paper balance to execute order.');
      return;
    }

    const newPosition: PaperPosition = {
      id: `pos-${Date.now()}`,
      symbol,
      name,
      side,
      shares,
      entryPrice: price,
      currentPrice: price,
      pnl: 0,
      pnlPercent: 0,
      timestamp: 'Just now',
    };

    const nextPositions = [newPosition, ...positions];
    const nextBal = side === 'BUY' ? paperBalance - totalCost : paperBalance + totalCost;

    setPositions(nextPositions);
    setPaperBalance(nextBal);

    try {
      localStorage.setItem('pm_positions', JSON.stringify(nextPositions));
      localStorage.setItem('pm_balance', nextBal.toString());
    } catch {}

    showToast(`Order Executed: ${side} ${shares}x ${symbol} @ $${price.toFixed(2)}`);
  };

  const handleClosePosition = (id: string) => {
    const pos = positions.find((p) => p.id === id);
    if (!pos) return;

    const currentItem = marketItems.find((i) => i.symbol === pos.symbol);
    const currPrice = currentItem ? currentItem.price : pos.entryPrice;
    const returnVal = currPrice * pos.shares;
    const nextBal = pos.side === 'BUY' ? paperBalance + returnVal : paperBalance;

    const nextPositions = positions.filter((p) => p.id !== id);
    setPositions(nextPositions);
    setPaperBalance(nextBal);

    try {
      localStorage.setItem('pm_positions', JSON.stringify(nextPositions));
      localStorage.setItem('pm_balance', nextBal.toString());
    } catch {}

    showToast(`Position closed: ${pos.symbol}`);
  };

  // Set default display mode based on initial screen width
  useEffect(() => {
    if (window.innerWidth < 768) {
      setDisplayMode('cards');
    }
  }, []);

  // Live Simulated Price Ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketItems((prevItems) => {
        const updated = [...prevItems];
        const count = 1 + Math.floor(Math.random() * 2);
        const updatedIds = new Set<string>();

        for (let i = 0; i < count; i++) {
          const randomIndex = Math.floor(Math.random() * updated.length);
          const item = { ...updated[randomIndex] };
          const delta = (Math.random() - 0.48) * (item.price * 0.0015);
          const newPrice = Math.max(0.01, item.price + delta);
          const diff = newPrice - item.openPrice;
          const diffPct = (diff / item.openPrice) * 100;

          item.price = parseFloat(newPrice.toFixed(2));
          item.change = parseFloat(diff.toFixed(2));
          item.changePercent = parseFloat(diffPct.toFixed(2));
          item.high24h = Math.max(item.high24h, item.price);
          item.low24h = Math.min(item.low24h, item.price);

          const nextSpark = [...item.sparkline];
          nextSpark[nextSpark.length - 1] = Math.max(
            2,
            Math.min(30, nextSpark[nextSpark.length - 1] + (delta > 0 ? 1 : -1))
          );
          item.sparkline = nextSpark;

          updated[randomIndex] = item;
          updatedIds.add(item.id);
        }

        setLiveTickItemIds(updatedIds);
        setTimeout(() => setLiveTickItemIds(new Set()), 1200);

        return updated;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  // Filter items by active tab & region
  const worldIndices = marketItems.filter((i) => {
    const matchesTab =
      activeTab === 'indices'
        ? i.category === 'indices' && i.region === 'world'
        : i.category === activeTab;
    if (selectedRegionFilter === 'US') return matchesTab && i.region === 'us';
    if (selectedRegionFilter === 'Europe') return matchesTab && i.region === 'europe';
    if (selectedRegionFilter === 'Asia') return matchesTab && i.region === 'asia';
    return matchesTab;
  });

  const usStocks = marketItems.filter((i) => i.category === 'indices' && i.region === 'us');

  // Handle symbol jump
  const handleSelectSymbolByName = (symbolName: string) => {
    const cleanSym = symbolName.replace('$', '').trim();
    const found = marketItems.find(
      (m) =>
        m.symbol.toLowerCase() === cleanSym.toLowerCase() ||
        m.name.toLowerCase() === cleanSym.toLowerCase()
    );
    if (found) {
      setSelectedSymbol(found);
    } else {
      // Fallback find matching prefix
      const partial = marketItems.find((m) =>
        m.symbol.toLowerCase().includes(cleanSym.toLowerCase())
      );
      if (partial) {
        setSelectedSymbol(partial);
      } else {
        showToast(`Viewing details for ${symbolName}`);
      }
    }
  };

  return (
    <div className="bg-[#f7f9ff] text-[#181c21] min-h-screen flex flex-col antialiased">
      {/* Top Real-Time Global Ticker Tape (Pro Feature) */}
      <TickerTape onSelectSymbol={handleSelectSymbolByName} />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Desktop Sidebar (Image 3) */}
        <Sidebar
          activeView={activeView}
          onViewChange={(view) => {
            setActiveView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenGetStarted={() => setIsGetStartedOpen(true)}
          unreadNewsCount={3}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8 md:pr-12">
          {/* Top App Bar */}
          <Header
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenGetStarted={() => setIsGetStartedOpen(true)}
            onToggleMobileMenu={() => setIsGetStartedOpen(true)}
          />

          {/* View Routing */}
          <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-8 py-6">
            {activeView === 'heatmap' && (
              <HeatmapView onSelectSymbol={handleSelectSymbolByName} />
            )}

            {activeView === 'calendar' && <EconomicCalendarView />}

            {activeView === 'news' && (
              <NewsView
                newsList={MARKET_NEWS}
                onSelectSymbol={handleSelectSymbolByName}
              />
            )}

            {activeView === 'ideas' && (
              <IdeasView
                ideas={TRADE_IDEAS}
                onSelectSymbol={handleSelectSymbolByName}
              />
            )}

            {activeView === 'profile' && (
              <ProfileView
                watchlistSymbols={watchlist}
                allItems={marketItems}
                alerts={alerts}
                onRemoveAlert={handleRemoveAlert}
                onRemoveWatchlist={handleToggleWatchlist}
                onSelectSymbol={(item) => setSelectedSymbol(item)}
              />
            )}

            {activeView === 'markets' && (
              <div>
                {/* Page Title & Region Dropdown (Image 1 & 3) */}
                <div className="mb-6 relative">
                  <div
                    id="page-header-title-container"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity w-fit select-none group"
                  >
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-headline text-[#181c21] group-hover:text-[#0049db] transition-colors">
                      {selectedRegionFilter === 'All'
                        ? 'Markets, everywhere'
                        : `${selectedRegionFilter} Markets`}
                    </h1>
                    <span
                      className={`material-symbols-outlined text-[#434656] text-3xl transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180 text-[#0049db]' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </div>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setIsDropdownOpen(false)}
                      ></div>
                      <div className="absolute left-0 top-full mt-2 z-30 w-64 bg-[#ffffff] border border-[#c3c5d8] rounded-xl shadow-xl p-1.5 animate-fadeIn">
                        {[
                          { id: 'All', label: 'Markets, everywhere (Global)' },
                          { id: 'US', label: 'US Markets & Equities' },
                          { id: 'Europe', label: 'European Indices & Debt' },
                          { id: 'Asia', label: 'Asian & Emerging Markets' },
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setSelectedRegionFilter(item.id as any);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                              selectedRegionFilter === item.id
                                ? 'bg-[#dfe2e9] text-[#0049db]'
                                : 'text-[#434656] hover:bg-[#f1f4fb] hover:text-[#181c21]'
                            }`}
                          >
                            <span>{item.label}</span>
                            {selectedRegionFilter === item.id && (
                              <span className="material-symbols-outlined text-[16px]">
                                check
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Navigation Tabs (Indices, Futures, Forex, Bonds, Crypto) */}
                <TabsHeader
                  activeTab={activeTab}
                  onTabChange={(tab) => setActiveTab(tab)}
                  displayMode={displayMode}
                  onDisplayModeChange={(mode) => setDisplayMode(mode)}
                />

                {/* Main Grid: Left Tables/Cards + Right Sidebar Panel */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                  <div className="xl:col-span-2 flex flex-col gap-6">
                    {/* Category Title dynamic mapping */}
                    {activeTab === 'indices' ? (
                      <>
                        {/* World Indices (Screenshot 1 cards + Screenshot 3 table) */}
                        <WorldIndicesSection
                          items={worldIndices}
                          displayMode={displayMode}
                          onSelectSymbol={(item) => setSelectedSymbol(item)}
                          onSeeAll={() => showToast('Displaying 8 World Indices')}
                          liveTickItemIds={liveTickItemIds}
                        />

                        {/* US Stocks (Screenshot 1 cards + Screenshot 3 table) */}
                        <USStocksSection
                          items={usStocks}
                          displayMode={displayMode}
                          onSelectSymbol={(item) => setSelectedSymbol(item)}
                          onSeeAll={() => showToast('Displaying Major US Tech Equities')}
                          liveTickItemIds={liveTickItemIds}
                        />
                      </>
                    ) : (
                      /* Other tabs: Futures, Forex, Bonds, Crypto */
                      <section className="bg-[#ffffff] border border-[#c3c5d8] rounded-xl overflow-hidden p-6 shadow-xs">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-bold font-headline capitalize text-[#181c21]">
                            {activeTab === 'bonds'
                              ? 'Government Bonds & Yields'
                              : `${activeTab} Instruments`}
                          </h2>
                          <span className="text-xs font-mono-num text-[#434656]">
                            {worldIndices.length} Assets
                          </span>
                        </div>

                        {displayMode === 'table' ? (
                          <div className="overflow-x-auto hide-scrollbar">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-[#f7f9ff] border-b border-[#c3c5d8] text-[#434656] font-mono-num text-[11px] uppercase">
                                  <th className="p-3.5 font-medium">Instrument</th>
                                  <th className="p-3.5 font-medium text-right">Price / Yield</th>
                                  <th className="p-3.5 font-medium text-right">Change</th>
                                  <th className="p-3.5 font-medium text-right">Change %</th>
                                  <th className="p-3.5 font-medium text-center hidden sm:table-cell">
                                    1D Trend
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#c3c5d8]/70">
                                {worldIndices.map((item) => {
                                  const isPos = item.change >= 0;
                                  const isLive = liveTickItemIds.has(item.id);
                                  return (
                                    <tr
                                      key={item.id}
                                      onClick={() => setSelectedSymbol(item)}
                                      className={`hover:bg-[#f1f4fb] transition-colors cursor-pointer ${
                                        isLive
                                          ? isPos
                                            ? 'tick-flash-up'
                                            : 'tick-flash-down'
                                          : ''
                                      }`}
                                    >
                                      <td className="p-3.5">
                                        <div className="flex items-center gap-3">
                                          <SymbolBadge item={item} size="sm" />
                                          <div>
                                            <div className="font-bold text-sm font-headline text-[#181c21]">
                                              {item.symbol}
                                            </div>
                                            <div className="text-xs text-[#434656] font-mono-num">
                                              {item.name}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="p-3.5 text-right font-mono-num font-semibold text-sm text-[#181c21]">
                                        {item.price.toFixed(item.category === 'forex' ? 4 : 2)}
                                        {item.currency === '%' ? '%' : ''}
                                      </td>
                                      <td
                                        className={`p-3.5 text-right font-mono-num font-semibold text-sm ${
                                          isPos ? 'market-up' : 'market-down'
                                        }`}
                                      >
                                        {isPos
                                          ? `+${item.change.toFixed(item.category === 'forex' ? 4 : 2)}`
                                          : item.change.toFixed(item.category === 'forex' ? 4 : 2)}
                                      </td>
                                      <td
                                        className={`p-3.5 text-right font-mono-num font-semibold text-sm ${
                                          isPos ? 'market-up' : 'market-down'
                                        }`}
                                      >
                                        {isPos
                                          ? `+${item.changePercent.toFixed(2)}%`
                                          : `${item.changePercent.toFixed(2)}%`}
                                      </td>
                                      <td className="p-3.5 text-center hidden sm:table-cell align-middle">
                                        <Sparkline
                                          data={item.sparkline}
                                          isPositive={isPos}
                                          width={84}
                                          height={28}
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {worldIndices.map((item) => {
                              const isPos = item.change >= 0;
                              return (
                                <div
                                  key={item.id}
                                  onClick={() => setSelectedSymbol(item)}
                                  className="bg-[#f7f9ff] border border-[#c3c5d8] rounded-xl p-4 flex items-center justify-between hover:border-[#0049db] transition-all cursor-pointer"
                                >
                                  <div className="flex items-center gap-3">
                                    <SymbolBadge item={item} size="md" />
                                    <div>
                                      <div className="font-bold text-base text-[#181c21]">
                                        {item.symbol}
                                      </div>
                                      <div className="text-xs text-[#434656] font-mono-num">
                                        {item.name}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-mono-num font-bold text-sm text-[#181c21]">
                                      {item.price.toFixed(item.category === 'forex' ? 4 : 2)}
                                    </div>
                                    <div
                                      className={`text-xs font-mono-num font-semibold ${
                                        isPos ? 'market-up' : 'market-down'
                                      }`}
                                    >
                                      {isPos ? '+' : ''}
                                      {item.changePercent.toFixed(2)}%
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </section>
                    )}
                  </div>

                  {/* Right Sidebar Panel (Desktop Image 3) */}
                  <div className="hidden xl:block">
                    <MarketSummaryPanel
                      stats={MARKET_SUMMARY}
                      gainers={TOP_GAINERS}
                      losers={TOP_LOSERS}
                      onSelectMover={handleSelectSymbolByName}
                      onOpenNews={() => setActiveView('news')}
                    />
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Pro Right Slide-Out Toolbar & Dock (TradingView Pro Style) */}
      <RightProToolbar
        activeTool={activeRightTool}
        onSelectTool={(tool) => setActiveRightTool(tool)}
        watchlistSymbols={watchlist}
        allItems={marketItems}
        alerts={alerts}
        positions={positions}
        onSelectSymbol={(item) => setSelectedSymbol(item)}
        onRemoveWatchlist={handleToggleWatchlist}
        onExecuteTrade={handleExecuteTrade}
        onClosePosition={handleClosePosition}
        paperBalance={paperBalance}
      />

      {/* Mobile Bottom Navigation (Image 1) */}
      <BottomNav
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        unreadNewsCount={3}
      />

      {/* Symbol Detail Modal / Drawer */}
      <SymbolDetailModal
        item={selectedSymbol}
        onClose={() => setSelectedSymbol(null)}
        isWatchlisted={selectedSymbol ? watchlist.includes(selectedSymbol.symbol) : false}
        onToggleWatchlist={handleToggleWatchlist}
        onSetAlert={handleSetAlert}
        onQuickTrade={handleExecuteTrade}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        items={marketItems}
        onSelectSymbol={(item) => setSelectedSymbol(item)}
      />

      {/* Get Started / Pro Access Modal */}
      <GetStartedModal
        isOpen={isGetStartedOpen}
        onClose={() => setIsGetStartedOpen(false)}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-[#181c21] text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-[#434656] animate-bounce-subtle">
          <span className="material-symbols-outlined text-[#089981] text-[18px]">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
