import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useReducedMotion } from 'framer-motion';
import { LifeStage, UserProfile, PeriodFeeling } from '../../types';
import { PrivacyFirstScreen } from './PrivacyFirstScreen';
import { UnlockScreen } from './UnlockScreen';
import { SocialProofIntroScreen } from './SocialProofIntroScreen';
import { DiscoverySourceScreen } from './DiscoverySourceScreen';
import { BirthYearScreen } from './BirthYearScreen';
import { BodyMeasurementsScreen } from './BodyMeasurementsScreen';
import { PeriodKnowledgeScreen } from './PeriodKnowledgeScreen';
import { PeriodFeelingsScreen } from './PeriodFeelingsScreen';
import { PeriodRegularityScreen } from './PeriodRegularityScreen';
import { BirthControlScreen } from './BirthControlScreen';
import { HealthConditionsScreen } from './HealthConditionsScreen';
import { DischargeEducationScreen } from './DischargeEducationScreen';
import { LifestyleImpactsScreen } from './LifestyleImpactsScreen';
import { PledgeCommitmentScreen } from './PledgeCommitmentScreen';
import { SecurityCertScreen } from './SecurityCertScreen';
import { NotificationOptInScreen } from './NotificationOptInScreen';
import { LensLoadingScreen } from './LensLoadingScreen';
import { PlanPricingScreen } from './PlanPricingScreen';
import { AnimatedPeriodCalendar } from './AnimatedPeriodCalendar';

export type OnboardingStepKey =
  | 'privacy'
  | 'unlock'
  | 'social-intro'
  | 'discovery'
  | 'birth-year'
  | 'body-measurements'
  | 'period-knowledge'
  | 'feelings'
  | 'period-regularity'
  | 'period-start'
  | 'rhythm'
  | 'birth-control'
  | 'health-conditions'
  | 'discharge'
  | 'lifestyle-impacts'
  | 'pledge-commitment'
  | 'security-cert'
  | 'notifications'
  | 'lens-loading'
  | 'plan-pricing';

interface OnboardingFlowProps {
  onComplete: (profile: Partial<UserProfile>) => void;
  initialStepKey?: OnboardingStepKey;
  onStepChange?: (stepKey: OnboardingStepKey) => void;
  onSkipAll?: () => void;
  onProgress?: (percent: number) => void;
}

const STEPS: OnboardingStepKey[] = [
  'privacy',
  'unlock',
  'social-intro',
  'discovery',
  'birth-year',
  'body-measurements',
  'period-knowledge',
  'feelings',
  'period-regularity',
  'period-start',
  'rhythm',
  'birth-control',
  'health-conditions',
  'discharge',
  'lifestyle-impacts',
  'pledge-commitment',
  'security-cert',
  'notifications',
  'lens-loading',
  'plan-pricing',
];

