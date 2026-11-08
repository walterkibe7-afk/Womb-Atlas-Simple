import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DailyEntry, UserProfile, AuthUser } from '../types';
import {
  getGreeting,
  determineCyclePhase,
  getPhaseDetails,
  generateGentleInsight,
  summarizeEntry,
  calculateCycleDayFromDate,
} from '../utils/cycle';

interface HomeScreenProps {
  entries: DailyEntry[];
  onNavigate: (screen: 'home' | 'log' | 'history') => void;
  userName?: string;
  userProfile?: UserProfile;
  currentUser?: AuthUser;
  onUpdatePeriodStart?: (date: string) => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onOpenAccount?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  entries,
  onNavigate,
  userName = 'Achieng',
  userProfile,
  currentUser,
  onUpdatePeriodStart,
  onOpenAuth,
  onOpenAccount,
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

  // Determine cycle day from last period start if available
  const hasPeriodStart = Boolean(userProfile?.lastPeriodStart);
  const currentCycleDay = hasPeriodStart
    ? calculateCycleDayFromDate(
        userProfile?.lastPeriodStart,
        '2026-11-08',
        userProfile?.cycleLength || 28
      ) || 7
    : 7;

  const currentPhase = determineCyclePhase(
    currentCycleDay,
    userProfile?.cycleLength || 28,
    userProfile?.periodLength || 5
  );

  const phaseDetails = getPhaseDetails(currentPhase, currentCycleDay);

  const greeting = getGreeting(userName || userProfile?.userName || 'Achieng');
  const gentleInsight = generateGentleInsight(
    entries,
    currentCycleDay,
    userProfile?.usesHormonalBirthControl,
    userProfile?.lifeStage
  );

  // Calculate ovulation prediction (typically day 14 for 28-day cycle)
  const ovulationDay = Math.round((userProfile?.cycleLength || 28) / 2);
  const daysUntilOvulation = ovulationDay - currentCycleDay;
  const isOvulationSoon = daysUntilOvulation >= 0;
  const daysUntilPeriod = (userProfile?.cycleLength || 28) - currentCycleDay;

  // Pregnancy / Fertility chance indicator
  const isFertileWindow = currentCycleDay >= ovulationDay - 5 && currentCycleDay <= ovulationDay + 1;
  const pregnancyChanceText = isFertileWindow ? 'High chance of conception' : 'Low chance of conception';

  // Today's entry if logged
  const todayEntry = entries.find((e) => e.date === '2026-11-08' || e.date === '2026-11-07');

  // Week strip calculation (centered around Nov 8, 2026)
  const weekDays = [
    { dayName: 'TODAY', dateNum: 8, isToday: true, isPeriod: currentCycleDay <= 5, isOvulation: currentCycleDay === 14 },
    { dayName: 'M', dateNum: 9, isToday: false, isPeriod: false, isOvulation: false },
    { dayName: 'T', dateNum: 10, isToday: false, isPeriod: false, isOvulation: false },
    { dayName: 'W', dateNum: 11, isToday: false, isPeriod: false, isOvulation: false },
    { dayName: 'T', dateNum: 12, isToday: false, isPeriod: false, isOvulation: false },
    { dayName: 'F', dateNum: 13, isToday: false, isPeriod: false, isOvulation: false },
    { dayName: 'S', dateNum: 14, dateLabel: 'Ovulation', isToday: false, isPeriod: false, isOvulation: true },
  ];

