import React, { useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import { cashflowPresets } from '../data/cashflowData';

export default function CashflowWidget() {
  const [activePeriod, setActivePeriod] = useState('weekly');
  const periods = ['weekly', 'monthly', 'yearly'];

  const currentData = cashflowPresets[activePeriod];

  const cyclePeriod = () => {
    const currentIndex = periods.indexOf(activePeriod);
    const nextIndex = (currentIndex + 1) % periods.length;
    setActivePeriod(periods[nextIndex]);
  };

  return (
    <div
      id="cashflowCard"
      className="w-full max-w-[340px] bg-crispWhite rounded-[26px] p-6 shadow-2xl text-obsidian border border-slate-100/90 transition-all duration-300 hover:shadow-saharaGold/10 hover:shadow-2xl hover:-translate-y-1"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-lg tracking-tight text-obsidian">Cashflow</span>
          <span className="pulse-badge bg-obsidian text-saharaGold text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-all duration-300">
            {currentData.badge}
          </span>
        </div>
        <button
          onClick={cyclePeriod}
          className="text-slateGray hover:text-obsidian transition-colors p-1.5 rounded-lg hover:bg-slate-100 active:rotate-45 transition-transform"
          title="Switch view"
          aria-label="Cycle period"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Period Tabs */}
      <div className="flex items-center gap-4 mt-3 text-[11px] font-semibold border-b border-slate-100 pb-2">
        {periods.map((period) => (
          <button
            key={period}
            onClick={() => setActivePeriod(period)}
            className={`pb-1 transition-all capitalize relative ${
              activePeriod === period
                ? 'text-obsidian font-bold'
                : 'text-slateGray hover:text-obsidian'
            }`}
          >
            {period}
            {activePeriod === period && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-obsidian rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 4-Column Animated Stacked Bar Chart */}
      <div className="grid grid-cols-4 gap-2.5 h-32 items-end pt-5 pb-3">
        {/* Col 1 */}
        <div className="flex flex-col gap-1 w-full justify-end h-full group/col">
          <div
            className="w-full rounded-[4px] bg-slateGray/35 transition-all duration-500 ease-out group-hover/col:bg-slateGray/50"
            style={{ height: currentData.heights[0] }}
          />
          <div
            className="w-full rounded-[4px] bg-obsidian transition-all duration-500 ease-out"
            style={{ height: currentData.heights[1] }}
          />
          <div
            className="w-full rounded-[4px] bg-saharaGold transition-all duration-500 ease-out"
            style={{ height: currentData.heights[2] }}
          />
        </div>

        {/* Col 2 */}
        <div className="flex flex-col gap-1 w-full justify-end h-full group/col">
          <div
            className="w-full rounded-[4px] bg-slateGray/35 transition-all duration-500 ease-out group-hover/col:bg-slateGray/50"
            style={{ height: currentData.heights[3] }}
          />
          <div
            className="w-full rounded-[4px] bg-slateCard transition-all duration-500 ease-out"
            style={{ height: currentData.heights[4] }}
          />
          <div
            className="w-full rounded-[4px] bg-saharaGold/70 transition-all duration-500 ease-out"
            style={{ height: currentData.heights[5] }}
          />
        </div>

        {/* Col 3 */}
        <div className="flex flex-col gap-1 w-full justify-end h-full group/col">
          <div
            className="w-full rounded-[4px] bg-slateGray/35 transition-all duration-500 ease-out group-hover/col:bg-slateGray/50"
            style={{ height: currentData.heights[6] }}
          />
          <div
            className="w-full rounded-[4px] bg-obsidian transition-all duration-500 ease-out"
            style={{ height: currentData.heights[7] }}
          />
          <div
            className="w-full rounded-[4px] bg-saharaGold transition-all duration-500 ease-out"
            style={{ height: currentData.heights[8] }}
          />
        </div>

        {/* Col 4 */}
        <div className="flex flex-col gap-1 w-full justify-end h-full group/col">
          <div
            className="w-full rounded-[4px] bg-slateGray/35 transition-all duration-500 ease-out group-hover/col:bg-slateGray/50"
            style={{ height: currentData.heights[9] }}
          />
          <div
            className="w-full rounded-[4px] bg-obsidian transition-all duration-500 ease-out"
            style={{ height: currentData.heights[10] }}
          />
          <div
            className="w-full rounded-[4px] bg-saharaGold/80 transition-all duration-500 ease-out"
            style={{ height: currentData.heights[11] }}
          />
        </div>
      </div>

      {/* Footer Timestamp */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slateGray font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-saharaGold shrink-0 animate-ping" />
        <span className="w-1.5 h-1.5 rounded-full bg-saharaGold shrink-0 -ml-3" />
        <span>{currentData.time}</span>
      </div>
    </div>
  );
}
