import React, { useState } from 'react';
import { initialEntries } from './data/seedData';
import { DailyEntry, UserProfile } from './types';
import { HomeScreen } from './components/HomeScreen';
import { LogScreen } from './components/LogScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { UnlockScreen } from './components/onboarding/UnlockScreen';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { DesktopApp } from './components/desktop/DesktopApp';

type ViewportMode = 'desktop' | 'mobile';
type ActiveViewKey =
  | 'unlock'
  | 'onboarding-name'
  | 'onboarding-period'
  | 'onboarding-rhythm'
  | 'home-phase'
  | 'home-learning'
  | 'log'
  | 'history';

export default function App() {
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [activeView, setActiveView] = useState<ActiveViewKey>('home-phase');
  const [entries, setEntries] = useState<DailyEntry[]>(initialEntries);

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    passcodeSet: false,
    passcode: undefined,
    userName: 'Achieng',
    lastPeriodStart: '2026-11-05', // 2 days ago = Day 3
    lifeStage: 'currently-cycling',
    cycleLength: 28,
    periodLength: 5,
    usesHormonalBirthControl: false,
    hasCompletedOnboarding: true,
  });

  const handleSaveEntry = (newEntryData: Omit<DailyEntry, 'id' | 'createdAt'>) => {
    setEntries((prev) => {
      const existingIndex = prev.findIndex((e) => e.date === newEntryData.date);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...newEntryData,
          createdAt: new Date().toISOString(),
        };
        return updated;
      } else {
        const created: DailyEntry = {
          ...newEntryData,
          id: `entry-${newEntryData.date}-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        return [created, ...prev];
      }
    });
  };

  const handleUpdatePeriodStart = (dateStr: string) => {
    setUserProfile((prev) => ({
      ...prev,
      lastPeriodStart: dateStr,
    }));
    setActiveView('home-phase');
  };

  const handleResetFirstLogin = () => {
    setUserProfile({
      passcodeSet: false,
      passcode: undefined,
      userName: '',
      lastPeriodStart: undefined,
      lifeStage: undefined,
      cycleLength: 28,
      periodLength: 5,
      usesHormonalBirthControl: false,
      hasCompletedOnboarding: false,
    });
    setViewportMode('mobile');
    setActiveView('unlock');
  };

  const handlePasscodeSet = (pin?: string) => {
    setUserProfile((prev) => ({
      ...prev,
      passcodeSet: Boolean(pin),
      passcode: pin,
    }));
    setActiveView('onboarding-name');
  };

  const handleOnboardingComplete = (data: Partial<UserProfile>) => {
    setUserProfile((prev) => ({
      ...prev,
      ...data,
      hasCompletedOnboarding: true,
    }));
    // Land directly on home: phase-mode if date given, learning-mode if not
    if (data.lastPeriodStart) {
      setActiveView('home-phase');
    } else {
      setActiveView('home-learning');
    }
  };

  const todayEntry = entries.find((e) => e.date === '2026-11-07');

  // Derive effective profile based on activeView quick toggle
  const effectiveProfile: UserProfile = {
    ...userProfile,
    lastPeriodStart:
      activeView === 'home-learning'
        ? undefined
        : userProfile.lastPeriodStart || '2026-11-05',
  };

  return (
    <div className="min-h-screen bg-[#EDE7DF] flex flex-col font-sans selection:bg-[#C99A86]/20">
      {/* Top Testing & Viewport Mode Navigation Bar */}
      <nav
        aria-label="Viewport Switcher"
        className="w-full bg-[#FAF6F0] border-b border-[#E3D7CB] py-2 px-4 z-40 sticky top-0 shadow-xs"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif text-base font-medium text-[#4A2B33]">
              Womb Atlas
            </span>
            <span className="text-xs text-[#7A5862]">
              · First-login flow &amp; desktop design
            </span>
          </div>

          {/* Quick Review Screen Switcher */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {/* Viewport switcher */}
            <div className="flex items-center gap-1 bg-[#EFE7DE] p-0.5 rounded-full border border-[#DFD3C5]">
              <button
                onClick={() => setViewportMode('desktop')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  viewportMode === 'desktop'
                    ? 'bg-[#FAF6F0] text-[#4A2B33] shadow-xs'
                    : 'text-[#7A5862] hover:text-[#4A2B33]'
                }`}
              >
                Desktop Version
              </button>
              <button
                onClick={() => setViewportMode('mobile')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  viewportMode === 'mobile'
                    ? 'bg-[#FAF6F0] text-[#4A2B33] shadow-xs'
                    : 'text-[#7A5862] hover:text-[#4A2B33]'
                }`}
              >
                Mobile View (375 × 812)
              </button>
            </div>

            {/* Reset flow button */}
            <button
              onClick={handleResetFirstLogin}
              className="text-xs text-[#9F6E5A] bg-[#F6EDE8] hover:bg-[#EADBCE] px-3 py-1 rounded-full border border-[#EADBCE] font-medium transition-colors"
            >
              Reset first-run flow
            </button>
          </div>
        </div>

        {/* Quick Jump Bar for all First-Login Screens */}
        <div className="max-w-7xl mx-auto pt-2 pb-0.5 flex items-center gap-1 overflow-x-auto text-[11px]">
          <span className="text-[#7A5862] font-medium whitespace-nowrap mr-1">
            Flow preview:
          </span>
          <button
            onClick={() => {
              setViewportMode('mobile');
              setActiveView('unlock');
            }}
            className={`px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors ${
              activeView === 'unlock' && viewportMode === 'mobile'
                ? 'bg-[#4A2B33] text-[#F7F3EC]'
                : 'bg-[#FAF6F0] text-[#7A5862] hover:text-[#4A2B33] border border-[#EADBCE]'
            }`}
          >
            1. Unlock (First run)
          </button>
          <button
            onClick={() => {
              setViewportMode('mobile');
              setActiveView('onboarding-name');
            }}
            className={`px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors ${
              activeView === 'onboarding-name' && viewportMode === 'mobile'
                ? 'bg-[#4A2B33] text-[#F7F3EC]'
                : 'bg-[#FAF6F0] text-[#7A5862] hover:text-[#4A2B33] border border-[#EADBCE]'
            }`}
          >
            2a. Name
          </button>
          <button
            onClick={() => {
              setViewportMode('mobile');
              setActiveView('onboarding-period');
            }}
            className={`px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors ${
              activeView === 'onboarding-period' && viewportMode === 'mobile'
                ? 'bg-[#4A2B33] text-[#F7F3EC]'
                : 'bg-[#FAF6F0] text-[#7A5862] hover:text-[#4A2B33] border border-[#EADBCE]'
            }`}
          >
            2b. Period start
          </button>
          <button
            onClick={() => {
              setViewportMode('mobile');
              setActiveView('onboarding-rhythm');
            }}
            className={`px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors ${
              activeView === 'onboarding-rhythm' && viewportMode === 'mobile'
                ? 'bg-[#4A2B33] text-[#F7F3EC]'
                : 'bg-[#FAF6F0] text-[#7A5862] hover:text-[#4A2B33] border border-[#EADBCE]'
            }`}
          >
            2c. Rhythm
          </button>
          <button
            onClick={() => {
              setActiveView('home-phase');
            }}
            className={`px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors ${
              activeView === 'home-phase'
                ? 'bg-[#4A2B33] text-[#F7F3EC]'
                : 'bg-[#FAF6F0] text-[#7A5862] hover:text-[#4A2B33] border border-[#EADBCE]'
            }`}
          >
            3. Landing (Phase-mode)
          </button>
          <button
            onClick={() => {
              setActiveView('home-learning');
            }}
            className={`px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors ${
              activeView === 'home-learning'
                ? 'bg-[#4A2B33] text-[#F7F3EC]'
                : 'bg-[#FAF6F0] text-[#7A5862] hover:text-[#4A2B33] border border-[#EADBCE]'
            }`}
          >
            3. Landing (Learning-mode)
          </button>
          <button
            onClick={() => {
              setActiveView('log');
            }}
            className={`px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors ${
              activeView === 'log'
                ? 'bg-[#4A2B33] text-[#F7F3EC]'
                : 'bg-[#FAF6F0] text-[#7A5862] hover:text-[#4A2B33] border border-[#EADBCE]'
            }`}
          >
            Daily log
          </button>
          <button
            onClick={() => {
              setActiveView('history');
            }}
            className={`px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors ${
              activeView === 'history'
                ? 'bg-[#4A2B33] text-[#F7F3EC]'
                : 'bg-[#FAF6F0] text-[#7A5862] hover:text-[#4A2B33] border border-[#EADBCE]'
            }`}
          >
            History
          </button>
        </div>
      </nav>

      {/* Main Viewport Content */}
      {viewportMode === 'desktop' ? (
        <DesktopApp
          entries={entries}
          onSaveEntry={handleSaveEntry}
          userName={effectiveProfile.userName || 'Achieng'}
          userProfile={effectiveProfile}
          onUpdatePeriodStart={handleUpdatePeriodStart}
          onSwitchToMobile={() => setViewportMode('mobile')}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
          {/* Realistic 375 × 812 Mobile Device Canvas */}
          <div className="origin-top scale-[0.92] sm:scale-[0.96] md:scale-100 transition-transform">
            <div className="relative w-[375px] h-[812px] bg-[#F7F3EC] rounded-[44px] shadow-[0_20px_50px_rgba(74,43,51,0.12)] border-[8px] border-[#3B282E] overflow-hidden flex flex-col">
              {/* Mobile Top Speaker & Camera Island */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#3B282E] rounded-full z-30 pointer-events-none flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1F1418] mr-3"></span>
                <span className="w-8 h-1 rounded-full bg-[#2A1D22]"></span>
              </div>

              {/* Mobile Status Bar */}
              <div className="w-full pt-2.5 px-6 pb-1 flex items-center justify-between text-[11px] font-medium text-[#4A2B33] select-none z-20">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]">5G</span>
                  <span className="w-4 h-2 border border-[#4A2B33] rounded-[2px] p-[1px] inline-block">
                    <span className="w-full h-full bg-[#4A2B33] block rounded-[1px]"></span>
                  </span>
                </div>
              </div>

              {/* Main Screen Container (Scrollable) */}
              <div className="flex-1 overflow-hidden relative">
                {/* 1. Unlock Screen */}
                {activeView === 'unlock' && (
                  <UnlockScreen
                    onPasscodeSet={handlePasscodeSet}
                    onSkip={() => setActiveView('onboarding-name')}
                  />
                )}

                {/* 2. Onboarding Cards */}
                {activeView === 'onboarding-name' && (
                  <OnboardingFlow
                    initialStep={1}
                    onComplete={handleOnboardingComplete}
                  />
                )}

                {activeView === 'onboarding-period' && (
                  <OnboardingFlow
                    initialStep={2}
                    onComplete={handleOnboardingComplete}
                  />
                )}

                {activeView === 'onboarding-rhythm' && (
                  <OnboardingFlow
                    initialStep={3}
                    onComplete={handleOnboardingComplete}
                  />
                )}

                {/* 3. Landing States */}
                {(activeView === 'home-phase' || activeView === 'home-learning') && (
                  <HomeScreen
                    entries={entries}
                    onNavigate={(screen) => {
                      if (screen === 'log') setActiveView('log');
                      if (screen === 'history') setActiveView('history');
                      if (screen === 'home') setActiveView('home-phase');
                    }}
                    userName={effectiveProfile.userName || 'Achieng'}
                    userProfile={effectiveProfile}
                    onUpdatePeriodStart={handleUpdatePeriodStart}
                  />
                )}

                {/* Daily Log Screen */}
                {activeView === 'log' && (
                  <LogScreen
                    existingEntry={todayEntry}
                    onSave={handleSaveEntry}
                    onCancel={() => setActiveView('home-phase')}
                  />
                )}

                {/* History Screen */}
                {activeView === 'history' && (
                  <HistoryScreen
                    entries={entries}
                    onBackToHome={() => setActiveView('home-phase')}
                  />
                )}
              </div>

              {/* Mobile Bottom Tab Bar (shown once user is in home, log, or history) */}
              {(activeView === 'home-phase' ||
                activeView === 'home-learning' ||
                activeView === 'log' ||
                activeView === 'history') && (
                <nav
                  aria-label="Mobile Navigation"
                  className="h-[64px] bg-[#FAF6F0] border-t border-[#EADBCE] grid grid-cols-3 items-center px-4 shrink-0 z-20"
                >
                  <button
                    onClick={() => setActiveView('home-phase')}
                    className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                      activeView === 'home-phase' || activeView === 'home-learning'
                        ? 'text-[#4A2B33]'
                        : 'text-[#9A7D86] hover:text-[#4A2B33]'
                    }`}
                  >
                    <span className="text-base leading-none">○</span>
                    <span className="text-[10px] font-medium mt-1">Today</span>
                  </button>

                  <button
                    onClick={() => setActiveView('log')}
                    className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                      activeView === 'log'
                        ? 'text-[#4A2B33]'
                        : 'text-[#9A7D86] hover:text-[#4A2B33]'
                    }`}
                  >
                    <span className="text-base leading-none">+</span>
                    <span className="text-[10px] font-medium mt-1">Log</span>
                  </button>

                  <button
                    onClick={() => setActiveView('history')}
                    className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                      activeView === 'history'
                        ? 'text-[#4A2B33]'
                        : 'text-[#9A7D86] hover:text-[#4A2B33]'
                    }`}
                  >
                    <span className="text-base leading-none">▤</span>
                    <span className="text-[10px] font-medium mt-1">History</span>
                  </button>
                </nav>
              )}

              {/* Mobile Home Bar Pill Indicator */}
              <div className="w-full pb-1.5 pt-0.5 bg-[#FAF6F0] flex justify-center items-center">
                <div className="w-28 h-1 bg-[#C99A86]/60 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
