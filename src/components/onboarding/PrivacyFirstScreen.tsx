import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Check, Lock, Sparkles, FileText, Activity } from 'lucide-react';

interface PrivacyFirstScreenProps {
  onContinue: (agreements: {
    privacyPolicy: boolean;
    healthData: boolean;
    appActivity: boolean;
  }) => void;
  onBack?: () => void;
}

export const PrivacyFirstScreen: React.FC<PrivacyFirstScreenProps> = ({
  onContinue,
  onBack,
}) => {
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedHealth, setAgreedHealth] = useState(false);
  const [agreedActivity, setAgreedActivity] = useState(false);
  const [acceptedAllPressed, setAcceptedAllPressed] = useState(false);

  const allAgreed = agreedPrivacy && agreedHealth && agreedActivity;

  const handleAcceptAll = () => {
    setAgreedPrivacy(true);
    setAgreedHealth(true);
    setAgreedActivity(true);
    setAcceptedAllPressed(true);
  };

  const handleNext = () => {
    if (allAgreed) {
      onContinue({
        privacyPolicy: agreedPrivacy,
        healthData: agreedHealth,
        appActivity: agreedActivity,
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-5 pt-4 pb-6 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg tracking-tight text-[#4A2B33] font-medium">
            Womb Atlas
          </span>
          <span className="text-[11px] text-[#7A5862]">· Privacy First</span>
        </div>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-[#7A5862] hover:text-[#4A2B33] min-h-[44px] px-2 flex items-center"
          >
            ← Back
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between pt-1">
        <div className="space-y-4">
          {/* Main Title & Reassurance */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF3ED] text-[#5B6D55] text-xs font-medium mb-2.5">
              <ShieldCheck size={14} />
              <span>Sanctuary Data Standard</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#4A2B33] leading-snug">
              Your privacy is our sacred promise
            </h1>
            <p className="text-xs sm:text-sm text-[#7A5862] font-sans mt-1.5 leading-relaxed">
              Before entering your sanctuary, please review and accept our foundational privacy commitments. Your cycle notes are never sold or shared.
            </p>
          </motion.div>

          {/* Three Agreement Cards */}
          <div className="space-y-3 pt-1">
            {/* 1. Privacy Policy */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              onClick={() => setAgreedPrivacy((prev) => !prev)}
              className={`p-4 rounded-[20px] border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                agreedPrivacy
                  ? 'bg-[#FAF6F0] border-[#C99A86] ring-1 ring-[#C99A86]/50 shadow-xs'
                  : 'bg-[#FAF6F0]/70 border-[#EADBCE] hover:border-[#D6C7BB]'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  agreedPrivacy
                    ? 'bg-[#4A2B33] text-[#F7F3EC]'
                    : 'border-2 border-[#D6C7BB] bg-white'
                }`}
              >
                {agreedPrivacy && <Check size={14} className="stroke-[2.5]" />}
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#4A2B33] text-sm">
                    Agree to Privacy Policy
                  </span>
                  <span className="text-[11px] text-[#C99A86] underline cursor-pointer">
                    Read terms
                  </span>
                </div>
                <p className="text-[#7A5862] mt-1 leading-relaxed">
                  I accept the Womb Atlas Privacy Policy and Terms of Use. My records are held with strict confidentiality.
                </p>
              </div>
            </motion.div>

            {/* 2. Processing Health Data */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onClick={() => setAgreedHealth((prev) => !prev)}
              className={`p-4 rounded-[20px] border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                agreedHealth
                  ? 'bg-[#FAF6F0] border-[#C99A86] ring-1 ring-[#C99A86]/50 shadow-xs'
                  : 'bg-[#FAF6F0]/70 border-[#EADBCE] hover:border-[#D6C7BB]'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  agreedHealth
                    ? 'bg-[#4A2B33] text-[#F7F3EC]'
                    : 'border-2 border-[#D6C7BB] bg-white'
                }`}
              >
                {agreedHealth && <Check size={14} className="stroke-[2.5]" />}
              </div>
              <div className="flex-1 text-xs">
                <span className="font-medium text-[#4A2B33] text-sm block">
                  Agree to processing of personal health data
                </span>
                <p className="text-[#7A5862] mt-1 leading-relaxed">
                  I consent to the encrypted processing of my menstrual flow, symptoms, and reproductive observations to provide personalized cycle predictions.
                </p>
              </div>
            </motion.div>

            {/* 3. Tracking App Activity */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              onClick={() => setAgreedActivity((prev) => !prev)}
              className={`p-4 rounded-[20px] border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                agreedActivity
                  ? 'bg-[#FAF6F0] border-[#C99A86] ring-1 ring-[#C99A86]/50 shadow-xs'
                  : 'bg-[#FAF6F0]/70 border-[#EADBCE] hover:border-[#D6C7BB]'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  agreedActivity
                    ? 'bg-[#4A2B33] text-[#F7F3EC]'
                    : 'border-2 border-[#D6C7BB] bg-white'
                }`}
              >
                {agreedActivity && <Check size={14} className="stroke-[2.5]" />}
              </div>
              <div className="flex-1 text-xs">
                <span className="font-medium text-[#4A2B33] text-sm block">
                  Agree to Womb Atlas tracking app activity
                </span>
                <p className="text-[#7A5862] mt-1 leading-relaxed">
                  I consent to anonymous diagnostic telemetry solely to improve app stability and cycle calculation accuracy without third-party advertising.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Actions: "Accept them all" (disappears when pressed) + "Next" (only highlighted when all 3 checked) */}
        <div className="pt-5 space-y-3">
          {/* "Accept them all" button - disappears after being pressed */}
          <AnimatePresence>
            {!acceptedAllPressed && !allAgreed && (
              <motion.button
                key="accept-all-btn"
                type="button"
                onClick={handleAcceptAll}
                initial={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full min-h-[46px] py-2.5 px-4 rounded-[18px] bg-[#EEF3ED] border border-[#D7E3D4] text-[#5B6D55] text-xs font-medium hover:bg-[#E3EDE1] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <Check size={15} />
                <span>Accept them all</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Next Button: Only highlighted or clickable after these 3 options have been selected */}
          <button
            type="button"
            disabled={!allAgreed}
            onClick={handleNext}
            className={`w-full min-h-[50px] py-3.5 px-6 rounded-[18px] font-sans text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 ${
              allAgreed
                ? 'bg-[#4A2B33] text-[#F7F3EC] hover:bg-[#3B2229] active:scale-[0.99] cursor-pointer'
                : 'bg-[#EADFD5]/70 text-[#A4948F] border border-[#DFD5CB] cursor-not-allowed opacity-60'
            }`}
          >
            <span>Continue</span>
            <span aria-hidden="true">→</span>
          </button>

          {!allAgreed && (
            <p className="text-[11px] text-center text-[#9E8B83] font-sans">
              Please select all 3 agreements above to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
