import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DailyEntry, UserProfile } from '../types';
import {
  getGreeting,
  determineCyclePhase,
  getPhaseDetails,
  generateGentleInsight,
  summarizeEntry,
  calculateCycleDayFromDate,
  getTodayIso,
  toLocalIso,
} from '../utils/cycle';

interface HomeScreenProps {
  entries: DailyEntry[];
  onNavigate: (screen: 'home' | 'log' | 'history') => void;
  userName?: string;
  userProfile?: UserProfile;
  onUpdatePeriodStart?: (date: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  entries,
  onNavigate,
  userName = 'Achieng',
  userProfile,
  onUpdatePeriodStart,
}) => {
  const [inlineCalendarOpen, setInlineCalendarOpen] = useState(false);

  // Determine cycle day from last period start if available
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

  const greeting = getGreeting(
    userName || userProfile?.userName || ''
  );
  const gentleInsight = generateGentleInsight(
    entries,
    currentCycleDay,
    userProfile?.usesHormonalBirthControl,
    userProfile?.lifeStage
  );

  // Today's entry if logged
  const todayEntry = entries.find((e) => e.date === getTodayIso());

  // Quick inline calendar helper (current month, dynamic)
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
    <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-5 pt-4 pb-6 overflow-y-auto">
      {/* Top Brand & Date Kicker */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <span className="font-serif text-lg tracking-tight text-[#4A2B33] font-medium">
            Womb Atlas
          </span>
          <p className="text-xs text-[#7A5862] font-sans mt-0.5">
            Saturday, November 7
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#7A5862] bg-[#FAF6F0] px-3 py-1 rounded-full border border-[#E8DFD5]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A8B5A2]"></span>
          <span>
            {currentCycleDay ? `Day ${currentCycleDay} of cycle` : 'Learning mode'}
          </span>
        </div>
      </div>

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mt-2 mb-5"
      >
        <h1 className="font-serif text-[28px] leading-tight text-[#4A2B33] font-normal">
          {greeting}
        </h1>
        <p className="text-sm text-[#7A5862] font-sans mt-1">
          A gentle space to listen to your body.
        </p>
      </motion.div>

      {/* STATUS CARD: 2 States (Phase-Mode vs Learning-Mode) */}
      {hasPeriodStart && phaseDetails ? (
        /* State 1: Phase-Mode */
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[20px] p-5 shadow-[0_4px_20px_rgba(74,43,51,0.04)] mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#7A5862]">
              Current cycle phase
            </span>
            <span className="text-xs font-serif italic text-[#C99A86]">
              Nurture rhythm
            </span>
          </div>

          <h2 className="font-serif text-2xl font-normal text-[#4A2B33] mb-2">
            {phaseDetails.label}
          </h2>

          <p className="text-sm leading-relaxed text-[#7A5862] font-sans mb-5">
            {phaseDetails.nurtureText}
          </p>

          {/* Primary Action Button */}
          <button
            onClick={() => onNavigate('log')}
            className="w-full min-h-[48px] py-3 px-5 rounded-[16px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm"
          >
            <span>How are you feeling today?</span>
            <span aria-hidden="true" className="text-base">
              →
            </span>
          </button>

          {todayEntry && (
            <div className="mt-4 pt-3.5 border-t border-[#EADBCE]/70 text-xs text-[#7A5862] flex items-center justify-between">
              <span>Today&apos;s log:</span>
              <span className="text-[#4A2B33] font-medium">
                {summarizeEntry(todayEntry)}
              </span>
            </div>
          )}
        </motion.div>
      ) : (
        /* State 2: Learning-Mode (if skipped or "not sure") */
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[20px] p-5 shadow-[0_4px_20px_rgba(74,43,51,0.04)] mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#7A5862]">
              Finding your rhythm
            </span>
            <span className="text-xs font-serif italic text-[#C99A86]">
              No rush
            </span>
          </div>

          <h2 className="font-serif text-2xl font-normal text-[#4A2B33] mb-2">
            The Atlas is finding your rhythm
          </h2>

          <p className="text-sm leading-relaxed text-[#7A5862] font-sans mb-4">
            The Atlas is still finding your rhythm. Log your next period when it starts, and we&apos;ll listen quietly alongside your body.
          </p>

          <button
            type="button"
            onClick={() => setInlineCalendarOpen((prev) => !prev)}
            className="w-full min-h-[46px] py-2.5 px-4 rounded-[16px] bg-[#F7F3EC] border border-[#EADBCE] text-[#4A2B33] font-sans text-xs font-medium flex items-center justify-center gap-2 hover:border-[#C99A86] transition-all"
          >
            <span>
              {inlineCalendarOpen
                ? 'Close calendar'
                : 'Select last period start date'}
            </span>
            <span className="text-sm">{inlineCalendarOpen ? '↑' : '↓'}</span>
          </button>

          {/* Inline Calendar Drawer */}
          <AnimatePresence>
            {inlineCalendarOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden pt-3 border-t border-[#EADBCE]/70 mt-3"
              >
                <div className="text-center mb-2">
                  <span className="text-xs font-serif text-[#4A2B33]">
                    November 2026
                  </span>
                  <p className="text-[10px] text-[#7A5862]">
                    Tap the day your bleeding began:
                  </p>
                </div>

                <div className="grid grid-cols-7 text-center text-[10px] text-[#7A5862] mb-1">
                  <span>Su</span>
                  <span>Mo</span>
                  <span>Tu</span>
                  <span>We</span>
                  <span>Th</span>
                  <span>Fr</span>
                  <span>Sa</span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-in-${i}`} className="h-7" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const isFuture =
                      new Date(today.getFullYear(), today.getMonth(), dayNum) > today;
                    return (
                      <button
                        key={`in-day-${dayNum}`}
                        type="button"
                        disabled={isFuture}
                        onClick={() => handleSelectInlineDate(dayNum)}
                        className={`h-7 rounded-full text-xs transition-all flex items-center justify-center ${
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
        </motion.div>
      )}

      {/* Gentle Insight Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-[#EEF3ED] border border-[#D7E3D4] rounded-[18px] p-4.5 mb-5 shadow-[0_2px_12px_rgba(91,109,85,0.04)]"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-[#A8B5A2]"></span>
          <span className="text-xs font-medium text-[#5B6D55]">
            Gentle insight
          </span>
        </div>
        <p className="font-serif text-base italic leading-relaxed text-[#4A2B33]">
          &ldquo;{gentleInsight}&rdquo;
        </p>
        <p className="text-[11px] text-[#7A5862] mt-2">
          {hasPeriodStart
            ? 'Based on your previous 3 recorded cycles'
            : 'Listening to your cadence as you begin'}
        </p>
      </motion.div>

      {/* Quick Links to Log and History */}
      <div className="grid grid-cols-2 gap-3 mt-auto">
        <button
          onClick={() => onNavigate('log')}
          className="min-h-[52px] p-3.5 bg-[#FAF6F0] border border-[#EADBCE] rounded-[16px] text-left hover:border-[#C99A86] transition-colors"
        >
          <span className="block text-xs text-[#7A5862]">Quick entry</span>
          <span className="font-serif text-base text-[#4A2B33] font-medium">
            Log today
          </span>
        </button>

        <button
          onClick={() => onNavigate('history')}
          className="min-h-[52px] p-3.5 bg-[#FAF6F0] border border-[#EADBCE] rounded-[16px] text-left hover:border-[#C99A86] transition-colors"
        >
          <span className="block text-xs text-[#7A5862]">Past cycles</span>
          <span className="font-serif text-base text-[#4A2B33] font-medium">
            History
          </span>
        </button>
      </div>
    </div>
  );
};
