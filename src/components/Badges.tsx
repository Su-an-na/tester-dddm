import React from 'react';
import { MarketItem } from '../types';

interface SymbolBadgeProps {
  item: MarketItem;
  size?: 'sm' | 'md' | 'lg';
}

export const SymbolBadge: React.FC<SymbolBadgeProps> = ({ item, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'w-7 h-7 text-[10px]' : size === 'lg' ? 'w-10 h-10 text-xs' : 'w-8 h-8 text-[11px]';

  if (item.iconType === 'nvidia') {
    return (
      <div
        className={`${sizeClasses} rounded-full bg-[#76B900] flex items-center justify-center text-white overflow-hidden shadow-sm flex-shrink-0`}
      >
        <svg fill="none" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 18.2C8.58 18.2 5.8 15.42 5.8 12C5.8 8.58 8.58 5.8 12 5.8C15.42 5.8 18.2 8.58 18.2 12C18.2 15.42 15.42 18.2 12 18.2Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    );
  }

  if (item.iconType === 'apple') {
    return (
      <div
        className={`${sizeClasses} rounded-full bg-black flex items-center justify-center text-white overflow-hidden shadow-sm flex-shrink-0`}
      >
        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          file_download
        </span>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: item.badgeBg || '#2962FF', color: item.badgeColor || '#ffffff' }}
      className={`${sizeClasses} rounded-full flex items-center justify-center font-mono-num font-medium flex-shrink-0 shadow-xs`}
    >
      {item.badgeNumber || item.symbol.slice(0, 3)}
    </div>
  );
};

export const USFlagBadge: React.FC<{ size?: string }> = ({ size = 'w-8 h-8' }) => {
  return (
    <div className={`${size} rounded-full overflow-hidden bg-[#dfe2e9] flex items-center justify-center border border-[#c3c5d8] shadow-xs flex-shrink-0`}>
      <div className="w-full h-full flex flex-col">
        <div className="h-1/2 flex w-full">
          <div className="w-1/2 bg-[#002868] h-full flex items-center justify-center">
            <span className="text-white text-[8px] leading-none select-none">*</span>
          </div>
          <div className="w-1/2 flex flex-col">
            <div className="h-1/3 bg-[#BF0A30]"></div>
            <div className="h-1/3 bg-white"></div>
            <div className="h-1/3 bg-[#BF0A30]"></div>
          </div>
        </div>
        <div className="h-1/2 flex flex-col w-full">
          <div className="h-1/3 bg-white"></div>
          <div className="h-1/3 bg-[#BF0A30]"></div>
          <div className="h-1/3 bg-white"></div>
        </div>
      </div>
    </div>
  );
};
