import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LifeStage, UserProfile } from '../../types';

interface OnboardingFlowProps {
  onComplete: (profile: Partial<UserProfile>) => void;
  initialStep?: 1 | 2 | 3;
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
  initialStep = 1,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(initialStep);

  // Form states
  const [userName, setUserName] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string | undefined>('2026-11-05');
  const [isNotSure, setIsNotSure] = useState<boolean>(false);
  const [lifeStage, setLifeStage] = useState<LifeStage | undefined>(
    'currently-cycling'
  );
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodLength, setPeriodLength] = useState<number>(5);
  const [usesHormonalBirthControl, setUsesHormonalBirthControl] =
    useState<boolean>(false);

  // Calendar month state for ~90 days back (Nov, Oct, Sep, Aug 2026)
  const [calendarMonth, setCalendarMonth] = useState<number>(10); // 10 = Nov 2026
  const calendarYear = 2026;

  const handleFinish = () => {
    onComplete({
      userName: userName.trim() || 'Achieng',
      lastPeriodStart: isNotSure ? undefined : selectedDate,
      lifeStage,
      cycleLength,
      periodLength,
      usesHormonalBirthControl,
      hasCompletedOnboarding: true,
    });
  };

  // Calendar calculations
  const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const monthLabel = new Date(calendarYear, calendarMonth, 1).toLocaleDateString(
    'en-US',
    { month: 'long', year: 'numeric' }
  );

  return (
    <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-5 pt-4 pb-6 overflow-y-auto">
      {/* Top Header with App Name and Quiet Back Action */}
      <div className="flex items-center justify-between pb-3">
        <span className="font-serif text-lg tracking-tight text-[#4A2B33] font-medium">
          Womb Atlas
        </span>
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
            className="text-xs text-[#7A5862] hover:text-[#4A2B33] min-h-[44px] px-2 flex items-center"
          >
            ← Previous
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* CARD A: NAME */}
        {step === 1 && (
          <motion.div
            key="card-name"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35 }}
            className="flex-1 flex flex-col justify-between pt-2"
          >
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-3xl font-normal text-[#4A2B33] leading-snug">
                  What should we call you?
                </h1>
                <p className="text-sm text-[#7A5862] font-sans mt-2">
                  Use your first name, a nickname, or whatever feels comforting.
                </p>
              </div>

              {/* Name Field Card */}
              <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[22px] p-5 shadow-[0_3px_16px_rgba(74,43,51,0.03)] space-y-2">
                <label
                  htmlFor="user-name-input"
                  className="block text-xs font-medium text-[#7A5862]"
                >
                  Your preferred name
                </label>
                <input
                  id="user-name-input"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Achieng"
                  className="w-full bg-[#F7F3EC] border border-[#EADBCE] rounded-[16px] px-4 py-3.5 text-base text-[#4A2B33] placeholder-[#A48F95] focus:outline-none focus:border-[#C99A86] focus:ring-1 focus:ring-[#C99A86] transition-all"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 space-y-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center"
              >
                Continue
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setUserName('');
                    setStep(2);
                  }}
                  className="text-xs text-[#7A5862] hover:text-[#4A2B33] py-2 px-4 transition-colors"
                >
                  I&apos;ll fill this in later
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* CARD B: PERIOD START */}
        {step === 2 && (
          <motion.div
            key="card-period"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35 }}
            className="flex-1 flex flex-col justify-between pt-1"
          >
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
                {/* Month navigation header */}
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

                {/* Day of week abbreviations */}
                <div className="grid grid-cols-7 text-center text-[10px] font-medium text-[#7A5862] mb-1">
                  <span>Su</span>
                  <span>Mo</span>
                  <span>Tu</span>
                  <span>We</span>
                  <span>Th</span>
                  <span>Fr</span>
                  <span>Sa</span>
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-0.5 text-center">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-7" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateStr = `${calendarYear}-${String(
                      calendarMonth + 1
                    ).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                    const isFuture =
                      calendarMonth === 10 && dayNum > 7; // today is Nov 7, 2026
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

                {/* Warm 'I'm not sure' button */}
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
                onClick={() => setStep(3)}
                className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center"
              >
                Continue
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsNotSure(true);
                    setSelectedDate(undefined);
                    setStep(3);
                  }}
                  className="text-xs text-[#7A5862] hover:text-[#4A2B33] py-2 px-4 transition-colors"
                >
                  Skip this question
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* CARD C: RHYTHM */}
        {step === 3 && (
          <motion.div
            key="card-rhythm"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35 }}
            className="flex-1 flex flex-col justify-between pt-2"
          >
            <div className="space-y-4">
              <div>
                <h1 className="font-serif text-2xl font-normal text-[#4A2B33] leading-snug">
                  How does your cycle usually run?
                </h1>
                <p className="text-xs text-[#7A5862] font-sans mt-1">
                  A rough idea is enough — the app learns as you log.
                </p>
              </div>

              {/* Sliders Card */}
              <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[22px] p-5 shadow-[0_3px_16px_rgba(74,43,51,0.03)] space-y-5">
                {/* Cycle Length Slider */}
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

                {/* Period Length Slider */}
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

                {/* Hormonal Birth Control Toggle */}
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
                onClick={handleFinish}
                className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center"
              >
                Enter the Atlas
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleFinish}
                  className="text-xs text-[#7A5862] hover:text-[#4A2B33] py-2 px-4 transition-colors"
                >
                  Accept default rhythm
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
