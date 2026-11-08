import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Check, Heart } from 'lucide-react';

interface PledgeCommitmentScreenProps {
  onContinue: () => void;
  onBack?: () => void;
}

export const PledgeCommitmentScreen: React.FC<PledgeCommitmentScreenProps> = ({
  onContinue,
  onBack,
}) => {
  const [holdingProgress, setHoldingProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isCommitted, setIsCommitted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    if (isCommitted) return;
    setIsHolding(true);
    let progress = 0;
    timerRef.current = setInterval(() => {
      progress += 4;
      if (progress >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        setHoldingProgress(100);
        setIsHolding(false);
        setIsCommitted(true);
        setTimeout(() => {
          onContinue();
        }, 800);
      } else {
        setHoldingProgress(progress);
      }
    }, 40);
  };

  const endHold = () => {
    if (isCommitted) return;
    setIsHolding(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setHoldingProgress(0);
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-6 pt-6 pb-8 justify-between select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2">
        <span className="font-serif text-lg tracking-tight text-[#4A2B33] font-medium">
          Womb Atlas
        </span>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-[#7A5862] hover:text-[#4A2B33] min-h-[44px] px-2 flex items-center"
          >
            ← Previous
          </button>
        )}
      </div>

      <div className="my-auto text-center space-y-8 max-w-sm mx-auto">
        {/* Sacred Pledge Affirmation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <span className="text-xs font-serif uppercase tracking-widest text-[#C99A86] font-semibold block">
            A gentle commitment
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#4A2B33] leading-snug">
            I will use Womb Atlas to
          </h1>
          <p className="font-serif italic text-lg sm:text-xl text-[#7A5862] leading-relaxed max-w-xs mx-auto">
            &ldquo;improve my relationship with my period, know my body better, and be ready for anything.&rdquo;
          </p>
        </motion.div>

        {/* Tap and Hold Emblem Target */}
        <div className="flex flex-col items-center justify-center pt-2">
          <div
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            className="relative w-36 h-36 rounded-full cursor-pointer flex items-center justify-center touch-none select-none transition-transform active:scale-95"
            role="button"
            tabIndex={0}
            aria-label="Tap and hold on the logo to commit"
          >
            {/* Pulsing Aura */}
            <motion.div
              animate={{
                scale: isHolding ? [1, 1.15, 1.05] : [1, 1.05, 1],
                opacity: isHolding ? 0.4 : 0.15,
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-full bg-[#C99A86]"
            />

            {/* Circular Progress Ring */}
            <svg className="w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#EADBCE"
                strokeWidth="4"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#C99A86"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="276"
                strokeDashoffset={276 - (276 * holdingProgress) / 100}
                className="transition-all duration-75"
              />
            </svg>

            {/* Center Womb Atlas Emblem */}
            <div className="absolute w-24 h-24 rounded-full bg-[#FAF6F0] border border-[#EADBCE] shadow-sm flex flex-col items-center justify-center text-center p-2">
              {isCommitted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-[#5B6D55]"
                >
                  <Check size={32} className="stroke-[3]" />
                </motion.div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-0.5">🕊️</span>
                  <span className="font-serif text-[11px] text-[#4A2B33] font-medium">
                    Commit
                  </span>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-[#C99A86] font-medium mt-4 animate-pulse">
            {isCommitted
              ? 'Sacred commitment accepted ✨'
              : isHolding
              ? 'Holding to commit...'
              : 'Tap and hold on the emblem to commit.'}
          </p>
        </div>
      </div>

      {/* Skip fallback */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onContinue}
          className="text-xs text-[#7A5862] hover:text-[#4A2B33] py-2 px-4 transition-colors"
        >
          Skip to next step
        </button>
      </div>
    </div>
  );
};
