import React from 'react';
import { MainView } from '../types';
import { BrandLogo } from './BrandLogo';

interface SidebarProps {
  activeView: MainView;
  onViewChange: (view: MainView) => void;
  onOpenGetStarted: () => void;
  unreadNewsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  onOpenGetStarted,
  unreadNewsCount = 3,
}) => {
  const navItems: { id: MainView; label: string; icon: string; badge?: number }[] = [
    { id: 'markets', label: 'Markets', icon: 'analytics' },
    { id: 'heatmap', label: 'Heatmap', icon: 'grid_view' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar_month' },
    { id: 'news', label: 'News', icon: 'article', badge: unreadNewsCount },
    { id: 'ideas', label: 'Ideas', icon: 'lightbulb' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#ffffff] border-r border-[#c3c5d8] h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-[#c3c5d8]">
        <BrandLogo size="md" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 flex flex-col gap-1.5 px-3">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              onClick={() => onViewChange(item.id)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-all duration-150 text-left font-medium ${
                isActive
                  ? 'bg-[#dfe2e9] text-[#0049db] font-bold shadow-xs'
                  : 'text-[#434656] hover:bg-[#f1f4fb] hover:text-[#181c21]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 && (
                <span className="text-[11px] font-mono-num font-semibold bg-[#2962FF]/10 text-[#0049db] px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Market Live Status indicator */}
      <div className="px-4 py-3 border-t border-[#c3c5d8]/60 bg-[#f7f9ff]/50">
        <div className="flex items-center justify-between text-xs text-[#434656] mb-1">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>
            NYSE / NASDAQ
          </span>
          <span className="font-mono-num text-[11px] text-[#089981] font-semibold">OPEN</span>
        </div>
        <div className="text-[11px] text-[#737687]">
          Live stream updates: <span className="font-mono-num text-[#181c21] font-medium">3s tick</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-[#c3c5d8]">
        <button
          id="sidebar-get-started-btn"
          onClick={onOpenGetStarted}
          className="gradient-bg w-full text-white px-4 py-2.5 rounded-lg font-bold text-sm tracking-wide shadow-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
        >
          Get started
        </button>
      </div>
    </aside>
  );
};
