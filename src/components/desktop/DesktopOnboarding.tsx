import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { OnboardingFlow, OnboardingStepKey } from '../onboarding/OnboardingFlow';
import { UserProfile } from '../../types';
import { Check, ShieldCheck, ArrowRight } from 'lucide-react';

export type DesktopStepKey =
  | 'onboarding-privacy'
  | 'onboarding-unlock'
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
  onSkipAll?: () => void;
}

const STEPS: { id: DesktopStepKey; key: OnboardingStepKey }[] = [
  { id: 'onboarding-privacy', key: 'privacy' },
  { id: 'onboarding-unlock', key: 'unlock' },
  { id: 'onboarding-social', key: 'social-intro' },
  { id: 'onboarding-discovery', key: 'discovery' },
  { id: 'onboarding-birth-year', key: 'birth-year' },
  { id: 'onboarding-measurements', key: 'body-measurements' },
  { id: 'onboarding-knowledge', key: 'period-knowledge' },
  { id: 'onboarding-feelings', key: 'feelings' },
  { id: 'onboarding-regularity', key: 'period-regularity' },
  { id: 'onboarding-period', key: 'period-start' },
  { id: 'onboarding-rhythm', key: 'rhythm' },
  { id: 'onboarding-birth-control', key: 'birth-control' },
  { id: 'onboarding-health-conditions', key: 'health-conditions' },
  { id: 'onboarding-discharge', key: 'discharge' },
  { id: 'onboarding-lifestyle', key: 'lifestyle-impacts' },
  { id: 'onboarding-pledge', key: 'pledge-commitment' },
  { id: 'onboarding-security', key: 'security-cert' },
  { id: 'onboarding-notifications', key: 'notifications' },
  { id: 'onboarding-loading', key: 'lens-loading' },
  { id: 'onboarding-plan', key: 'plan-pricing' },
];

const ONBOARDING_STEPS = STEPS;

export const DesktopOnboarding: React.FC<DesktopOnboardingProps> = ({
  currentStep,
  onPasscodeSet,
  onSkipPasscode,
  onOnboardingComplete,
  onNavigateStep,
  onCancelToHome,
  onSkipAll,
}) => {
  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    const idx = ONBOARDING_STEPS.findIndex((s) => s.id === currentStep);
    if (idx >= 0) {
      setProgressPercent(Math.round(((idx + 1) / ONBOARDING_STEPS.length) * 100));
    }
  }, [currentStep]);

  const getStepKey = (): OnboardingStepKey => {
    const step = STEPS.find((s) => s.id === currentStep);
    return step?.key || 'privacy';
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 flex flex-col items-center">
      {/* Progress Indicator: Thin line with percentage */}
      <div className="w-full max-w-2xl mb-4 flex flex-col items-center gap-2">
        <div className="w-full h-1 bg-[#EADBCE] rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Onboarding progress">
          <motion.div className="h-full bg-[#C99A86]" initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.4, ease: 'easeOut' }} />
        </div>
        <p className="text-right text-[10px] text-[#7A5862] font-serif">{progressPercent}%</p>
      </div>

      {onCancelToHome && (
        <div className="w-full max-w-2xl mb-4 text-right">
          <button type="button" onClick={onCancelToHome} className="text-xs text-[#7A5862] hover:text-[#4A2B33] underline decoration-[#C99A86]/60 underline-offset-4 whitespace-nowrap">Skip to home</button>
        </div>
      )}

      {/* Main Sanctuary Card Container for Onboarding */}
      <div className="w-full max-w-md bg-[#FAF6F0] border border-[#EADBCE] rounded-[32px] shadow-[0_12px_40px_rgba(74,43,51,0.06)] overflow-hidden min-h-[640px] flex flex-col relative">
        <div className="p-1 sm:p-2 flex-1 flex flex-col">
          <OnboardingFlow
            initialStepKey={getStepKey()}
            onStepChange={(stepKey) => {
              const stepMap: Record<OnboardingStepKey, DesktopStepKey> = {
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
              onNavigateStep(stepMap[stepKey]);
            }}
            onComplete={onOnboardingComplete}
            onSkipAll={onSkipAll}
          />
        </div>

        {/* Gentle Footer Security Assurance */}
        <div className="bg-[#FAF6F0] border-t border-[#EADBCE]/70 px-6 py-2.5 flex items-center justify-between text-[11px] text-[#7A5862]">
          <span className="flex items-center gap-1.5 text-[#5B6D55]"><ShieldCheck size={13} /><span>Private by design · No third-party data tracking</span></span>
          <span className="font-serif italic text-[#C99A86]">Womb Atlas</span>
        </div>
      </div>
    </div>
  );
};