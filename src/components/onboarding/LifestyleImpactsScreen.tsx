import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Moon,
  Sparkles,
  Zap,
  Apple,
  Brain,
  Activity,
  Check,
  Calendar,
  Smile,
  Shield,
} from 'lucide-react';

interface LifestyleImpactsScreenProps {
  onComplete: (data: {
    todaySymptoms?: string[];
    cycleSymptoms?: string[];
    impactsSleep?: 'yes' | 'no' | 'not-sure';
    mentalHealthImpacts?: string[];
    impactsEnergy?: 'yes' | 'no' | 'not-sure';
    impactsDiet?: 'yes' | 'no' | 'not-sure';
  }) => void;
  onBack?: () => void;
}

type SubStep =
  | 'today-symptoms'
  | 'cycle-symptoms'
  | 'sleep'
  | 'mental-health'
  | 'energy'
  | 'diet'
  | 'ready-forecast';

export const LifestyleImpactsScreen: React.FC<LifestyleImpactsScreenProps> = ({
  onComplete,
  onBack,
}) => {
  const [subStep, setSubStep] = useState<SubStep>('today-symptoms');

  // Answers
  const [todaySymptoms, setTodaySymptoms] = useState<string[]>([]);
  const [cycleSymptoms, setCycleSymptoms] = useState<string[]>(['cramps', 'fatigue']);
  const [impactsSleep, setImpactsSleep] = useState<'yes' | 'no' | 'not-sure'>('yes');
  const [mentalHealthImpacts, setMentalHealthImpacts] = useState<string[]>(['mood-swings']);
  const [impactsEnergy, setImpactsEnergy] = useState<'yes' | 'no' | 'not-sure'>('yes');
  const [impactsDiet, setImpactsDiet] = useState<'yes' | 'no' | 'not-sure'>('yes');

  const handleNextStep = () => {
    switch (subStep) {
      case 'today-symptoms':
        setSubStep('cycle-symptoms');
        break;
      case 'cycle-symptoms':
        setSubStep('sleep');
        break;
      case 'sleep':
        setSubStep('mental-health');
        break;
      case 'mental-health':
        setSubStep('energy');
        break;
      case 'energy':
        setSubStep('diet');
        break;
      case 'diet':
        setSubStep('ready-forecast');
        break;
      case 'ready-forecast':
        onComplete({
          todaySymptoms,
          cycleSymptoms,
          impactsSleep,
          mentalHealthImpacts,
          impactsEnergy,
          impactsDiet,
        });
        break;
    }
  };

  const handlePrevStep = () => {
    switch (subStep) {
      case 'today-symptoms':
        if (onBack) onBack();
        break;
      case 'cycle-symptoms':
        setSubStep('today-symptoms');
        break;
      case 'sleep':
        setSubStep('cycle-symptoms');
        break;
      case 'mental-health':
        setSubStep('sleep');
        break;
      case 'energy':
        setSubStep('mental-health');
        break;
      case 'diet':
        setSubStep('energy');
        break;
      case 'ready-forecast':
        setSubStep('diet');
        break;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-5 pt-3 pb-6 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2">
        <span className="font-serif text-lg tracking-tight text-[#4A2B33] font-medium">
          Womb Atlas
        </span>
        <button
          type="button"
          onClick={handlePrevStep}
          className="text-xs text-[#7A5862] hover:text-[#4A2B33] min-h-[44px] px-2 flex items-center"
        >
          ← Previous
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* 1. Today's Symptoms (Screenshot 14) */}
        {subStep === 'today-symptoms' && (
          <motion.div
            key="today-symptoms"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="flex-1 flex flex-col justify-between pt-1"
          >
            <div className="space-y-4">
              <div>
                <span className="text-xs text-[#7A5862] font-sans block mb-1">
                  Your cycle can impact how you feel
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#4A2B33] leading-snug">
                  How do you feel today?
                </h1>
                <p className="text-xs text-[#7A5862] font-sans mt-1">
                  Select your symptoms.
                </p>
              </div>

              {/* Flo Icon Grid (6 chips) */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { id: 'cramps', label: 'Cramps', emoji: '🌸' },
                  { id: 'fatigue', label: 'Fatigue', emoji: '🔋' },
                  { id: 'bloating', label: 'Bloating', emoji: '🎈' },
                  { id: 'tender-breasts', label: 'Tender breasts', emoji: '🍒' },
                  { id: 'backache', label: 'Backache', emoji: '🌿' },
                  { id: 'none', label: 'None of these', emoji: '✨' },
                ].map((item) => {
                  const isSelected = todaySymptoms.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (item.id === 'none') {
                          setTodaySymptoms(['none']);
                        } else {
                          setTodaySymptoms((prev) => {
                            const withoutNone = prev.filter((s) => s !== 'none');
                            return withoutNone.includes(item.id)
                              ? withoutNone.filter((s) => s !== item.id)
                              : [...withoutNone, item.id];
                          });
                        }
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-[20px] transition-all border min-h-[92px] ${
                        isSelected
                          ? 'bg-[#FAF6F0] border-[#C99A86] ring-1 ring-[#C99A86] shadow-xs'
                          : 'bg-[#FAF6F0]/70 border-[#EADBCE] hover:bg-[#FAF6F0]'
                      }`}
                    >
                      <span className="text-2xl mb-1.5">{item.emoji}</span>
                      <span className="text-[11px] font-medium text-[#4A2B33] text-center leading-tight">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>Next</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* 2. Cycle-related symptoms list (Screenshot 17) */}
        {subStep === 'cycle-symptoms' && (
          <motion.div
            key="cycle-symptoms"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="flex-1 flex flex-col justify-between pt-1"
          >
            <div className="space-y-4">
              <div>
                <span className="text-xs text-[#C99A86] font-medium block mb-1">
                  71% of users say the app helps manage symptoms
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#4A2B33] leading-snug">
                  Do you experience any cycle-related symptoms?
                </h1>
                <p className="text-xs text-[#7A5862] font-sans mt-1">
                  Select all that apply.
                </p>
              </div>

              <div className="space-y-2 pt-1 max-h-[350px] overflow-y-auto pr-1">
                {[
                  { id: 'cramps', label: 'Cramps' },
                  { id: 'spotting', label: 'Spotting' },
                  { id: 'bloating', label: 'Bloating' },
                  { id: 'mood-swings', label: 'Mood swings' },
                  { id: 'headaches', label: 'Headaches' },
                  { id: 'fatigue', label: 'Fatigue' },
                  { id: 'tender-breasts', label: 'Tender breasts' },
                ].map((s) => {
                  const isChecked = cycleSymptoms.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() =>
                        setCycleSymptoms((prev) =>
                          prev.includes(s.id) ? prev.filter((i) => i !== s.id) : [...prev, s.id]
                        )
                      }
                      className={`w-full min-h-[48px] p-3.5 rounded-[18px] transition-all border flex items-center justify-between text-left ${
                        isChecked
                          ? 'bg-[#FAF6F0] border-[#C99A86] ring-1 ring-[#C99A86] shadow-xs'
                          : 'bg-[#FAF6F0]/70 border-[#EADBCE] hover:bg-[#FAF6F0]'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-medium text-[#4A2B33]">
                        {s.label}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isChecked
                            ? 'border-[#C99A86] bg-[#C99A86] text-white'
                            : 'border-[#D8CCC1] bg-white'
                        }`}
                      >
                        {isChecked && <Check size={12} className="stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>Next</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* 3. Sleep Impact (Screenshot 15) */}
        {subStep === 'sleep' && (
          <motion.div
            key="sleep"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="flex-1 flex flex-col justify-between pt-1"
          >
            <div className="space-y-4">
              <div>
                <span className="text-xs text-[#5B6D55] font-medium block mb-1">
                  69% of users say Womb Atlas helps them sleep better
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#4A2B33] leading-snug">
                  Does your cycle impact your sleep?
                </h1>
                <p className="text-xs text-[#7A5862] font-sans mt-1">
                  Progesterone peaks after ovulation can alter body temperature and sleep depth.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                {(['yes', 'no', 'not-sure'] as const).map((choice) => {
                  const isSelected = impactsSleep === choice;
                  const label = choice === 'yes' ? 'Yes' : choice === 'no' ? 'No' : "I'm not sure";
                  return (
                    <div
                      key={choice}
                      onClick={() => setImpactsSleep(choice)}
                      className={`w-full rounded-[22px] transition-all border cursor-pointer overflow-hidden ${
                        isSelected
                          ? 'bg-[#FAF6F0] border-[#C99A86] ring-1 ring-[#C99A86] shadow-xs'
                          : 'bg-[#FAF6F0]/70 border-[#EADBCE] hover:bg-[#FAF6F0]'
                      }`}
                    >
                      <div className="p-4 flex items-center justify-between">
                        <span className="text-sm font-medium text-[#4A2B33]">{label}</span>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-[#C99A86] bg-[#C99A86] text-white'
                              : 'border-[#D8CCC1] bg-white'
                          }`}
                        >
                          {isSelected && <Check size={12} className="stroke-[3]" />}
                        </div>
                      </div>

                      {choice === 'no' && isSelected && (
                        <div className="px-4 pb-4 pt-1 border-t border-[#EADBCE]/60">
                          <div className="bg-[#F4ECE3] rounded-xl p-3 text-xs text-[#7A5862] leading-relaxed">
                            We love that you aren&apos;t losing sleep because of your cycle! You&apos;ll still find gentle calming evening audios and tea rituals in your sanctuary.
                          </div>
                        </div>
                      )}

                      {choice === 'yes' && isSelected && (
                        <div className="px-4 pb-4 pt-1 border-t border-[#EADBCE]/60">
                          <div className="bg-[#F4ECE3] rounded-xl p-3 text-xs text-[#7A5862] leading-relaxed">
                            Progesterone rises after ovulation, slightly raising body temperature. We&apos;ll notify you when to keep your room cooler and wind down gently.
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>Next</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* 4. Mental Health Impact (Screenshot 23) */}
        {subStep === 'mental-health' && (
          <motion.div
            key="mental-health"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="flex-1 flex flex-col justify-between pt-1"
          >
            <div className="space-y-4">
              <div>
                <span className="text-xs text-[#7A5862] font-sans block mb-1">
                  More than half of users better understand mental health with cycle tracking
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#4A2B33] leading-snug">
                  Does your cycle impact any aspect of your mental health?
                </h1>
                <p className="text-xs text-[#7A5862] font-sans mt-1">
                  Select all that resonate.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                {[
                  {
                    id: 'mood-swings',
                    label: 'Mood swings',
                    desc: 'Noticeable emotional shifts before your period starts.',
                  },
                  {
                    id: 'anxiety',
                    label: 'Anxiety',
                    desc: 'Restlessness or heightened sensitivity in the late luteal phase.',
                  },
                  {
                    id: 'fatigue',
                    label: 'Fatigue',
                    desc: 'Mental exhaustion or brain fog when estrogen dips.',
                  },
                  {
                    id: 'irritability',
                    label: 'Irritability',
                    desc: 'Feeling easily overwhelmed or needing extra quiet space.',
                  },
                  {
                    id: 'low-mood',
                    label: 'Low mood',
                    desc: 'Hormones have a major role to play — tracking shows you why.',
                  },
                ].map((item) => {
                  const isChecked = mentalHealthImpacts.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() =>
                        setMentalHealthImpacts((prev) =>
                          prev.includes(item.id)
                            ? prev.filter((i) => i !== item.id)
                            : [...prev, item.id]
                        )
                      }
                      className={`w-full rounded-[20px] transition-all border p-3.5 cursor-pointer ${
                        isChecked
                          ? 'bg-[#FAF6F0] border-[#C99A86] ring-1 ring-[#C99A86] shadow-xs'
                          : 'bg-[#FAF6F0]/70 border-[#EADBCE] hover:bg-[#FAF6F0]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#4A2B33]">
                          {item.label}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isChecked
                              ? 'border-[#C99A86] bg-[#C99A86] text-white'
                              : 'border-[#D8CCC1] bg-white'
                          }`}
                        >
                          {isChecked && <Check size={12} className="stroke-[3]" />}
                        </div>
                      </div>
                      <span className="text-[11px] text-[#7A5862] block mt-1 leading-normal">
                        {item.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>Next</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* 5. Energy or Activity (Screenshot 20) */}
        {subStep === 'energy' && (
          <motion.div
            key="energy"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="flex-1 flex flex-col justify-between pt-1"
          >
            <div className="space-y-4">
              <div>
                <span className="text-xs text-[#C99A86] font-medium block mb-1">
                  Energy syncing for women
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#4A2B33] leading-snug">
                  Does your cycle impact your energy or activity levels?
                </h1>
                <p className="text-xs text-[#7A5862] font-sans mt-1">
                  Estrogen brings vibrant strength, while progesterone invites grounding restorative movement.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                {(['yes', 'no', 'not-sure'] as const).map((choice) => {
                  const isSelected = impactsEnergy === choice;
                  const label = choice === 'yes' ? 'Yes' : choice === 'no' ? 'No' : "I'm not sure";
                  return (
                    <div
                      key={choice}
                      onClick={() => setImpactsEnergy(choice)}
                      className={`w-full rounded-[22px] transition-all border cursor-pointer overflow-hidden ${
                        isSelected
                          ? 'bg-[#FAF6F0] border-[#C99A86] ring-1 ring-[#C99A86] shadow-xs'
                          : 'bg-[#FAF6F0]/70 border-[#EADBCE] hover:bg-[#FAF6F0]'
                      }`}
                    >
                      <div className="p-4 flex items-center justify-between">
                        <span className="text-sm font-medium text-[#4A2B33]">{label}</span>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-[#C99A86] bg-[#C99A86] text-white'
                              : 'border-[#D8CCC1] bg-white'
                          }`}
                        >
                          {isSelected && <Check size={12} className="stroke-[3]" />}
                        </div>
                      </div>

                      {choice === 'yes' && isSelected && (
                        <div className="px-4 pb-4 pt-1 border-t border-[#EADBCE]/60">
                          <div className="bg-[#F4ECE3] rounded-xl p-3 text-xs text-[#7A5862] leading-relaxed">
                            Your hormones change during your cycle which means everything from your energy, strength, stamina and motivation can fluctuate. Womb Atlas helps you exercise in tune with your rhythm.
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>Next</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* 6. Diet Impact (Screenshot 21) */}
        {subStep === 'diet' && (
          <motion.div
            key="diet"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="flex-1 flex flex-col justify-between pt-1"
          >
            <div className="space-y-4">
              <div>
                <span className="text-xs text-[#5B6D55] font-medium block mb-1">
                  66% of users say cycle awareness improves their nourishment
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#4A2B33] leading-snug">
                  Does your cycle impact your diet?
                </h1>
                <p className="text-xs text-[#7A5862] font-sans mt-1">
                  Appetite, metabolism and magnesium needs naturally rise before bleeding.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                {(['yes', 'no', 'not-sure'] as const).map((choice) => {
                  const isSelected = impactsDiet === choice;
                  const label = choice === 'yes' ? 'Yes' : choice === 'no' ? 'No' : "I'm not sure";
                  return (
                    <div
                      key={choice}
                      onClick={() => setImpactsDiet(choice)}
                      className={`w-full rounded-[22px] transition-all border cursor-pointer overflow-hidden ${
                        isSelected
                          ? 'bg-[#FAF6F0] border-[#C99A86] ring-1 ring-[#C99A86] shadow-xs'
                          : 'bg-[#FAF6F0]/70 border-[#EADBCE] hover:bg-[#FAF6F0]'
                      }`}
                    >
                      <div className="p-4 flex items-center justify-between">
                        <span className="text-sm font-medium text-[#4A2B33]">{label}</span>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-[#C99A86] bg-[#C99A86] text-white'
                              : 'border-[#D8CCC1] bg-white'
                          }`}
                        >
                          {isSelected && <Check size={12} className="stroke-[3]" />}
                        </div>
                      </div>

                      {choice === 'no' && isSelected && (
                        <div className="px-4 pb-4 pt-1 border-t border-[#EADBCE]/60">
                          <div className="bg-[#F4ECE3] rounded-xl p-3 text-xs text-[#7A5862] leading-relaxed">
                            That&apos;s great! You&apos;ll find lots of gentle, wholesome recipe ideas to nourish your iron and vitality across each cycle phase.
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>Next</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* 7. Forecast / Spot Patterns (Screenshot 16 & 25) */}
        {subStep === 'ready-forecast' && (
          <motion.div
            key="ready-forecast"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            className="flex-1 flex flex-col justify-between pt-1"
          >
            <div className="space-y-4">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#4A2B33] leading-snug">
                  Always be ready for what&apos;s coming
                </h1>
                <p className="text-xs sm:text-sm text-[#7A5862] font-sans mt-2 leading-relaxed">
                  When you log your symptoms, Womb Atlas helps you spot patterns so you can plan life around how you may feel every day — and even next cycle.
                </p>
              </div>

              {/* Flo Pattern Preview Graphic Card */}
              <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[24px] p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs font-serif text-[#4A2B33]">
                  <span>How you might feel tomorrow</span>
                  <span className="text-[#C99A86]">High energy ✨</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-[10px] text-[#7A5862]">
                  <div className="bg-[#FAF6F0] p-2 rounded-xl border border-[#EADBCE]">
                    <span className="text-base block mb-0.5">🌸</span>
                    <span>No cramps</span>
                  </div>
                  <div className="bg-[#FAF6F0] p-2 rounded-xl border border-[#EADBCE]">
                    <span className="text-base block mb-0.5">⚡</span>
                    <span>High stamina</span>
                  </div>
                  <div className="bg-[#FAF6F0] p-2 rounded-xl border border-[#EADBCE]">
                    <span className="text-base block mb-0.5">😌</span>
                    <span>Calm mind</span>
                  </div>
                  <div className="bg-[#FAF6F0] p-2 rounded-xl border border-[#EADBCE]">
                    <span className="text-base block mb-0.5">🌙</span>
                    <span>Deep sleep</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EADBCE]/60 text-[11px] text-[#5B6D55] flex items-center gap-1.5">
                  <Shield size={13} />
                  <span>Pattern detected based on your last 3 logs</span>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
