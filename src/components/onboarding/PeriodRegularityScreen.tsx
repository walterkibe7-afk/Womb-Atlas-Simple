import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Info } from 'lucide-react';

interface PeriodRegularityScreenProps {
  initialValue?: 'yes' | 'no' | 'not-sure';
  onContinue: (regularity: 'yes' | 'no' | 'not-sure') => void;
  onSkipAll?: () => void;
}

export const PeriodRegularityScreen: React.FC<PeriodRegularityScreenProps> = ({
  initialValue = 'yes',
  onContinue,
  onSkipAll,
}) => {
  const [selected, setSelected] = useState<'yes' | 'no' | 'not-sure'>(initialValue);

  return (
    <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-5 pt-3 pb-6 overflow-y-auto">
      <div className="flex items-center justify-between pb-2">
        <span className="font-serif text-lg tracking-tight text-[#4A2B33] font-medium">Womb Atlas</span>
        <button type="button" onClick={onSkipAll} className="text-xs text-[#7A5862] hover:text-[#4A2B33] min-h-[44px] px-2 flex items-center">Skip all</button>
      </div>

      <div className="flex-1 flex flex-col justify-between pt-1">
        <div className="space-y-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#4A2B33] leading-snug">Are your periods regular?</h1>
            <p className="text-xs sm:text-sm text-[#7A5862] font-sans mt-2 leading-relaxed">This would mean the gap between your periods is around the same number of days each month.</p>
          </div>

          <div className="space-y-3 pt-1">
            <button type="button" onClick={() => setSelected('yes')} className={`w-full min-h-[54px] p-4 rounded-[20px] transition-all border flex items-center justify-between text-left ${selected === 'yes' ? 'bg-[#FAF6F0] border-[#C99A86] ring-1 ring-[#C99A86] shadow-xs' : 'bg-[#FAF6F0]/70 border-[#EADBCE] hover:bg-[#FAF6F0]'}`}><span className="text-sm font-medium text-[#4A2B33]">Yes</span><div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${selected === 'yes' ? 'border-[#C99A86] bg-[#C99A86] text-white' : 'border-[#D8CCC1] bg-white'}`}>{selected === 'yes' && <Check size={12} className="stroke-[3]" />}</div></button>

            <div onClick={() => setSelected('no')} className={`w-full rounded-[22px] transition-all border cursor-pointer overflow-hidden ${selected === 'no' ? 'bg-[#FAF6F0] border-[#C99A86] ring-1 ring-[#C99A86] shadow-xs' : 'bg-[#FAF6F0]/70 border-[#EADBCE] hover:bg-[#FAF6F0]'}`}>
              <div className="p-4 flex items-center justify-between"><span className="text-sm font-medium text-[#4A2B33]">No</span><div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${selected === 'no' ? 'border-[#C99A86] bg-[#C99A86] text-white' : 'border-[#D8CCC1] bg-white'}`}>{selected === 'no' && <Check size={12} className="stroke-[3]" />}</div></div>
              <AnimatePresence>
                {selected === 'no' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-4 pb-4 pt-1 border-t border-[#EADBCE]/60">
                    <div className="bg-[#F4ECE3] rounded-xl p-3 text-xs text-[#7A5862] leading-relaxed flex items-start gap-2"><span className="text-sm">🌸</span><span><strong className="text-[#4A2B33] font-medium block mb-0.5">That&apos;s completely okay.</strong>Even if your periods aren&apos;t regular, we can let you know which subtle body signals to watch out for so you can live in harmony with your cycle.</span></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button type="button" onClick={() => setSelected('not-sure')} className={`w-full min-h-[54px] p-4 rounded-[20px] transition-all border flex items-center justify-between text-left ${selected === 'not-sure' ? 'bg-[#FAF6F0] border-[#C99A86] ring-1 ring-[#C99A86] shadow-xs' : 'bg-[#FAF6F0]/70 border-[#EADBCE] hover:bg-[#FAF6F0]'}`}><span className="text-sm font-medium text-[#4A2B33]">I don&apos;t know</span><div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${selected === 'not-sure' ? 'border-[#C99A86] bg-[#C99A86] text-white' : 'border-[#D8CCC1] bg-white'}`}>{selected === 'not-sure' && <Check size={12} className="stroke-[3]" />}</div></button>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <button type="button" onClick={() => onContinue(selected)} className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"><span>Continue</span><span aria-hidden="true">→</span></button>
          <div className="text-center"><button type="button" onClick={onSkipAll} className="text-xs text-[#7A5862] hover:text-[#4A2B33] py-2 px-4 transition-colors">Skip all</button></div>
        </div>
      </div>
    </div>
  );
};