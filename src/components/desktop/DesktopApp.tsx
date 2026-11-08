import React, { useState } from 'react';
import { DailyEntry } from '../../types';
import { calculateCycleDayFromDate, getTodayIso } from '../../utils/cycle';
import { DesktopToday } from './DesktopToday';
import { DesktopLog } from './DesktopLog';
import { DesktopHistory } from './DesktopHistory';

interface DesktopAppProps {
  entries: DailyEntry[];
  onSaveEntry: (entry: Omit<DailyEntry, 'id' | 'createdAt'>) => void;
  userName?: string;
  userProfile?: import('../../types').UserProfile;
  onUpdatePeriodStart?: (date: string) => void;
  onSwitchToMobile?: () => void;
}

export type DesktopTab = 'today' | 'log' | 'history';

export const DesktopApp: React.FC<DesktopAppProps> = ({
  entries,
  onSaveEntry,
  userName = 'Achieng',
  userProfile,
  onUpdatePeriodStart,
}) => {
  const [activeTab, setActiveTab] = useState<DesktopTab>('today');
  const todayEntry = entries.find((e) => e.date === getTodayIso());
  const cycleDay = calculateCycleDayFromDate(
    userProfile?.lastPeriodStart,
    getTodayIso(),
    userProfile?.cycleLength ?? 28
  );

  return (
    <div className="w-full min-h-screen bg-[#F7F3EC] text-[#4A2B33] flex flex-col font-sans">
      {/* Top Bar (Follows Top Bar Contract: 3 Zones) */}
      <header className="border-b border-[#EADBCE] bg-[#FAF6F0]/90 backdrop-blur-xs px-8 lg:px-16 py-4 flex items-center justify-between gap-8 sticky top-0 z-30">
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-serif text-xl font-medium tracking-tight text-[#4A2B33] whitespace-nowrap">
            Womb Atlas
          </span>
          <span className="text-xs text-[#7A5862] hidden sm:inline whitespace-nowrap">
            · Saturday, November 7
          </span>
        </div>

        {/* Zone 2: Clean single-line text links */}
        <nav className="flex items-center gap-8 text-sm text-[#7A5862]">
          <button
            onClick={() => setActiveTab('today')}
            className={`whitespace-nowrap transition-colors pb-0.5 ${
              activeTab === 'today'
                ? 'text-[#4A2B33] font-medium border-b-2 border-[#4A2B33]'
                : 'hover:text-[#4A2B33]'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab('log')}
            className={`whitespace-nowrap transition-colors pb-0.5 ${
              activeTab === 'log'
                ? 'text-[#4A2B33] font-medium border-b-2 border-[#4A2B33]'
                : 'hover:text-[#4A2B33]'
            }`}
          >
            Daily entry
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`whitespace-nowrap transition-colors pb-0.5 ${
              activeTab === 'history'
                ? 'text-[#4A2B33] font-medium border-b-2 border-[#4A2B33]'
                : 'hover:text-[#4A2B33]'
            }`}
          >
            Cycle history
          </button>
        </nav>

        {/* Zone 3: 1 Primary CTA Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('log')}
            className="min-h-[40px] px-5 py-2 rounded-full bg-[#4A2B33] text-[#F7F3EC] text-xs font-medium hover:bg-[#3B2229] transition-all whitespace-nowrap shadow-xs"
          >
            Log today
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 lg:px-12 py-8">
        {activeTab === 'today' && (
          <DesktopToday
            entries={entries}
            onNavigate={(tab) => setActiveTab(tab)}
            userName={userName}
            userProfile={userProfile}
            onUpdatePeriodStart={onUpdatePeriodStart}
          />
        )}

        {activeTab === 'log' && (
          <DesktopLog
            existingEntry={todayEntry}
            onSave={onSaveEntry}
            onCancel={() => setActiveTab('today')}
            cycleDay={cycleDay ?? undefined}
          />
        )}

        {activeTab === 'history' && (
          <DesktopHistory
            entries={entries}
            onBackToToday={() => setActiveTab('today')}
          />
        )}
      </main>

      {/* Desktop Footer */}
      <footer className="border-t border-[#EADBCE] px-8 lg:px-16 py-6 text-xs text-[#7A5862] flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
        <span>Womb Atlas · Private, local-first menstrual care</span>
        <span>A calm companion for your reproductive health</span>
      </footer>
    </div>
  );
};
