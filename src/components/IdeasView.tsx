import React, { useState } from 'react';
import { TradeIdea } from '../types';

interface IdeasViewProps {
  ideas: TradeIdea[];
  onSelectSymbol: (symbol: string) => void;
}

export const IdeasView: React.FC<IdeasViewProps> = ({ ideas, onSelectSymbol }) => {
  const [likedIdeas, setLikedIdeas] = useState<Set<string>>(new Set());

  const handleToggleLike = (id: string) => {
    const next = new Set(likedIdeas);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setLikedIdeas(next);
  };

  return (
    <div className="space-y-6 select-none">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-headline text-[#181c21]">
          Trading Ideas & Technical Setups
        </h1>
        <p className="text-sm text-[#434656] mt-1">
          Community insights, price action forecasts, and charting strategies from top traders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ideas.map((idea) => {
          const isLiked = likedIdeas.has(idea.id);
          const likeCount = idea.likes + (isLiked ? 1 : 0);

          return (
            <div
              key={idea.id}
              className="bg-[#ffffff] border border-[#c3c5d8] rounded-xl p-5 hover:border-[#0049db] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Author & Timestamp */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={idea.authorAvatar}
                      alt={idea.author}
                      className="w-8 h-8 rounded-full object-cover border border-[#c3c5d8]"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#181c21]">
                        {idea.author}
                      </div>
                      <div className="text-[10px] text-[#737687] font-mono-num">
                        {idea.timeAgo} • {idea.timeframe}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectSymbol(idea.symbol)}
                      className="font-mono-num text-xs font-bold bg-[#dfe2e9] text-[#181c21] px-2.5 py-1 rounded-md hover:bg-[#0049db] hover:text-white transition-colors cursor-pointer"
                    >
                      {idea.symbol}
                    </button>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        idea.bias === 'Long'
                          ? 'bg-[#089981]/15 text-[#089981]'
                          : idea.bias === 'Short'
                          ? 'bg-[#F23645]/15 text-[#F23645]'
                          : 'bg-[#5a5e6b]/15 text-[#5a5e6b]'
                      }`}
                    >
                      {idea.bias}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-base text-[#181c21] mb-2 leading-snug">
                  {idea.title}
                </h3>

                {/* Chart Mock preview box */}
                <div className="bg-[#f7f9ff] border border-[#c3c5d8] rounded-lg p-3 my-3 text-xs text-[#434656] font-mono-num flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0049db] text-[20px]">
                    ssid_chart
                  </span>
                  <span>{idea.chartDescription}</span>
                </div>

                {/* Summary */}
                <p className="text-xs text-[#434656] leading-relaxed mb-3">
                  {idea.summary}
                </p>

                {/* Tags */}
                <div className="flex gap-1.5 flex-wrap mb-4">
                  {idea.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono-num bg-[#f1f4fb] text-[#434656] px-2 py-0.5 rounded border border-[#c3c5d8]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Likes & Comments Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#c3c5d8]/70 text-xs text-[#434656]">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleToggleLike(idea.id)}
                    className={`flex items-center gap-1 font-mono-num text-xs transition-colors cursor-pointer ${
                      isLiked ? 'text-[#F23645] font-bold' : 'hover:text-[#F23645]'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      favorite
                    </span>
                    <span>{likeCount}</span>
                  </button>

                  <span className="flex items-center gap-1 font-mono-num text-xs">
                    <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                    <span>{idea.comments}</span>
                  </span>
                </div>

                <button
                  onClick={() => onSelectSymbol(idea.symbol)}
                  className="text-xs font-bold text-[#0049db] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Analyze Symbol</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
