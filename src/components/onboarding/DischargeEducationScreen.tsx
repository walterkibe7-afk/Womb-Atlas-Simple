import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Sparkles, Droplets } from 'lucide-react';

interface DischargeEducationScreenProps {
  onContinue: (knowsDischarge: 'yes' | 'no') => void;
  onBack?: () => void;
}

export const DischargeEducationScreen: React.FC<DischargeEducationScreenProps> = ({
  onContinue,
  onBack,
}) => {
  const [selected, setSelected] = useState<'yes' | 'no'>('no');
  const [showDiagram, setShowDiagram] = useState<boolean>(false);

  return (
    <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-5 pt-3 pb-6 overflow-y-auto">
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

      <div className="flex-1 flex flex-col justify-between pt-1">
        <div className="space-y-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#4A2B33] leading-snug">
              Did you know your discharge changes throughout your cycle?
            </h1>
            <p className="text-xs sm:text-sm text-[#7A5862] font-sans mt-2">
              Cervical fluid is one of your body&apos;s clearest fertility and hormonal compasses.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {/* Option: Yes */}
            <button
              type="button"
              onClick={() => {
                setSelected('yes');
                setShowDiagram(true);
              }}
              className={`w-full min-h-[52px] p-4 rounded-[20px] transition-all border flex items-center justify-between text-left ${
                selected === 'yes'
                  ? 'bg-[#FAF6F0] border-[#C99A86] ring-1 ring-[#C99A86] shadow-xs'
                  : 'bg-[#FAF6F0]/70 border-[#EADBCE] hover:bg-[#FAF6F0]'
              }`}
            >
              <span className="text-sm font-medium text-[#4A2B33]">Yes</span>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                  selected === 'yes'
                    ? 'border-[#C99A86] bg-[#C99A86] text-white'
                    : 'border-[#D8CCC1] bg-white'
                }`}
              >
                {selected === 'yes' && <Check size={12} className="stroke-[3]" />}
              </div>
            </button>

            {/* Option: No */}
            <div
              onClick={() => {
                setSelected('no');
                setShowDiagram(true);
              }}
              className={`w-full rounded-[22px] transition-all border cursor-pointer overflow-hidden ${
                selected === 'no'
                  ? 'bg-[#FAF6F0] border-[#C99A86] ring-1 ring-[#C99A86] shadow-xs'
                  : 'bg-[#FAF6F0]/70 border-[#EADBCE] hover:bg-[#FAF6F0]'
              }`}
            >
              <div className="p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-[#4A2B33]">No</span>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    selected === 'no'
                      ? 'border-[#C99A86] bg-[#C99A86] text-white'
                      : 'border-[#D8CCC1] bg-white'
                  }`}
                >
                  {selected === 'no' && <Check size={12} className="stroke-[3]" />}
                </div>
              </div>

              {selected === 'no' && (
                <div className="px-4 pb-4 pt-1 border-t border-[#EADBCE]/60">
                  <div className="bg-[#F4ECE3] rounded-xl p-3 text-xs text-[#7A5862] leading-relaxed flex items-start gap-2">
                    <Droplets size={16} className="text-[#C99A86] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#4A2B33] font-medium block mb-0.5">It&apos;s totally normal.</strong>
                      Discharge changes naturally: from dry after bleeding, to creamy in the follicular phase, to stretchy egg-white around ovulation.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Flo Screenshot 18: "Decode your discharge" Circular Graphic Preview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[24px] p-4 shadow-xs text-center space-y-2 mt-2"
          >
            <div className="flex items-center justify-center gap-2 text-xs font-serif text-[#C99A86] font-medium">
              <Sparkles size={13} />
              <span>Decode your discharge</span>
            </div>

            {/* Circular Cycle Stage Diagram */}
            <div className="relative w-44 h-44 mx-auto my-2 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#EADBCE" strokeWidth="8" />
                {/* Period bleed segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#4A2B33"
                  strokeWidth="8"
                  strokeDasharray="25 226"
                  strokeDashoffset="0"
                />
                {/* Creamy / Sticky */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#E8DFD5"
                  strokeWidth="8"
                  strokeDasharray="40 211"
                  strokeDashoffset="-25"
                />
                {/* Fertile / Egg white */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#A8B5A2"
                  strokeWidth="8"
                  strokeDasharray="30 221"
                  strokeDashoffset="-65"
                />
                {/* Luteal / Thick */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#C99A86"
                  strokeWidth="8"
                  strokeDasharray="60 191"
                  strokeDashoffset="-95"
                />
              </svg>

              <div className="absolute text-center px-2">
                <span className="text-[10px] uppercase tracking-wider text-[#7A5862] font-semibold block">
                  Cycle Compass
                </span>
                <span className="font-serif text-xs text-[#4A2B33] font-medium block">
                  Cervical Rhythm
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1 text-[10px] text-[#7A5862] pt-1">
              <div className="bg-[#FAF6F0] p-1 rounded-md border border-[#EADBCE]/60">
                <span className="w-2 h-2 rounded-full bg-[#4A2B33] inline-block mb-1"></span>
                <span className="block font-medium text-[#4A2B33]">Period</span>
              </div>
              <div className="bg-[#FAF6F0] p-1 rounded-md border border-[#EADBCE]/60">
                <span className="w-2 h-2 rounded-full bg-[#E8DFD5] inline-block mb-1"></span>
                <span className="block font-medium text-[#4A2B33]">Sticky</span>
              </div>
              <div className="bg-[#FAF6F0] p-1 rounded-md border border-[#EADBCE]/60">
                <span className="w-2 h-2 rounded-full bg-[#A8B5A2] inline-block mb-1"></span>
                <span className="block font-medium text-[#4A2B33]">Egg white</span>
              </div>
              <div className="bg-[#FAF6F0] p-1 rounded-md border border-[#EADBCE]/60">
                <span className="w-2 h-2 rounded-full bg-[#C99A86] inline-block mb-1"></span>
                <span className="block font-medium text-[#4A2B33]">Creamy</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 space-y-2">
          <button
            type="button"
            onClick={() => onContinue(selected)}
            className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>Continue</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
