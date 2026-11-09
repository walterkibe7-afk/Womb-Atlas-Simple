import { LandingScreen } from '../LandingScreen';
import { DailyEntry, UserProfile } from '../../types';

interface DesktopTodayProps {
  entries: DailyEntry[];
  onNavigate: (tab: 'today' | 'log' | 'history') => void;
  userName?: string;
  userProfile?: UserProfile;
  onUpdatePeriodStart?: (date: string) => void;
  onContinueOnboarding?: () => void;
}

export const DesktopToday: React.FC<DesktopTodayProps> = ({
  entries,
  onNavigate,
  userName,
  userProfile,
  onUpdatePeriodStart,
  onContinueOnboarding,
}) => {
  return (
    <LandingScreen
      entries={entries}
      onNavigate={(screen) => onNavigate(screen === 'home' ? 'today' : screen)}
      userName={userName}
      userProfile={userProfile}
      currentUser={undefined}
      onUpdatePeriodStart={onUpdatePeriodStart}
      onOpenAuth={undefined}
      onOpenAccount={undefined}
      isDesktop={true}
      onContinueOnboarding={onContinueOnboarding}
    />
  );
};