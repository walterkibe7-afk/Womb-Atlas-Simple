import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DailyEntry, UserProfile } from '../../types';
import {
  getGreeting,
  determineCyclePhase,
  getPhaseDetails,
  generateGentleInsight,
  summarizeEntry,
  calculateCycleDayFromDate,
  getTodayIso,
  toLocalIso,
} from '../../utils/cycle';

interface DesktopTodayProps {
  entries: DailyEntry[];
  onNavigate: (tab: 'today' | 'log' | 'history') => void;
  userName?: string;
  userProfile?: UserProfile;
  onUpdatePeriodStart?: (date: string) => void;
}

export const DesktopToday: React.FC<DesktopTodayProps> = ({
  entries,
  onNavigate,
  userName = 'Achieng',
  userProfile,
  onUpdatePeriodStart,
}) => {
  const [inlineCalendarOpen, setInlineCalendarOpen] = useState(false);

  const hasPeriodStart = Boolean(userProfile?.lastPeriodStart);
  const currentCycleDay = hasPeriodStart
    ? calculateCycleDayFromDate(
        userProfile?.lastPeriodStart,
        getTodayIso(),
        userProfile?.cycleLength || 28
      ) || 1
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

  const effectiveUserName = userName || userProfile?.userName || '';
  const greeting = getGreeting(effectiveUserName);
  const gentleInsight = generateGentleInsight(
    entries,
    currentCycleDay,
    userProfile?.usesHormonalBirthControl,
    userProfile?.lifeStage
  );
  const todayEntry = entries.find((e) => e.date === getTodayIso());

  const phases = [
    {
      name: 'Menstrual',
      days: 'Days 1–5',
      note: 'Rest, release & clearing space',
      active: currentPhase === 'menstrual',
    },
    {
      name: 'Follicular',
      days: 'Days 6–11',
      note: 'Rising energy & gentle renewal',
      active: currentPhase === 'follicular',
    },
    {
      name: 'Ovulatory',
      days: 'Days 12–16',
      note: 'Warmth, vitality & connection',
      active: currentPhase === 'ovulatory',
    },
    {
      name: 'Luteal',
      days: 'Days 17–28',
      note: 'Turning inward & mindful boundaries',
      active: currentPhase === 'luteal',
    },
  ];

  // Inline calendar helpers (current month, dynamic)
  const today = new Date(`${getTodayIso()}T00:00:00`);
  const firstDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  ).getDay();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const handleSelectInlineDate = (dayNum: number) => {
    const dateStr = toLocalIso(
      new Date(today.getFullYear(), today.getMonth(), dayNum)
    );
    if (onUpdatePeriodStart) {
      onUpdatePeriodStart(dateStr);
    }
    setInlineCalendarOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Desktop Greeting Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-[#A8B5A2]"></span>
          <span className="text-xs font-medium text-[#7A5862]">
            {currentCycleDay
              ? `Day ${currentCycleDay} of ${userProfile?.cycleLength || 28} · Quiet rhythm`
              : 'Learning mode · Quiet rhythm'}
          </span>
        </div>
        <h1 className="font-serif text-3xl lg:text-4xl text-[#4A2B33] font-normal leading-tight">
          {greeting}
        </h1>
        <p className="text-sm text-[#7A5862] mt-1.5 max-w-xl">
          A quiet space to check in with yourself. No rush, no diagnostic alarms — just an unhurried map of your body&apos;s natural cadence.
        </p>
      </motion.div>

      {/* 2-Column Balanced Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Primary Cycle Phase Card & Navigation (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* THE CYCLE PHASE CARD (Mimicking mobile status card style) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[24px] p-7 lg:p-8 shadow-[0_4px_24px_rgba(74,43,51,0.03)]"
            data-testid="cycle-phase-card"
          >
            {hasPeriodStart && phaseDetails ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-[#7A5862]">
                    Current cycle phase
                  </span>
                  <span className="text-xs font-serif italic text-[#C99A86]">
                    Nurture rhythm
                  </span>
                </div>

                <h2 className="font-serif text-3xl font-normal text-[#4A2B33] mb-3">
                  {phaseDetails.label}
                </h2>

                <p className="text-sm lg:text-base text-[#7A5862] leading-relaxed mb-5 max-w-lg">
                  {phaseDetails.nurtureText}
                </p>

                {/* Gentle insight embedded inside the cycle phase card */}
                <div className="p-4 bg-[#EEF3ED] border border-[#D7E3D4] rounded-[18px] mb-6">
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] font-medium text-[#5B6D55]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A8B5A2]"></span>
                    <span>Gentle reproductive health insight</span>
                  </div>
                  <p className="font-serif text-sm italic text-[#4A2B33] leading-relaxed">
                    &ldquo;{gentleInsight}&rdquo;
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <button
                    onClick={() => onNavigate('log')}
                    className="min-h-[48px] px-7 py-3 rounded-[16px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>How are you feeling today?</span>
                    <span aria-hidden="true">→</span>
                  </button>
                  <button
                    onClick={() => onNavigate('history')}
                    className="min-h-[48px] px-6 py-3 rounded-[16px] bg-[#FAF6F0] border border-[#EADBCE] text-sm text-[#4A2B33] font-medium hover:border-[#C99A86] transition-colors text-center"
                  >
                    View calendar history
                  </button>
                </div>
              </>
            ) : (
              /* Learning Mode Cycle Phase Card */
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-[#7A5862]">
                    Finding your rhythm
                  </span>
                  <span className="text-xs font-serif italic text-[#C99A86]">
                    Gentle start
                  </span>
                </div>

                <h2 className="font-serif text-3xl font-normal text-[#4A2B33] mb-3">
                  The Atlas is finding your rhythm
                </h2>

                <p className="text-sm lg:text-base text-[#7A5862] leading-relaxed mb-5 max-w-lg">
                  The Atlas is still finding your rhythm. Log your next period when it starts, and we&apos;ll listen quietly alongside your body.
                </p>

                <div className="p-4 bg-[#EEF3ED] border border-[#D7E3D4] rounded-[18px] mb-6">
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] font-medium text-[#5B6D55]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A8B5A2]"></span>
                    <span>Gentle reproductive health insight</span>
                  </div>
                  <p className="font-serif text-sm italic text-[#4A2B33] leading-relaxed">
                    &ldquo;{gentleInsight}&rdquo;
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => setInlineCalendarOpen((prev) => !prev)}
                    className="min-h-[48px] px-6 py-3 rounded-[16px] bg-[#4A2B33] text-[#F7F3EC] text-sm font-medium hover:bg-[#3B2229] transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>
                      {inlineCalendarOpen
                        ? 'Close calendar'
                        : 'Select last period start date'}
                    </span>
                    <span>{inlineCalendarOpen ? '↑' : '↓'}</span>
                  </button>
                  <button
                    onClick={() => onNavigate('log')}
                    className="min-h-[48px] px-6 py-3 rounded-[16px] bg-[#FAF6F0] border border-[#EADBCE] text-sm text-[#4A2B33] font-medium hover:border-[#C99A86] transition-colors text-center"
                  >
                    Log daily symptoms
                  </button>
                </div>

                {/* Inline calendar for desktop learning mode */}
                <AnimatePresence>
                  {inlineCalendarOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden pt-5 border-t border-[#EADBCE]/70 mt-5"
                    >
                      <div className="text-center mb-3">
                        <span className="text-sm font-serif text-[#4A2B33]">
                          November 2026
                        </span>
                        <p className="text-xs text-[#7A5862]">
                          Tap the day your bleeding began:
                        </p>
                      </div>

                      <div className="grid grid-cols-7 text-center text-xs text-[#7A5862] mb-1.5 max-w-sm mx-auto">
                        <span>Su</span>
                        <span>Mo</span>
                        <span>Tu</span>
                        <span>We</span>
                        <span>Th</span>
                        <span>Fr</span>
                        <span>Sa</span>
                      </div>

                      <div className="grid grid-cols-7 gap-1.5 text-center max-w-sm mx-auto">
                        {Array.from({ length: firstDay }).map((_, i) => (
                          <div key={`desk-in-${i}`} className="h-8" />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                          const dayNum = i + 1;
                          const isFuture =
                            new Date(today.getFullYear(), today.getMonth(), dayNum) > today;
                          return (
                            <button
                              key={`desk-in-day-${dayNum}`}
                              type="button"
                              disabled={isFuture}
                              onClick={() => handleSelectInlineDate(dayNum)}
                              className={`h-8 rounded-full text-xs transition-all flex items-center justify-center ${
                                isFuture
                                  ? 'text-[#C7B7B9] cursor-not-allowed'
                                  : 'text-[#4A2B33] hover:bg-[#EADBCE] active:bg-[#4A2B33] active:text-[#F7F3EC]'
                              }`}
                            >
                              {dayNum}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {todayEntry && (
              <div className="mt-6 pt-4 border-t border-[#EADBCE]/70 flex items-center justify-between text-xs text-[#7A5862]">
                <span>Today&apos;s recorded note:</span>
                <span className="text-[#4A2B33] font-medium">
                  {summarizeEntry(todayEntry)}
                </span>
              </div>
            )}
          </motion.div>

          {/* Quick Navigation Cards */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onNavigate('log')}
              className="p-5 bg-[#FAF6F0] border border-[#EADBCE] rounded-[20px] text-left hover:border-[#C99A86] transition-all"
            >
              <span className="text-xs text-[#7A5862] block mb-1">
                Daily journal
              </span>
              <span className="font-serif text-lg text-[#4A2B33] font-medium block">
                Record today&apos;s entry
              </span>
              <span className="text-xs text-[#7A5862] mt-1 block">
                Flow, cramps, mood &amp; note
              </span>
            </button>

            <button
              onClick={() => onNavigate('history')}
              className="p-5 bg-[#FAF6F0] border border-[#EADBCE] rounded-[20px] text-left hover:border-[#C99A86] transition-all"
            >
              <span className="text-xs text-[#7A5862] block mb-1">
                Gentle cadence
              </span>
              <span className="font-serif text-lg text-[#4A2B33] font-medium block">
                Cycle history
              </span>
              <span className="text-xs text-[#7A5862] mt-1 block">
                Calendar &amp; 5-month rhythm
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Gentle Insight & Rhythm Map (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Gentle Insight Callout Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-[#EEF3ED] border border-[#D7E3D4] rounded-[22px] p-6 shadow-[0_2px_16px_rgba(91,109,85,0.04)]"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-2 h-2 rounded-full bg-[#A8B5A2]"></span>
              <span className="text-xs font-medium text-[#5B6D55]">
                Reproductive health insight
              </span>
            </div>
            <p className="font-serif text-xl italic leading-relaxed text-[#4A2B33]">
              &ldquo;{gentleInsight}&rdquo;
            </p>
            <p className="text-xs text-[#7A5862] mt-3">
              {hasPeriodStart
                ? 'Observed gently from your previous menstrual entries.'
                : 'Listening quietly alongside your body.'}
            </p>
          </motion.div>

          {/* Cycle Phases Natural Map */}
          <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[22px] p-6 space-y-3">
            <span className="text-xs font-medium text-[#7A5862] block mb-1">
              Your body&apos;s four phases
            </span>

            {phases.map((p) => (
              <div
                key={p.name}
                className={`p-3.5 rounded-[16px] border transition-all ${
                  p.active
                    ? 'bg-[#F7F3EC] border-[#C99A86] shadow-xs'
                    : 'border-transparent text-[#7A5862]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-serif text-sm font-medium ${
                      p.active ? 'text-[#4A2B33]' : 'text-[#7A5862]'
                    }`}
                  >
                    {p.name}
                  </span>
                  <span className="text-xs text-[#7A5862]">{p.days}</span>
                </div>
                <p className="text-xs text-[#7A5862] mt-0.5">{p.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
