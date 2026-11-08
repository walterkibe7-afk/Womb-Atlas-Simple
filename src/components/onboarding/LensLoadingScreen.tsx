import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShieldCheck, Check } from 'lucide-react';

interface LensLoadingScreenProps {
  onComplete: () => void;
  autoAdvance?: boolean;
}

export const LensLoadingScreen: React.FC<LensLoadingScreenProps> = ({
  onComplete,
  autoAdvance = true,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Smooth non-linear progress
        const increment = prev < 60 ? 3 : prev < 90 ? 2 : 1;
        return Math.min(100, prev + increment);
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  // When progress reaches 100, wait briefly then auto-advance if enabled
  useEffect(() => {
    if (progress >= 100 && autoAdvance) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [progress, autoAdvance, onComplete]);

  const getStageMessage = () => {
    if (progress < 25) return 'Reading your unique rhythm...';
    if (progress < 50) return 'Harmonizing biological timeline...';
    if (progress < 75) return 'Calibrating four gentle cycle phases...';
    if (progress < 99) return 'Synthesizing personal sanctuary insights...';
    return 'Your personal sanctuary is ready';
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-6 py-8 justify-between select-none overflow-y-auto">
      {/* Top Header */}
      <div className="text-center pt-2">
        <span className="font-serif text-lg tracking-tight text-[#4A2B33] font-medium block">
          Womb Atlas
        </span>
        <span className="text-[11px] text-[#7A5862]">· Sanctuary Calibration</span>
      </div>

      {/* Centerpiece: Illustrated Calendar with Animated Optical Lens */}
      <div className="my-auto py-6 flex flex-col items-center">
        <div className="relative w-64 h-56 flex items-center justify-center">
          {/* Calendar Illustration Card */}
          <div className="absolute inset-0 bg-[#FAF6F0] border border-[#EADBCE] rounded-[24px] shadow-[0_8px_30px_rgba(74,43,51,0.06)] p-4 flex flex-col justify-between overflow-hidden">
            {/* Calendar spiral rings header */}
            <div className="flex justify-between items-center pb-2 border-b border-[#EADBCE]/80">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5, 6].map((r) => (
                  <div
                    key={r}
                    className="w-2 h-3 rounded-full bg-[#E8DFD5] border border-[#D6C7BB]"
                  />
                ))}
              </div>
              <span className="font-serif text-[11px] text-[#7A5862]">
                November 2026
              </span>
            </div>

            {/* Grid of calendar day dots */}
            <div className="grid grid-cols-7 gap-2.5 py-2 text-center">
              {Array.from({ length: 28 }).map((_, i) => {
                const day = i + 1;
                const isPeriod = day <= 5;
                const isOvulation = day >= 13 && day <= 15;
                return (
                  <div
                    key={i}
                    className={`h-4 rounded-full flex items-center justify-center text-[9px] font-sans transition-all ${
                      isPeriod
                        ? 'bg-[#C99A86]/25 text-[#4A2B33] font-medium'
                        : isOvulation
                        ? 'bg-[#A8B5A2]/30 text-[#4A2B33]'
                        : 'bg-[#F2ECE4] text-[#A48F95]'
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {/* Subtle bottom note */}
            <div className="text-[10px] text-[#7A5862] font-serif italic text-center">
              Natural menstrual rhythm
            </div>
          </div>

          {/* ANIMATED OPTICAL LENS (Scanning over the calendar) */}
          <motion.div
            animate={{
              x: [-35, 30, 10, -25, -35],
              y: [-20, 15, -15, 20, -20],
              rotate: [0, 15, -10, 8, 0],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute z-20 pointer-events-none"
          >
            {/* The Lens Structure */}
            <div className="relative w-28 h-28">
              {/* Outer Metallic Ring with drop shadow */}
              <div className="absolute inset-0 rounded-full border-[6px] border-[#3B2229] shadow-[0_12px_28px_rgba(74,43,51,0.25)] flex items-center justify-center bg-transparent backdrop-blur-[0.5px]">
                {/* Secondary Rose-Gold Inner Bezel */}
                <div className="w-full h-full rounded-full border-2 border-[#C99A86] relative overflow-hidden flex items-center justify-center">
                  {/* Glass Caustic Lens Glare / Reflections */}
                  <motion.div
                    animate={{
                      opacity: [0.35, 0.75, 0.4, 0.8, 0.35],
                      rotate: [0, 45, 90, 135, 180],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent"
                  />

                  {/* Concentric Focal Ring */}
                  <div className="w-14 h-14 rounded-full border border-dashed border-[#C99A86]/60 animate-spin" style={{ animationDuration: '10s' }} />

                  {/* Center Optical Crosshair */}
                  <div className="w-2.5 h-2.5 rounded-full bg-[#C99A86]/80 shadow-xs" />
                </div>
              </div>

              {/* Lens Handle extending to bottom-right */}
              <div className="absolute -bottom-7 -right-7 w-4 h-12 bg-[#3B2229] rounded-full rotate-[-45deg] origin-top border border-[#2A181D] shadow-md">
                <div className="w-1.5 h-6 bg-[#C99A86]/40 rounded-full mx-auto mt-2" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress & Lens Stage Copy */}
        <div className="mt-8 text-center max-w-xs space-y-3">
          <motion.h2
            key={getStageMessage()}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-xl sm:text-2xl font-normal text-[#4A2B33]"
          >
            {progress < 100
              ? 'Calculating your cycle predictions...'
              : 'Predictions calibrated'}
          </motion.h2>

          <p className="text-xs text-[#7A5862] font-sans h-5">
            {getStageMessage()}
          </p>

          {/* Circular & Linear Progress Display */}
          <div className="w-full max-w-[240px] mx-auto pt-2">
            <div className="flex items-center justify-between text-xs text-[#7A5862] mb-1.5 font-medium">
              <span>Calibration</span>
              <span className="font-serif text-sm text-[#4A2B33]">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-[#EADFD5] rounded-full overflow-hidden p-0.5 border border-[#DFD3C5]">
              <motion.div
                className="h-full bg-[#4A2B33] rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Reassurance & Completion Action */}
      <div className="space-y-3 pt-4">
        {/* Social Proof Encouragement Card (Flo style) */}
        <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[18px] p-3.5 text-center shadow-2xs">
          <p className="text-xs text-[#4A2B33] leading-relaxed">
            <strong className="font-medium text-[#C99A86]">94% of women</strong> say tracking their biological rhythm with gentle care helped them feel grounded and empowered.
          </p>
        </div>

        {/* Enter Sanctuary Button (visible when calibration is 100%) */}
        {progress >= 100 ? (
          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            type="button"
            onClick={onComplete}
            className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>Enter your sanctuary</span>
            <span aria-hidden="true">→</span>
          </motion.button>
        ) : (
          <div className="h-[50px] flex items-center justify-center text-xs text-[#7A5862]">
            <span>Calibrating with your personal parameters...</span>
          </div>
        )}
      </div>
    </div>
  );
};
