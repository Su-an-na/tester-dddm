import React, { useEffect, useRef, useState } from 'react';
import { MarketItem } from '../types';
import { SymbolBadge } from './Badges';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MarketItem[];
  onSelectSymbol: (item: MarketItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  items,
  onSelectSymbol,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredItems = items.filter((item) => {
    const matchesType = filterType === 'all' || item.category === filterType;
    const q = query.toLowerCase().trim();
    if (!q) return matchesType;
    return (
      matchesType &&
      (item.symbol.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        (item.subName && item.subName.toLowerCase().includes(q)) ||
        (item.sector && item.sector.toLowerCase().includes(q)))
    );
  });

  return (
    <div
      id="search-modal-overlay"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/60 backdrop-blur-sm select-none animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="search-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#ffffff] border border-[#c3c5d8] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#c3c5d8] flex items-center gap-3 bg-[#f7f9ff]">
          <span className="material-symbols-outlined text-[#0049db] text-[24px]">search</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search symbols, indices, stocks, crypto, forex..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[#181c21] placeholder-[#434656] text-base font-medium focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#737687] hover:text-[#181c21] p-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">clear</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-mono-num text-[#737687] px-2 py-1 bg-[#dfe2e9] rounded border border-[#c3c5d8] cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2.5 border-b border-[#c3c5d8] flex gap-2 overflow-x-auto hide-scrollbar bg-white">
          {[
            { id: 'all', label: 'All Assets' },
            { id: 'indices', label: 'Indices & Stocks' },
            { id: 'futures', label: 'Futures' },
            { id: 'forex', label: 'Forex' },
            { id: 'bonds', label: 'Bonds' },
            { id: 'crypto', label: 'Crypto' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-[#0049db] text-white shadow-xs'
                  : 'bg-[#f1f4fb] text-[#434656] hover:bg-[#dfe2e9]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto flex-1 p-2 divide-y divide-[#c3c5d8]/40">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#737687]">
              No instruments found for "{query}".
            </div>
          ) : (
            filteredItems.map((item) => {
              const isPos = item.change >= 0;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectSymbol(item);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f1f4fb] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <SymbolBadge item={item} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm font-headline text-[#181c21] group-hover:text-[#0049db] transition-colors">
                          {item.symbol}
                        </span>
                        <span className="text-[10px] font-mono-num px-1.5 py-0.2 rounded bg-[#dfe2e9] text-[#434656]">
                          {item.category.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-[#434656] font-mono-num">
                        {item.name} {item.subName ? `• ${item.subName}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono-num font-bold text-sm text-[#181c21]">
                      ${item.price.toFixed(2)}
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
            })
          )}
        </div>
      </div>
    </div>
  );
};