  const dailyInsights = [
    {
      id: 'cycle-day',
      tag: `Cycle day ${currentCycleDay}`,
      title: 'Your inner season',
      subtitle: `${phaseDetails.label}`,
      badgeColor: 'bg-[#E3EFE9] text-[#2D5A43] border-[#CCE0D6]',
      buttonText: 'View phase',
      content: phaseDetails.nurtureText,
      tips: [
        'Hormones are softly shifting toward vitality',
        'Prioritize wholesome hydration and light grounding walks',
        'Listen to subtle intuitive signals without pressure',
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
        'Track basal body warmth if practicing natural family planning',
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
        'Write in your journal to honor subtle mood nuances',
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
        'Magnesium glycinate supports muscle relaxation before sleep',
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
        'Log flow consistency in the daily journal to identify patterns',
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-5 pt-3 pb-6 overflow-y-auto">
      {/* Top Header with Date & Calendar Button (Flo Screenshot 3) */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#E8DFD5] flex items-center justify-center text-sm shadow-xs border border-[#D9CFC4]">
            🌿
          </div>
          <div>
            <h2 className="font-serif text-base font-medium text-[#4A2B33]">
              November 8
            </h2>
            <p className="text-[11px] text-[#7A5862] font-sans">
              {greeting}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('history')}
            title="View Calendar History"
            aria-label="View Calendar History"
            className="w-8 h-8 rounded-full bg-[#FAF6F0] border border-[#E8DFD5] flex items-center justify-center text-[#4A2B33] hover:border-[#C99A86] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.8" />
              <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.8" />
              <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.8" />
              <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.8" />
            </svg>
          </button>

          {currentUser && currentUser.provider !== 'local' ? (
            <button
              type="button"
              onClick={onOpenAccount}
              aria-label="Account details"
              className="w-8 h-8 rounded-full bg-[#FAF6F0] border border-[#E8DFD5] flex items-center justify-center font-serif text-xs text-[#4A2B33] hover:border-[#C99A86] transition-colors"
            >
              {currentUser.name.charAt(0).toUpperCase()}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onOpenAuth?.('login')}
              className="text-[11px] font-medium text-[#4A2B33] bg-[#FAF6F0] hover:bg-[#EFE7DE] border border-[#E8DFD5] px-2.5 py-1 rounded-full transition-colors"
            >
              Sign in
            </button>
          )}
        </div>
      </div>

      {/* Week Calendar Strip (Screenshot 3) */}
      <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[20px] p-3 mb-4 shadow-[0_2px_12px_rgba(74,43,51,0.03)]">
        <div className="grid grid-cols-7 gap-1 text-center items-center">
          {weekDays.map((wd, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center py-1.5 px-1 rounded-[14px] transition-all ${
                wd.isToday
                  ? 'bg-[#4A2B33] text-[#F7F3EC] shadow-xs'
                  : 'hover:bg-[#F2ECE3] text-[#7A5862]'
              }`}
            >
              <span className={`text-[9px] font-medium tracking-wider mb-1 ${wd.isToday ? 'text-[#EADBCE]' : 'text-[#8E6D77]'}`}>
                {wd.dayName}
              </span>
              <span className={`text-sm font-serif font-medium ${wd.isToday ? 'text-[#F7F3EC]' : 'text-[#4A2B33]'}`}>
                {wd.dateNum}
              </span>
              <div className="h-1.5 mt-1 flex items-center justify-center">
                {wd.isPeriod && (
                  <span className={`w-1.5 h-1.5 rounded-full ${wd.isToday ? 'bg-[#FF9B8A]' : 'bg-[#C97A7E]'}`} />
                )}
                {wd.isOvulation && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8EAB94]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Cycle Countdown & Status (Screenshot 3) */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-radial from-[#FAF6F0] to-[#F4EEE4] border border-[#EADBCE] rounded-[24px] p-5 mb-4 text-center shadow-[0_4px_20px_rgba(74,43,51,0.04)] relative overflow-hidden"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#E5DACD] text-xs font-sans text-[#7A5862] mb-2">
          <span className="w-2 h-2 rounded-full bg-[#C99A86] animate-pulse"></span>
          <span>{phaseDetails.label} · Day {currentCycleDay}</span>
        </div>

        <p className="text-xs uppercase tracking-widest text-[#8E6D77] font-sans font-medium">
          {isOvulationSoon ? 'Ovulation in' : 'Next period in'}
        </p>

        <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#4A2B33] my-1">
          {isOvulationSoon ? `${Math.max(1, daysUntilOvulation)} days` : `${Math.max(1, daysUntilPeriod)} days`}
        </h1>

        <div className="flex items-center justify-center gap-1.5 text-xs text-[#7A5862] mt-1 font-sans">
          <span>{pregnancyChanceText}</span>
          <span
            className="w-4 h-4 rounded-full border border-[#C99A86] text-[#C99A86] inline-flex items-center justify-center text-[10px] cursor-pointer"
            title="Estimated based on your cycle rhythm"
          >
            i
          </span>
        </div>
      </motion.div>

      {/* 3 Quick Action Buttons: Log Period, Symptoms, Intimacy (Screenshot 3) */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <button
          type="button"
          onClick={() => onNavigate('log')}
          className="flex flex-col items-center justify-center p-3 rounded-[20px] bg-[#FAF6F0] border border-[#EADBCE] hover:border-[#C97A7E] hover:shadow-xs transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-[#FCEBEB] text-[#C97A7E] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-xs">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <span className="text-xs font-sans font-medium text-[#4A2B33]">Log period</span>
          <span className="text-[10px] text-[#8E6D77]">Flow & cramps</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('log')}
          className="flex flex-col items-center justify-center p-3 rounded-[20px] bg-[#FAF6F0] border border-[#EADBCE] hover:border-[#A8B5A2] hover:shadow-xs transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-[#EFF5ED] text-[#5B6D55] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-xs">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-xs font-sans font-medium text-[#4A2B33]">Symptoms</span>
          <span className="text-[10px] text-[#8E6D77]">Body & mood</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('log')}
          className="flex flex-col items-center justify-center p-3 rounded-[20px] bg-[#FAF6F0] border border-[#EADBCE] hover:border-[#C99A86] hover:shadow-xs transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-[#FAF0EB] text-[#C99A86] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-xs">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="text-xs font-sans font-medium text-[#4A2B33]">Intimacy</span>
          <span className="text-[10px] text-[#8E6D77]">Sex & desire</span>
        </button>
      </div>

      {/* My Daily Insights Section (Flo Screenshots 3 & 5) */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-serif text-lg text-[#4A2B33] font-medium">
              My daily insights · Today
            </h3>
            <p className="text-[11px] text-[#7A5862]">
              Midwife wisdom tailored to cycle day {currentCycleDay}
            </p>
          </div>
          <span className="text-xs text-[#C99A86] font-serif italic">Swipe ➔</span>
        </div>

        {/* Horizontal Card Carousel */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
          {dailyInsights.map((insight) => (
            <motion.div
              key={insight.id}
              whileHover={{ y: -2 }}
              onClick={() => setSelectedInsight(insight)}
              className="flex-shrink-0 w-[240px] snap-start bg-[#FAF6F0] border border-[#EADBCE] rounded-[20px] p-4 flex flex-col justify-between cursor-pointer hover:border-[#C99A86] hover:shadow-sm transition-all"
            >
              <div>
                <span className={`inline-block text-[10px] font-sans font-medium px-2 py-0.5 rounded-full border mb-2.5 ${insight.badgeColor}`}>
                  {insight.tag}
                </span>
                <h4 className="font-serif text-base text-[#4A2B33] font-normal leading-snug mb-1">
                  {insight.title}
                </h4>
                <p className="text-xs text-[#7A5862] line-clamp-2 leading-relaxed">
                  {insight.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EADBCE]/70 flex items-center justify-between">
                <span className="text-xs font-medium text-[#4A2B33]">{insight.buttonText}</span>
                <span className="text-xs text-[#C99A86]">→</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Gentle Insight Banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-[#EEF3ED] border border-[#D7E3D4] rounded-[18px] p-4.5 mb-5 shadow-[0_2px_12px_rgba(91,109,85,0.04)]"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-[#A8B5A2]"></span>
          <span className="text-xs font-medium text-[#5B6D55]">
            Sanctuary observation
          </span>
        </div>
        <p className="font-serif text-base italic leading-relaxed text-[#4A2B33]">
          &ldquo;{gentleInsight}&rdquo;
        </p>
        <p className="text-[11px] text-[#7A5862] mt-2">
          {hasPeriodStart
            ? 'Reflecting your previous recorded cycles'
            : 'Listening gently alongside your body'}
        </p>
      </motion.div>

      {/* Bottom Navigation Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-auto">
        <button
          onClick={() => onNavigate('log')}
          className="min-h-[50px] p-3.5 bg-[#4A2B33] text-[#F7F3EC] rounded-[16px] text-center font-sans font-medium text-xs hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-xs flex items-center justify-center gap-1.5"
        >
          <span>Open daily journal</span>
          <span aria-hidden="true">→</span>
        </button>

        <button
          onClick={() => onNavigate('history')}
          className="min-h-[50px] p-3.5 bg-[#FAF6F0] border border-[#EADBCE] text-[#4A2B33] rounded-[16px] text-center font-sans font-medium text-xs hover:border-[#C99A86] transition-colors flex items-center justify-center gap-1.5"
        >
          <span>Cycle history</span>
        </button>
      </div>

      {/* Interactive Daily Insight Modal Reader */}
      <AnimatePresence>
        {selectedInsight && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A2B33]/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm bg-[#FAF6F0] border border-[#EADBCE] rounded-[24px] p-6 shadow-xl max-h-[85vh] overflow-y-auto text-[#4A2B33]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-full border ${selectedInsight.badgeColor}`}>
                  {selectedInsight.tag}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedInsight(null)}
                  className="w-7 h-7 rounded-full bg-[#F7F3EC] border border-[#EADBCE] flex items-center justify-center text-[#7A5862] hover:text-[#4A2B33]"
                >
                  ✕
                </button>
              </div>

              <h3 className="font-serif text-2xl font-normal text-[#4A2B33] mb-1">
                {selectedInsight.title}
              </h3>
              <p className="text-xs text-[#C99A86] font-serif italic mb-4">
                {selectedInsight.subtitle}
              </p>

              <p className="text-sm text-[#7A5862] leading-relaxed mb-5 font-sans">
                {selectedInsight.content}
              </p>

              <div className="bg-[#F7F3EC] border border-[#EADBCE] rounded-[18px] p-4 mb-5">
                <span className="text-xs font-serif font-medium text-[#4A2B33] block mb-2">
                  Midwife care suggestions:
                </span>
                <ul className="space-y-2">
                  {selectedInsight.tips.map((tip, i) => (
                    <li key={i} className="text-xs text-[#7A5862] flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A8B5A2] mt-1.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setSelectedInsight(null)}
                className="w-full min-h-[46px] rounded-[16px] bg-[#4A2B33] text-[#F7F3EC] text-xs font-sans font-medium hover:bg-[#3B2229] transition-all"
              >
                Understood, thank you
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
