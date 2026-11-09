import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PeriodFeeling } from '../../types';

interface PeriodFeelingsScreenProps {
  initialFeeling?: PeriodFeeling;
  onContinue: (feeling: PeriodFeeling) => void;
  onSkipAll?: () => void;
}

interface FeelingOption {
  id: PeriodFeeling;
  label: string;
  emoji: string;
  explanation: string;
}

const FEELING_OPTIONS: FeelingOption[] = [
  { id: 'love-hate', label: "It's a love-hate relationship", emoji: '😕', explanation: "We get it — you're relieved when it arrives but can't wait to see it go. We'll gently predict when your period is coming and help you find calm rhythm with your body." },
  { id: 'embarrassed', label: 'Embarrassed', emoji: '🫣', explanation: "It's totally normal to feel a bit uncomfortable talking about periods. Womb Atlas is your quiet, private sanctuary where every observation is confidential and free of judgment." },
  { id: 'hate', label: 'Hate it', emoji: '😡', explanation: "We hear you. The cramps, fatigue, and disruption can feel exhausting. We'll help you spot your body's signals early so you can rest and care for yourself before symptoms peak." },
  { id: 'understand-better', label: 'I want to understand it better', emoji: '🤔', explanation: 'Curiosity is empowering. Tracking subtle shifts in flow and mood reveals the wisdom behind your energy and sleep patterns across every phase of your cycle.' },
  { id: 'friends', label: "We've become friends", emoji: '😌', explanation: "Wonderful. Living in harmony with your biological cadence brings deep peace and grounding. We're here to listen alongside your body with quiet respect." },
];

export const PeriodFeelingsScreen: React.FC<PeriodFeelingsScreenProps> = ({
  initialFeeling = 'love-hate',
  onContinue,
  onSkipAll,
}) => {
  const [selectedFeeling, setSelectedFeeling] = useState<PeriodFeeling>(initialFeeling);

  return (
    <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-5 pt-4 pb-6 overflow-y-auto">
      <div className="flex items-center justify-between pb-3">
        <span className="font-serif text-lg tracking-tight text-[#4A2B33] font-medium">Womb Atlas</span>
        <button type="button" onClick={onSkipAll} className="text-xs text-[#7A5862] hover:text-[#4A2B33] min-h-[44px] px-2 flex items-center">Skip all</button>
      </div>

      <div className="flex-1 flex flex-col justify-between pt-1">
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#4A2B33] leading-snug">How do you feel about your period?</h1>
            <p className="text-xs sm:text-sm text-[#7A5862] font-sans mt-1.5">Every feeling is valid here. Tap what feels closest to you right now.</p>
          </motion.div>

          <div className="space-y-2.5 pt-1">
            {FEELING_OPTIONS.map((option) => {
              const isSelected = selectedFeeling === option.id;
              return (
                <motion.div key={option.id} layout onClick={() => setSelectedFeeling(option.id)} className={`rounded-[20px] transition-all cursor-pointer overflow-hidden border ${isSelected ? 'bg-[#4A2B33] text-[#F7F3EC] border-[#3B2229] shadow-sm' : 'bg-[#FAF6F0] text-[#4A2B33] border-[#EADBCE] hover:border-[#D6C7BB]'}`}>
                  <div className="p-4 flex items-center justify-between"><span className="font-medium text-xs sm:text-sm">{option.label}</span><span className="text-lg shrink-0 ml-2">{option.emoji}</span></div>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="px-4 pb-4 pt-1">
                        <div className="p-3.5 rounded-[14px] bg-[#3B2229] text-[#EDE4DA] text-xs leading-relaxed border border-[#5A3841]"><p>{option.explanation}</p></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="pt-5 space-y-2.5">
          <button type="button" onClick={() => onContinue(selectedFeeling)} className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"><span>Continue</span><span aria-hidden="true">→</span></button>
          <div className="text-center"><button type="button" onClick={onSkipAll} className="text-xs text-[#7A5862] hover:text-[#4A2B33] py-2 px-4 transition-colors">Skip all</button></div>
        </div>
      </div>
    </div>
  );
};