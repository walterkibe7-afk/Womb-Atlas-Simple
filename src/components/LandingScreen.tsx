import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { DailyEntry, UserProfile, AuthUser } from '../types';
import {
  getGreeting,
  determineCyclePhase,
  getPhaseDetails,
  generateGentleInsight,
  summarizeEntry,
  calculateCycleDayFromDate,
} from '../utils/cycle';
import type { Easing } from 'framer-motion';

interface LandingScreenProps {
  entries: DailyEntry[];
  onNavigate: (screen: 'log' | 'history' | 'home') => void;
  userName?: string;
  userProfile?: UserProfile;
  currentUser?: AuthUser;
  onUpdatePeriodStart?: (date: string) => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onOpenAccount?: () => void;
  isDesktop?: boolean;
  onContinueOnboarding?: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  entries,
  onNavigate,
  userName = 'Achieng',
  userProfile,
  currentUser,
  onUpdatePeriodStart,
  onOpenAuth,
  onOpenAccount,
  isDesktop = false,
  onContinueOnboarding,
}) => {
  const [inlineCalendarOpen, setInlineCalendarOpen] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<{
    title: string;
    subtitle: string;
    tag: string;
    badgeColor: string;
    content: string;
    tips: string[];
  } | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Animation configs respecting reduced motion preference
  const getFadeInUp = () => prefersReducedMotion ? {} : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };
  const getFadeInUp10 = () => prefersReducedMotion ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: 0.05 } };
  const getFadeInUp10Delay1 = () => prefersReducedMotion ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: 0.1 } };
  const getFadeInUp10Delay15 = () => prefersReducedMotion ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: 0.15 } };
  const getFadeInUp6 = () => prefersReducedMotion ? {} : { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };
  const getFadeInUp8Delay1 = () => prefersReducedMotion ? {} : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: 0.1 } };
  const getScaleFadeIn = () => prefersReducedMotion ? {} : { initial: { opacity: 0, y: 10, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as Easing } };
  const getProgressBarAnim = () => prefersReducedMotion ? { animate: { width: `${onboardingProgress}%` } } : { initial: { width: 0 }, animate: { width: `${onboardingProgress}%` }, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as Easing } };
  const getInlineCalendarAnim = () => prefersReducedMotion ? {} : { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 } };
  const getModalAnim = () => ({ initial: { opacity: 0, scale: 0.95, y: 10 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 10 } });

  const hasCompletedOnboarding = userProfile?.hasCompletedOnboarding === true;
  const hasPeriodStart = Boolean(userProfile?.lastPeriodStart);
  const currentCycleDay = hasPeriodStart
    ? calculateCycleDayFromDate(
        userProfile?.lastPeriodStart || '',
        '2026-11-08',
        userProfile?.cycleLength || 28
      ) || 7
    : null;

  const currentPhase = currentCycleDay
    ? determineCyclePhase(
        currentCycleDay,
        userProfile?.cycleLength || 28,
        userProfile?.periodLength || 5
      )
    : null;

  const phaseDetails = currentPhase && currentCycleDay
    ? getPhaseDetails(currentPhase, currentCycleDay)
    : null;

  const effectiveUserName = userName || userProfile?.userName || 'Achieng';
  const greeting = getGreeting(effectiveUserName);
  const gentleInsight = generateGentleInsight(
    entries,
    currentCycleDay,
    userProfile?.usesHormonalBirthControl,
    userProfile?.lifeStage
  );

  const ovulationDay = Math.round((userProfile?.cycleLength || 28) / 2);
  const daysUntilOvulation = ovulationDay - (currentCycleDay || 7);
  const isOvulationSoon = daysUntilOvulation >= 0;
  const daysUntilPeriod = (userProfile?.cycleLength || 28) - (currentCycleDay || 7);
  const isFertileWindow = currentCycleDay !== null && currentCycleDay >= ovulationDay - 5 && currentCycleDay <= ovulationDay + 1;
  const pregnancyChanceText = isFertileWindow ? 'High chance of conception' : 'Low chance of conception';

  const todayEntry = entries.find((e) => e.date === '2026-11-08' || e.date === '2026-11-07');

  const phases = [
    { name: 'Menstrual', days: 'Days 1–5', note: 'Rest, release & clearing space', active: currentPhase === 'menstrual' },
    { name: 'Follicular', days: 'Days 6–11', note: 'Rising energy & gentle renewal', active: currentPhase === 'follicular' },
    { name: 'Ovulatory', days: 'Days 12–16', note: 'Warmth, vitality & connection', active: currentPhase === 'ovulatory' },
    { name: 'Luteal', days: 'Days 17–28', note: 'Turning inward & mindful boundaries', active: currentPhase === 'luteal' },
  ];

  const calendarYear = 2026;
  const calendarMonth = 10;
  const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

  const handleSelectInlineDate = (dayNum: number) => {
    const dateStr = `2026-11-${String(dayNum).padStart(2, '0')}`;
    if (onUpdatePeriodStart) {
      onUpdatePeriodStart(dateStr);
    }
    setInlineCalendarOpen(false);
  };

  // General educational insights for incomplete onboarding state
  const generalInsights = useMemo(() => [
    {
      id: 'cycle-basics',
      tag: 'Cycle basics',
      title: 'Understanding your cycle',
      subtitle: 'Learn the four phases',
      badgeColor: 'bg-[#E3EFE9] text-[#2D5A43] border-[#CCE0D6]',
      buttonText: 'Read more',
      content: 'Your menstrual cycle has four phases — menstrual, follicular, ovulatory, and luteal. Each brings different energy levels, emotional patterns, and physical sensations.',
      tips: [
        'Menstrual phase: Rest and reflect',
        'Follicular phase: Energy rises, try new things',
        'Ovulatory phase: Peak vitality and connection',
        'Luteal phase: Turn inward, set boundaries'
      ],
    },
    {
      id: 'tracking-benefits',
      tag: 'Why track?',
      title: 'Benefits of cycle tracking',
      subtitle: 'Knowledge is power',
      badgeColor: 'bg-[#FBECEB] text-[#8C3A48] border-[#F4D2D5]',
      buttonText: 'Read more',
      content: 'Tracking helps you anticipate changes, plan around your energy, and spot patterns. It\'s not about perfection — it\'s about awareness.',
      tips: [
        'Notice mood and energy shifts',
        'Identify symptom patterns',
        'Plan activities with your cycle',
        'Share data with healthcare providers if needed'
      ],
    },
    {
      id: 'self-care',
      tag: 'Self care',
      title: 'Gentle self-care through the cycle',
      subtitle: 'Listen to your body',
      badgeColor: 'bg-[#EDEAF7] text-[#4A3D73] border-[#DDD7F1]',
      buttonText: 'Read more',
      content: 'Different phases call for different care. Honor what your body needs — whether that\'s rest, movement, nutrition, or emotional space.',
      tips: [
        'Warm baths and magnesium for cramps',
        'Protein and iron-rich foods during menstruation',
        'Light exercise during follicular phase',
        'Journaling and boundaries in luteal phase'
      ],
    },
    {
      id: 'privacy',
      tag: 'Privacy first',
      title: 'Your data stays yours',
      subtitle: 'No tracking, no ads',
      badgeColor: 'bg-[#FDF3E7] text-[#7A4B1A] border-[#F7E2C7]',
      buttonText: 'Read more',
      content: 'Womb Atlas is built on a sanctuary model. Your cycle data never leaves your device unless you choose to sync. No third-party analytics, no advertising, no data sales.',
      tips: [
        'Local-first storage by default',
        'Optional encrypted sync with OAuth',
        'You can delete all data anytime',
        'No account required to use the app'
      ],
    },
  ], []);

  // Personalized insights for completed onboarding state
  const personalizedInsights = useMemo(() => [
    {
      id: 'cycle-day',
      tag: `Cycle day ${currentCycleDay || '—'}`,
      title: 'Your inner season',
      subtitle: phaseDetails?.label || 'Learning your rhythm',
      badgeColor: 'bg-[#E3EFE9] text-[#2D5A43] border-[#CCE0D6]',
      buttonText: 'View phase',
      content: phaseDetails?.nurtureText || 'The Atlas is still finding your rhythm. Log your next period when it starts.',
      tips: [
        'Hormones are softly shifting toward vitality',
        'Prioritize wholesome hydration and light grounding walks',
        'Listen to subtle intuitive signals without pressure'
      ],
    },
    {
      id: 'fertility',
      tag: "Today's conception chance",
      title: pregnancyChanceText,
      subtitle: isFertileWindow ? 'Fertile window open' : 'Luteal / follicular quiet',
      badgeColor: 'bg-[#FBECEB] text-[#8C3A48] border-[#F4D2D5]',
      buttonText: 'See update',
      content: isFertileWindow
        ? 'Estrogen is elevating as the follicular phase approaches ovulation. Cervical fluid may be clear and stretchy (egg-white consistency).'
        : 'Outside the prime 6-day fertile window. Your natural baseline remains quiet and protective.',
      tips: [
        'Notice natural shifts in cervical fluid transparency',
        'Record any mild mid-cycle twinges (mittelschmerz)',
        'Track basal body warmth if practicing natural family planning'
      ],
    },
    {
      id: 'symptoms',
      tag: 'November 8: Daily forecast',
      title: 'Symptoms to expect',
      subtitle: 'Gentle body signals',
      badgeColor: 'bg-[#EDEAF7] text-[#4A3D73] border-[#DDD7F1]',
      buttonText: 'Get insights',
      content: 'During this stage, energy begins to rebuild. Mild breast tenderness or shifting appetite can naturally accompany hormonal calibration.',
      tips: [
        'Rest when tired; do not rush physical exertion',
        'Sip chamomile or raspberry leaf tea for uterine comfort',
        'Write in your journal to honor subtle mood nuances'
      ],
    },
    {
      id: 'backache',
      tag: "Let's talk backache",
      title: 'Easing lower back tension',
      subtitle: 'Soothe sacral tenderness',
      badgeColor: 'bg-[#FDF3E7] text-[#7A4B1A] border-[#F7E2C7]',
      buttonText: 'Read guide',
      content: 'Prostaglandins released during menstruation can trigger smooth muscle contractions that radiate into your lower back and sacrum.',
      tips: [
        'Gentle cat-cow stretches release pelvic tightness',
        'A warm castor oil compress provides penetrating relief',
        'Magnesium glycinate supports muscle relaxation before sleep'
      ],
    },
    {
      id: 'spotting',
      tag: 'Spotting vs period bleeding',
      title: 'Decoding subtle flows',
      subtitle: 'Color, flow & timing',
      badgeColor: 'bg-[#FCEFE8] text-[#8A3F24] border-[#F6D8C9]',
      buttonText: 'Explore care',
      content: 'Spotting is light pink or brownish discharge that barely fills a liner, often linked to ovulation or implantation, whereas menstrual flow is continuous and deep red.',
      tips: [
        'Brownish spotting is often oxidized blood leaving the uterus',
        'Mid-cycle pink spotting can mark follicular rupture (ovulation)',
        'Log flow consistency in the daily journal to identify patterns'
      ],
    },
  ], [currentCycleDay, phaseDetails, isFertileWindow, pregnancyChanceText]);

  const insights = hasCompletedOnboarding ? personalizedInsights : generalInsights;

  // Onboarding progress calculation
  const onboardingSteps = [
    { key: 'agreedToPrivacyPolicy', label: 'Privacy consent' },
    { key: 'passcodeSet', label: 'Passcode lock' },
    { key: 'birthYear', label: 'Birth year' },
    { key: 'heightCm', label: 'Body measurements' },
    { key: 'periodKnowledge', label: 'Period knowledge' },
    { key: 'periodFeeling', label: 'Feelings about period' },
    { key: 'periodsRegular', label: 'Cycle regularity' },
    { key: 'lastPeriodStart', label: 'Last period date' },
    { key: 'cycleLength', label: 'Cycle rhythm' },
    { key: 'birthControl', label: 'Birth control' },
    { key: 'healthConditions', label: 'Health conditions' },
    { key: 'knowsDischargeChanges', label: 'Discharge education' },
    { key: 'hasCommitted', label: 'Pledge commitment' },
    { key: 'notificationsAllowed', label: 'Notifications' },
    { key: 'selectedPlan', label: 'Plan selection' },
  ];
  const completedSteps = onboardingSteps.filter(s => userProfile?.[s.key as keyof UserProfile]).length;
  const onboardingProgress = Math.round((completedSteps / onboardingSteps.length) * 100);

  if (isDesktop) {
    return (
      <div className="space-y-8">
        <motion.div
          initial={getFadeInUp().initial}
          animate={getFadeInUp().animate}
          transition={getFadeInUp().transition}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#A8B5A2]"></span>
            <span className="text-xs font-medium text-[#7A5862]">
              {hasCompletedOnboarding
                ? (currentCycleDay
                    ? `Day ${currentCycleDay} of ${userProfile?.cycleLength || 28} · Quiet rhythm`
                    : 'Learning mode · Quiet rhythm')
                : 'Welcome · Your sanctuary awaits'}
            </span>
          </div>
          <h1 className="font-serif text-3xl lg:text-4xl text-[#4A2B33] font-normal leading-tight">
            {greeting}
          </h1>
          <p className="text-sm text-[#7A5862] mt-1.5 max-w-xl">
            {hasCompletedOnboarding
              ? 'A quiet space to check in with yourself. No rush, no diagnostic alarms — just an unhurried map of your body\'s natural cadence.'
              : 'Your personal setup isn\'t complete yet. Finish onboarding to unlock personalized cycle insights, or explore general education below.'}
          </p>
        </motion.div>

        {/* Incomplete Onboarding Prominent Card */}
        {!hasCompletedOnboarding && onContinueOnboarding && (
          <motion.div
            initial={getScaleFadeIn().initial}
            animate={getScaleFadeIn().animate}
            transition={getScaleFadeIn().transition}
            className="bg-gradient-to-r from-[#FDF3E7] to-[#FEF7ED] border border-[#F7E2C7] rounded-[24px] p-6 lg:p-8 shadow-[0_4px_24px_rgba(74,43,51,0.06)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FCEFE8] rounded-full blur-3xl opacity-50" aria-hidden="true" />
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#C99A86] animate-pulse" aria-hidden="true"></span>
                  <span className="text-xs font-medium text-[#8A3F24] uppercase tracking-wide">Setup in progress</span>
                </div>
                <h2 className="font-serif text-2xl lg:text-3xl font-normal text-[#4A2B33] mb-3 max-w-2xl">
                  Complete your sanctuary setup
                </h2>
                <p className="text-sm lg:text-base text-[#7A5862] leading-relaxed mb-5 max-w-xl">
                  Finishing your personal setup unlocks personalized cycle insights, phase predictions, fertility awareness, and tailored educational content — all private to you.
                </p>
                {/* Progress indicator */}
                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[#7A5862] font-medium">{completedSteps} of {onboardingSteps.length} steps completed</span>
                    <span className="font-serif text-[#C99A86] font-medium">{onboardingProgress}%</span>
                  </div>
                  <div className="h-2 bg-[#EADBCE] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#C99A86]"
                      initial={getProgressBarAnim().initial}
                      animate={getProgressBarAnim().animate}
                      transition={getProgressBarAnim().transition}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onContinueOnboarding}
                  className="min-h-[48px] px-7 py-3 rounded-[16px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Complete your setup</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
              <div className="hidden lg:block w-24 h-24 flex-shrink-0">
                <svg viewBox="0 0 96 96" className="w-full h-full text-[#C99A86]" fill="none" aria-hidden="true">
                  <circle cx="48" cy="48" r="40" stroke="#F7E2C7" strokeWidth="4" />
                  <path d="M48 16v32M32 32h32" stroke="#C99A86" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="48" cy="48" r="28" stroke="#F7E2C7" strokeWidth="2" strokeDasharray="8 8" />
                  <path d="M48 48l8 8" stroke="#C99A86" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={getFadeInUp10().initial}
              animate={getFadeInUp10().animate}
              transition={getFadeInUp10().transition}
              className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[24px] p-7 lg:p-8 shadow-[0_4px_24px_rgba(74,43,51,0.03)]"
              data-testid="cycle-phase-card"
            >
              {hasCompletedOnboarding && hasPeriodStart && phaseDetails ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-[#7A5862]">Current cycle phase</span>
                    <span className="text-xs font-serif italic text-[#C99A86]">Nurture rhythm</span>
                  </div>
                  <h2 className="font-serif text-3xl font-normal text-[#4A2B33] mb-3">{phaseDetails.label}</h2>
                  <p className="text-sm lg:text-base text-[#7A5862] leading-relaxed mb-5 max-w-lg">{phaseDetails.nurtureText}</p>
                  <div className="p-4 bg-[#EEF3ED] border border-[#D7E3D4] rounded-[18px] mb-6">
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] font-medium text-[#5B6D55]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A8B5A2]"></span>
                      <span>Gentle reproductive health insight</span>
                    </div>
                    <p className="font-serif text-sm italic text-[#4A2B33] leading-relaxed">&ldquo;{gentleInsight}&rdquo;</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                    <button onClick={() => onNavigate('log')} className="min-h-[48px] px-7 py-3 rounded-[16px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] transition-all flex items-center justify-center gap-2 shadow-sm">
                      <span>How are you feeling today?</span>
                      <span aria-hidden="true">→</span>
                    </button>
                    <button onClick={() => onNavigate('history')} className="min-h-[48px] px-6 py-3 rounded-[16px] bg-[#FAF6F0] border border-[#EADBCE] text-sm text-[#4A2B33] font-medium hover:border-[#C99A86] transition-colors text-center">View calendar history</button>
                  </div>
                </>
              ) : hasCompletedOnboarding && !hasPeriodStart ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-[#7A5862]">Finding your rhythm</span>
                    <span className="text-xs font-serif italic text-[#C99A86]">Gentle start</span>
                  </div>
                  <h2 className="font-serif text-3xl font-normal text-[#4A2B33] mb-3">The Atlas is finding your rhythm</h2>
                  <p className="text-sm lg:text-base text-[#7A5862] leading-relaxed mb-5 max-w-lg">The Atlas is still finding your rhythm. Log your next period when it starts, and we\'ll listen quietly alongside your body.</p>
                  <div className="p-4 bg-[#EEF3ED] border border-[#D7E3D4] rounded-[18px] mb-6">
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] font-medium text-[#5B6D55]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A8B5A2]"></span>
                      <span>Gentle reproductive health insight</span>
                    </div>
                    <p className="font-serif text-sm italic text-[#4A2B33] leading-relaxed">&ldquo;{gentleInsight}&rdquo;</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                    <button type="button" onClick={() => setInlineCalendarOpen((prev) => !prev)} className="min-h-[48px] px-6 py-3 rounded-[16px] bg-[#4A2B33] text-[#F7F3EC] text-sm font-medium hover:bg-[#3B2229] transition-all flex items-center justify-center gap-2 shadow-sm">
                      <span>{inlineCalendarOpen ? 'Close calendar' : 'Select last period start date'}</span>
                      <span>{inlineCalendarOpen ? '↑' : '↓'}</span>
                    </button>
                    <button onClick={() => onNavigate('log')} className="min-h-[48px] px-6 py-3 rounded-[16px] bg-[#FAF6F0] border border-[#EADBCE] text-sm text-[#4A2B33] font-medium hover:border-[#C99A86] transition-colors text-center">Log daily symptoms</button>
                  </div>
                  <AnimatePresence>
                    {inlineCalendarOpen && (
                      <motion.div
                        initial={getInlineCalendarAnim().initial}
                        animate={getInlineCalendarAnim().animate}
                        exit={getInlineCalendarAnim().exit}
                        className="overflow-hidden pt-5 border-t border-[#EADBCE]/70 mt-5">
                        <div className="text-center mb-3">
                          <span className="text-sm font-serif text-[#4A2B33]">November 2026</span>
                          <p className="text-xs text-[#7A5862]">Tap the day your bleeding began:</p>
                        </div>
                        <div className="grid grid-cols-7 text-center text-xs text-[#7A5862] mb-1.5 max-w-sm mx-auto">
                          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1.5 text-center max-w-sm mx-auto">
                          {Array.from({ length: firstDay }).map((_, i) => <div key={`desk-in-${i}`} className="h-8" />)}
                          {Array.from({ length: daysInMonth }).map((_, i) => {
                            const dayNum = i + 1;
                            const isFuture = dayNum > 7;
                            return (
                              <button key={`desk-in-day-${dayNum}`} type="button" disabled={isFuture} onClick={() => handleSelectInlineDate(dayNum)} className={`h-8 rounded-full text-xs transition-all flex items-center justify-center ${isFuture ? 'text-[#C7B7B9] cursor-not-allowed' : 'text-[#4A2B33] hover:bg-[#EADBCE] active:bg-[#4A2B33] active:text-[#F7F3EC]'}`}>{dayNum}</button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                // Incomplete onboarding state - simplified since we have the prominent card above
                <>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-[#7A5862]">Complete your setup</span>
                    <span className="text-xs font-serif italic text-[#C99A86]">Almost there</span>
                  </div>
                  <h2 className="font-serif text-3xl font-normal text-[#4A2B33] mb-3">Welcome to your sanctuary</h2>
                  <p className="text-sm lg:text-base text-[#7A5862] leading-relaxed mb-5 max-w-lg">Your personal setup isn\'t complete yet. Finish onboarding to unlock personalized cycle insights, phase predictions, and tailored educational content.</p>
                  <div className="p-4 bg-[#EEF3ED] border border-[#D7E3D4] rounded-[18px] mb-6">
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] font-medium text-[#5B6D55]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A8B5A2]"></span>
                      <span>Gentle insight while you set up</span>
                    </div>
                    <p className="font-serif text-sm italic text-[#4A2B33] leading-relaxed">&ldquo;{gentleInsight}&rdquo;</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                    {onContinueOnboarding && (
                      <button type="button" onClick={onContinueOnboarding} className="min-h-[48px] px-6 py-3 rounded-[16px] bg-[#4A2B33] text-[#F7F3EC] text-sm font-medium hover:bg-[#3B2229] transition-all flex items-center justify-center gap-2 shadow-sm">
                        <span>Continue your setup</span>
                        <span aria-hidden="true">→</span>
                      </button>
                    )}
                    <button onClick={() => onNavigate('log')} className="min-h-[48px] px-6 py-3 rounded-[16px] bg-[#FAF6F0] border border-[#EADBCE] text-sm text-[#4A2B33] font-medium hover:border-[#C99A86] transition-colors text-center">Log daily symptoms</button>
                  </div>
                </>
              )}
              {todayEntry && (
                <div className="mt-6 pt-4 border-t border-[#EADBCE]/70 flex items-center justify-between text-xs text-[#7A5862]">
                  <span>Today\'s recorded note:</span>
                  <span className="text-[#4A2B33] font-medium">{summarizeEntry(todayEntry)}</span>
                </div>
              )}
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => onNavigate('log')} className="p-5 bg-[#FAF6F0] border border-[#EADBCE] rounded-[20px] text-left hover:border-[#C99A86] transition-all">
                <span className="text-xs text-[#7A5862] block mb-1">Daily journal</span>
                <span className="font-serif text-lg text-[#4A2B33] font-medium block">Record today\'s entry</span>
                <span className="text-xs text-[#7A5862] mt-1 block">Flow, cramps, mood & note</span>
              </button>
              <button onClick={() => onNavigate('history')} className="p-5 bg-[#FAF6F0] border border-[#EADBCE] rounded-[20px] text-left hover:border-[#C99A86] transition-all">
                <span className="text-xs text-[#7A5862] block mb-1">Gentle cadence</span>
                <span className="font-serif text-lg text-[#4A2B33] font-medium block">Cycle history</span>
                <span className="text-xs text-[#7A5862] mt-1 block">Calendar & 5-month rhythm</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={getFadeInUp10Delay1().initial}
              animate={getFadeInUp10Delay1().animate}
              transition={getFadeInUp10Delay1().transition}
              className="bg-[#EEF3ED] border border-[#D7E3D4] rounded-[22px] p-6 shadow-[0_2px_16px_rgba(91,109,85,0.04)]">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-[#A8B5A2]"></span>
                <span className="text-xs font-medium text-[#5B6D55]">Reproductive health insight</span>
              </div>
              <p className="font-serif text-xl italic leading-relaxed text-[#4A2B33]">&ldquo;{gentleInsight}&rdquo;</p>
              <p className="text-xs text-[#7A5862] mt-3">{hasCompletedOnboarding ? (hasPeriodStart ? 'Observed gently from your previous menstrual entries.' : 'Listening quietly alongside your body.') : 'General educational insight — personalize by completing your setup.'}</p>
            </motion.div>

            <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[22px] p-6 space-y-3">
              <span className="text-xs font-medium text-[#7A5862] block mb-1">Your body\'s four phases</span>
              {phases.map((p) => (
                <div key={p.name} className={`p-3.5 rounded-[16px] border transition-all ${p.active ? 'bg-[#F7F3EC] border-[#C99A86] shadow-xs' : 'border-transparent text-[#7A5862]'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-serif text-sm font-medium ${p.active ? 'text-[#4A2B33]' : 'text-[#7A5862]'}`}>{p.name}</span>
                    <span className="text-xs text-[#7A5862]">{p.days}</span>
                  </div>
                  <p className="text-xs text-[#7A5862] mt-0.5">{p.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Educational Insights Carousel */}
        <motion.div
          initial={getFadeInUp10Delay15().initial}
          animate={getFadeInUp10Delay15().animate}
          transition={getFadeInUp10Delay15().transition}
          className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-normal text-[#4A2B33]">
              {hasCompletedOnboarding ? 'Personalized insights' : 'Explore & learn'}
            </h2>
            <span className="text-xs text-[#C99A86] font-serif italic">Swipe ➔</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
            {insights.map((insight) => (
              <div key={insight.id} className="flex-shrink-0 w-[240px] snap-start bg-[#FAF6F0] border border-[#EADBCE] rounded-[20px] p-4 flex flex-col justify-between cursor-pointer hover:border-[#C99A86] hover:shadow-sm transition-all" onClick={() => setSelectedInsight(insight)}>
                <div>
                  <span className={`inline-block text-[10px] font-sans font-medium px-2 py-0.5 rounded-full border mb-2.5 ${insight.badgeColor}`}>{insight.tag}</span>
                  <h4 className="font-serif text-base text-[#4A2B33] font-normal leading-snug mb-1">{insight.title}</h4>
                  <p className="text-xs text-[#7A5862] line-clamp-2 leading-relaxed">{insight.content}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#EADBCE]/70 flex items-center justify-between"><span className="text-xs font-medium text-[#4A2B33]">{insight.buttonText}</span><span className="text-xs text-[#C99A86]">→</span></div>
              </div>
            ))}
          </div>
        </motion.div>

<motion.div
        initial={getFadeInUp10Delay1().initial}
        animate={getFadeInUp10Delay1().animate}
        transition={getFadeInUp10Delay1().transition}
        className="bg-[#EEF3ED] border border-[#D7E3D4] rounded-[18px] p-4.5 mb-5 shadow-[0_2px_12px_rgba(91,109,85,0.04)]">
          <div className="flex items-center gap-2 mb-1.5"><span className="w-2 h-2 rounded-full bg-[#A8B5A2]"></span><span className="text-xs font-medium text-[#5B6D55]">Sanctuary observation</span></div>
          <p className="font-serif text-base italic leading-relaxed text-[#4A2B33]">&ldquo;{gentleInsight}&rdquo;</p>
          <p className="text-[11px] text-[#7A5862] mt-2">{hasCompletedOnboarding ? (hasPeriodStart ? 'Reflecting your previous recorded cycles' : 'Listening gently alongside your body') : 'General educational insight — personalize by completing your setup'}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-5 pt-3 pb-6 overflow-y-auto">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#E8DFD5] flex items-center justify-center text-sm shadow-xs border border-[#D9CFC4]">🌿</div>
          <div>
            <h2 className="font-serif text-base font-medium text-[#4A2B33]">November 8</h2>
            <p className="text-[11px] text-[#7A5862] font-sans">{greeting}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onNavigate('history')} title="View Calendar History" aria-label="View Calendar History" className="w-8 h-8 rounded-full bg-[#FAF6F0] border border-[#E8DFD5] flex items-center justify-center text-[#4A2B33] hover:border-[#C99A86] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.8" /><line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.8" /><line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.8" /><line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.8" /></svg>
          </button>
          {currentUser && currentUser.provider !== 'local' ? (
            <button type="button" onClick={onOpenAccount} aria-label="Account details" className="w-8 h-8 rounded-full bg-[#FAF6F0] border border-[#E8DFD5] flex items-center justify-center font-serif text-xs text-[#4A2B33] hover:border-[#C99A86] transition-colors">{currentUser.name.charAt(0).toUpperCase()}</button>
          ) : (
            <button type="button" onClick={() => onOpenAuth?.('login')} className="text-[11px] font-medium text-[#4A2B33] bg-[#FAF6F0] hover:bg-[#EFE7DE] border border-[#E8DFD5] px-2.5 py-1 rounded-full transition-colors">Sign in</button>
          )}
        </div>
      </div>

      {/* Incomplete Onboarding Prominent Card - Mobile */}
      {!hasCompletedOnboarding && onContinueOnboarding && (
        <motion.div
          initial={getScaleFadeIn().initial}
          animate={getScaleFadeIn().animate}
          transition={getScaleFadeIn().transition}
          className="bg-gradient-to-r from-[#FDF3E7] to-[#FEF7ED] border border-[#F7E2C7] rounded-[20px] p-5 mb-4 shadow-[0_4px_20px_rgba(74,43,51,0.06)] relative"
        >
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#C99A86] animate-pulse" aria-hidden="true"></span>
              <span className="text-xs font-medium text-[#8A3F24] uppercase tracking-wide">Setup in progress</span>
            </div>
            <h2 className="font-serif text-xl font-normal text-[#4A2B33] mb-2">
              Complete your sanctuary setup
            </h2>
            <p className="text-sm text-[#7A5862] leading-relaxed mb-4">
              Finishing your personal setup unlocks personalized cycle insights, phase predictions, fertility awareness, and tailored educational content — all private to you.
            </p>
            {/* Progress indicator */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[#7A5862] font-medium">{completedSteps} of {onboardingSteps.length} steps completed</span>
                <span className="font-serif text-[#C99A86] font-medium">{onboardingProgress}%</span>
              </div>
              <div className="h-2 bg-[#EADBCE] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#C99A86]"
                  initial={getProgressBarAnim().initial}
                  animate={getProgressBarAnim().animate}
                  transition={getProgressBarAnim().transition}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={onContinueOnboarding}
              className="w-full min-h-[48px] px-6 py-3 rounded-[16px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Complete your setup</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </motion.div>
      )}

      <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[20px] p-3 mb-4 shadow-[0_2px_12px_rgba(74,43,51,0.03)]">
        <div className="grid grid-cols-7 gap-1 text-center items-center">
          {[
            { dayName: 'TODAY', dateNum: 8, isToday: true, isPeriod: hasCompletedOnboarding && hasPeriodStart && (currentCycleDay || 7) <= 5, isOvulation: hasCompletedOnboarding && hasPeriodStart && currentCycleDay === 14 },
            { dayName: 'M', dateNum: 9, isToday: false, isPeriod: false, isOvulation: false },
            { dayName: 'T', dateNum: 10, isToday: false, isPeriod: false, isOvulation: false },
            { dayName: 'W', dateNum: 11, isToday: false, isPeriod: false, isOvulation: false },
            { dayName: 'T', dateNum: 12, isToday: false, isPeriod: false, isOvulation: false },
            { dayName: 'F', dateNum: 13, isToday: false, isPeriod: false, isOvulation: false },
            { dayName: 'S', dateNum: 14, dateLabel: 'Ovulation', isToday: false, isPeriod: false, isOvulation: hasCompletedOnboarding && hasPeriodStart && currentCycleDay === 14 },
          ].map((wd, idx) => (
            <div key={idx} className={`flex flex-col items-center py-1.5 px-1 rounded-[14px] transition-all ${wd.isToday ? 'bg-[#4A2B33] text-[#F7F3EC] shadow-xs' : 'hover:bg-[#F2ECE3] text-[#7A5862]'}`}>
              <span className={`text-[9px] font-medium tracking-wider mb-1 ${wd.isToday ? 'text-[#EADBCE]' : 'text-[#8E6D77]'}`}>{wd.dayName}</span>
              <span className={`text-sm font-serif font-medium ${wd.isToday ? 'text-[#F7F3EC]' : 'text-[#4A2B33]'}`}>{wd.dateNum}</span>
              <div className="h-1.5 mt-1 flex items-center justify-center">
                {wd.isPeriod && <span className={`w-1.5 h-1.5 rounded-full ${wd.isToday ? 'bg-[#FF9B8A]' : 'bg-[#C97A7E]'}`} />}
                {wd.isOvulation && <span className="w-1.5 h-1.5 rounded-full bg-[#8EAB94]" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial={getFadeInUp6().initial}
        animate={getFadeInUp6().animate}
        transition={getFadeInUp6().transition}
        className="bg-radial from-[#FAF6F0] to-[#F4EEE4] border border-[#EADBCE] rounded-[24px] p-5 mb-4 text-center shadow-[0_4px_20px_rgba(74,43,51,0.04)] relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#E5DACD] text-xs font-sans text-[#7A5862] mb-2">
          <span className="w-2 h-2 rounded-full bg-[#C99A86] animate-pulse"></span>
          <span>{hasCompletedOnboarding && hasPeriodStart ? (phaseDetails?.label || 'Finding your rhythm') : 'Complete your setup'} · {hasCompletedOnboarding && hasPeriodStart ? `Day ${currentCycleDay || '—'}` : 'Setup needed'}</span>
        </div>
        {hasCompletedOnboarding && hasPeriodStart ? (
          <>
            <p className="text-xs uppercase tracking-widest text-[#8E6D77] font-sans font-medium">{isOvulationSoon ? 'Ovulation in' : 'Next period in'}</p>
            <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#4A2B33] my-1">{isOvulationSoon ? `${Math.max(1, daysUntilOvulation)} days` : `${Math.max(1, daysUntilPeriod)} days`}</h1>
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#7A5862] mt-1 font-sans">
              <span>{pregnancyChanceText}</span>
              <span className="w-4 h-4 rounded-full border border-[#C99A86] text-[#C99A86] inline-flex items-center justify-center text-[10px] cursor-pointer" title="Estimated based on your cycle rhythm">i</span>
            </div>
          </>
        ) : (
          <>
            <p className="text-xs uppercase tracking-widest text-[#8E6D77] font-sans font-medium">Complete your setup</p>
            <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#4A2B33] my-1">—</h1>
            <p className="text-xs text-[#7A5862] mt-1">Finish onboarding to see your cycle forecast</p>
          </>
        )}
      </motion.div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <button type="button" onClick={() => onNavigate('log')} className="flex flex-col items-center justify-center p-3 rounded-[20px] bg-[#FAF6F0] border border-[#EADBCE] hover:border-[#C97A7E] hover:shadow-xs transition-all group">
          <div className="w-12 h-12 rounded-full bg-[#FCEBEB] text-[#C97A7E] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-xs"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg></div>
          <span className="text-xs font-sans font-medium text-[#4A2B33]">Log period</span>
          <span className="text-[10px] text-[#8E6D77]">Flow & cramps</span>
        </button>
        <button type="button" onClick={() => onNavigate('log')} className="flex flex-col items-center justify-center p-3 rounded-[20px] bg-[#FAF6F0] border border-[#EADBCE] hover:border-[#A8B5A2] hover:shadow-xs transition-all group">
          <div className="w-12 h-12 rounded-full bg-[#EFF5ED] text-[#5B6D55] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-xs"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" strokeWidth="2.2" strokeLinecap="round" /><line x1="5" y1="12" x2="19" y2="12" strokeWidth="2.2" strokeLinecap="round" /></svg></div>
          <span className="text-xs font-sans font-medium text-[#4A2B33]">Symptoms</span>
          <span className="text-[10px] text-[#8E6D77]">Body & mood</span>
        </button>
        <button type="button" onClick={() => onNavigate('log')} className="flex flex-col items-center justify-center p-3 rounded-[20px] bg-[#FAF6F0] border border-[#EADBCE] hover:border-[#C99A86] hover:shadow-xs transition-all group">
          <div className="w-12 h-12 rounded-full bg-[#FAF0EB] text-[#C99A86] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-xs"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></div>
          <span className="text-xs font-sans font-medium text-[#4A2B33]">Intimacy</span>
          <span className="text-[10px] text-[#8E6D77]">Sex & desire</span>
        </button>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-serif text-lg text-[#4A2B33] font-medium">
              {hasCompletedOnboarding ? 'My daily insights · Today' : 'Learn & explore'}
            </h3>
            <p className="text-[11px] text-[#7A5862]">
              {hasCompletedOnboarding
                ? `Midwife wisdom tailored to cycle day ${currentCycleDay || '—'}`
                : 'General reproductive health education'}
            </p>
          </div>
          <span className="text-xs text-[#C99A86] font-serif italic">Swipe ➔</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
          {insights.map((insight) => (
            <div key={insight.id} className="flex-shrink-0 w-[240px] snap-start bg-[#FAF6F0] border border-[#EADBCE] rounded-[20px] p-4 flex flex-col justify-between cursor-pointer hover:border-[#C99A86] hover:shadow-sm transition-all" onClick={() => setSelectedInsight(insight)}>
              <div>
                <span className={`inline-block text-[10px] font-sans font-medium px-2 py-0.5 rounded-full border mb-2.5 ${insight.badgeColor}`}>{insight.tag}</span>
                <h4 className="font-serif text-base text-[#4A2B33] font-normal leading-snug mb-1">{insight.title}</h4>
                <p className="text-xs text-[#7A5862] line-clamp-2 leading-relaxed">{insight.content}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#EADBCE]/70 flex items-center justify-between"><span className="text-xs font-medium text-[#4A2B33]">{insight.buttonText}</span><span className="text-xs text-[#C99A86]">→</span></div>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial={getFadeInUp8Delay1().initial}
        animate={getFadeInUp8Delay1().animate}
        transition={getFadeInUp8Delay1().transition}
        className="bg-[#EEF3ED] border border-[#D7E3D4] rounded-[18px] p-4.5 mb-5 shadow-[0_2px_12px_rgba(91,109,85,0.04)]">
        <div className="flex items-center gap-2 mb-1.5"><span className="w-2 h-2 rounded-full bg-[#A8B5A2]"></span><span className="text-xs font-medium text-[#5B6D55]">Sanctuary observation</span></div>
        <p className="font-serif text-base italic leading-relaxed text-[#4A2B33]">&ldquo;{gentleInsight}&rdquo;</p>
        <p className="text-[11px] text-[#7A5862] mt-2">{hasCompletedOnboarding ? (hasPeriodStart ? 'Reflecting your previous recorded cycles' : 'Listening gently alongside your body') : 'General educational insight — personalize by completing your setup'}</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 mt-auto">
        <button onClick={() => onNavigate('log')} className="min-h-[50px] p-3.5 bg-[#4A2B33] text-[#F7F3EC] rounded-[16px] text-center font-sans font-medium text-xs hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-xs flex items-center justify-center gap-1.5"><span>Open daily journal</span><span aria-hidden="true">→</span></button>
        <button onClick={() => onNavigate('history')} className="min-h-[50px] p-3.5 bg-[#FAF6F0] border border-[#EADBCE] text-[#4A2B33] rounded-[16px] text-center font-sans font-medium text-xs hover:border-[#C99A86] transition-colors flex items-center justify-center gap-1.5"><span>Cycle history</span></button>
      </div>

      <AnimatePresence>
        {selectedInsight && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A2B33]/40 backdrop-blur-xs">
            <motion.div
              initial={getModalAnim().initial}
              animate={getModalAnim().animate}
              exit={getModalAnim().exit}
              className="w-full max-w-sm bg-[#FAF6F0] border border-[#EADBCE] rounded-[24px] p-6 shadow-xl max-h-[85vh] overflow-y-auto text-[#4A2B33]">
              <div className="flex items-center justify-between mb-3"><span className={`text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-full border ${selectedInsight.badgeColor}`}>{selectedInsight.tag}</span><button type="button" onClick={() => setSelectedInsight(null)} className="w-7 h-7 rounded-full bg-[#F7F3EC] border border-[#EADBCE] flex items-center justify-center text-[#7A5862] hover:text-[#4A2B33]">✕</button></div>
              <h3 className="font-serif text-2xl font-normal text-[#4A2B33] mb-1">{selectedInsight.title}</h3>
              <p className="text-xs text-[#C99A86] font-serif italic mb-4">{selectedInsight.subtitle}</p>
              <p className="text-sm text-[#7A5862] leading-relaxed mb-5 font-sans">{selectedInsight.content}</p>
              <div className="bg-[#F7F3EC] border border-[#EADBCE] rounded-[18px] p-4 mb-5"><span className="text-xs font-serif font-medium text-[#4A2B33] block mb-2">Midwife care suggestions:</span><ul className="space-y-2">{selectedInsight.tips.map((tip, i) => (<li key={i} className="text-xs text-[#7A5862] flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#A8B5A2] mt-1.5 flex-shrink-0" /><span>{tip}</span></li>))}</ul></div>
              <button type="button" onClick={() => setSelectedInsight(null)} className="w-full min-h-[46px] rounded-[16px] bg-[#4A2B33] text-[#F7F3EC] text-xs font-sans font-medium hover:bg-[#3B2229] transition-all">Understood, thank you</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};