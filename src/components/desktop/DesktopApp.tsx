import React, { useState } from 'react';
import { DailyEntry, AuthUser, UserProfile } from '../../types';
import { DesktopToday } from './DesktopToday';
import { DesktopLog } from './DesktopLog';
import { DesktopHistory } from './DesktopHistory';
import { AuthPage } from '../auth/AuthPage';
import { AccountMenuModal } from '../auth/AccountMenuModal';
import { User, LogIn, ShieldCheck } from 'lucide-react';

interface DesktopAppProps {
  entries: DailyEntry[];
  onSaveEntry: (entry: Omit<DailyEntry, 'id' | 'createdAt'>) => void;
  userName?: string;
  userProfile?: UserProfile;
  currentUser?: AuthUser;
  onUpdatePeriodStart?: (date: string) => void;
  onSwitchToMobile?: () => void;
  onSwitchToDesktop?: () => void;
  onAuthSuccess?: (user: AuthUser) => void;
  onSignOut?: () => void;
  onStartOnboarding?: () => void;
  initialAuthMode?: 'login' | 'signup';
  activeTab?: DesktopTab;
  onTabChange?: (tab: DesktopTab) => void;
  accountModalOpen?: boolean;
  onAccountModalClose?: () => void;
}

export type DesktopTab = 'today' | 'log' | 'history' | 'auth';

