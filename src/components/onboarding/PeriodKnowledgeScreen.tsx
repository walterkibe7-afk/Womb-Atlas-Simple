import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, BookOpen } from 'lucide-react';

interface PeriodKnowledgeScreenProps {
  initialValue?: 'expert' | 'learning' | 'little' | 'whats-a-period';
  onContinue: (knowledge: 'expert' | 'learning' | 'little' | 'whats-a-period') => void;
  onBack?: () => void;
}

const OPTIONS = [
  {
    id: 'expert' as const,
    label: "I'm an expert, period!",
    subtext: 'You know your follicular from your luteal phase inside out.',
  },
  {
    id: 'learning' as const,
    label: "It's OK, but I still have a little to learn",
    subtext: "You know the basics but want deeper insights into hormone shifts.",
  },
  {
    id: 'little' as const,
    label: "I don't know much about them",
    subtext: 'You want clear, non-judgmental guidance you can trust.',
  },
  {
    id: 'whats-a-period' as const,
    label: "What's a period?",
    subtext: "Starting from square one — we'll walk with you step by step.",
  },
];

export const PeriodKnowledgeScreen: React.FC<PeriodKnowledgeScreenProps> = ({
  initialValue = 'learning',
  onContinue,
  onBack,
}) => {
  const [selected, setSelected] = useState(initialValue);

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
              How would you rate your knowledge about periods?
            </h1>
            <p className="text-xs sm:text-sm text-[#7A5862] font-sans mt-1.5">
              This helps us tune the depth of our educational notes and cycle observations.
            </p>
          </div>

          <div className="space-y-2.5 pt-1">
            {OPTIONS.map((opt) => {
              const isSelected = selected === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelected(opt.id)}
                  className={`w-full min-h-[56px] text-left p-4 rounded-[20px] transition-all border flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#FAF6F0] border-[#C99A86] ring-1 ring-[#C99A86] shadow-xs'
                      : 'bg-[#FAF6F0]/70 border-[#EADBCE] hover:bg-[#FAF6F0]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-sm font-medium text-[#4A2B33] block">
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-[#7A5862] block">
                      {opt.subtext}
                    </span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
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
              onClick={() => onContinue('learning')}
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
