import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DailyEntry } from '../types';
import { formatFriendlyDate, formatFullDate, summarizeEntry } from '../utils/cycle';
import { cycleHistoryCadence } from '../data/seedData';

interface HistoryScreenProps {
  entries: DailyEntry[];
  onBackToHome: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  entries,
  onBackToHome,
}) => {
  // Calendar month state: November 2026 (10 index in JS Date) or October 2026 (9 index)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(10); // 10 = Nov
  const [selectedEntry, setSelectedEntry] = useState<DailyEntry | null>(null);

  // Month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthName = new Date(currentYear, currentMonth, 1).toLocaleDateString(
    'en-US',
    { month: 'long', year: 'numeric' }
  );

  // Days in month calculation
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Map entries for quick lookup by date string: YYYY-MM-DD
  const entriesByDate = new Map<string, DailyEntry>();
  entries.forEach((entry) => {
    entriesByDate.set(entry.date, entry);
  });

  // Sort entries descending by date
  const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-5 pt-4 pb-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <button
          onClick={onBackToHome}
          className="text-xs text-[#7A5862] hover:text-[#4A2B33] min-h-[44px] px-2 flex items-center"
        >
          ← Back to today
        </button>
        <span className="font-serif text-lg text-[#4A2B33] font-medium">
          Cycle History
        </span>
        <div className="w-10"></div>
      </div>

      {/* 1. Simple Month Calendar */}
      <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[20px] p-4.5 mb-5 shadow-[0_3px_16px_rgba(74,43,51,0.03)]">
        {/* Month selector */}
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="font-serif text-lg font-normal text-[#4A2B33]">
            {monthName}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              aria-label="Previous month"
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#EADBCE]/50 text-[#7A5862] transition-colors"
            >
              ‹
            </button>
            <button
              onClick={nextMonth}
              aria-label="Next month"
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#EADBCE]/50 text-[#7A5862] transition-colors"
            >
              ›
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 text-center text-[11px] font-medium text-[#7A5862] mb-2">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-y-1.5 text-center">
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-9" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
              2,
              '0'
            )}-${String(dayNum).padStart(2, '0')}`;
            const entry = entriesByDate.get(dateStr);
            const isToday = dateStr === '2026-11-07';
            const hasPeriod =
              entry && entry.flow && entry.flow !== 'none';
            const hasPain = entry && entry.pain >= 2;

            return (
              <button
                key={dateStr}
                onClick={() => {
                  if (entry) setSelectedEntry(entry);
                }}
                disabled={!entry}
                className={`h-9 flex flex-col items-center justify-center rounded-full relative transition-all ${
                  isToday
                    ? 'ring-1 ring-[#C99A86] bg-[#FAF6F0]'
                    : ''
                } ${entry ? 'cursor-pointer hover:bg-[#EADBCE]/40' : 'cursor-default'}`}
              >
                <span
                  className={`text-xs ${
                    entry ? 'text-[#4A2B33] font-medium' : 'text-[#A48F95]'
                  }`}
                >
                  {dayNum}
                </span>

                {/* Dots indicator for period flow & pain */}
                <div className="flex items-center gap-0.5 h-1.5 mt-0.5">
                  {hasPeriod && (
                    <span
                      className={`rounded-full bg-[#4A2B33] ${
                        entry?.flow === 'heavy' ? 'w-1.5 h-1.5' : 'w-1 h-1'
                      }`}
                      title={entry?.flow}
                    />
                  )}
                  {hasPain && (
                    <span
                      className="w-1 h-1 rounded-full bg-[#C99A86]"
                      title="Pain felt"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-[#EADBCE]/60 flex items-center justify-center gap-4 text-[11px] text-[#7A5862]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4A2B33]"></span>
            <span>Period flow</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C99A86]"></span>
            <span>Pain felt</span>
          </div>
        </div>
      </div>

      {/* 2. One Emotion-Free Chart Max (Recent cycle rhythm) */}
      <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[20px] p-4.5 mb-5 shadow-[0_2px_12px_rgba(74,43,51,0.03)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#7A5862]">
            Cycle cadence rhythm
          </span>
          <span className="text-xs text-[#5B6D55] font-medium">
            28 days avg
          </span>
        </div>

        <p className="text-xs text-[#7A5862] mb-3">
          Quiet monthly duration over your last 5 cycles
        </p>

        {/* Calm, emotion-free minimal cadence bars */}
        <div className="flex items-end justify-between gap-3 h-20 pt-2 pb-1 px-2">
          {cycleHistoryCadence.map((rec, i) => {
            // 28 days normalized height around 60-70%
            const heightPercent = Math.min(100, Math.max(30, (rec.days / 32) * 100));
            const isRecent = i === cycleHistoryCadence.length - 1;
            return (
              <div
                key={rec.month}
                className="flex-1 flex flex-col items-center h-full justify-end"
              >
                <span className="text-[10px] text-[#7A5862] font-mono tabular-nums mb-1">
                  {rec.days}d
                </span>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[28px] rounded-t-[8px] transition-all ${
                    isRecent ? 'bg-[#C99A86]' : 'bg-[#E0D3C7]'
                  }`}
                />
                <span className="text-[11px] text-[#7A5862] mt-1.5">
                  {rec.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Reversed List of Past Entries */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between mb-1 px-1">
          <span className="text-xs font-medium text-[#7A5862]">
            Past recorded entries
          </span>
          <span className="text-[11px] text-[#7A5862]">
            {sortedEntries.length} logged days
          </span>
        </div>

        {sortedEntries.map((entry) => (
          <button
            key={entry.id}
            onClick={() => setSelectedEntry(entry)}
            className="w-full text-left bg-[#FAF6F0] border border-[#EADBCE] rounded-[16px] p-3.5 hover:border-[#C99A86] transition-all shadow-[0_1px_4px_rgba(74,43,51,0.02)] active:scale-[0.99]"
          >
            <div className="flex items-baseline justify-between mb-1">
              <span className="font-serif text-sm font-medium text-[#4A2B33]">
                {formatFriendlyDate(entry.date)}
              </span>
              <span className="text-[11px] text-[#7A5862]">
                Day {entry.cycleDay}
              </span>
            </div>
            <p className="text-xs text-[#7A5862] line-clamp-1">
              {summarizeEntry(entry)}
            </p>
          </button>
        ))}
      </div>

      {/* Full Log Detail Modal / Sheet */}
      <AnimatePresence>
        {selectedEntry && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="w-full max-w-sm bg-[#FAF6F0] border border-[#EADBCE] rounded-[24px] p-5 shadow-xl text-[#4A2B33]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EADBCE]/70 mb-4">
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#4A2B33]">
                    {formatFullDate(selectedEntry.date)}
                  </h3>
                  <span className="text-xs text-[#7A5862]">
                    Cycle Day {selectedEntry.cycleDay}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="w-8 h-8 rounded-full bg-[#EADBCE]/50 flex items-center justify-center text-sm text-[#7A5862] hover:text-[#4A2B33]"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-[#EADBCE]/40">
                  <span className="text-[#7A5862]">Flow level</span>
                  <span className="font-medium text-[#4A2B33] capitalize">
                    {selectedEntry.flow} flow
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#EADBCE]/40">
                  <span className="text-[#7A5862]">Pain intensity</span>
                  <span className="font-medium text-[#4A2B33]">
                    {selectedEntry.pain} / 5
                  </span>
                </div>

                {selectedEntry.symptoms.length > 0 && (
                  <div className="py-1 border-b border-[#EADBCE]/40">
                    <span className="text-[#7A5862] block mb-1.5">
                      Symptoms noted
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedEntry.symptoms.map((s) => (
                        <span
                          key={s}
                          className="bg-[#F7F3EC] border border-[#EADBCE] px-2.5 py-1 rounded-full text-[11px] text-[#4A2B33]"
                        >
                          {s.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEntry.mood && (
                  <div className="flex items-center justify-between py-1 border-b border-[#EADBCE]/40">
                    <span className="text-[#7A5862]">Emotional climate</span>
                    <span className="font-medium text-[#4A2B33] capitalize">
                      {selectedEntry.mood}
                    </span>
                  </div>
                )}

                {selectedEntry.note && (
                  <div className="py-1">
                    <span className="text-[#7A5862] block mb-1">
                      Personal note
                    </span>
                    <p className="p-3 bg-[#F7F3EC] rounded-[14px] border border-[#EADBCE] text-xs leading-relaxed text-[#4A2B33] italic">
                      &ldquo;{selectedEntry.note}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedEntry(null)}
                className="w-full mt-5 py-3 rounded-[16px] bg-[#4A2B33] text-[#F7F3EC] text-xs font-medium hover:bg-[#3B2229]"
              >
                Close entry
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
