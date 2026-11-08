import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Calendar, Sparkles, Check } from 'lucide-react';

interface NotificationOptInScreenProps {
  predictedDate?: string;
  onContinue: (allowed: boolean) => void;
  onBack?: () => void;
}

export const NotificationOptInScreen: React.FC<NotificationOptInScreenProps> = ({
  predictedDate = 'November 30',
  onContinue,
  onBack,
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [allowed, setAllowed] = useState<boolean | null>(null);

  const handlePrompt = () => {
    setShowDialog(true);
  };

  const handleDecision = (decision: boolean) => {
    setAllowed(decision);
    setShowDialog(false);
    setTimeout(() => {
      onContinue(decision);
    }, 400);
  };

  return (
    <div className="relative flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-6 pt-6 pb-8 justify-between select-none overflow-hidden">
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

      <div className="my-auto text-center space-y-6 max-w-sm mx-auto">
        {/* Soft Bell Icon Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-20 h-20 rounded-full bg-[#F2E5DC] text-[#C99A86] mx-auto flex items-center justify-center shadow-xs"
        >
          <Bell size={36} className="stroke-[1.8]" />
        </motion.div>

        {/* Flo Screenshot 11: Simulated Notification Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[22px] p-4 text-left shadow-[0_6px_24px_rgba(74,43,51,0.06)] space-y-1.5"
        >
          <div className="flex items-center justify-between text-[11px] text-[#7A5862]">
            <div className="flex items-center gap-1.5 font-medium text-[#4A2B33]">
              <span className="w-4 h-4 rounded-full bg-[#C99A86] text-white flex items-center justify-center text-[9px]">
                🕊️
              </span>
              <span>WOMB ATLAS</span>
            </div>
            <span>now</span>
          </div>

          <div className="text-xs font-semibold text-[#4A2B33] flex items-center gap-1">
            <span>Your period might start today</span>
            <span>📅</span>
          </div>
          <p className="text-[11px] text-[#7A5862] leading-normal">
            Log your symptoms for gentle midwife tips on how to rest and feel grounded 👉
          </p>
        </motion.div>

        {/* Prediction Statement */}
        <div className="space-y-2 pt-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#4A2B33]">
            Your next period will start around
          </h1>
          <div className="font-serif text-2xl font-bold text-[#C99A86]">
            {predictedDate}
          </div>
          <p className="text-xs text-[#7A5862] max-w-xs mx-auto leading-relaxed pt-1">
            Want a peaceful heads up before your period starts? Tap &lsquo;Allow&rsquo; to receive gentle reminders without panic.
          </p>
        </div>
      </div>

      {/* Continue Action */}
      <div className="pt-4 space-y-2">
        <button
          type="button"
          onClick={handlePrompt}
          className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <span>Continue</span>
          <span aria-hidden="true">→</span>
        </button>
        <div className="text-center">
          <button
            type="button"
            onClick={() => onContinue(false)}
            className="text-xs text-[#7A5862] hover:text-[#4A2B33] py-2 px-4 transition-colors"
          >
            Not now
          </button>
        </div>
      </div>

      {/* Flo Screenshot 12: Realistic Interactive Native Permissions Prompt Dialog */}
      <AnimatePresence>
        {showDialog && (
          <div className="absolute inset-0 bg-[#3B282E]/50 backdrop-blur-[2px] z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="w-full max-w-xs bg-[#2E2024] text-[#F7F3EC] rounded-[24px] p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF6F0]/10 flex items-center justify-center text-[#F7F3EC]">
                  <Bell size={20} />
                </div>
                <div className="text-sm font-medium leading-snug">
                  Allow Womb Atlas to send you notifications?
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleDecision(true)}
                  className="w-full py-2.5 rounded-xl bg-[#C99A86] text-white text-xs font-semibold hover:bg-[#B88975] transition-colors"
                >
                  ALLOW
                </button>
                <button
                  type="button"
                  onClick={() => handleDecision(false)}
                  className="w-full py-2 rounded-xl text-xs text-[#DFD3C5] hover:text-white transition-colors"
                >
                  DON&apos;T ALLOW
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
