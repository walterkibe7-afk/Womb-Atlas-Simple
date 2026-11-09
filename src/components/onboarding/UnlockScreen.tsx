import React, { useState } from 'react';
import { motion } from 'motion/react';

interface UnlockScreenProps {
  onPasscodeSet: (passcode?: string) => void;
  onSkip: () => void;
  onSkipAll?: () => void;
}

export const UnlockScreen: React.FC<UnlockScreenProps> = ({
  onPasscodeSet,
  onSkip,
  onSkipAll,
}) => {
  const [pin, setPin] = useState<string>('');

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        setTimeout(() => {
          onPasscodeSet(nextPin);
        }, 250);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-6 pt-10 pb-8 justify-between select-none">
      <div className="flex items-center justify-between pb-2">
        <span className="font-serif text-lg tracking-tight text-[#4A2B33] font-medium">Womb Atlas</span>
        <button type="button" onClick={onSkipAll} className="text-xs text-[#7A5862] hover:text-[#4A2B33] min-h-[44px] px-2 flex items-center">Skip all</button>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center pt-4 flex-1 flex flex-col justify-center">
        <span className="font-serif text-3xl text-[#4A2B33] font-normal tracking-tight block">Womb Atlas</span>
        <p className="text-xs text-[#7A5862] font-sans mt-2 max-w-[260px] mx-auto leading-relaxed">A private space, kept on your device. Yours alone.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[24px] p-6 shadow-[0_4px_20px_rgba(74,43,51,0.03)] text-center my-auto">
        <div className="w-9 h-9 rounded-full bg-[#EEF3ED] text-[#5B6D55] mx-auto flex items-center justify-center text-sm mb-3">🔒</div>
        <h2 className="font-serif text-xl font-normal text-[#4A2B33]">Set a private lock</h2>
        <p className="text-xs text-[#7A5862] font-sans mt-1 mb-5">Four quiet digits to keep your notes safe.</p>
        <div className="flex items-center justify-center gap-3.5 mb-2">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <motion.div key={idx} animate={{ scale: isFilled ? [1, 1.2, 1] : 1, backgroundColor: isFilled ? '#4A2B33' : '#E8DFD5' }} transition={{ duration: 0.15 }} className="w-3.5 h-3.5 rounded-full border border-[#D8CCC1]" />
            );
          })}
        </div>
      </motion.div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-y-2.5 gap-x-5 max-w-[260px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button key={num} type="button" onClick={() => handleDigit(num)} className="min-h-[48px] h-12 rounded-full bg-[#FAF6F0] border border-[#EADBCE] text-base font-sans font-medium text-[#4A2B33] active:bg-[#EADBCE]/70 active:scale-95 transition-all flex items-center justify-center">{num}</button>
          ))}
          <div className="h-12" />
          <button type="button" onClick={() => handleDigit('0')} className="min-h-[48px] h-12 rounded-full bg-[#FAF6F0] border border-[#EADBCE] text-base font-sans font-medium text-[#4A2B33] active:bg-[#EADBCE]/70 active:scale-95 transition-all flex items-center justify-center">0</button>
          <button type="button" onClick={handleDelete} aria-label="Delete last digit" className="min-h-[48px] h-12 rounded-full text-xs font-sans text-[#7A5862] active:text-[#4A2B33] transition-colors flex items-center justify-center">Delete</button>
        </div>

        <div className="text-center pt-2 space-y-2">
          <button type="button" onClick={onSkip} className="text-xs text-[#7A5862] hover:text-[#4A2B33] transition-colors py-2 px-4 rounded-full">Skip for now</button>
          <button type="button" onClick={onSkipAll} className="text-xs text-[#7A5862] hover:text-[#4A2B33] transition-colors py-2 px-4 rounded-full">Skip all</button>
        </div>
      </div>
    </div>
  );
};