import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Shield } from 'lucide-react';

interface BirthControlScreenProps {
  initialValue?: string;
  onContinue: (method: string) => void;
  onBack?: () => void;
}

const METHODS = [
  { id: 'nothing', label: 'Nothing', desc: 'Natural cycle observations' },
  { id: 'pill-patch-ring', label: 'Pill, patch or ring', desc: 'Combined hormonal contraception' },
  { id: 'pop', label: 'Progestin-only pill (POPs or Mini pills)', desc: 'Progestin only' },
  { id: 'implant-injection', label: 'Implant or injection', desc: 'Longer-acting hormonal support' },
  { id: 'hormonal-iud', label: 'Hormonal IUD', desc: 'Mirena, Kyleena, Jaydess, etc.' },
  { id: 'copper-iud', label: 'Copper IUD (Non-hormonal)', desc: 'Maintains natural hormonal rhythm' },
  { id: 'condoms', label: 'Condoms (male or female)', desc: 'Barrier method' },
  { id: 'pull-out', label: 'Pull out method', desc: 'Withdrawal' },
];

export const BirthControlScreen: React.FC<BirthControlScreenProps> = ({
  initialValue = 'nothing',
  onContinue,
  onBack,
}) => {
  const [selected, setSelected] = useState<string>(initialValue);

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
              What birth control do you use, if any?
            </h1>
            <p className="text-xs sm:text-sm text-[#7A5862] font-sans mt-2 leading-relaxed">
              We&apos;re asking because some types of birth control can impact ovulation signals and period bleed patterns.
            </p>
          </div>

          <div className="space-y-2 pt-1 max-h-[380px] overflow-y-auto pr-1">
            {METHODS.map((m) => {
              const isSelected = selected === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelected(m.id)}
                  className={`w-full min-h-[50px] p-3.5 rounded-[18px] transition-all border flex items-center justify-between text-left ${
                    isSelected
                      ? 'bg-[#FAF6F0] border-[#C99A86] ring-1 ring-[#C99A86] shadow-xs'
                      : 'bg-[#FAF6F0]/70 border-[#EADBCE] hover:bg-[#FAF6F0]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs sm:text-sm font-medium text-[#4A2B33] block">
                      {m.label}
                    </span>
                    <span className="text-[10px] text-[#7A5862] block">
                      {m.desc}
                    </span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-[#C99A86] bg-[#C99A86] text-white'
                        : 'border-[#D8CCC1] bg-white'
                    }`}
                  >
                    {isSelected && <Check size={12} className="stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
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
          <div className="text-center">
            <button
              type="button"
              onClick={() => onContinue('nothing')}
              className="text-xs text-[#7A5862] hover:text-[#4A2B33] py-2 px-4 transition-colors"
            >
              Skip this question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
