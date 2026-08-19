import React, { useState } from 'react';
import { MarketNewsItem } from '../types';

interface NewsViewProps {
  newsList: MarketNewsItem[];
  onSelectSymbol: (symbolName: string) => void;
}

export const NewsView: React.FC<NewsViewProps> = ({ newsList, onSelectSymbol }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const categories = ['All', 'Markets', 'Technology', 'Economy', 'Commodities', 'Forex'];

  const filteredNews = newsList.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          item.summary.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-headline text-[#181c21]">
            Financial News & Analysis
          </h1>
          <p className="text-sm text-[#434656] mt-1">
            Real-time market intelligence, macro updates, and global economic reporting.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737687] text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Filter news..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-white border border-[#c3c5d8] rounded-full py-1.5 pl-9 pr-4 text-xs text-[#181c21] focus:border-[#0049db] focus:ring-1 focus:ring-[#0049db] focus:outline-none"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#0049db] text-white shadow-xs'
                : 'bg-[#ffffff] text-[#434656] border border-[#c3c5d8] hover:border-[#0049db]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Feed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.map((news) => (
          <article
            key={news.id}
            className="bg-[#ffffff] border border-[#c3c5d8] rounded-xl p-5 hover:border-[#0049db] hover:shadow-[0px_4px_16px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between"
          >
            <div>
              {/* Meta Header */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono-num font-semibold text-[#0049db]">
                  {news.source} • {news.timeAgo}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono-num uppercase font-semibold ${
                    news.sentiment === 'bullish'
                      ? 'bg-[#089981]/10 text-[#089981]'
                      : news.sentiment === 'bearish'
                      ? 'bg-[#F23645]/10 text-[#F23645]'
                      : 'bg-[#5a5e6b]/10 text-[#5a5e6b]'
                  }`}
                >
                  {news.sentiment}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-base font-headline text-[#181c21] mb-2 leading-snug">
                {news.title}
              </h3>

              {/* Summary */}
              <p className="text-xs text-[#434656] leading-relaxed mb-4">
                {news.summary}
              </p>
            </div>

            {/* Footer tags */}
            <div className="flex items-center justify-between pt-3 border-t border-[#c3c5d8]/60 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                {news.relatedSymbols.map((sym) => (
                  <button
                    key={sym}
                    onClick={() => onSelectSymbol(sym)}
                    className="font-mono-num text-[11px] font-bold bg-[#f1f4fb] hover:bg-[#dfe2e9] text-[#181c21] px-2 py-0.5 rounded border border-[#c3c5d8] transition-colors cursor-pointer"
                  >
                    ${sym}
                  </button>
                ))}
              </div>
              <span className="text-[#737687] text-[11px] font-mono-num">
                {news.readTime}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
