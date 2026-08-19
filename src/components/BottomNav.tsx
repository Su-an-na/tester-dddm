import React from 'react';
import { MainView } from '../types';

interface BottomNavProps {
  activeView: MainView;
  onViewChange: (view: MainView) => void;
  unreadNewsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeView,
  onViewChange,
  unreadNewsCount = 3,
}) => {
  const tabs: { id: MainView; label: string; icon: string; badge?: number }[] = [
    { id: 'markets', label: 'Markets', icon: 'analytics' },
    { id: 'news', label: 'News', icon: 'article', badge: unreadNewsCount },
    { id: 'ideas', label: 'Ideas', icon: 'lightbulb' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="bg-[#f7f9ff] border-t border-[#c3c5d8] fixed bottom-0 left-0 right-0 w-full z-50 flex justify-around items-center h-16 px-2 pb-safe md:hidden shadow-lg select-none backdrop-blur-md bg-opacity-95"
    >
      {tabs.map((tab) => {
        const isActive = activeView === tab.id;
        return (
          <button
            key={tab.id}
            id={`bottom-nav-${tab.id}`}
            onClick={() => onViewChange(tab.id)}
            className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-150 ${
              isActive
                ? 'text-[#0049db] font-bold scale-105'
                : 'text-[#434656] hover:text-[#0049db]'
            }`}
          >
            <div className="relative">
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              {tab.badge && tab.badge > 0 && !isActive && (
                <span className="absolute -top-1 -right-2 w-2 h-2 bg-[#0049db] rounded-full"></span>
              )}
            </div>
            <span className="text-[11px] font-mono-num mt-0.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
