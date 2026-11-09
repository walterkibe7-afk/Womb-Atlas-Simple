import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, Check, ShieldCheck, Heart } from 'lucide-react';

interface PlanPricingScreenProps {
  onSelectPlan: (plan: 'yearly' | 'monthly' | 'trial') => void;
  onClose?: () => void;
  onSkipAll?: () => void;
}

export const PlanPricingScreen: React.FC<PlanPricingScreenProps> = ({
  onSelectPlan,
  onClose,
  onSkipAll,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');
  const [trialEnabled, setTrialEnabled] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);

  const handleCloseAttempt = () => { setShowExitIntent(true); };

  const handleConfirm = () => { onSelectPlan(trialEnabled ? 'trial' : selectedPlan); };

  return (
    <div className="relative flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-5 pt-3 pb-6 overflow-y-auto">
      <div className="flex items-center justify-between pb-2">
        <span className="font-serif text-lg tracking-tight text-[#4A2B33] font-medium">Womb Atlas</span>
        <button type="button" onClick={onSkipAll} className="text-xs text-[#7A5862] hover:text-[#4A2B33] min-h-[44px] px-2 flex items-center">Skip all</button>
      </div>

      <div className="flex-1 flex flex-col justify-between pt-1">
        <div className="space-y-4 text-center">
          <div><h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#4A2B33] leading-snug">Choose your plan</h1><p className="text-xs text-[#7A5862] mt-1">Unlock personalized predictions, fertile windows, and gentle cycle audios.</p></div>
          <div className="space-y-2 max-w-xs mx-auto"><div className="flex items-center justify-center gap-1 text-[#E5A84D]">{[0,1,2,3,4].map((i) => <Star key={i} size={18} fill="#E5A84D" className="stroke-none" />)}</div><p className="font-serif italic text-xs text-[#4A2B33] leading-relaxed">&ldquo;Really accurate!! This app is amazing, it&apos;s so easy to use and calming. I&apos;ve tried other trackers but this one feels like a caring sanctuary!! 💕&rdquo;</p><span className="text-[10px] text-[#7A5862] block">— shelby_the_one_and_only</span></div>
          <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[22px] px-4 py-3 flex items-center justify-between shadow-2xs"><span className="text-xs font-medium text-[#4A2B33]">Not sure yet? Enable free trial.</span><button type="button" role="switch" aria-checked={trialEnabled} onClick={() => setTrialEnabled((v) => !v)} className={`w-12 h-7 rounded-full p-1 transition-colors shrink-0 ${trialEnabled ? 'bg-[#A8B5A2]' : 'bg-[#D8CCC1]'}`}><motion.div animate={{ x: trialEnabled ? 20 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="w-5 h-5 rounded-full bg-white shadow-xs" /></button></div>
          <div className="space-y-3 pt-1">
            <div onClick={() => setSelectedPlan('yearly')} className={`relative rounded-[22px] p-4 border transition-all cursor-pointer text-left overflow-hidden ${selectedPlan === 'yearly' ? 'bg-[#FAF6F0] border-[#C99A86] ring-2 ring-[#C99A86] shadow-xs' : 'bg-[#FAF6F0]/70 border-[#EADBCE]'}`}><div className="absolute top-0 right-0 bg-[#C99A86] text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-xl uppercase tracking-wider">SAVE 82%</div><div className="flex items-center justify-between pr-14"><div><span className="font-serif text-base font-bold text-[#4A2B33] block">Yearly Plan</span><span className="text-xs text-[#7A5862]">12 mo · KES 1,933.49</span></div><div className="text-right"><span className="font-serif text-sm font-semibold text-[#4A2B33] block">KES 161.12 / mo</span>{selectedPlan === 'yearly' && <span className="text-[10px] text-[#5B6D55] font-medium flex items-center gap-0.5 justify-end"><Check size={11} /> Selected</span>}</div></div></div>
            <div onClick={() => setSelectedPlan('monthly')} className={`rounded-[22px] p-4 border transition-all cursor-pointer text-left flex items-center justify-between ${selectedPlan === 'monthly' ? 'bg-[#FAF6F0] border-[#C99A86] ring-2 ring-[#C99A86] shadow-xs' : 'bg-[#FAF6F0]/70 border-[#EADBCE]'}`}><div><span className="font-serif text-base font-medium text-[#4A2B33] block">Monthly</span><span className="text-xs text-[#7A5862]">Flexible month-to-month</span></div><span className="font-serif text-sm font-medium text-[#4A2B33]">KES 900 / mo</span></div>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <button type="button" onClick={handleConfirm} className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"><span>Complete setup</span><span aria-hidden="true">→</span></button>
          <p className="text-[11px] text-center text-[#7A5862]">Free trial can be cancelled anytime with zero penalty.</p>
          <div className="text-center"><button type="button" onClick={onSkipAll} className="text-xs text-[#7A5862] hover:text-[#4A2B33] py-2 px-4 transition-colors">Skip all</button></div>
        </div>
      </div>

      <AnimatePresence>
        {showExitIntent && (
          <div className="absolute inset-0 bg-[#3B282E]/50 backdrop-blur-[2px] z-50 flex items-end justify-center p-3">
            <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }} className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-[32px] p-6 shadow-2xl text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F3E7DC] text-2xl mx-auto flex items-center justify-center shadow-xs">🧸</div>
              <div><h3 className="font-serif text-2xl font-normal text-[#4A2B33]">Before you go...</h3><p className="text-xs text-[#7A5862] font-sans mt-1">Here&apos;s your chance to enjoy 14 days of Womb Atlas completely free!</p></div>
              <div className="space-y-2 pt-2"><button type="button" onClick={() => { setShowExitIntent(false); onSelectPlan('trial'); }} className="w-full min-h-[48px] py-3 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-xs font-semibold hover:bg-[#3B2229] transition-colors shadow-xs">Start your 14-day free trial</button><button type="button" onClick={() => { setShowExitIntent(false); if (onClose) onClose(); }} className="w-full py-2.5 text-xs text-[#7A5862] hover:text-[#4A2B33] transition-colors">I don&apos;t want it · Continue to sanctuary</button></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};