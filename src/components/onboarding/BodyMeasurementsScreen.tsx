import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown, Check } from 'lucide-react';

interface BodyMeasurementsScreenProps {
  onContinue: (measurements: {
    heightUnit: 'imperial' | 'metric';
    heightFeet?: number;
    heightInches?: number;
    heightCm?: number;
    weightUnit: 'metric' | 'imperial';
    weightKg?: number;
    weightLbs?: number;
  }) => void;
  onSkipAll?: () => void;
}

export const BodyMeasurementsScreen: React.FC<BodyMeasurementsScreenProps> = ({
  onContinue,
  onSkipAll,
}) => {
  const [measurementStep, setMeasurementStep] = useState<'height' | 'weight'>('height');

  const [heightUnit, setHeightUnit] = useState<'imperial' | 'metric'>('imperial');
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(4);
  const [heightCm, setHeightCm] = useState<number>(163);

  const [weightUnit, setWeightUnit] = useState<'metric' | 'imperial'>('metric');
  const [weightKg, setWeightKg] = useState<number>(60);
  const [weightDecimal, setWeightDecimal] = useState<number>(0);
  const [weightLbs, setWeightLbs] = useState<number>(132);

  const handleNext = () => {
    if (measurementStep === 'height') {
      setMeasurementStep('weight');
    } else {
      onContinue({
        heightUnit,
        heightFeet,
        heightInches,
        heightCm,
        weightUnit,
        weightKg: Number(`${weightKg}.${weightDecimal}`),
        weightLbs,
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-5 pt-3 pb-6 overflow-y-auto">
      <div className="flex items-center justify-between pb-2">
        <span className="font-serif text-lg tracking-tight text-[#4A2B33] font-medium">Womb Atlas</span>
        <button type="button" onClick={onSkipAll} className="text-xs text-[#7A5862] hover:text-[#4A2B33] min-h-[44px] px-2 flex items-center">Skip all</button>
      </div>

      <AnimatePresence mode="wait">
        {measurementStep === 'height' ? (
          <motion.div key="height-step" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="flex-1 flex flex-col justify-between pt-1">
            <div className="space-y-4">
              <div className="text-center"><h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#4A2B33] leading-snug">How tall are you?</h1><p className="text-xs text-[#7A5862] font-sans mt-1.5">Helps calculate your basal metabolism and cycle energetic baseline.</p></div>
              <div className="flex justify-center pt-1">
                <div className="bg-[#EFE7DE] p-1 rounded-full border border-[#DFD3C5] flex items-center">
                  <button type="button" onClick={() => setHeightUnit('metric')} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${heightUnit === 'metric' ? 'bg-[#FAF6F0] text-[#4A2B33] shadow-xs' : 'text-[#7A5862] hover:text-[#4A2B33]'}`}>Metric (cm)</button>
                  <button type="button" onClick={() => setHeightUnit('imperial')} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${heightUnit === 'imperial' ? 'bg-[#FAF6F0] text-[#4A2B33] shadow-xs' : 'text-[#7A5862] hover:text-[#4A2B33]'}`}>Imperial (ft/in)</button>
                </div>
              </div>
              <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[24px] py-4 px-6 text-center shadow-xs"><span className="font-serif text-3xl font-medium text-[#4A2B33]">{heightUnit === 'imperial' ? `${heightFeet} ' ${heightInches} "` : `${heightCm} cm`}</span></div>
              <div className="bg-[#FAF6F0]/90 border border-[#EADBCE] rounded-[24px] p-5 shadow-xs">
                {heightUnit === 'imperial' ? (
                  <div className="grid grid-cols-2 gap-6 text-center max-w-[240px] mx-auto">
                    <div><span className="text-[11px] text-[#7A5862] font-medium block mb-2">Feet</span><div className="flex flex-col items-center gap-1.5"><button type="button" onClick={() => setHeightFeet((f) => Math.min(7, f + 1))} className="text-[#9A7D86] hover:text-[#4A2B33] p-1" aria-label="Increase feet"><ChevronUp size={18} /></button><span className="text-xl font-serif text-[#C7B7B9]">{heightFeet + 1}</span><div className="border-y-2 border-[#C99A86] py-1 px-4 w-16"><span className="text-2xl font-serif font-bold text-[#4A2B33]">{heightFeet}</span></div><span className="text-xl font-serif text-[#C7B7B9]">{Math.max(3, heightFeet - 1)}</span><button type="button" onClick={() => setHeightFeet((f) => Math.max(3, f - 1))} className="text-[#9A7D86] hover:text-[#4A2B33] p-1" aria-label="Decrease feet"><ChevronDown size={18} /></button></div></div>
                    <div><span className="text-[11px] text-[#7A5862] font-medium block mb-2">Inches</span><div className="flex flex-col items-center gap-1.5"><button type="button" onClick={() => setHeightInches((i) => (i >= 11 ? 0 : i + 1))} className="text-[#9A7D86] hover:text-[#4A2B33] p-1" aria-label="Increase inches"><ChevronUp size={18} /></button><span className="text-xl font-serif text-[#C7B7B9]">{heightInches >= 11 ? 0 : heightInches + 1}</span><div className="border-y-2 border-[#C99A86] py-1 px-4 w-16"><span className="text-2xl font-serif font-bold text-[#4A2B33]">{heightInches}</span></div><span className="text-xl font-serif text-[#C7B7B9]">{heightInches <= 0 ? 11 : heightInches - 1}</span><button type="button" onClick={() => setHeightInches((i) => (i <= 0 ? 11 : i - 1))} className="text-[#9A7D86] hover:text-[#4A2B33] p-1" aria-label="Decrease inches"><ChevronDown size={18} /></button></div></div>
                  </div>
                ) : (
                  <div className="text-center max-w-[180px] mx-auto"><span className="text-[11px] text-[#7A5862] font-medium block mb-2">Centimeters</span><div className="flex flex-col items-center gap-1.5"><button type="button" onClick={() => setHeightCm((c) => Math.min(220, c + 1))} className="text-[#9A7D86] hover:text-[#4A2B33] p-1"><ChevronUp size={18} /></button><span className="text-xl font-serif text-[#C7B7B9]">{heightCm + 1}</span><div className="border-y-2 border-[#C99A86] py-1 px-6"><span className="text-2xl font-serif font-bold text-[#4A2B33]">{heightCm}</span></div><span className="text-xl font-serif text-[#C7B7B9]">{heightCm - 1}</span><button type="button" onClick={() => setHeightCm((c) => Math.max(120, c - 1))} className="text-[#9A7D86] hover:text-[#4A2B33] p-1"><ChevronDown size={18} /></button></div></div>
                )}
              </div>
            </div>
            <div className="pt-4 space-y-2">
              <button type="button" onClick={handleNext} className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"><span>Next</span><span aria-hidden="true">→</span></button>
              <div className="text-center"><button type="button" onClick={() => setMeasurementStep('weight')} className="text-xs text-[#7A5862] hover:text-[#4A2B33] py-2 px-4 transition-colors">Skip height</button></div>
              <div className="text-center"><button type="button" onClick={onSkipAll} className="text-xs text-[#7A5862] hover:text-[#4A2B33] py-2 px-4 transition-colors">Skip all</button></div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="weight-step" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="flex-1 flex flex-col justify-between pt-1">
            <div className="space-y-4">
              <div className="text-center"><h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#4A2B33] leading-snug">How much do you weigh?</h1><p className="text-xs text-[#7A5862] font-sans mt-1.5">Weight and hydration naturally fluctuate 1-2 kg around your period.</p></div>
              <div className="flex justify-center pt-1"><div className="bg-[#EFE7DE] p-1 rounded-full border border-[#DFD3C5] flex items-center"><button type="button" onClick={() => setWeightUnit('metric')} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${weightUnit === 'metric' ? 'bg-[#FAF6F0] text-[#4A2B33] shadow-xs' : 'text-[#7A5862] hover:text-[#4A2B33]'}`}>Metric (kg)</button><button type="button" onClick={() => setWeightUnit('imperial')} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${weightUnit === 'imperial' ? 'bg-[#FAF6F0] text-[#4A2B33] shadow-xs' : 'text-[#7A5862] hover:text-[#4A2B33]'}`}>Imperial (lbs)</button></div></div>
              <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[24px] py-4 px-6 text-center shadow-xs"><span className="font-serif text-3xl font-medium text-[#4A2B33]">{weightUnit === 'metric' ? `${weightKg} . ${weightDecimal} kg` : `${weightLbs} lbs`}</span></div>
              <div className="bg-[#FAF6F0]/90 border border-[#EADBCE] rounded-[24px] p-5 shadow-xs">
                {weightUnit === 'metric' ? (
                  <div className="grid grid-cols-2 gap-6 text-center max-w-[240px] mx-auto">
                    <div><span className="text-[11px] text-[#7A5862] font-medium block mb-2">kg</span><div className="flex flex-col items-center gap-1.5"><button type="button" onClick={() => setWeightKg((k) => Math.min(180, k + 1))} className="text-[#9A7D86] hover:text-[#4A2B33] p-1"><ChevronUp size={18} /></button><span className="text-xl font-serif text-[#C7B7B9]">{weightKg + 1}</span><div className="border-y-2 border-[#C99A86] py-1 px-4 w-16"><span className="text-2xl font-serif font-bold text-[#4A2B33]">{weightKg}</span></div><span className="text-xl font-serif text-[#C7B7B9]">{weightKg - 1}</span><button type="button" onClick={() => setWeightKg((k) => Math.max(30, k - 1))} className="text-[#9A7D86] hover:text-[#4A2B33] p-1"><ChevronDown size={18} /></button></div></div>
                    <div><span className="text-[11px] text-[#7A5862] font-medium block mb-2">. decimal</span><div className="flex flex-col items-center gap-1.5"><button type="button" onClick={() => setWeightDecimal((d) => (d >= 9 ? 0 : d + 1))} className="text-[#9A7D86] hover:text-[#4A2B33] p-1"><ChevronUp size={18} /></button><span className="text-xl font-serif text-[#C7B7B9]">{weightDecimal >= 9 ? 0 : weightDecimal + 1}</span><div className="border-y-2 border-[#C99A86] py-1 px-4 w-16"><span className="text-2xl font-serif font-bold text-[#4A2B33]">{weightDecimal}</span></div><span className="text-xl font-serif text-[#C7B7B9]">{weightDecimal <= 0 ? 9 : weightDecimal - 1}</span><button type="button" onClick={() => setWeightDecimal((d) => (d <= 0 ? 9 : d - 1))} className="text-[#9A7D86] hover:text-[#4A2B33] p-1"><ChevronDown size={18} /></button></div></div>
                  </div>
                ) : (
                  <div className="text-center max-w-[180px] mx-auto"><span className="text-[11px] text-[#7A5862] font-medium block mb-2">Pounds (lbs)</span><div className="flex flex-col items-center gap-1.5"><button type="button" onClick={() => setWeightLbs((l) => Math.min(400, l + 1))} className="text-[#9A7D86] hover:text-[#4A2B33] p-1"><ChevronUp size={18} /></button><span className="text-xl font-serif text-[#C7B7B9]">{weightLbs + 1}</span><div className="border-y-2 border-[#C99A86] py-1 px-6"><span className="text-2xl font-serif font-bold text-[#4A2B33]">{weightLbs}</span></div><span className="text-xl font-serif text-[#C7B7B9]">{weightLbs - 1}</span><button type="button" onClick={() => setWeightLbs((l) => Math.max(65, l - 1))} className="text-[#9A7D86] hover:text-[#4A2B33] p-1"><ChevronDown size={18} /></button></div></div>
                )}
              </div>
            </div>
            <div className="pt-4 space-y-2">
              <button type="button" onClick={handleNext} className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"><span>Continue</span><span aria-hidden="true">→</span></button>
              <div className="text-center"><button type="button" onClick={handleNext} className="text-xs text-[#7A5862] hover:text-[#4A2B33] py-2 px-4 transition-colors">Skip weight</button></div>
              <div className="text-center"><button type="button" onClick={onSkipAll} className="text-xs text-[#7A5862] hover:text-[#4A2B33] py-2 px-4 transition-colors">Skip all</button></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};