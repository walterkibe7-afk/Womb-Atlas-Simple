import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Check } from 'lucide-react';

interface SecurityCertScreenProps {
  onContinue: () => void;
  onSkipAll?: () => void;
}

export const SecurityCertScreen: React.FC<SecurityCertScreenProps> = ({
  onContinue,
  onSkipAll,
}) => {
  const [percent, setPercent] = useState(12);

  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 6;
      });
    }, 120);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-6 pt-6 pb-8 justify-between select-none">
      <div className="flex items-center justify-between pb-2">
        <span className="font-serif text-lg tracking-tight text-[#4A2B33] font-medium">Womb Atlas</span>
        <button type="button" onClick={onSkipAll} className="text-xs text-[#7A5862] hover:text-[#4A2B33] min-h-[44px] px-2 flex items-center">Skip all</button>
      </div>

      <div className="my-auto text-center space-y-6 max-w-sm mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
          <div className="relative w-44 h-48 flex items-center justify-center">
            <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-md">
              <path d="M100 10 L180 50 L180 130 C180 180 100 210 100 210 C100 210 20 180 20 130 L20 50 Z" fill="#FAF6F0" stroke="#C99A86" strokeWidth="4" />
              <path d="M100 25 L165 58 L165 125 C165 168 100 195 100 195 C100 195 35 168 35 125 L35 58 Z" fill="#F3E9E2" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-2"><span className="font-serif italic text-lg text-[#C99A86] font-medium">Womb Atlas</span><div className="bg-[#C99A86] text-white font-sans text-[11px] font-bold px-3 py-1 rounded-sm mt-1 uppercase tracking-wider shadow-2xs">ISO 27001</div><span className="text-[10px] text-[#7A5862] font-semibold mt-1 uppercase tracking-widest">Certified Safe</span></div>
          </div>
          <h1 className="font-serif text-3xl font-normal text-[#4A2B33] mt-5">Know your data is safe</h1>
          <p className="text-xs text-[#7A5862] max-w-xs mt-1.5 leading-relaxed">Your reproductive cycle entries are safeguarded by state-of-the-art encryption. We never sell your health information to advertisers.</p>
        </motion.div>

        <div className="flex flex-col items-center justify-center pt-2">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#EADBCE" strokeWidth="6" /><circle cx="50" cy="50" r="40" fill="none" stroke="#C99A86" strokeWidth="7" strokeLinecap="round" strokeDasharray="251" strokeDashoffset={251 - (251 * percent) / 100} className="transition-all duration-150" /></svg>
            <span className="absolute font-serif text-xl font-bold text-[#4A2B33]">{percent}%</span>
          </div>
          <span className="text-xs text-[#7A5862] font-medium mt-2">{percent >= 100 ? 'Personalization complete ✨' : 'Personalizing your experience...'}</span>
        </div>
      </div>

      <div className="pt-4 space-y-2">
        <button type="button" onClick={onContinue} className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"><span>Continue</span><span aria-hidden="true">→</span></button>
        <div className="text-center"><button type="button" onClick={onSkipAll} className="text-xs text-[#7A5862] hover:text-[#4A2B33] py-2 px-4 transition-colors">Skip all</button></div>
      </div>
    </div>
  );
};