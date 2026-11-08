import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LifeStage, UserProfile, PeriodFeeling } from '../../types';
import { PrivacyFirstScreen } from './PrivacyFirstScreen';
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

export type OnboardingStepKey =
  | 'privacy'
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
  onBackToUnlock?: () => void;
}

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
  onBackToUnlock,
}) => {
  const [stepKey, setStepKey] = useState<OnboardingStepKey>(initialStepKey);

  React.useEffect(() => {
    setStepKey(initialStepKey);
  }, [initialStepKey]);

  const updateStep = (nextKey: OnboardingStepKey) => {
    setStepKey(nextKey);
    if (onStepChange) {
      onStepChange(nextKey);
    }
  };

  // State collected across all steps
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

  // Calendar month state for ~90 days back
  const [calendarMonth, setCalendarMonth] = useState<number>(10); // 10 = Nov 2026
  const calendarYear = 2026;

  const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const monthLabel = new Date(calendarYear, calendarMonth, 1).toLocaleDateString(
    'en-US',
    { month: 'long', year: 'numeric' }
  );

  const handleFinishAll = () => {
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

  return (
    <div className="h-full w-full">
      <AnimatePresence mode="wait">
        {/* 1. Privacy First */}
        {stepKey === 'privacy' && (
          <motion.div
            key="step-privacy"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="h-full"
          >
            <PrivacyFirstScreen
              onBack={onBackToUnlock}
              onContinue={(agreements) => {
                setAgreedPrivacy(agreements.privacyPolicy);
                setAgreedHealth(agreements.healthData);
                setAgreedActivity(agreements.appActivity);
                updateStep('social-intro');
              }}
            />
          </motion.div>
        )}

        {/* 2. Social Proof & Community Testimonials */}
        {stepKey === 'social-intro' && (
          <motion.div
            key="step-social-intro"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="h-full"
          >
            <SocialProofIntroScreen
              onBack={() => updateStep('privacy')}
              onContinue={() => updateStep('discovery')}
            />
          </motion.div>
        )}

        {/* 3. Discovery Source ("How did you find out about us?") */}
        {stepKey === 'discovery' && (
          <motion.div
            key="step-discovery"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="h-full"
          >
            <DiscoverySourceScreen
              onBack={() => updateStep('social-intro')}
              onContinue={(source) => {
                setDiscoverySource(source);
                updateStep('birth-year');
              }}
            />
          </motion.div>
        )}

        {/* 4. Birth Year Scroll-Lock Drum Wheel */}
        {stepKey === 'birth-year' && (
          <motion.div
            key="step-birth-year"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="h-full"
          >
            <BirthYearScreen
              initialYear={birthYear}
              onBack={() => updateStep('discovery')}
              onContinue={(year) => {
                setBirthYear(year);
                updateStep('body-measurements');
              }}
            />
          </motion.div>
        )}

        {/* 5. Body Measurements (Height & Weight Scroll-Lock Pickers) */}
        {stepKey === 'body-measurements' && (
          <motion.div
            key="step-body-measurements"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="h-full"
          >
            <BodyMeasurementsScreen
              onBack={() => updateStep('birth-year')}
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
            />
          </motion.div>
        )}

        {/* 6. Period Knowledge Level ("How would you rate your knowledge...?") */}
        {stepKey === 'period-knowledge' && (
          <motion.div
            key="step-period-knowledge"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="h-full"
          >
            <PeriodKnowledgeScreen
              initialValue={periodKnowledge}
              onBack={() => updateStep('body-measurements')}
              onContinue={(k) => {
                setPeriodKnowledge(k);
                updateStep('feelings');
              }}
            />
          </motion.div>
        )}

        {/* 7. Period Feelings (5 Sentiments with Expandable Cards) */}
        {stepKey === 'feelings' && (
          <motion.div
            key="step-feelings"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="h-full"
          >
            <PeriodFeelingsScreen
              initialFeeling={periodFeeling}
              onBack={() => updateStep('period-knowledge')}
              onContinue={(feeling) => {
                setPeriodFeeling(feeling);
                updateStep('period-regularity');
              }}
            />
          </motion.div>
        )}

        {/* 8. Period Regularity ("Are your periods regular?") */}
        {stepKey === 'period-regularity' && (
          <motion.div
            key="step-period-regularity"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="h-full"
          >
            <PeriodRegularityScreen
              initialValue={periodsRegular}
              onBack={() => updateStep('feelings')}
              onContinue={(r) => {
                setPeriodsRegular(r);
                updateStep('period-start');
              }}
            />
          </motion.div>
        )}

        {/* 9. When did your last period start? (Calendar + Life Stage Chips) */}
        {stepKey === 'period-start' && (
          <motion.div
            key="step-period-start"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-5 pt-3 pb-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2">
              <span className="font-serif text-lg tracking-tight text-[#4A2B33] font-medium">
                Womb Atlas
              </span>
              <button
                type="button"
                onClick={() => updateStep('period-regularity')}
                className="text-xs text-[#7A5862] hover:text-[#4A2B33] min-h-[44px] px-2 flex items-center"
              >
                ← Previous
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-between pt-1">
              <div className="space-y-4">
                <div>
                  <h1 className="font-serif text-2xl font-normal text-[#4A2B33] leading-snug">
                    When did your last period start?
                  </h1>
                  <p className="text-xs text-[#7A5862] font-sans mt-1">
                    Choose the first day of bleeding, or skip if you aren&apos;t sure.
                  </p>
                </div>

                {/* Friendly Calendar Picker */}
                <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[22px] p-3.5 shadow-[0_3px_16px_rgba(74,43,51,0.03)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif text-base font-normal text-[#4A2B33]">
                      {monthLabel}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setCalendarMonth((m) => Math.max(7, m - 1))}
                        disabled={calendarMonth <= 7}
                        aria-label="Previous month"
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[#7A5862] hover:bg-[#EADBCE]/50 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalendarMonth((m) => Math.min(10, m + 1))}
                        disabled={calendarMonth >= 10}
                        aria-label="Next month"
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[#7A5862] hover:bg-[#EADBCE]/50 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        ›
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 text-center text-[10px] font-medium text-[#7A5862] mb-1">
                    <span>Su</span>
                    <span>Mo</span>
                    <span>Tu</span>
                    <span>We</span>
                    <span>Th</span>
                    <span>Fr</span>
                    <span>Sa</span>
                  </div>

                  <div className="grid grid-cols-7 gap-0.5 text-center">
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-7" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const dateStr = `${calendarYear}-${String(
                        calendarMonth + 1
                      ).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                      const isFuture = calendarMonth === 10 && dayNum > 7;
                      const isSelected = !isNotSure && selectedDate === dateStr;

                      return (
                        <button
                          key={dateStr}
                          type="button"
                          disabled={isFuture}
                          onClick={() => {
                            setSelectedDate(dateStr);
                            setIsNotSure(false);
                          }}
                          className={`h-7 rounded-full text-xs transition-all flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#4A2B33] text-[#F7F3EC] font-medium shadow-xs scale-105'
                              : isFuture
                              ? 'text-[#C7B7B9] cursor-not-allowed'
                              : 'text-[#4A2B33] hover:bg-[#EADBCE]/60'
                          }`}
                        >
                          {dayNum}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#EADBCE]/70 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsNotSure(true);
                        setSelectedDate(undefined);
                      }}
                      className={`min-h-[40px] px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isNotSure
                          ? 'bg-[#A8B5A2] text-white shadow-xs'
                          : 'bg-[#F7F3EC] border border-[#EADBCE] text-[#7A5862] hover:text-[#4A2B33]'
                      }`}
                    >
                      {isNotSure ? "✓ I'm not sure" : "I'm not sure"}
                    </button>
                  </div>
                </div>

                {/* Closest life phase chips */}
                <div className="space-y-2 pt-1">
                  <p className="text-xs text-[#7A5862] font-sans">
                    Which of these feels closest to you right now?
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {LIFE_STAGES.map((stage) => {
                      const isChipSelected = lifeStage === stage.id;
                      return (
                        <button
                          key={stage.id}
                          type="button"
                          onClick={() =>
                            setLifeStage((current) =>
                              current === stage.id ? undefined : stage.id
                            )
                          }
                          className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs transition-all border ${
                            isChipSelected
                              ? 'bg-[#FAF6F0] border-[#C99A86] text-[#4A2B33] ring-1 ring-[#C99A86] font-medium'
                              : 'bg-[#FAF6F0]/70 border-[#EADBCE] text-[#7A5862] hover:border-[#D6C7BB]'
                          }`}
                        >
                          {stage.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => updateStep('rhythm')}
                  className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <span aria-hidden="true">→</span>
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNotSure(true);
                      setSelectedDate(undefined);
                      updateStep('rhythm');
                    }}
                    className="text-xs text-[#7A5862] hover:text-[#4A2B33] py-2 px-4 transition-colors"
                  >
                    Skip this question
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 10. How does your cycle usually run? (Rhythm Sliders + HBC Toggle) */}
        {stepKey === 'rhythm' && (
          <motion.div
            key="step-rhythm"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-5 pt-3 pb-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2">
              <span className="font-serif text-lg tracking-tight text-[#4A2B33] font-medium">
                Womb Atlas
              </span>
              <button
                type="button"
                onClick={() => updateStep('period-start')}
                className="text-xs text-[#7A5862] hover:text-[#4A2B33] min-h-[44px] px-2 flex items-center"
              >
                ← Previous
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-between pt-1">
              <div className="space-y-4">
                <div>
                  <h1 className="font-serif text-2xl font-normal text-[#4A2B33] leading-snug">
                    How does your cycle usually run?
                  </h1>
                  <p className="text-xs text-[#7A5862] font-sans mt-1">
                    A rough idea is enough — the app learns as you log.
                  </p>
                </div>

                <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[22px] p-5 shadow-[0_3px_16px_rgba(74,43,51,0.03)] space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="cycle-length-slider"
                        className="text-xs font-medium text-[#7A5862]"
                      >
                        Cycle length
                      </label>
                      <span className="font-serif text-base text-[#C99A86] font-medium">
                        {cycleLength} days
                      </span>
                    </div>
                    <input
                      id="cycle-length-slider"
                      type="range"
                      min="21"
                      max="35"
                      step="1"
                      value={cycleLength}
                      onChange={(e) => setCycleLength(Number(e.target.value))}
                      className="w-full h-2 bg-[#EADFD5] rounded-lg appearance-none cursor-pointer accent-[#C99A86]"
                    />
                    <div className="flex justify-between text-[10px] text-[#A48F95] mt-1">
                      <span>21 days</span>
                      <span>28 (average)</span>
                      <span>35 days</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="period-length-slider"
                        className="text-xs font-medium text-[#7A5862]"
                      >
                        Period bleeding length
                      </label>
                      <span className="font-serif text-base text-[#C99A86] font-medium">
                        {periodLength} days
                      </span>
                    </div>
                    <input
                      id="period-length-slider"
                      type="range"
                      min="2"
                      max="7"
                      step="1"
                      value={periodLength}
                      onChange={(e) => setPeriodLength(Number(e.target.value))}
                      className="w-full h-2 bg-[#EADFD5] rounded-lg appearance-none cursor-pointer accent-[#C99A86]"
                    />
                    <div className="flex justify-between text-[10px] text-[#A48F95] mt-1">
                      <span>2 days</span>
                      <span>5 (average)</span>
                      <span>7 days</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#EADBCE]/70 flex items-center justify-between gap-3">
                    <div>
                      <label
                        htmlFor="hbc-toggle"
                        className="text-xs font-medium text-[#4A2B33] block"
                      >
                        Using hormonal birth control?
                      </label>
                      <span className="text-[11px] text-[#7A5862] block mt-0.5">
                        We&apos;ll speak a little more gently about predictions.
                      </span>
                    </div>

                    <button
                      id="hbc-toggle"
                      type="button"
                      role="switch"
                      aria-checked={usesHormonalBirthControl}
                      onClick={() =>
                        setUsesHormonalBirthControl((prev) => !prev)
                      }
                      className={`w-12 h-7 rounded-full p-1 transition-colors shrink-0 ${
                        usesHormonalBirthControl ? 'bg-[#A8B5A2]' : 'bg-[#D8CCC1]'
                      }`}
                    >
                      <motion.div
                        animate={{
                          x: usesHormonalBirthControl ? 20 : 0,
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="w-5 h-5 rounded-full bg-white shadow-xs"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-5 space-y-2.5">
                <button
                  type="button"
                  onClick={() => updateStep('birth-control')}
                  className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 11. Birth Control Methods */}
        {stepKey === 'birth-control' && (
          <motion.div
            key="step-birth-control"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="h-full"
          >
            <BirthControlScreen
              initialValue={birthControl}
              onBack={() => updateStep('rhythm')}
              onContinue={(method) => {
                setBirthControl(method);
                updateStep('health-conditions');
              }}
            />
          </motion.div>
        )}

        {/* 12. Health Conditions (PCOS, Endo, Fibroids, etc.) */}
        {stepKey === 'health-conditions' && (
          <motion.div
            key="step-health-conditions"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="h-full"
          >
            <HealthConditionsScreen
              initialValues={healthConditions}
              onBack={() => updateStep('birth-control')}
              onContinue={(conditions) => {
                setHealthConditions(conditions);
                updateStep('discharge');
              }}
            />
          </motion.div>
        )}

        {/* 13. Cervical Discharge Education & Cycle Compass Diagram */}
        {stepKey === 'discharge' && (
          <motion.div
            key="step-discharge"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="h-full"
          >
            <DischargeEducationScreen
              onBack={() => updateStep('health-conditions')}
              onContinue={(k) => {
                setKnowsDischargeChanges(k);
                updateStep('lifestyle-impacts');
              }}
            />
          </motion.div>
        )}

        {/* 14. Lifestyle & Daily Symptoms Impacts Questionnaire */}
        {stepKey === 'lifestyle-impacts' && (
          <motion.div
            key="step-lifestyle-impacts"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="h-full"
          >
            <LifestyleImpactsScreen
              onBack={() => updateStep('discharge')}
              onComplete={(data) => {
                if (data.todaySymptoms) setTodaySymptoms(data.todaySymptoms);
                if (data.cycleSymptoms) setCycleSymptoms(data.cycleSymptoms);
                if (data.impactsSleep) setImpactsSleep(data.impactsSleep);
                if (data.mentalHealthImpacts) setMentalHealthImpacts(data.mentalHealthImpacts);
                if (data.impactsEnergy) setImpactsEnergy(data.impactsEnergy);
                if (data.impactsDiet) setImpactsDiet(data.impactsDiet);
                updateStep('pledge-commitment');
              }}
            />
          </motion.div>
        )}

        {/* 15. Tap and Hold Sacred Commitment Pledge */}
        {stepKey === 'pledge-commitment' && (
          <motion.div
            key="step-pledge-commitment"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="h-full"
          >
            <PledgeCommitmentScreen
              onBack={() => updateStep('lifestyle-impacts')}
              onContinue={() => updateStep('security-cert')}
            />
          </motion.div>
        )}

        {/* 16. Security & ISO Certification */}
        {stepKey === 'security-cert' && (
          <motion.div
            key="step-security-cert"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="h-full"
          >
            <SecurityCertScreen
              onBack={() => updateStep('pledge-commitment')}
              onContinue={() => updateStep('notifications')}
            />
          </motion.div>
        )}

        {/* 17. Notification Opt-in Prompt */}
        {stepKey === 'notifications' && (
          <motion.div
            key="step-notifications"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="h-full"
          >
            <NotificationOptInScreen
              predictedDate="November 30"
              onBack={() => updateStep('security-cert')}
              onContinue={(allowed) => {
                setNotificationsAllowed(allowed);
                updateStep('lens-loading');
              }}
            />
          </motion.div>
        )}

        {/* 18. Optical Lens Scanning Calibration Screen */}
        {stepKey === 'lens-loading' && (
          <motion.div
            key="step-lens-loading"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="h-full"
          >
            <LensLoadingScreen onComplete={() => updateStep('plan-pricing')} />
          </motion.div>
        )}

        {/* 19. Choose Your Plan Membership (with 14-day exit intent) */}
        {stepKey === 'plan-pricing' && (
          <motion.div
            key="step-plan-pricing"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="h-full"
          >
            <PlanPricingScreen
              onSelectPlan={(plan) => {
                setSelectedPlan(plan);
                handleFinishAll();
              }}
              onClose={handleFinishAll}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
