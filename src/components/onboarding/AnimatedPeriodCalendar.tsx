import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PeriodCalendarProps {
  selectedDate: string | undefined;
  onSelectDate: (dateStr: string) => void;
  onConfirm: () => void;
  onSkip: () => void;
  cycleLength?: number;
  periodLength?: number;
  isNotSure: boolean;
  onNotSureChange: (value: boolean) => void;
  disabled?: boolean;
}

export const AnimatedPeriodCalendar: React.FC<PeriodCalendarProps> = ({
  selectedDate,
  onSelectDate,
  onConfirm,
  onSkip,
  cycleLength = 28,
  periodLength = 5,
  isNotSure,
  onNotSureChange,
  disabled = false,
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const [calendarMonth, setCalendarMonth] = useState<number>(10);
  const calendarYear = 2026;
  const [showPredictions, setShowPredictions] = useState(false);
  const [animatedDays, setAnimatedDays] = useState<Set<number>>(new Set());
  const animationFrameRef = useRef<number | null>(null);

  const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const monthLabel = new Date(calendarYear, calendarMonth, 1).toLocaleDateString(
    'en-US',
    { month: 'long', year: 'numeric' }
  );

  // Calculate period days and predictions
  const getPeriodDays = useCallback((startDateStr: string): number[] => {
    const startDay = new Date(startDateStr).getDate();
    const days: number[] = [];
    for (let i = 0; i < periodLength; i++) {
      const day = startDay + i;
      if (day <= daysInMonth) days.push(day);
    }
    return days;
  }, [periodLength, daysInMonth]);

  const getNextPeriodStart = useCallback((startDateStr: string): number | null => {
    const startDay = new Date(startDateStr).getDate();
    const nextStart = startDay + cycleLength;
    if (nextStart <= daysInMonth) return nextStart;
    return null;
  }, [cycleLength, daysInMonth]);

  const getFertileWindow = useCallback((startDateStr: string): { start: number; end: number } | null => {
    const startDay = new Date(startDateStr).getDate();
    const ovulationDay = startDay + Math.floor(cycleLength / 2);
    const fertileStart = ovulationDay - 5;
    const fertileEnd = ovulationDay + 1;
    if (fertileStart <= daysInMonth && fertileEnd > 0) {
      return {
        start: Math.max(1, fertileStart),
        end: Math.min(daysInMonth, fertileEnd),
      };
    }
    return null;
  }, [cycleLength, daysInMonth]);

  const periodDays = selectedDate ? getPeriodDays(selectedDate) : [];
  const nextPeriodStart = selectedDate ? getNextPeriodStart(selectedDate) : null;
  const nextPeriodDays = nextPeriodStart
    ? Array.from({ length: periodLength }, (_, i) => nextPeriodStart + i).filter(d => d <= daysInMonth)
    : [];
  const fertileWindow = selectedDate ? getFertileWindow(selectedDate) : null;

  // Animate period days filling in progressively
  useEffect(() => {
    if (!selectedDate || prefersReducedMotion) {
      if (selectedDate) setAnimatedDays(new Set(periodDays));
      return;
    }

    setAnimatedDays(new Set());
    let currentIndex = 0;

    const animateNext = () => {
      if (currentIndex < periodDays.length) {
        setAnimatedDays(prev => new Set(prev).add(periodDays[currentIndex]));
        currentIndex++;
        animationFrameRef.current = requestAnimationFrame(animateNext);
      } else {
        // After period days animate, show predictions
        setTimeout(() => setShowPredictions(true), 300);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateNext);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [selectedDate, periodDays, prefersReducedMotion]);

  const handleSelectDate = useCallback((dayNum: number) => {
    if (dayNum > 7 && calendarMonth === 10) return; // Don't allow future dates
    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    onSelectDate(dateStr);
  }, [calendarMonth, calendarYear, onSelectDate]);

  const isInPeriodDays = useCallback((day: number) => periodDays.includes(day), [periodDays]);
  const isInAnimatedPeriodDays = useCallback((day: number) => animatedDays.has(day), [animatedDays]);
  const isInNextPeriodDays = useCallback((day: number) => nextPeriodDays.includes(day), [nextPeriodDays]);
  const isInFertileWindow = useCallback((day: number) => fertileWindow && day >= fertileWindow.start && day <= fertileWindow.end, [fertileWindow]);
  const isFuture = useCallback((day: number) => calendarMonth === 10 && day > 7, [calendarMonth]);

  // Inject CSS for pulse animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.02); }
      }
      .animate-pulse-calendar { animation: pulse 1.5s ease-in-out infinite; }
      .animate-pulse-slow { animation: pulse 2s ease-in-out infinite; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-5 pt-3 pb-6 overflow-y-auto">
      <div className="flex items-center justify-between pb-2">
        <span className="font-serif text-lg tracking-tight text-[#4A2B33] font-medium">Womb Atlas</span>
        <button type="button" onClick={onSkip} className="text-xs text-[#7A5862] hover:text-[#4A2B33] min-h-[44px] px-2 flex items-center">Skip all</button>
      </div>

      <div className="flex-1 flex flex-col justify-between pt-1">
        <div className="space-y-4">
          <div>
            <h1 className="font-serif text-2xl font-normal text-[#4A2B33] leading-snug">When did your last period start?</h1>
            <p className="text-xs text-[#7A5862] font-sans mt-1">Choose the first day of bleeding, or skip if you aren&apos;t sure.</p>
          </div>

          <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[22px] p-3.5 shadow-[0_3px_16px_rgba(74,43,51,0.03)]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif text-base font-normal text-[#4A2B33]">{monthLabel}</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setCalendarMonth((m) => Math.max(7, m - 1))} disabled={calendarMonth <= 7} aria-label="Previous month" className="w-7 h-7 rounded-full flex items-center justify-center text-[#7A5862] hover:bg-[#EADBCE]/50 disabled:opacity-30 disabled:hover:bg-transparent">‹</button>
                <button type="button" onClick={() => setCalendarMonth((m) => Math.min(10, m + 1))} disabled={calendarMonth >= 10} aria-label="Next month" className="w-7 h-7 rounded-full flex items-center justify-center text-[#7A5862] hover:bg-[#EADBCE]/50 disabled:opacity-30 disabled:hover:bg-transparent">›</button>
              </div>
            </div>
            <div className="grid grid-cols-7 text-center text-[10px] font-medium text-[#7A5862] mb-1"><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div>
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="h-7" />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const isFutureDate = isFuture(dayNum);
                const isSelected = !isNotSure && selectedDate === dateStr;
                const inPeriod = isInPeriodDays(dayNum);
                const inAnimatedPeriod = isInAnimatedPeriodDays(dayNum);
                const inNextPeriod = isInNextPeriodDays(dayNum);
                const inFertile = isInFertileWindow(dayNum);

                let dayClassName = 'h-7 rounded-full text-xs transition-all flex items-center justify-center ';

                if (isSelected) {
                  dayClassName += 'bg-[#4A2B33] text-[#F7F3EC] font-medium shadow-xs scale-105';
                } else if (inAnimatedPeriod) {
                  dayClassName += 'bg-[#C99A86] text-[#F7F3EC] font-medium animate-pulse-calendar';
                } else if (inPeriod) {
                  dayClassName += 'bg-[#C99A86]/30 text-[#C99A86] font-medium';
                } else if (showPredictions && inNextPeriod) {
                  dayClassName += 'bg-[#FCEFE8] text-[#8A3F24] font-medium ring-1 ring-[#F6D8C9] animate-pulse-slow';
                } else if (showPredictions && inFertile) {
                  dayClassName += 'bg-[#EDEAF7] text-[#4A3D73] font-medium ring-1 ring-[#DDD7F1]';
                } else if (isFutureDate) {
                  dayClassName += 'text-[#C7B7B9] cursor-not-allowed';
                } else {
                  dayClassName += 'text-[#4A2B33] hover:bg-[#EADBCE]/60';
                }

                return (
                  <button
                    key={dateStr}
                    type="button"
                    disabled={isFutureDate || disabled}
                    onClick={() => handleSelectDate(dayNum)}
                    className={dayClassName}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            {(showPredictions && (nextPeriodDays.length > 0 || fertileWindow)) && (
              <div className="mt-3 pt-3 border-t border-[#EADBCE]/60 flex flex-wrap items-center justify-center gap-3 text-[10px] text-[#7A5862]">
                {periodDays.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C99A86]"></span>
                    <span>Your period (recorded)</span>
                  </div>
                )}
                {nextPeriodDays.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FCEFE8] border border-[#F6D8C9] ring-1 ring-[#F6D8C9]"></span>
                    <span>Estimated next period</span>
                  </div>
                )}
                {fertileWindow && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EDEAF7] border border-[#DDD7F1] ring-1 ring-[#DDD7F1]"></span>
                    <span>Estimated fertile window</span>
                  </div>
                )}
              </div>
            )}

            <div className="mt-3 pt-2.5 border-t border-[#EADBCE]/70 text-center">
              <button type="button" onClick={() => { onNotSureChange(true); onSelectDate(''); }} className={`min-h-[40px] px-4 py-1.5 rounded-full text-xs font-medium transition-all ${isNotSure ? 'bg-[#A8B5A2] text-white shadow-xs' : 'bg-[#F7F3EC] border border-[#EADBCE] text-[#7A5862] hover:text-[#4A2B33]'}`}>{isNotSure ? "✓ I'm not sure" : "I'm not sure"}</button>
            </div>
          </div>

          {selectedDate && !isNotSure && (
            <div className="space-y-2 pt-1">
              <p className="text-xs text-[#7A5862] font-sans">Which of these feels closest to you right now?</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'currently-cycling', label: 'currently cycling' },
                  { id: 'postpartum', label: 'postpartum' },
                  { id: 'perimenopause', label: 'perimenopause' },
                  { id: 'pregnant-recovering', label: 'pregnant/recovering' },
                  { id: 'not-sure', label: 'not sure' },
                ].map((stage) => (
                  <button key={stage.id} type="button" disabled={disabled} onClick={() => {}} className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs transition-all border bg-[#FAF6F0]/70 border-[#EADBCE] text-[#7A5862] hover:border-[#D6C7BB] opacity-50`}>{stage.label}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 space-y-2">
          <button type="button" disabled={!selectedDate && !isNotSure} onClick={onConfirm} className={`w-full min-h-[50px] py-3.5 px-6 rounded-[18px] font-sans text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 ${(!selectedDate && !isNotSure) ? 'bg-[#EADFD5]/70 text-[#A4948F] border border-[#DFD5CB] cursor-not-allowed opacity-60' : 'bg-[#4A2B33] text-[#F7F3EC] hover:bg-[#3B2229] active:scale-[0.99] cursor-pointer'}`}><span>Continue</span><span aria-hidden="true">→</span></button>
          <div className="text-center"><button type="button" onClick={onSkip} className="text-xs text-[#7A5862] hover:text-[#4A2B33] py-2 px-4 transition-colors">Skip all</button></div>
        </div>
      </div>
    </div>
  );
};