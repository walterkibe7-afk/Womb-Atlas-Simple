import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Shield, ChevronRight } from 'lucide-react';

interface SocialProofIntroScreenProps {
  onContinue: () => void;
  onSkipAll?: () => void;
}

export const SocialProofIntroScreen: React.FC<SocialProofIntroScreenProps> = ({
  onContinue,
  onSkipAll,
}) => {
  return (
    <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-5 pt-3 pb-6 overflow-y-auto">
      <div className="flex items-center justify-between pb-2">
        <span className="font-serif text-lg tracking-tight text-[#4A2B33] font-medium">Womb Atlas</span>
        <button type="button" onClick={onSkipAll} className="text-xs text-[#7A5862] hover:text-[#4A2B33] min-h-[44px] px-2 flex items-center">Skip all</button>
      </div>

      <div className="flex-1 flex flex-col justify-between pt-1">
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#EADBCE] text-xs text-[#C99A86] font-medium"><Sparkles size={13} /><span>You&apos;re in the right place</span></span>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#4A2B33] leading-snug mt-3">Guiding over <span className="text-[#C99A86] font-medium">2.2 million</span> cycles with tenderness</h1>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[24px] p-5 shadow-[0_4px_20px_rgba(74,43,51,0.04)] relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-[#EADBCE]/60 pb-3">
              <div className="flex items-center gap-2.5"><div className="w-10 h-10 rounded-full bg-[#F0E6DD] flex items-center justify-center font-serif text-base text-[#4A2B33] font-medium">PA</div><div><div className="text-xs font-medium text-[#4A2B33]">Pendo A.</div><div className="text-[10px] text-[#7A5862]">@pendo_nurture</div></div></div>
              <span className="text-[11px] text-[#C99A86] bg-[#FAF6F0] border border-[#EADBCE] px-2.5 py-0.5 rounded-full">Verified member</span>
            </div>
            <div className="space-y-1.5 text-xs text-[#4A2B33] leading-relaxed font-sans">
              <p className="italic text-[#7A5862]">&ldquo;Why am I feeling so quiet and craving dark chocolate today?&rdquo;</p>
              <p className="font-medium text-[#4A2B33]">*opens Womb Atlas*</p>
              <p className="text-xs text-[#A8B5A2] font-semibold">&ldquo;Day 24 · Luteal Phase. Your body is naturally asking for slower rhythms and warming teas.&rdquo;</p>
              <p className="text-xs text-[#7A5862] pt-1">Oh. Instant peace of mind.</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#FAF6F0]/80 border border-[#EADBCE] rounded-[22px] p-4 space-y-3">
            <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-[#EEF3ED] text-[#5B6D55] flex items-center justify-center text-xs">🌿</div><h2 className="font-serif text-sm font-medium text-[#4A2B33]">So much more than calendar dots</h2></div>
            <p className="text-xs text-[#7A5862] leading-relaxed">We guide you through your entire hormonal journey — from ovulation signals and sleep shifts to soothing backache remedies and intimate vitality.</p>
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-xl p-2"><span className="block text-sm font-serif text-[#C99A86] font-medium">94%</span><span className="text-[10px] text-[#7A5862]">Felt calmer</span></div>
              <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-xl p-2"><span className="block text-sm font-serif text-[#5B6D55] font-medium">3 days</span><span className="text-[10px] text-[#7A5862]">Prior notice</span></div>
              <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-xl p-2"><span className="block text-sm font-serif text-[#4A2B33] font-medium">100%</span><span className="text-[10px] text-[#7A5862]">Private data</span></div>
            </div>
          </motion.div>
        </div>

        <div className="pt-4 space-y-2">
          <button type="button" onClick={onContinue} className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"><span>Continue</span><span aria-hidden="true">→</span></button>
          <div className="text-center"><button type="button" onClick={onSkipAll} className="text-xs text-[#7A5862] hover:text-[#4A2B33] py-2 px-4 transition-colors">Skip all</button></div>
        </div>
      </div>
    </div>
  );
};