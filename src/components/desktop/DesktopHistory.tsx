import React, { useState } from 'react';
import { DailyEntry } from '../../types';
import { formatFriendlyDate, formatFullDate, summarizeEntry, getTodayIso } from '../../utils/cycle';
import { cycleHistoryCadence } from '../../data/seedData';

interface DesktopHistoryProps {
  entries: DailyEntry[];
  onBackToToday: () => void;
}

export const DesktopHistory: React.FC<DesktopHistoryProps> = ({
  entries,
  onBackToToday,
}) => {
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(10); // 10 = Nov
  // Default selected entry to the latest entry (Nov 7)
  const [selectedEntry, setSelectedEntry] = useState<DailyEntry | null>(
    entries[0] || null
  );

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

  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const entriesByDate = new Map<string, DailyEntry>();
  entries.forEach((entry) => {
    entriesByDate.set(entry.date, entry);
  });

  const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#EADBCE]">
        <div>
          <button
            onClick={onBackToToday}
            className="text-xs text-[#7A5862] hover:text-[#4A2B33] mb-1 flex items-center gap-1 transition-colors"
          >
            ← Back to today
          </button>
          <h1 className="font-serif text-3xl text-[#4A2B33] font-normal">
            Cycle History &amp; Rhythm
          </h1>
          <p className="text-xs text-[#7A5862] mt-0.5">
            A quiet record of your natural flow and comfort across seasons
          </p>
        </div>

        <div className="text-xs text-[#5B6D55] bg-[#EEF3ED] border border-[#D7E3D4] px-3.5 py-1.5 rounded-full font-medium">
          28-day steady cadence
        </div>
      </div>

      {/* 2-Column Desktop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Month Calendar & Cadence Chart (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Simple Month Calendar */}
          <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[22px] p-6 shadow-[0_2px_14px_rgba(74,43,51,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-normal text-[#4A2B33]">
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

            {/* Weekdays */}
            <div className="grid grid-cols-7 text-center text-xs font-medium text-[#7A5862] mb-3">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-y-2 text-center">
              {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-10" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
                  2,
                  '0'
                )}-${String(dayNum).padStart(2, '0')}`;
                const entry = entriesByDate.get(dateStr);
                const isSelected = selectedEntry?.date === dateStr;
                const isToday = dateStr === getTodayIso();
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
                    className={`h-10 flex flex-col items-center justify-center rounded-[12px] relative transition-all ${
                      isSelected
                        ? 'bg-[#EFE5DB] ring-1 ring-[#C99A86]'
                        : isToday
                        ? 'bg-[#FAF6F0] ring-1 ring-[#EADBCE]'
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

                    {/* Dots indicator */}
                    <div className="flex items-center gap-1 h-1.5 mt-0.5">
                      {hasPeriod && (
                        <span
                          className={`rounded-full bg-[#4A2B33] ${
                            entry?.flow === 'heavy' ? 'w-1.5 h-1.5' : 'w-1 h-1'
                          }`}
                        />
                      )}
                      {hasPain && (
                        <span className="w-1 h-1 rounded-full bg-[#C99A86]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-5 pt-3.5 border-t border-[#EADBCE]/60 flex items-center justify-center gap-6 text-xs text-[#7A5862]">
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

          {/* Emotion-Free Cycle Cadence Chart */}
          <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[22px] p-6 shadow-[0_2px_14px_rgba(74,43,51,0.02)]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-[#7A5862]">
                Monthly cadence rhythm
              </span>
              <span className="text-xs text-[#5B6D55] font-medium">
                28 days avg
              </span>
            </div>
            <p className="text-xs text-[#7A5862] mb-4">
              Steady cycle length over your past 5 cycles
            </p>

            <div className="flex items-end justify-between gap-4 h-24 pt-2 pb-1 px-3">
              {cycleHistoryCadence.map((rec, i) => {
                const heightPercent = Math.min(100, Math.max(30, (rec.days / 32) * 100));
                const isRecent = i === cycleHistoryCadence.length - 1;
                return (
                  <div
                    key={rec.month}
                    className="flex-1 flex flex-col items-center h-full justify-end"
                  >
                    <span className="text-xs text-[#7A5862] font-mono tabular-nums mb-1.5">
                      {rec.days}d
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[36px] rounded-t-[10px] transition-all ${
                        isRecent ? 'bg-[#C99A86]' : 'bg-[#E0D3C7]'
                      }`}
                    />
                    <span className="text-xs text-[#7A5862] mt-2">
                      {rec.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Full Log Inspection & Reversed Timeline (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Active Log Card */}
          {selectedEntry ? (
            <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[22px] p-6 shadow-[0_2px_14px_rgba(74,43,51,0.02)]">
              <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-[#EADBCE]/70">
                <div>
                  <h3 className="font-serif text-xl font-normal text-[#4A2B33]">
                    {formatFullDate(selectedEntry.date)}
                  </h3>
                  <span className="text-xs text-[#7A5862]">
                    Cycle Day {selectedEntry.cycleDay}
                  </span>
                </div>
                <span className="text-xs text-[#C99A86] capitalize font-medium">
                  {selectedEntry.flow} flow
                </span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-[#EADBCE]/40">
                  <span className="text-[#7A5862]">Pain or cramp intensity</span>
                  <span className="font-medium text-[#4A2B33]">
                    {selectedEntry.pain} / 5
                  </span>
                </div>

                {selectedEntry.symptoms.length > 0 && (
                  <div className="py-1.5 border-b border-[#EADBCE]/40">
                    <span className="text-[#7A5862] block mb-2">
                      Symptoms noted
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.symptoms.map((s) => (
                        <span
                          key={s}
                          className="bg-[#F7F3EC] border border-[#EADBCE] px-3 py-1 rounded-full text-xs text-[#4A2B33]"
                        >
                          {s.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEntry.mood && (
                  <div className="flex items-center justify-between py-1.5 border-b border-[#EADBCE]/40">
                    <span className="text-[#7A5862]">Emotional climate</span>
                    <span className="font-medium text-[#4A2B33] capitalize">
                      {selectedEntry.mood}
                    </span>
                  </div>
                )}

                {selectedEntry.note && (
                  <div className="pt-2">
                    <span className="text-[#7A5862] block mb-1.5 font-medium">
                      Personal reflection
                    </span>
                    <p className="p-3.5 bg-[#F7F3EC] rounded-[16px] border border-[#EADBCE] text-xs leading-relaxed text-[#4A2B33] italic">
                      &ldquo;{selectedEntry.note}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[22px] p-6 text-center text-xs text-[#7A5862]">
              Select a date on the calendar or from the list below to view details.
            </div>
          )}

          {/* Reversed List of Past Entries */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-medium text-[#7A5862]">
                Past recorded entries
              </span>
              <span className="text-xs text-[#7A5862]">
                {sortedEntries.length} logged days
              </span>
            </div>

            <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1">
              {sortedEntries.map((entry) => {
                const isSelected = selectedEntry?.id === entry.id;
                return (
                  <button
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className={`w-full text-left p-3.5 rounded-[16px] border transition-all ${
                      isSelected
                        ? 'bg-[#FAF6F0] border-[#C99A86] ring-1 ring-[#C99A86] shadow-xs'
                        : 'bg-[#FAF6F0]/80 border-[#EADBCE] hover:border-[#D6C7BB]'
                    }`}
                  >
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-serif text-sm font-medium text-[#4A2B33]">
                        {formatFriendlyDate(entry.date)}
                      </span>
                      <span className="text-xs text-[#7A5862]">
                        Day {entry.cycleDay}
                      </span>
                    </div>
                    <p className="text-xs text-[#7A5862] line-clamp-1">
                      {summarizeEntry(entry)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
