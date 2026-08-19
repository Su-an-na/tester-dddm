import React, { useState } from 'react';
import { MarketItem, PriceAlert } from '../types';
import { SymbolBadge } from './Badges';

interface ProfileViewProps {
  watchlistSymbols: string[];
  allItems: MarketItem[];
  alerts: PriceAlert[];
  onRemoveAlert: (id: string) => void;
  onRemoveWatchlist: (symbol: string) => void;
  onSelectSymbol: (item: MarketItem) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  watchlistSymbols,
  allItems,
  alerts,
  onRemoveAlert,
  onRemoveWatchlist,
  onSelectSymbol,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [paperBalance] = useState<number>(100000);
  const [liveStreamRate, setLiveStreamRate] = useState<number>(3);

  const watchlistedItems = allItems.filter((i) => watchlistSymbols.includes(i.symbol));

  return (
    <div className="space-y-6 select-none max-w-5xl">
      {/* User Header Profile Card */}
      <div className="bg-[#ffffff] border border-[#c3c5d8] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-xl shadow-md">
            PM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-headline text-[#181c21]">
                Trader Account
              </h2>
              <span className="text-[10px] font-mono-num font-bold bg-[#0049db] text-white px-2 py-0.5 rounded-full">
                PRO ACTIVE
              </span>
            </div>
            <p className="text-xs text-[#434656] mt-0.5">
              Precision Terminal ID: <span className="font-mono-num">#TV-88219-PRO</span>
            </p>
          </div>
        </div>

        {/* Paper Trading Balance */}
        <div className="bg-[#f7f9ff] border border-[#c3c5d8] rounded-xl p-3 sm:text-right">
          <span className="text-xs text-[#434656] block">Simulated Portfolio</span>
          <span className="text-xl font-bold font-mono-num text-[#089981]">
            ${paperBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Watchlist Section */}
      <div className="bg-[#ffffff] border border-[#c3c5d8] rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold font-headline text-[#181c21]">
              My Watchlist ({watchlistedItems.length})
            </h3>
            <p className="text-xs text-[#434656]">
              Pinned assets for quick monitoring and price alerts.
            </p>
          </div>
        </div>

        {watchlistedItems.length === 0 ? (
          <div className="text-center py-10 text-[#737687] text-sm bg-[#f7f9ff] rounded-xl border border-dashed border-[#c3c5d8]">
            <span className="material-symbols-outlined text-3xl mb-1 block text-[#c3c5d8]">
              star_border
            </span>
            No assets in your watchlist yet. Click the star icon on any symbol to pin it here.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {watchlistedItems.map((item) => {
              const isPos = item.change >= 0;
              return (
                <div
                  key={item.id}
                  className="bg-[#f7f9ff] border border-[#c3c5d8] rounded-xl p-3 flex items-center justify-between hover:border-[#0049db] transition-all group"
                >
                  <div
                    onClick={() => onSelectSymbol(item)}
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  >
                    <SymbolBadge item={item} size="sm" />
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-[#181c21] truncate group-hover:text-[#0049db]">
                        {item.symbol}
                      </div>
                      <div className="text-[11px] font-mono-num text-[#434656]">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono-num font-bold ${
                        isPos ? 'market-up' : 'market-down'
                      }`}
                    >
                      {isPos ? '+' : ''}
                      {item.changePercent.toFixed(1)}%
                    </span>
                    <button
                      onClick={() => onRemoveWatchlist(item.symbol)}
                      className="text-[#737687] hover:text-[#F23645] p-1 transition-colors cursor-pointer"
                      title="Remove from watchlist"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Alerts Section */}
      <div className="bg-[#ffffff] border border-[#c3c5d8] rounded-2xl p-6 shadow-xs">
        <h3 className="text-base font-bold font-headline text-[#181c21] mb-1">
          Active Price Alerts ({alerts.length})
        </h3>
        <p className="text-xs text-[#434656] mb-4">
          Instant alerts triggered when asset touches target threshold.
        </p>

        {alerts.length === 0 ? (
          <div className="text-center py-8 text-[#737687] text-sm bg-[#f7f9ff] rounded-xl border border-dashed border-[#c3c5d8]">
            <span className="material-symbols-outlined text-3xl mb-1 block text-[#c3c5d8]">
              notifications_none
            </span>
            No price alerts configured.
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between bg-[#f7f9ff] border border-[#c3c5d8] rounded-xl p-3.5"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#0049db] text-[20px]">
                    notifications_active
                  </span>
                  <div>
                    <span className="font-bold text-sm font-headline text-[#181c21]">
                      {alert.symbol}
                    </span>
                    <span className="text-xs text-[#434656] ml-2">
                      When price moves {alert.condition}{' '}
                      <strong className="font-mono-num">${alert.targetPrice.toFixed(2)}</strong>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveAlert(alert.id)}
                  className="text-xs font-semibold text-[#F23645] hover:underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Terminal Settings */}
      <div className="bg-[#ffffff] border border-[#c3c5d8] rounded-2xl p-6 shadow-xs">
        <h3 className="text-base font-bold font-headline text-[#181c21] mb-4">
          Terminal Preferences
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#f7f9ff] border border-[#c3c5d8] rounded-xl p-4">
            <label className="text-xs font-bold text-[#181c21] block mb-1">
              Base Display Currency
            </label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full bg-white border border-[#c3c5d8] rounded-lg p-2 text-xs font-mono-num text-[#181c21] focus:border-[#0049db] focus:outline-none"
            >
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="JPY">JPY (¥) - Japanese Yen</option>
            </select>
          </div>

          <div className="bg-[#f7f9ff] border border-[#c3c5d8] rounded-xl p-4">
            <label className="text-xs font-bold text-[#181c21] block mb-1">
              Live Stream Tick Speed
            </label>
            <select
              value={liveStreamRate}
              onChange={(e) => setLiveStreamRate(Number(e.target.value))}
              className="w-full bg-white border border-[#c3c5d8] rounded-lg p-2 text-xs font-mono-num text-[#181c21] focus:border-[#0049db] focus:outline-none"
            >
              <option value={2}>Fast (Every 2 seconds)</option>
              <option value={3}>Standard (Every 3 seconds)</option>
              <option value={5}>Relaxed (Every 5 seconds)</option>
              <option value={0}>Paused (Manual refresh)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