export const DesktopApp: React.FC<DesktopAppProps> = ({
  entries,
  onSaveEntry,
  userName = 'Achieng',
  userProfile,
  currentUser,
  onUpdatePeriodStart,
  onSwitchToMobile,
  onSwitchToDesktop,
  onAuthSuccess,
  onSignOut,
  onStartOnboarding,
  initialAuthMode = 'login',
  activeTab: controlledActiveTab,
  onTabChange,
  accountModalOpen,
  onAccountModalClose,
}) => {
  const [activeTab, setActiveTab] = useState<DesktopTab>('today');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialAuthMode);
  const [accountModalOpenInternal, setAccountModalOpenInternal] = useState(false);
  const todayEntry = entries.find((e) => e.date === '2026-11-07');

  const isControlled = controlledActiveTab !== undefined;
  const currentTab = isControlled ? controlledActiveTab : activeTab;
  const setCurrentTab = isControlled ? onTabChange! : setActiveTab;

  const isAccountModalOpen = accountModalOpen ?? accountModalOpenInternal;
  const closeAccountModal = () => {
    if (accountModalOpen !== undefined && onAccountModalClose) {
      onAccountModalClose();
    } else {
      setAccountModalOpenInternal(false);
    }
  };
  const openAccountModal = () => {
    if (accountModalOpen !== undefined && onAccountModalClose) {
      // Parent controls the modal
    } else {
      setAccountModalOpenInternal(true);
    }
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setCurrentTab('auth');
  };

  const handleAuthTabClick = () => {
    if (currentTab === 'auth') {
      setAuthMode((prev) => (prev === 'login' ? 'signup' : 'login'));
    } else {
      setCurrentTab('auth');
    }
  };

  const handleAuthComplete = (user: AuthUser) => {
    if (onAuthSuccess) {
      onAuthSuccess(user);
    }
    setCurrentTab('today');
  };

  const isGuest = !currentUser || currentUser.provider === 'local';

  return (
    <div className="w-full min-h-screen bg-[#F7F3EC] text-[#4A2B33] flex flex-col font-sans">
      {/* Top Bar (Follows Top Bar Contract: 3 Zones) */}
      <header className="border-b border-[#EADBCE] bg-[#FAF6F0]/90 backdrop-blur-xs px-8 lg:px-16 py-3.5 flex items-center justify-between gap-6 sticky top-0 z-30">
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentTab('today')}
            className="font-serif text-xl font-medium tracking-tight text-[#4A2B33] hover:text-[#3B2229] transition-colors whitespace-nowrap text-left"
          >
            Womb Atlas
          </button>
          <span className="text-xs text-[#7A5862] hidden sm:inline whitespace-nowrap">
            · Saturday, November 7
          </span>
        </div>

        {/* Zone 2: Clean single-line text links */}
        <nav className="flex items-center gap-7 text-sm text-[#7A5862]">
          <button
            onClick={() => setCurrentTab('today')}
            className={`whitespace-nowrap transition-colors pb-0.5 ${
              currentTab === 'today'
                ? 'text-[#4A2B33] font-medium border-b-2 border-[#4A2B33]'
                : 'hover:text-[#4A2B33]'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setCurrentTab('log')}
            className={`whitespace-nowrap transition-colors pb-0.5 ${
              currentTab === 'log'
                ? 'text-[#4A2B33] font-medium border-b-2 border-[#4A2B33]'
                : 'hover:text-[#4A2B33]'
            }`}
          >
            Daily entry
          </button>
          <button
            onClick={() => setCurrentTab('history')}
            className={`whitespace-nowrap transition-colors pb-0.5 ${
              currentTab === 'history'
                ? 'text-[#4A2B33] font-medium border-b-2 border-[#4A2B33]'
                : 'hover:text-[#4A2B33]'
            }`}
          >
            Cycle history
          </button>
          {onStartOnboarding && (
            <button
              onClick={onStartOnboarding}
              className="whitespace-nowrap transition-colors pb-0.5 hover:text-[#4A2B33]"
            >
              First-login steps
            </button>
          )}
          <button
            onClick={handleAuthTabClick}
            className={`whitespace-nowrap transition-colors pb-0.5 ${
              currentTab === 'auth'
                ? 'text-[#4A2B33] font-medium border-b-2 border-[#4A2B33]'
                : 'hover:text-[#4A2B33]'
            }`}
          >
            Sanctuary access
          </button>
        </nav>

        {/* Zone 3: Account & Primary CTA Button */}
        <div className="flex items-center gap-3 shrink-0">
          {!isGuest ? (
            <button
              onClick={openAccountModal}
              className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-[#FAF6F0] hover:bg-white border border-[#EADBCE] text-xs text-[#4A2B33] transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-[#EFE7DE] flex items-center justify-center font-serif text-xs font-medium text-[#4A2B33]">
                {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <span className="font-medium hidden sm:inline">{currentUser?.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#A8B5A2]"></span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleOpenAuth('login')}
                className="text-xs text-[#7A5862] hover:text-[#4A2B33] px-3 py-1.5 rounded-full hover:bg-[#EFE7DE] transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => handleOpenAuth('signup')}
                className="text-xs text-[#4A2B33] font-medium px-3.5 py-1.5 rounded-full bg-[#FAF6F0] border border-[#EADBCE] hover:border-[#C99A86] transition-colors hidden sm:inline"
              >
                Sign up
              </button>
            </div>
          )}

          <button
            onClick={() => setCurrentTab('log')}
            className="min-h-[38px] px-4 py-2 rounded-full bg-[#4A2B33] text-[#F7F3EC] text-xs font-medium hover:bg-[#3B2229] transition-all whitespace-nowrap shadow-xs"
          >
            Log today
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 lg:px-12 py-8 flex flex-col justify-center">
        {currentTab === 'today' && (
          <DesktopToday
            entries={entries}
            onNavigate={(tab) => setCurrentTab(tab)}
            userName={currentUser?.name || userName}
            userProfile={userProfile}
            onUpdatePeriodStart={onUpdatePeriodStart}
            onContinueOnboarding={onStartOnboarding}
          />
        )}

        {currentTab === 'log' && (
          <DesktopLog
            existingEntry={todayEntry}
            onSave={onSaveEntry}
            onCancel={() => setCurrentTab('today')}
          />
        )}

        {currentTab === 'history' && (
          <DesktopHistory
            entries={entries}
            onBackToToday={() => setCurrentTab('today')}
          />
        )}

        {currentTab === 'auth' && (
          <AuthPage
            initialMode={authMode}
            isMobileView={false}
            onSuccess={handleAuthComplete}
            onContinueGuest={() => setCurrentTab('today')}
            onCancel={() => setCurrentTab('today')}
          />
        )}
      </main>

      {/* Desktop Footer */}
      <footer className="border-t border-[#EADBCE] px-8 lg:px-16 py-6 text-xs text-[#7A5862] flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-[#A8B5A2]" />
          <span>Womb Atlas · Private, local-first menstrual care</span>
        </div>
        <span>A calm companion for your reproductive health</span>
      </footer>

      {/* Account Menu Modal */}
      <AccountMenuModal
        isOpen={isAccountModalOpen}
        currentUser={currentUser}
        userProfile={userProfile}
        onClose={closeAccountModal}
        onSignOut={() => {
          if (onSignOut) onSignOut();
          setCurrentTab('today');
        }}
        onOpenAuth={(mode) => handleOpenAuth(mode)}
      />
    </div>
  );
};

