import React from 'react';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenGetStarted: () => void;
  onToggleMobileMenu?: () => void;
  searchQuery?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenGetStarted,
  onToggleMobileMenu,
}) => {
  return (
    <header className="bg-[#ffffff] border-b border-[#c3c5d8] sticky top-0 z-30 select-none">
      <div className="flex items-center justify-between px-4 md:px-8 h-16 w-full max-w-[1440px] mx-auto gap-4">
        {/* Mobile Header (Menu + Logo) */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            id="mobile-menu-btn"
            onClick={onToggleMobileMenu}
            className="text-[#0049db] hover:bg-[#dfe2e9] transition-colors rounded-full p-2 active:scale-95 flex items-center justify-center cursor-pointer"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <BrandLogo size="md" />
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl">
          <div
            id="desktop-search-trigger"
            onClick={onOpenSearch}
            className="relative w-full group cursor-pointer"
          >
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#434656] text-[20px] group-hover:text-[#0049db] transition-colors">
              search
            </span>
            <input
              readOnly
              className="w-full bg-[#f7f9ff] border border-[#c3c5d8] rounded-full py-2 pl-11 pr-14 text-sm text-[#181c21] placeholder-[#434656] group-hover:border-[#0049db] group-hover:shadow-xs focus:ring-2 focus:ring-[#0049db] focus:outline-none transition-all cursor-pointer"
              placeholder="Search markets, news, symbols..."
              type="text"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="hidden lg:inline-block px-2 py-0.5 text-[10px] font-mono-num font-semibold text-[#737687] bg-[#dfe2e9] border border-[#c3c5d8] rounded shadow-2xs">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Mobile Search Button & Quick CTAs */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            id="mobile-search-btn"
            onClick={onOpenSearch}
            className="md:hidden text-[#434656] hover:text-[#0049db] hover:bg-[#dfe2e9] transition-colors rounded-full p-2 cursor-pointer flex items-center justify-center"
            aria-label="Search"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          {/* Quick Notification / Feed Status */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-[#434656] font-mono-num bg-[#f1f4fb] px-3 py-1.5 rounded-full border border-[#c3c5d8]">
            <span className="w-2 h-2 rounded-full bg-[#089981]"></span>
            <span>DATA FEED ACTIVE</span>
          </div>

          {/* Mobile Get Started gradient pill */}
          <button
            id="mobile-get-started-btn"
            onClick={onOpenGetStarted}
            className="gradient-bg text-white px-3.5 py-1.5 rounded-lg text-xs font-bold md:hidden shadow-xs cursor-pointer"
          >
            Get started
          </button>
        </div>
      </div>
    </header>
  );
};
