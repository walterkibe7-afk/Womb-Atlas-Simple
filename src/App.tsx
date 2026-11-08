import React, { useState } from 'react';
import { initialEntries } from './data/seedData';
import { DailyEntry, UserProfile, AuthUser } from './types';
import { HomeScreen } from './components/HomeScreen';
import { LogScreen } from './components/LogScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { UnlockScreen } from './components/onboarding/UnlockScreen';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { DesktopApp } from './components/desktop/DesktopApp';
import { DesktopOnboarding, DesktopStepKey } from './components/desktop/DesktopOnboarding';
import { OnboardingStepKey } from './components/onboarding/OnboardingFlow';
import { AuthPage } from './components/auth/AuthPage';
import { AccountMenuModal } from './components/auth/AccountMenuModal';

type ViewportMode = 'desktop' | 'mobile';
type ActiveViewKey =
  | DesktopStepKey
  | 'home-phase'
  | 'home-learning'
  | 'log'
  | 'history'
  | 'auth-login'
  | 'auth-signup';

const VIEW_TO_ONBOARDING: Record<DesktopStepKey, OnboardingStepKey> = {
  'unlock': 'privacy',
  'onboarding-privacy': 'privacy',
  'onboarding-social': 'social-intro',
  'onboarding-discovery': 'discovery',
  'onboarding-birth-year': 'birth-year',
  'onboarding-measurements': 'body-measurements',
  'onboarding-knowledge': 'period-knowledge',
  'onboarding-feelings': 'feelings',
  'onboarding-regularity': 'period-regularity',
  'onboarding-period': 'period-start',
  'onboarding-rhythm': 'rhythm',
  'onboarding-birth-control': 'birth-control',
  'onboarding-health-conditions': 'health-conditions',
  'onboarding-discharge': 'discharge',
  'onboarding-lifestyle': 'lifestyle-impacts',
  'onboarding-pledge': 'pledge-commitment',
  'onboarding-security': 'security-cert',
  'onboarding-notifications': 'notifications',
  'onboarding-loading': 'lens-loading',
  'onboarding-plan': 'plan-pricing',
};

const ONBOARDING_TO_VIEW: Record<OnboardingStepKey, DesktopStepKey> = {
  'privacy': 'onboarding-privacy',
  'social-intro': 'onboarding-social',
  'discovery': 'onboarding-discovery',
  'birth-year': 'onboarding-birth-year',
  'body-measurements': 'onboarding-measurements',
  'period-knowledge': 'onboarding-knowledge',
  'feelings': 'onboarding-feelings',
  'period-regularity': 'onboarding-regularity',
  'period-start': 'onboarding-period',
  'rhythm': 'onboarding-rhythm',
  'birth-control': 'onboarding-birth-control',
  'health-conditions': 'onboarding-health-conditions',
  'discharge': 'onboarding-discharge',
  'lifestyle-impacts': 'onboarding-lifestyle',
  'pledge-commitment': 'onboarding-pledge',
  'security-cert': 'onboarding-security',
  'notifications': 'onboarding-notifications',
  'lens-loading': 'onboarding-loading',
  'plan-pricing': 'onboarding-plan',
};

