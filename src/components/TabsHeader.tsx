import React from 'react';
import { DisplayMode, TabCategory } from '../types';

interface TabsHeaderProps {
  activeTab: TabCategory;
  onTabChange: (tab: TabCategory) => void;
  displayMode: DisplayMode;
  onDisplayModeChange: (mode: DisplayMode) => void;
}

export const TabsHeader: React.FC<TabsHeaderProps> = ({
  activeTab,
  onTabChange,
  displayMode,
  onDisplayModeChange,
}) => {
  const tabs: { id: TabCategory; label: string }[] = [
    { id: 'indices', label: 'Indices' },
    { id: 'futures', label: 'Futures' },
    { id: 'forex', label: 'Forex' },
    { id: 'bonds', label: 'Government bonds' },
    { id: 'crypto', label: 'Crypto' },
  ];

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
      {/* Mobile Pill-container / Desktop Underline-tabs */}
      <div className="relative overflow-x-auto hide-scrollbar w-full sm:w-auto">
        {/* Desktop Tabs (Underline style) */}
        <div className="hidden md:flex gap-2 border-b border-[#c3c5d8] w-full">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`desktop-tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`px-6 py-3 border-b-2 font-semibold text-[15px] whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#0049db] text-[#0049db]'
                    : 'border-transparent text-[#434656] hover:text-[#181c21]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Mobile Tabs (Pill style container matching Screenshot 1) */}
        <div className="md:hidden flex gap-2 border border-[#c3c5d8] rounded-full p-1 w-max min-w-full bg-[#f1f4fb]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`mobile-tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#ffffff] shadow-xs border border-[#c3c5d8] text-[#181c21]'
                    : 'text-[#434656] hover:bg-[#dfe2e9]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* View Switcher (Table vs Cards) */}
      <div className="hidden sm:flex items-center gap-1 bg-[#ffffff] p-1 rounded-lg border border-[#c3c5d8] shadow-2xs self-end">
        <button
          id="view-mode-table-btn"
          onClick={() => onDisplayModeChange('table')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
            displayMode === 'table'
              ? 'bg-[#0049db] text-white shadow-xs'
              : 'text-[#434656] hover:text-[#181c21] hover:bg-[#f1f4fb]'
          }`}
          title="Table View (Image 3)"
        >
          <span className="material-symbols-outlined text-[16px]">table_rows</span>
          <span>Table</span>
        </button>
        <button
          id="view-mode-cards-btn"
          onClick={() => onDisplayModeChange('cards')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
            displayMode === 'cards'
              ? 'bg-[#0049db] text-white shadow-xs'
              : 'text-[#434656] hover:text-[#181c21] hover:bg-[#f1f4fb]'
          }`}
          title="Cards View (Image 1)"
        >
          <span className="material-symbols-outlined text-[16px]">grid_view</span>
          <span>Cards</span>
        </button>
      </div>
    </div>
  );
};
