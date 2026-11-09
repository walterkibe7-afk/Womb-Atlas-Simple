import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface HealthConditionsScreenProps {
  initialValues?: string[];
  onContinue: (conditions: string[]) => void;
  onSkipAll?: () => void;
}

const CONDITIONS = [
  { id: 'yeast', label: 'Yeast infections' },
  { id: 'uti', label: 'Urinary tract infections (UTIs)' },
  { id: 'bv', label: 'Bacterial Vaginosis (BV)' },
  { id: 'pcos', label: 'Polycystic ovary syndrome (PCOS)' },
  { id: 'endo', label: 'Endometriosis' },
  { id: 'fibroids', label: 'Fibroids' },
  { id: 'not-sure', label: "I'm not sure" },
  { id: 'none', label: 'No, none of the above' },
];

export const HealthConditionsScreen: React.FC<HealthConditionsScreenProps> = ({
  initialValues = ['none'],
  onContinue,
  onSkipAll,
}) => {
  const [selected, setSelected] = useState<string[]>(initialValues);

  const toggleCondition = (id: string) => {
    if (id === 'none' || id === 'not-sure') {
      setSelected([id]);
      return;
    }
    setSelected((prev) => {
      const filtered = prev.filter((item) => item !== 'none' && item !== 'not-sure');
      if (filtered.includes(id)) {
        const next = filtered.filter((item) => item !== id);
        return next.length === 0 ? ['none'] : next;
      } else {
        return [...filtered, id];
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-5 pt-3 pb-6 overflow-y-auto">
      <div className="flex items-center justify-between pb-2">
        <span className="font-serif text-lg tracking-tight text-[#4A2B33] font-medium">Womb Atlas</span>
        <button type="button" onClick={onSkipAll} className="text-xs text-[#7A5862] hover:text-[#4A2B33] min-h-[44px] px-2 flex items-center">Skip all</button>
      </div>

      <div className="flex-1 flex flex-col justify-between pt-1">
        <div className="space-y-4">
          <div><h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#4A2B33] leading-snug">Do you experience any of these health conditions?</h1><p className="text-xs sm:text-sm text-[#7A5862] font-sans mt-2">Choose all that apply.</p></div>
          <div className="space-y-2 pt-1 max-h-[380px] overflow-y-auto pr-1">
            {CONDITIONS.map((c) => {
              const isChecked = selected.includes(c.id);
              return (
                <button key={c.id} type="button" onClick={() => toggleCondition(c.id)} className={`w-full min-h-[50px] p-3.5 rounded-[18px] transition-all border flex items-center justify-between text-left ${isChecked ? 'bg-[#FAF6F0] border-[#C99A86] ring-1 ring-[#C99A86] shadow-xs' : 'bg-[#FAF6F0]/70 border-[#EADBCE] hover:bg-[#FAF6F0]'}`}>
                  <span className="text-xs sm:text-sm font-medium text-[#4A2B33]">{c.label}</span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${isChecked ? 'border-[#C99A86] bg-[#C99A86] text-white' : 'border-[#D8CCC1] bg-white'}`}>{isChecked && <Check size={12} className="stroke-[3]" />}</div>
                </button>
              );
            })}
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