export default function App() {
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [activeView, setActiveView] = useState<ActiveViewKey>('unlock');
  const [entries, setEntries] = useState<DailyEntry[]>(initialEntries);
  const [currentUser, setCurrentUser] = useState<AuthUser | undefined>(undefined);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

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
    hasCompletedOnboarding: false,
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
    setCurrentUser(undefined);
    setActiveView('unlock');
  };

  const handlePasscodeSet = (pin?: string) => {
    setUserProfile((prev) => ({
      ...prev,
      passcodeSet: Boolean(pin),
      passcode: pin,
    }));
    setActiveView('onboarding-privacy');
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

  const handleAuthSuccess = (user: AuthUser, authMode?: 'login' | 'signup') => {
    setCurrentUser(user);
    setUserProfile((prev) => ({
      ...prev,
      userName: user.name || prev.userName || 'Achieng',
      hasCompletedOnboarding: authMode === 'signup' ? false : prev.hasCompletedOnboarding,
    }));

    // If new signup or first login, take the user through the first-login sequence!
    if (authMode === 'signup' || !userProfile.hasCompletedOnboarding) {
      setActiveView('unlock');
    } else {
      setActiveView('home-phase');
    }
  };

  const handleSignOut = () => {
    setCurrentUser(undefined);
  };

  const todayEntry = entries.find((e) => e.date === '2026-11-07');

  // Derive effective profile based on activeView quick toggle
  const effectiveProfile: UserProfile = {
    ...userProfile,
    userName: currentUser?.name || userProfile.userName || 'Achieng',
    currentUser,
    lastPeriodStart:
      activeView === 'home-learning'
        ? undefined
        : userProfile.lastPeriodStart || '2026-11-05',
  };

  const isFirstLoginStep =
    activeView === 'unlock' || activeView.startsWith('onboarding-');

  return (
    <div className="min-h-screen bg-[#EDE7DF] flex flex-col font-sans selection:bg-[#C99A86]/20">
      {/* Top Testing & Viewport Mode Navigation Bar */}
      <nav
        aria-label="Viewport Switcher"
        className="w-full bg-[#FAF6F0] border-b border-[#E3D7CB] py-2.5 px-4 z-40 sticky top-0 shadow-xs"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif text-base font-medium text-[#4A2B33]">
              Womb Atlas
            </span>
            <span className="text-xs text-[#7A5862]">
              · Reproductive health tracker &amp; sanctuary
            </span>
          </div>

          {/* Quick Review Screen Switcher */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
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

            {/* Auth status indicator pill */}
            <button
              onClick={() => setAccountModalOpen(true)}
              className="text-xs text-[#4A2B33] bg-[#FAF6F0] hover:bg-[#EFE7DE] px-3 py-1 rounded-full border border-[#EADBCE] font-medium transition-colors flex items-center gap-1.5"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  currentUser ? 'bg-[#A8B5A2]' : 'bg-[#C99A86]'
                }`}
              ></span>
              <span>
                {currentUser
                  ? `${currentUser.name} (${currentUser.provider})`
                  : 'Sanctuary (Guest)'}
              </span>
            </button>

            {/* Walkthrough CTA button */}
            <button
              onClick={handleResetFirstLogin}
              className="text-xs text-[#9F6E5A] bg-[#F6EDE8] hover:bg-[#EADBCE] px-3 py-1 rounded-full border border-[#EADBCE] font-medium transition-colors"
            >
              Restart first-login flow
            </button>
          </div>
        </div>

        {/* Quick Stepper Bar for First-Login Steps & Sanctuary Views */}
        <div className="max-w-7xl mx-auto pt-2.5 pb-1 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-[#4A2B33] font-medium whitespace-nowrap bg-[#EFE7DE] px-2 py-0.5 rounded-md mr-1">
            First-login steps:
          </span>

          {[
            { id: 'unlock', label: '1. Lock' },
            { id: 'onboarding-privacy', label: '2. Privacy' },
            { id: 'onboarding-social', label: '3. Story' },
            { id: 'onboarding-discovery', label: '4. Found us' },
            { id: 'onboarding-birth-year', label: '5. Birth' },
            { id: 'onboarding-measurements', label: '6. Body' },
            { id: 'onboarding-knowledge', label: '7. Knowledge' },
            { id: 'onboarding-feelings', label: '8. Feelings' },
            { id: 'onboarding-regularity', label: '9. Regularity' },
            { id: 'onboarding-period', label: '10. Period' },
            { id: 'onboarding-rhythm', label: '11. Rhythm' },
            { id: 'onboarding-birth-control', label: '12. Birth control' },
            { id: 'onboarding-health-conditions', label: '13. Health' },
            { id: 'onboarding-discharge', label: '14. Discharge' },
            { id: 'onboarding-lifestyle', label: '15. Symptoms' },
            { id: 'onboarding-pledge', label: '16. Pledge' },
            { id: 'onboarding-security', label: '17. Safe' },
            { id: 'onboarding-notifications', label: '18. Remind' },
            { id: 'onboarding-loading', label: '19. Lens' },
            { id: 'onboarding-plan', label: '20. Plan' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveView(s.id as DesktopStepKey)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors font-medium ${
                activeView === s.id
                  ? 'bg-[#4A2B33] text-[#F7F3EC]'
                  : 'bg-[#FAF6F0] text-[#7A5862] hover:text-[#4A2B33] border border-[#EADBCE]'
              }`}
            >
              {s.label}
            </button>
          ))}

          <span className="text-[#DFD3C5] mx-1">|</span>

          {/* Landing and App Views */}
          <span className="text-[#7A5862] font-medium whitespace-nowrap mr-0.5">
            After onboarding:
          </span>
          <button
            onClick={() => setActiveView('home-phase')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
              activeView === 'home-phase'
                ? 'bg-[#4A2B33] text-[#F7F3EC]'
                : 'bg-[#FAF6F0] text-[#7A5862] hover:text-[#4A2B33] border border-[#EADBCE]'
            }`}
          >
            3. Landing (Phase-mode)
          </button>
          <button
            onClick={() => setActiveView('home-learning')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
              activeView === 'home-learning'
                ? 'bg-[#4A2B33] text-[#F7F3EC]'
                : 'bg-[#FAF6F0] text-[#7A5862] hover:text-[#4A2B33] border border-[#EADBCE]'
            }`}
          >
            3. Landing (Learning-mode)
          </button>

          <span className="text-[#DFD3C5] mx-1">|</span>

          {/* Auth & Logging */}
          <button
            onClick={() => setActiveView('auth-login')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
              activeView === 'auth-login'
                ? 'bg-[#4A2B33] text-[#F7F3EC]'
                : 'bg-[#FAF6F0] text-[#7A5862] hover:text-[#4A2B33] border border-[#EADBCE]'
            }`}
          >
            Sign in
          </button>
          <button
            onClick={() => setActiveView('auth-signup')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
              activeView === 'auth-signup'
                ? 'bg-[#4A2B33] text-[#F7F3EC]'
                : 'bg-[#FAF6F0] text-[#7A5862] hover:text-[#4A2B33] border border-[#EADBCE]'
            }`}
          >
            Sign up
          </button>
          <button
            onClick={() => setActiveView('log')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
              activeView === 'log'
                ? 'bg-[#4A2B33] text-[#F7F3EC]'
                : 'bg-[#FAF6F0] text-[#7A5862] hover:text-[#4A2B33] border border-[#EADBCE]'
            }`}
          >
            Daily log
          </button>
          <button
            onClick={() => setActiveView('history')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
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
        activeView === 'auth-login' || activeView === 'auth-signup' ? (
          <div className="w-full min-h-[calc(100vh-100px)] bg-[#F7F3EC] flex flex-col justify-center items-center py-8">
            <AuthPage
              initialMode={activeView === 'auth-signup' ? 'signup' : 'login'}
              isMobileView={false}
              onSuccess={handleAuthSuccess}
              onContinueGuest={() => setActiveView('unlock')}
              onCancel={() => setActiveView('home-phase')}
            />
          </div>
        ) : isFirstLoginStep ? (
          /* Desktop Onboarding Flow Container */
          <div className="w-full min-h-[calc(100vh-100px)] bg-[#F7F3EC] flex flex-col justify-center items-center py-6">
            <DesktopOnboarding
              currentStep={activeView as any}
              onPasscodeSet={handlePasscodeSet}
              onSkipPasscode={() => setActiveView('onboarding-privacy')}
              onOnboardingComplete={handleOnboardingComplete}
              onNavigateStep={(step) => setActiveView(step)}
              onCancelToHome={() => setActiveView('home-phase')}
            />
          </div>
        ) : (
          <DesktopApp
            entries={entries}
            onSaveEntry={handleSaveEntry}
            userName={effectiveProfile.userName}
            userProfile={effectiveProfile}
            currentUser={currentUser}
            onUpdatePeriodStart={handleUpdatePeriodStart}
            onSwitchToMobile={() => setViewportMode('mobile')}
            onAuthSuccess={handleAuthSuccess}
            onSignOut={handleSignOut}
            onStartOnboarding={() => setActiveView('unlock')}
          />
        )
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
              <div className="w-full pt-4 px-6 pb-2 flex items-center justify-between text-[11px] font-medium text-[#4A2B33] select-none z-20 bg-[#F7F3EC]">
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
                {/* Auth Screen (Mobile) */}
                {(activeView === 'auth-login' || activeView === 'auth-signup') && (
                  <AuthPage
                    initialMode={activeView === 'auth-signup' ? 'signup' : 'login'}
                    isMobileView={true}
                    onSuccess={handleAuthSuccess}
                    onContinueGuest={() => setActiveView('unlock')}
                    onCancel={() => setActiveView('home-phase')}
                  />
                )}

                {/* 1. Unlock Screen */}
                {activeView === 'unlock' && (
                  <UnlockScreen
                    onPasscodeSet={handlePasscodeSet}
                    onSkip={() => setActiveView('onboarding-privacy')}
                  />
                )}

                {/* 2. Onboarding Flow (All Questionnaire & Onboarding Steps) */}
                {isFirstLoginStep && activeView !== 'unlock' && (
                  <OnboardingFlow
                    initialStepKey={VIEW_TO_ONBOARDING[activeView as DesktopStepKey] || 'privacy'}
                    onStepChange={(stepKey) => {
                      setActiveView(ONBOARDING_TO_VIEW[stepKey] || 'onboarding-privacy');
                    }}
                    onBackToUnlock={() => setActiveView('unlock')}
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
                    userName={effectiveProfile.userName}
                    userProfile={effectiveProfile}
                    currentUser={currentUser}
                    onUpdatePeriodStart={handleUpdatePeriodStart}
                    onOpenAuth={(mode) => setActiveView(mode === 'signup' ? 'auth-signup' : 'auth-login')}
                    onOpenAccount={() => setAccountModalOpen(true)}
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

      {/* Global Account Menu Modal */}
      <AccountMenuModal
        isOpen={accountModalOpen}
        currentUser={currentUser}
        userProfile={effectiveProfile}
        onClose={() => setAccountModalOpen(false)}
        onSignOut={handleSignOut}
        onOpenAuth={(mode) => {
          setActiveView(mode === 'signup' ? 'auth-signup' : 'auth-login');
        }}
      />
    </div>
  );
}
