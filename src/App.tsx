import React, { useState, useEffect, useCallback } from 'react';
import { initialEntries } from './data/seedData';
import { DailyEntry, UserProfile, AuthUser } from './types';
import { HomeScreen } from './components/HomeScreen';
import { LogScreen } from './components/LogScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { DesktopApp, DesktopTab } from './components/desktop/DesktopApp';
import { DesktopOnboarding, DesktopStepKey } from './components/desktop/DesktopOnboarding';
import { OnboardingStepKey } from './components/onboarding/OnboardingFlow';
import { AuthPage } from './components/auth/AuthPage';
import { AccountMenuModal } from './components/auth/AccountMenuModal';
import { SplashScreen } from './components/onboarding/SplashScreen';

type AppSection = 'home' | 'track' | 'insights' | 'profile';
type AppPhase = 'splash' | 'auth' | 'onboarding' | 'app';

const VIEW_TO_ONBOARDING: Record<DesktopStepKey, OnboardingStepKey> = {
  'onboarding-privacy': 'privacy',
  'onboarding-unlock': 'unlock',
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
  'unlock': 'onboarding-unlock',
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

const DEFAULT_PROFILE: UserProfile = {
  passcodeSet: false,
  passcode: undefined,
  userName: '',
  lastPeriodStart: undefined,
  lifeStage: undefined,
  cycleLength: 28,
  periodLength: 5,
  usesHormonalBirthControl: false,
  hasCompletedOnboarding: false,
};

export default function App() {
  const [appPhase, setAppPhase] = useState<AppPhase>('splash');
  const [currentSection, setCurrentSection] = useState<AppSection>('home');
  const [entries, setEntries] = useState<DailyEntry[]>(initialEntries);
  const [currentUser, setCurrentUser] = useState<AuthUser | undefined>(undefined);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showSplash, setShowSplash] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState<DesktopStepKey>('onboarding-privacy');
  const [onboardingMobileStep, setOnboardingMobileStep] = useState<OnboardingStepKey>('privacy');
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setAppPhase('auth');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSaveEntry = useCallback((newEntryData: Omit<DailyEntry, 'id' | 'createdAt'>) => {
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
  }, []);

  const handleUpdatePeriodStart = useCallback((dateStr: string) => {
    setUserProfile((prev) => ({
      ...prev,
      lastPeriodStart: dateStr,
    }));
  }, []);

  const handleAuthSuccess = useCallback((user: AuthUser, mode?: 'login' | 'signup') => {
    setCurrentUser(user);
    setUserProfile((prev) => ({
      ...prev,
      userName: user.name || prev.userName || 'Achieng',
      hasCompletedOnboarding: mode === 'signup' ? false : prev.hasCompletedOnboarding,
    }));

    if (mode === 'signup') {
      setAppPhase('onboarding');
      setOnboardingStep('onboarding-privacy');
      setOnboardingMobileStep('privacy');
    } else if (!userProfile.hasCompletedOnboarding) {
      setAppPhase('onboarding');
      setOnboardingStep('onboarding-privacy');
      setOnboardingMobileStep('privacy');
    } else if (!userProfile.passcodeSet) {
      setAppPhase('onboarding');
      setOnboardingStep('onboarding-unlock');
      setOnboardingMobileStep('unlock');
    } else {
      setAppPhase('app');
      setCurrentSection('home');
    }
  }, [userProfile.hasCompletedOnboarding, userProfile.passcodeSet]);

  const handleSignOut = useCallback(() => {
    setCurrentUser(undefined);
    setUserProfile(DEFAULT_PROFILE);
    setAppPhase('auth');
    setAuthMode('login');
  }, []);

  const handleOnboardingComplete = useCallback((data: Partial<UserProfile>) => {
    setUserProfile((prev) => ({
      ...prev,
      ...data,
      hasCompletedOnboarding: true,
    }));
    setAppPhase('app');
    setCurrentSection(data.lastPeriodStart ? 'home' : 'home');
  }, []);

  const handleSkipAll = useCallback(() => {
    setUserProfile((prev) => ({
      ...prev,
      hasCompletedOnboarding: true,
    }));
    setAppPhase('app');
    setCurrentSection('home');
  }, []);

  const handleContinueOnboarding = useCallback(() => {
    setAppPhase('onboarding');
    if (!userProfile.agreedToPrivacyPolicy) {
      setOnboardingStep('onboarding-privacy');
      setOnboardingMobileStep('privacy');
    } else if (!userProfile.passcodeSet) {
      setOnboardingStep('onboarding-unlock');
      setOnboardingMobileStep('unlock');
    } else {
      setOnboardingStep('onboarding-social');
      setOnboardingMobileStep('social-intro');
    }
  }, [userProfile.agreedToPrivacyPolicy, userProfile.passcodeSet]);

  const handleOnboardingStepChange = useCallback((stepKey: OnboardingStepKey) => {
    setOnboardingMobileStep(stepKey);
    const desktopStep = ONBOARDING_TO_VIEW[stepKey];
    if (desktopStep) {
      setOnboardingStep(desktopStep);
    }
  }, []);

  const handleDesktopOnboardingStepChange = useCallback((step: DesktopStepKey) => {
    setOnboardingStep(step);
    const mobileStep = VIEW_TO_ONBOARDING[step];
    if (mobileStep) {
      setOnboardingMobileStep(mobileStep);
    }
  }, []);

  const handlePasscodeSet = useCallback((pin?: string) => {
    setUserProfile((prev) => ({
      ...prev,
      passcodeSet: Boolean(pin),
      passcode: pin,
    }));
  }, []);

  const handleOpenAuth = useCallback((mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAppPhase('auth');
  }, []);

  const handleBackToApp = useCallback(() => {
    setAppPhase('app');
  }, []);

  const todayEntry = entries.find((e) => e.date === '2026-11-07');

  const effectiveProfile: UserProfile = {
    ...userProfile,
    userName: currentUser?.name || userProfile.userName || 'Achieng',
    currentUser,
    lastPeriodStart: userProfile.lastPeriodStart,
  };

  const isInOnboarding = appPhase === 'onboarding';
  const isInAuth = appPhase === 'auth';

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (isInAuth) {
    return (
      <AuthPage
        initialMode={authMode}
        isMobileView={isMobileView}
        onSuccess={handleAuthSuccess}
        onContinueGuest={() => {
          setCurrentUser({ id: 'local-guest', name: 'Guest', provider: 'local' });
          setAppPhase('onboarding');
          setOnboardingStep('onboarding-privacy');
          setOnboardingMobileStep('privacy');
        }}
        onCancel={handleBackToApp}
      />
    );
  }

  if (isInOnboarding) {
    if (isMobileView) {
      return (
        <div className="flex flex-col h-screen bg-[#F7F3EC] text-[#4A2B33]">
          <OnboardingFlow
            initialStepKey={onboardingMobileStep}
            onStepChange={handleOnboardingStepChange}
            onComplete={handleOnboardingComplete}
            onSkipAll={handleSkipAll}
          />
        </div>
      );
    } else {
      return (
        <div className="w-full min-h-screen bg-[#F7F3EC] flex flex-col justify-center items-center py-6">
          <DesktopOnboarding
            currentStep={onboardingStep}
            onPasscodeSet={handlePasscodeSet}
            onSkipPasscode={() => handleOnboardingStepChange('social-intro')}
            onOnboardingComplete={handleOnboardingComplete}
            onNavigateStep={handleDesktopOnboardingStepChange}
            onCancelToHome={handleBackToApp}
            onSkipAll={handleSkipAll}
          />
        </div>
      );
    }
  }

  const renderMobileApp = () => (
    <div className="flex flex-col h-screen bg-[#EDE7DF] pb-safe">
      <div className="flex-1 flex flex-col min-h-0 relative">
        <div className="mobile-preview-frame w-full max-w-[375px] h-full bg-[#F7F3EC] rounded-[44px] shadow-[0_20px_50px_rgba(74,43,51,0.12)] border border-[#DFD3C5] overflow-hidden flex flex-col">
          <div className="pt-[env(safe-area-inset-top)]" aria-hidden="true" />
          <div className="flex-1 overflow-y-auto relative pb-[calc(env(safe-area-inset-bottom)+80px)]">
            {currentSection === 'home' && (
              <HomeScreen
                entries={entries}
                onNavigate={(screen) => {
                  if (screen === 'log') setCurrentSection('track');
                  if (screen === 'history') setCurrentSection('insights');
                  if (screen === 'home') setCurrentSection('home');
                }}
                userName={effectiveProfile.userName}
                userProfile={effectiveProfile}
                currentUser={currentUser}
                onUpdatePeriodStart={handleUpdatePeriodStart}
                onOpenAuth={handleOpenAuth}
                onOpenAccount={() => setAccountModalOpen(true)}
                onContinueOnboarding={handleContinueOnboarding}
              />
            )}
            {currentSection === 'track' && (
              <LogScreen
                existingEntry={todayEntry}
                onSave={handleSaveEntry}
                onCancel={() => setCurrentSection('home')}
              />
            )}
            {currentSection === 'insights' && (
              <HistoryScreen
                entries={entries}
                onBackToHome={() => setCurrentSection('home')}
              />
            )}
            {currentSection === 'profile' && (
              <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-5 pt-4 pb-6 overflow-y-auto">
                <div className="flex items-center justify-between pb-3">
                  <span className="font-serif text-lg text-[#4A2B33] font-medium">Profile</span>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => setAccountModalOpen(true)}
                    className="w-full text-left p-4 bg-[#FAF6F0] border border-[#EADBCE] rounded-[16px] hover:border-[#C99A86] transition-all"
                  >
                    <div className="font-medium text-[#4A2B33]">Account & Sanctuary Access</div>
                    <div className="text-xs text-[#7A5862] mt-1">Manage authentication, passcode, and data</div>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left p-4 bg-[#FAF6F0] border border-[#EADBCE] rounded-[16px] hover:border-[#E8CAD0] hover:bg-[#FBECEE] transition-all text-[#9F4855]"
                  >
                    <div className="font-medium">Sign Out</div>
                    <div className="text-xs text-[#7A5862] mt-1">Leave your sanctuary</div>
                  </button>
                </div>
              </div>
            )}
          </div>
          <nav
            aria-label="Mobile Navigation"
            className="h-[80px] bg-[#FAF6F0] border-t border-[#EADBCE] grid grid-cols-4 items-center px-4 shrink-0 z-20 fixed bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom)]"
          >
            <button
              onClick={() => setCurrentSection('home')}
              className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                currentSection === 'home' ? 'text-[#4A2B33]' : 'text-[#9A7D86] hover:text-[#4A2B33]'
              }`}
            >
              <span className="text-xl leading-none">🏠</span>
              <span className="text-[10px] font-medium mt-1">Home</span>
            </button>
            <button
              onClick={() => setCurrentSection('track')}
              className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                currentSection === 'track' ? 'text-[#4A2B33]' : 'text-[#9A7D86] hover:text-[#4A2B33]'
              }`}
            >
              <span className="text-xl leading-none">📝</span>
              <span className="text-[10px] font-medium mt-1">Track</span>
            </button>
            <button
              onClick={() => setCurrentSection('insights')}
              className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                currentSection === 'insights' ? 'text-[#4A2B33]' : 'text-[#9A7D86] hover:text-[#4A2B33]'
              }`}
            >
              <span className="text-xl leading-none">📊</span>
              <span className="text-[10px] font-medium mt-1">Insights</span>
            </button>
            <button
              onClick={() => setCurrentSection('profile')}
              className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                currentSection === 'profile' ? 'text-[#4A2B33]' : 'text-[#9A7D86] hover:text-[#4A2B33]'
              }`}
            >
              <span className="text-xl leading-none">👤</span>
              <span className="text-[10px] font-medium mt-1">Profile</span>
            </button>
          </nav>
        </div>
      </div>
      <AccountMenuModal
        isOpen={accountModalOpen}
        currentUser={currentUser}
        userProfile={effectiveProfile}
        onClose={() => setAccountModalOpen(false)}
        onSignOut={handleSignOut}
        onOpenAuth={handleOpenAuth}
      />
    </div>
  );

  const renderDesktopApp = () => (
    <DesktopApp
      entries={entries}
      onSaveEntry={handleSaveEntry}
      userName={effectiveProfile.userName}
      userProfile={effectiveProfile}
      currentUser={currentUser}
      onUpdatePeriodStart={handleUpdatePeriodStart}
      onAuthSuccess={handleAuthSuccess}
      onSignOut={handleSignOut}
      onStartOnboarding={handleContinueOnboarding}
      activeTab={
        currentSection === 'home' ? 'today' :
        currentSection === 'track' ? 'log' :
        currentSection === 'insights' ? 'history' :
        undefined
      }
      onTabChange={(tab) => {
        if (tab === 'today') setCurrentSection('home');
        else if (tab === 'log') setCurrentSection('track');
        else if (tab === 'history') setCurrentSection('insights');
        else if (tab === 'auth') handleOpenAuth('login');
      }}
      accountModalOpen={currentSection === 'profile'}
      onAccountModalClose={() => setCurrentSection('home')}
    />
  );

  return (
    <div className="min-h-screen bg-[#EDE7DF] flex flex-col font-sans selection:bg-[#C99A86]/20">
      {isMobileView ? renderMobileApp() : renderDesktopApp()}
    </div>
  );
}