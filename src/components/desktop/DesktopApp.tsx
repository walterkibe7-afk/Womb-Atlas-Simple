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
  onAuthSuccess?: (user: AuthUser) => void;
  onSignOut?: () => void;
  onStartOnboarding?: () => void;
  initialAuthMode?: 'login' | 'signup';
}

export type DesktopTab = 'today' | 'log' | 'history' | 'auth';

export const DesktopApp: React.FC<DesktopAppProps> = ({
  entries,
  onSaveEntry,
  userName = 'Achieng',
  userProfile,
  currentUser,
  onUpdatePeriodStart,
  onAuthSuccess,
  onSignOut,
  onStartOnboarding,
  initialAuthMode = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<DesktopTab>('today');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialAuthMode);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const todayEntry = entries.find((e) => e.date === '2026-11-07');

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setActiveTab('auth');
  };

  const handleAuthComplete = (user: AuthUser) => {
    if (onAuthSuccess) {
      onAuthSuccess(user);
    }
    setActiveTab('today');
  };

  const isGuest = !currentUser || currentUser.provider === 'local';

  return (
    <div className="w-full min-h-screen bg-[#F7F3EC] text-[#4A2B33] flex flex-col font-sans">
      {/* Top Bar (Follows Top Bar Contract: 3 Zones) */}
      <header className="border-b border-[#EADBCE] bg-[#FAF6F0]/90 backdrop-blur-xs px-8 lg:px-16 py-3.5 flex items-center justify-between gap-6 sticky top-0 z-30">
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('today')}
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
          {onStartOnboarding && (
            <button
              onClick={onStartOnboarding}
              className="whitespace-nowrap transition-colors pb-0.5 hover:text-[#4A2B33]"
            >
              First-login steps
            </button>
          )}
          <button
            onClick={() => handleOpenAuth('login')}
            className={`whitespace-nowrap transition-colors pb-0.5 ${
              activeTab === 'auth'
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
              onClick={() => setAccountModalOpen(true)}
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
            onClick={() => setActiveTab('log')}
            className="min-h-[38px] px-4 py-2 rounded-full bg-[#4A2B33] text-[#F7F3EC] text-xs font-medium hover:bg-[#3B2229] transition-all whitespace-nowrap shadow-xs"
          >
            Log today
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 lg:px-12 py-8 flex flex-col justify-center">
        {activeTab === 'today' && (
          <DesktopToday
            entries={entries}
            onNavigate={(tab) => setActiveTab(tab)}
            userName={currentUser?.name || userName}
            userProfile={userProfile}
            onUpdatePeriodStart={onUpdatePeriodStart}
          />
        )}

        {activeTab === 'log' && (
          <DesktopLog
            existingEntry={todayEntry}
            onSave={onSaveEntry}
            onCancel={() => setActiveTab('today')}
          />
        )}

        {activeTab === 'history' && (
          <DesktopHistory
            entries={entries}
            onBackToToday={() => setActiveTab('today')}
          />
        )}

        {activeTab === 'auth' && (
          <AuthPage
            initialMode={authMode}
            isMobileView={false}
            onSuccess={handleAuthComplete}
            onContinueGuest={() => setActiveTab('today')}
            onCancel={() => setActiveTab('today')}
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
        isOpen={accountModalOpen}
        currentUser={currentUser}
        userProfile={userProfile}
        onClose={() => setAccountModalOpen(false)}
        onSignOut={() => {
          if (onSignOut) onSignOut();
        }}
        onOpenAuth={(mode) => handleOpenAuth(mode)}
      />
    </div>
  );
};

