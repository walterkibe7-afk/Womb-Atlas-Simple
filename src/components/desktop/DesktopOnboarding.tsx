import React from 'react';
import { motion } from 'motion/react';
import { UnlockScreen } from '../onboarding/UnlockScreen';
import { OnboardingFlow, OnboardingStepKey } from '../onboarding/OnboardingFlow';
import { UserProfile } from '../../types';
import { Check, ShieldCheck, ArrowRight } from 'lucide-react';

export type DesktopStepKey =
  | 'unlock'
  | 'onboarding-privacy'
  | 'onboarding-social'
  | 'onboarding-discovery'
  | 'onboarding-birth-year'
  | 'onboarding-measurements'
  | 'onboarding-knowledge'
  | 'onboarding-feelings'
  | 'onboarding-regularity'
  | 'onboarding-period'
  | 'onboarding-rhythm'
  | 'onboarding-birth-control'
  | 'onboarding-health-conditions'
  | 'onboarding-discharge'
  | 'onboarding-lifestyle'
  | 'onboarding-pledge'
  | 'onboarding-security'
  | 'onboarding-notifications'
  | 'onboarding-loading'
  | 'onboarding-plan';

interface DesktopOnboardingProps {
  currentStep: DesktopStepKey;
  onPasscodeSet: (pin?: string) => void;
  onSkipPasscode: () => void;
  onOnboardingComplete: (data: Partial<UserProfile>) => void;
  onNavigateStep: (step: DesktopStepKey) => void;
  onCancelToHome?: () => void;
}

const STEPS = [
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
] as const;

export const DesktopOnboarding: React.FC<DesktopOnboardingProps> = ({
  currentStep,
  onPasscodeSet,
  onSkipPasscode,
  onOnboardingComplete,
  onNavigateStep,
  onCancelToHome,
}) => {
  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

  const getStepKey = (): OnboardingStepKey => {
    switch (currentStep) {
      case 'onboarding-privacy':
        return 'privacy';
      case 'onboarding-social':
        return 'social-intro';
      case 'onboarding-discovery':
        return 'discovery';
      case 'onboarding-birth-year':
        return 'birth-year';
      case 'onboarding-measurements':
        return 'body-measurements';
      case 'onboarding-knowledge':
        return 'period-knowledge';
      case 'onboarding-feelings':
        return 'feelings';
      case 'onboarding-regularity':
        return 'period-regularity';
      case 'onboarding-period':
        return 'period-start';
      case 'onboarding-rhythm':
        return 'rhythm';
      case 'onboarding-birth-control':
        return 'birth-control';
      case 'onboarding-health-conditions':
        return 'health-conditions';
      case 'onboarding-discharge':
        return 'discharge';
      case 'onboarding-lifestyle':
        return 'lifestyle-impacts';
      case 'onboarding-pledge':
        return 'pledge-commitment';
      case 'onboarding-security':
        return 'security-cert';
      case 'onboarding-notifications':
        return 'notifications';
      case 'onboarding-loading':
        return 'lens-loading';
      case 'onboarding-plan':
        return 'plan-pricing';
      default:
        return 'privacy';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 flex flex-col items-center">
      {/* Top Breadcrumb & Progress (Felt, calm, not a clinical progress bar) */}
      <div className="w-full max-w-2xl mb-4 flex items-center justify-between text-xs overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 flex-nowrap py-1">
          {STEPS.map((s, idx) => {
            const isActive = s.id === currentStep;
            const isCompleted = currentStepIndex > idx;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onNavigateStep(s.id as DesktopStepKey)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all text-[11px] font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-[#4A2B33] text-[#F7F3EC] shadow-xs'
                    : isCompleted
                    ? 'bg-[#EEF3ED] text-[#5B6D55]'
                    : 'bg-[#FAF6F0] text-[#7A5862] hover:text-[#4A2B33] border border-[#EADBCE]'
                }`}
              >
                {isCompleted && <Check size={11} className="stroke-[2.5]" />}
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {onCancelToHome && (
          <button
            type="button"
            onClick={onCancelToHome}
            className="text-xs text-[#7A5862] hover:text-[#4A2B33] underline decoration-[#C99A86]/60 underline-offset-4 ml-3 whitespace-nowrap shrink-0"
          >
            Skip to home
          </button>
        )}
      </div>

      {/* Main Sanctuary Card Container for Onboarding */}
      <div className="w-full max-w-md bg-[#FAF6F0] border border-[#EADBCE] rounded-[32px] shadow-[0_12px_40px_rgba(74,43,51,0.06)] overflow-hidden min-h-[640px] flex flex-col relative">
        <div className="p-1 sm:p-2 flex-1 flex flex-col">
          {currentStep === 'unlock' ? (
            <UnlockScreen
              onPasscodeSet={onPasscodeSet}
              onSkip={onSkipPasscode}
            />
          ) : (
            <OnboardingFlow
              initialStepKey={getStepKey()}
              onStepChange={(stepKey) => {
                const stepMap: Record<OnboardingStepKey, DesktopStepKey> = {
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
                onNavigateStep(stepMap[stepKey]);
              }}
              onBackToUnlock={() => onNavigateStep('unlock')}
              onComplete={onOnboardingComplete}
            />
          )}
        </div>

        {/* Gentle Footer Security Assurance */}
        <div className="bg-[#FAF6F0] border-t border-[#EADBCE]/70 px-6 py-2.5 flex items-center justify-between text-[11px] text-[#7A5862]">
          <span className="flex items-center gap-1.5 text-[#5B6D55]">
            <ShieldCheck size={13} />
            <span>Private by design · No third-party data tracking</span>
          </span>
          <span className="font-serif italic text-[#C99A86]">Womb Atlas</span>
        </div>
      </div>
    </div>
  );
};
