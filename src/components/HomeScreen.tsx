import { LandingScreen } from './LandingScreen';
import { DailyEntry, UserProfile, AuthUser } from '../types';

interface HomeScreenProps {
  entries: DailyEntry[];
  onNavigate: (screen: 'home' | 'log' | 'history') => void;
  userName?: string;
  userProfile?: UserProfile;
  currentUser?: AuthUser;
  onUpdatePeriodStart?: (date: string) => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onOpenAccount?: () => void;
  onContinueOnboarding?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  entries,
  onNavigate,
  userName,
  userProfile,
  currentUser,
  onUpdatePeriodStart,
  onOpenAuth,
  onOpenAccount,
  onContinueOnboarding,
}) => {
  return (
    <LandingScreen
      entries={entries}
      onNavigate={(screen) => onNavigate(screen === 'home' ? 'home' : screen)}
      userName={userName}
      userProfile={userProfile}
      currentUser={currentUser}
      onUpdatePeriodStart={onUpdatePeriodStart}
      onOpenAuth={onOpenAuth}
      onOpenAccount={onOpenAccount}
      isDesktop={false}
      onContinueOnboarding={onContinueOnboarding}
    />
  );
};