const LIFE_STAGES: { id: LifeStage; label: string }[] = [
  { id: 'currently-cycling', label: 'currently cycling' },
  { id: 'postpartum', label: 'postpartum' },
  { id: 'perimenopause', label: 'perimenopause' },
  { id: 'pregnant-recovering', label: 'pregnant/recovering' },
  { id: 'not-sure', label: 'not sure' },
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
  initialStepKey = 'privacy',
  onStepChange,
  onSkipAll,
  onProgress,
}) => {
  const [stepKey, setStepKey] = useState<OnboardingStepKey>(initialStepKey);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  React.useEffect(() => {
    setStepKey(initialStepKey);
  }, [initialStepKey]);

  const prefersReducedMotion = useReducedMotion();

  const updateStep = (nextKey: OnboardingStepKey) => {
    setStepKey(nextKey);
    if (onStepChange) {
      onStepChange(nextKey);
    }
    if (onProgress && !privacyAccepted && nextKey !== 'privacy') {
      setPrivacyAccepted(true);
    }
    if (onProgress) {
      const currentIndex = STEPS.indexOf(stepKey);
      const nextIndex = STEPS.indexOf(nextKey);
      if (nextIndex > currentIndex) {
        const percent = Math.round(((nextIndex) / (STEPS.length - 1)) * 100);
        onProgress(percent);
      }
    }
  };

  const handleSkipAll = () => {
    if (onSkipAll) {
      onSkipAll();
    }
  };

  const handleFinishAll = () => {
    if (onProgress) onProgress(100);
    onComplete({
      userName: 'Achieng',
      birthYear,
      discoverySource,
      periodFeeling,
      agreedToPrivacyPolicy: agreedPrivacy,
      agreedToHealthData: agreedHealth,
      agreedToAppActivity: agreedActivity,
      periodKnowledge,
      periodsRegular,
      birthControl,
      healthConditions,
      knowsDischargeChanges,
      todaySymptoms,
      cycleSymptoms,
      impactsSleep,
      mentalHealthImpacts,
      impactsEnergy,
      impactsDiet,
      heightUnit,
      heightFeet,
      heightInches,
      heightCm,
      weightUnit,
      weightKg,
      weightLbs,
      hasCommitted: true,
      notificationsAllowed,
      selectedPlan,
      lastPeriodStart: isNotSure ? undefined : selectedDate,
      lifeStage,
      cycleLength,
      periodLength,
      usesHormonalBirthControl,
      hasCompletedOnboarding: true,
    });
  };

  const [agreedPrivacy, setAgreedPrivacy] = useState(true);
  const [agreedHealth, setAgreedHealth] = useState(true);
  const [agreedActivity, setAgreedActivity] = useState(true);
  const [discoverySource, setDiscoverySource] = useState('friend');
  const [birthYear, setBirthYear] = useState<number>(1998);
  const [heightUnit, setHeightUnit] = useState<'imperial' | 'metric'>('imperial');
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(4);
  const [heightCm, setHeightCm] = useState<number>(163);
  const [weightUnit, setWeightUnit] = useState<'metric' | 'imperial'>('metric');
  const [weightKg, setWeightKg] = useState<number>(60);
  const [weightLbs, setWeightLbs] = useState<number>(132);
  const [periodKnowledge, setPeriodKnowledge] = useState<'expert' | 'learning' | 'little' | 'whats-a-period'>('learning');
  const [periodFeeling, setPeriodFeeling] = useState<PeriodFeeling>('love-hate');
  const [periodsRegular, setPeriodsRegular] = useState<'yes' | 'no' | 'not-sure'>('yes');
  const [selectedDate, setSelectedDate] = useState<string | undefined>('2026-11-05');
  const [isNotSure, setIsNotSure] = useState<boolean>(false);
  const [lifeStage, setLifeStage] = useState<LifeStage | undefined>('currently-cycling');
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodLength, setPeriodLength] = useState<number>(5);
  const [usesHormonalBirthControl, setUsesHormonalBirthControl] = useState<boolean>(false);
  const [birthControl, setBirthControl] = useState<string>('nothing');
  const [healthConditions, setHealthConditions] = useState<string[]>(['none']);
  const [knowsDischargeChanges, setKnowsDischargeChanges] = useState<'yes' | 'no'>('no');
  const [todaySymptoms, setTodaySymptoms] = useState<string[]>([]);
  const [cycleSymptoms, setCycleSymptoms] = useState<string[]>(['cramps']);
  const [impactsSleep, setImpactsSleep] = useState<'yes' | 'no' | 'not-sure'>('yes');
  const [mentalHealthImpacts, setMentalHealthImpacts] = useState<string[]>(['mood-swings']);
  const [impactsEnergy, setImpactsEnergy] = useState<'yes' | 'no' | 'not-sure'>('yes');
  const [impactsDiet, setImpactsDiet] = useState<'yes' | 'no' | 'not-sure'>('yes');
  const [notificationsAllowed, setNotificationsAllowed] = useState<boolean>(true);
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly' | 'trial'>('yearly');

  const showProgress = privacyAccepted || stepKey !== 'privacy';
  const currentIndex = STEPS.indexOf(stepKey);
  const progressPercent = privacyAccepted ? Math.round((currentIndex / (STEPS.length - 1)) * 100) : 0;

  return (
    <div className="h-full w-full">
      {showProgress && (
        <div className="w-full px-5 pt-2 pb-1" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Onboarding progress">
          <div className="h-1 bg-[#EADBCE] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#C99A86]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <p className="text-right text-[10px] text-[#7A5862] mt-1 font-serif">{progressPercent}%</p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {stepKey === 'privacy' && (
          <motion.div key="step-privacy" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="h-full">
            <PrivacyFirstScreen
              onContinue={(agreements) => {
                setAgreedPrivacy(agreements.privacyPolicy);
                setAgreedHealth(agreements.healthData);
                setAgreedActivity(agreements.appActivity);
                updateStep('unlock');
              }}
              onSkipAll={handleSkipAll}
            />
          </motion.div>
        )}

        {stepKey === 'unlock' && (
          <motion.div key="step-unlock" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="h-full">
            <UnlockScreen
              onPasscodeSet={() => updateStep('social-intro')}
              onSkip={() => updateStep('social-intro')}
              onSkipAll={handleSkipAll}
            />
          </motion.div>
        )}

        {stepKey === 'social-intro' && (
          <motion.div key="step-social-intro" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="h-full">
            <SocialProofIntroScreen
              onContinue={() => updateStep('discovery')}
              onSkipAll={handleSkipAll}
            />
          </motion.div>
        )}

        {stepKey === 'discovery' && (
          <motion.div key="step-discovery" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="h-full">
            <DiscoverySourceScreen
              onContinue={(source) => {
                setDiscoverySource(source);
                updateStep('birth-year');
              }}
              onSkipAll={handleSkipAll}
            />
          </motion.div>
        )}

        {stepKey === 'birth-year' && (
          <motion.div key="step-birth-year" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="h-full">
            <BirthYearScreen
              initialYear={birthYear}
              onContinue={(year) => {
                setBirthYear(year);
                updateStep('body-measurements');
              }}
              onSkipAll={handleSkipAll}
            />
          </motion.div>
        )}

        {stepKey === 'body-measurements' && (
          <motion.div key="step-body-measurements" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="h-full">
            <BodyMeasurementsScreen
              onContinue={(m) => {
                setHeightUnit(m.heightUnit);
                if (m.heightFeet !== undefined) setHeightFeet(m.heightFeet);
                if (m.heightInches !== undefined) setHeightInches(m.heightInches);
                if (m.heightCm !== undefined) setHeightCm(m.heightCm);
                setWeightUnit(m.weightUnit);
                if (m.weightKg !== undefined) setWeightKg(m.weightKg);
                if (m.weightLbs !== undefined) setWeightLbs(m.weightLbs);
                updateStep('period-knowledge');
              }}
              onSkipAll={handleSkipAll}
            />
          </motion.div>
        )}

        {stepKey === 'period-knowledge' && (
          <motion.div key="step-period-knowledge" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="h-full">
            <PeriodKnowledgeScreen
              initialValue={periodKnowledge}
              onContinue={(k) => {
                setPeriodKnowledge(k);
                updateStep('feelings');
              }}
              onSkipAll={handleSkipAll}
            />
          </motion.div>
        )}

        {stepKey === 'feelings' && (
          <motion.div key="step-feelings" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="h-full">
            <PeriodFeelingsScreen
              initialFeeling={periodFeeling}
              onContinue={(feeling) => {
                setPeriodFeeling(feeling);
                updateStep('period-regularity');
              }}
              onSkipAll={handleSkipAll}
            />
          </motion.div>
        )}

        {stepKey === 'period-regularity' && (
          <motion.div key="step-period-regularity" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="h-full">
            <PeriodRegularityScreen
              initialValue={periodsRegular}
              onContinue={(r) => {
                setPeriodsRegular(r);
                updateStep('period-start');
              }}
              onSkipAll={handleSkipAll}
            />
          </motion.div>
        )}

        {stepKey === 'period-start' && (
          <AnimatedPeriodCalendar
            key="step-period-start"
            selectedDate={selectedDate}
            onSelectDate={(dateStr) => { setSelectedDate(dateStr); setIsNotSure(false); }}
            onConfirm={() => updateStep('rhythm')}
            onSkip={handleSkipAll}
            cycleLength={cycleLength}
            periodLength={periodLength}
            isNotSure={isNotSure}
            onNotSureChange={setIsNotSure}
          />
        )}

        {stepKey === 'rhythm' && (
          <motion.div key="step-rhythm" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-5 pt-3 pb-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-2">
              <span className="font-serif text-lg tracking-tight text-[#4A2B33] font-medium">Womb Atlas</span>
              <button type="button" onClick={handleSkipAll} className="text-xs text-[#7A5862] hover:text-[#4A2B33] min-h-[44px] px-2 flex items-center">Skip all</button>
            </div>
            <div className="flex-1 flex flex-col justify-between pt-1">
              <div className="space-y-4">
                <div>
                  <h1 className="font-serif text-2xl font-normal text-[#4A2B33] leading-snug">How does your cycle usually run?</h1>
                  <p className="text-xs text-[#7A5862] font-sans mt-1">A rough idea is enough — the app learns as you log.</p>
                </div>
                <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[22px] p-5 shadow-[0_3px_16px_rgba(74,43,51,0.03)] space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="cycle-length-slider" className="text-xs font-medium text-[#7A5862]">Cycle length</label>
                      <span className="font-serif text-base text-[#C99A86] font-medium">{cycleLength} days</span>
                    </div>
                    <input id="cycle-length-slider" type="range" min="21" max="35" step="1" value={cycleLength} onChange={(e) => setCycleLength(Number(e.target.value))} className="w-full h-2 bg-[#EADFD5] rounded-lg appearance-none cursor-pointer accent-[#C99A86]" />
                    <div className="flex justify-between text-[10px] text-[#A48F95] mt-1"><span>21 days</span><span>28 (average)</span><span>35 days</span></div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="period-length-slider" className="text-xs font-medium text-[#7A5862]">Period bleeding length</label>
                      <span className="font-serif text-base text-[#C99A86] font-medium">{periodLength} days</span>
                    </div>
                    <input id="period-length-slider" type="range" min="2" max="7" step="1" value={periodLength} onChange={(e) => setPeriodLength(Number(e.target.value))} className="w-full h-2 bg-[#EADFD5] rounded-lg appearance-none cursor-pointer accent-[#C99A86]" />
                    <div className="flex justify-between text-[10px] text-[#A48F95] mt-1"><span>2 days</span><span>5 (average)</span><span>7 days</span></div>
                  </div>
                  <div className="pt-3 border-t border-[#EADBCE]/70 flex items-center justify-between gap-3">
                    <div>
                      <label htmlFor="hbc-toggle" className="text-xs font-medium text-[#4A2B33] block">Using hormonal birth control?</label>
                      <span className="text-[11px] text-[#7A5862] block mt-0.5">We&apos;ll speak a little more gently about predictions.</span>
                    </div>
                    <button id="hbc-toggle" type="button" role="switch" aria-checked={usesHormonalBirthControl} onClick={() => setUsesHormonalBirthControl((prev) => !prev)} className={`w-12 h-7 rounded-full p-1 transition-colors shrink-0 ${usesHormonalBirthControl ? 'bg-[#A8B5A2]' : 'bg-[#D8CCC1]'}`}>
                      <motion.div animate={{ x: usesHormonalBirthControl ? 20 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="w-5 h-5 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="pt-5 space-y-2.5">
                <button type="button" onClick={() => updateStep('birth-control')} className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"><span>Continue</span><span aria-hidden="true">→</span></button>
                <div className="text-center"><button type="button" onClick={handleSkipAll} className="text-xs text-[#7A5862] hover:text-[#4A2B33] py-2 px-4 transition-colors">Skip all</button></div>
              </div>
            </div>
          </motion.div>
        )}

        {stepKey === 'birth-control' && (
          <motion.div key="step-birth-control" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="h-full">
            <BirthControlScreen
              initialValue={birthControl}
              onContinue={(method) => { setBirthControl(method); updateStep('health-conditions'); }}
              onSkipAll={handleSkipAll}
            />
          </motion.div>
        )}

        {stepKey === 'health-conditions' && (
          <motion.div key="step-health-conditions" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="h-full">
            <HealthConditionsScreen
              initialValues={healthConditions}
              onContinue={(conditions) => { setHealthConditions(conditions); updateStep('discharge'); }}
              onSkipAll={handleSkipAll}
            />
          </motion.div>
        )}

        {stepKey === 'discharge' && (
          <motion.div key="step-discharge" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="h-full">
            <DischargeEducationScreen
              onContinue={(k) => { setKnowsDischargeChanges(k); updateStep('lifestyle-impacts'); }}
              onSkipAll={handleSkipAll}
            />
          </motion.div>
        )}

        {stepKey === 'lifestyle-impacts' && (
          <motion.div key="step-lifestyle-impacts" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="h-full">
            <LifestyleImpactsScreen
              onComplete={(data) => {
                if (data.todaySymptoms) setTodaySymptoms(data.todaySymptoms);
                if (data.cycleSymptoms) setCycleSymptoms(data.cycleSymptoms);
                if (data.impactsSleep) setImpactsSleep(data.impactsSleep);
                if (data.mentalHealthImpacts) setMentalHealthImpacts(data.mentalHealthImpacts);
                if (data.impactsEnergy) setImpactsEnergy(data.impactsEnergy);
                if (data.impactsDiet) setImpactsDiet(data.impactsDiet);
                updateStep('pledge-commitment');
              }}
              onSkipAll={handleSkipAll}
            />
          </motion.div>
        )}

        {stepKey === 'pledge-commitment' && (
          <motion.div key="step-pledge-commitment" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="h-full">
            <PledgeCommitmentScreen
              onContinue={() => updateStep('security-cert')}
              onSkipAll={handleSkipAll}
            />
          </motion.div>
        )}

        {stepKey === 'security-cert' && (
          <motion.div key="step-security-cert" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="h-full">
            <SecurityCertScreen
              onContinue={() => updateStep('notifications')}
              onSkipAll={handleSkipAll}
            />
          </motion.div>
        )}

        {stepKey === 'notifications' && (
          <motion.div key="step-notifications" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="h-full">
            <NotificationOptInScreen
              predictedDate="November 30"
              onContinue={(allowed) => { setNotificationsAllowed(allowed); updateStep('lens-loading'); }}
              onSkipAll={handleSkipAll}
            />
          </motion.div>
        )}

        {stepKey === 'lens-loading' && (
          <motion.div key="step-lens-loading" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} className="h-full">
            <LensLoadingScreen onComplete={() => updateStep('plan-pricing')} onSkipAll={handleSkipAll} />
          </motion.div>
        )}

        {stepKey === 'plan-pricing' && (
          <motion.div key="step-plan-pricing" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="h-full">
            <PlanPricingScreen
              onSelectPlan={(plan) => { setSelectedPlan(plan); handleFinishAll(); }}
              onClose={handleFinishAll}
              onSkipAll={handleSkipAll}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};