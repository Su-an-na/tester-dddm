import React, { useState } from 'react';
import { ECONOMIC_CALENDAR_DATA } from '../data/mockMarkets';

export const EconomicCalendarView: React.FC = () => {
  const [filterImpact, setFilterImpact] = useState<string>('ALL');

  const filteredEvents = ECONOMIC_CALENDAR_DATA.filter((e) => {
    if (filterImpact === 'ALL') return true;
    return e.impact === filterImpact;
  });

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#ffffff] border border-[#c3c5d8] rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold font-headline text-[#181c21]">
              Global Economic Calendar
            </h1>
            <span className="text-[10px] font-mono-num font-bold bg-[#0049db] text-white px-2 py-0.5 rounded-full">
              LIVE MACRO
            </span>
          </div>
          <p className="text-xs text-[#434656] mt-1">
            Institutional volatility events, central bank rate decisions, and macroeconomic releases.
          </p>
        </div>

        {/* Impact Filter */}
        <div className="flex items-center gap-1.5 bg-[#f1f4fb] p-1 rounded-lg border border-[#c3c5d8] text-xs font-semibold">
          {['ALL', 'HIGH', 'MED'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterImpact(lvl)}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                filterImpact === lvl
                  ? 'bg-[#0049db] text-white shadow-xs'
                  : 'text-[#434656] hover:text-[#181c21]'
              }`}
            >
              {lvl === 'ALL' ? 'All Impacts' : `${lvl} Volatility`}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Table */}
      <div className="bg-[#ffffff] border border-[#c3c5d8] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto hide-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f7f9ff] border-b border-[#c3c5d8] text-[#434656] font-mono-num text-[11px] uppercase">
                <th className="p-4 font-semibold">Time / Country</th>
                <th className="p-4 font-semibold">Economic Event</th>
                <th className="p-4 font-semibold text-center">Impact</th>
                <th className="p-4 font-semibold text-right">Actual</th>
                <th className="p-4 font-semibold text-right">Forecast</th>
                <th className="p-4 font-semibold text-right">Previous</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c3c5d8]/70 text-xs">
              {filteredEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-[#f1f4fb] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{evt.flag}</span>
                      <div>
                        <div className="font-mono-num font-bold text-[#181c21]">{evt.time}</div>
                        <div className="text-[10px] text-[#737687]">{evt.country}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-sm font-headline text-[#181c21]">
                      {evt.event}
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-mono-num font-bold ${
                        evt.impact === 'HIGH'
                          ? 'bg-[#F23645]/15 text-[#F23645] border border-[#F23645]/30'
                          : 'bg-[#ff9800]/15 text-[#e65100] border border-[#ff9800]/30'
                      }`}
                    >
                      {evt.impact}
                    </span>
                  </td>

                  <td className="p-4 text-right font-mono-num font-bold text-sm text-[#181c21]">
                    {evt.actual ? (
                      <span className="text-[#089981] bg-[#089981]/10 px-2 py-0.5 rounded">
                        {evt.actual}
                      </span>
                    ) : (
                      <span className="text-[#737687]">Pending</span>
                    )}
                  </td>

                  <td className="p-4 text-right font-mono-num text-[#434656]">
                    {evt.forecast}
                  </td>

                  <td className="p-4 text-right font-mono-num text-[#737687]">
                    {evt.previous}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
