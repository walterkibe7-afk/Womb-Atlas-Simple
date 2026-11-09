import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, ChevronUp, ChevronDown } from 'lucide-react';

interface BirthYearScreenProps {
  initialYear?: number;
  onContinue: (year: number) => void;
  onSkipAll?: () => void;
}

const YEARS = Array.from({ length: 2012 - 1955 + 1 }, (_, i) => 2012 - i);

export const BirthYearScreen: React.FC<BirthYearScreenProps> = ({
  initialYear = 1998,
  onContinue,
  onSkipAll,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(initialYear);
  const containerRef = useRef<HTMLDivElement>(null);

  const ITEM_HEIGHT = 52;

  useEffect(() => {
    const index = YEARS.indexOf(selectedYear);
    if (index >= 0 && containerRef.current) {
      containerRef.current.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' });
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(YEARS.length - 1, index));
    if (YEARS[clampedIndex] && YEARS[clampedIndex] !== selectedYear) {
      setSelectedYear(YEARS[clampedIndex]);
    }
  };

  const handleSelectYear = (year: number) => {
    setSelectedYear(year);
    const index = YEARS.indexOf(year);
    if (index >= 0 && containerRef.current) {
      containerRef.current.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' });
    }
  };

  const handleStepYear = (delta: number) => {
    const currentIndex = YEARS.indexOf(selectedYear);
    const nextIndex = Math.max(0, Math.min(YEARS.length - 1, currentIndex + delta));
    handleSelectYear(YEARS[nextIndex]);
  };

  const approximateAge = 2026 - selectedYear;

  return (
    <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-5 pt-4 pb-6 overflow-y-auto">
      <div className="flex items-center justify-between pb-3">
        <span className="font-serif text-lg tracking-tight text-[#4A2B33] font-medium">Womb Atlas</span>
        <button type="button" onClick={onSkipAll} className="text-xs text-[#7A5862] hover:text-[#4A2B33] min-h-[44px] px-2 flex items-center">Skip all</button>
      </div>

      <div className="flex-1 flex flex-col justify-between pt-1">
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#4A2B33] leading-snug">When were you born?</h1>
            <p className="text-xs sm:text-sm text-[#7A5862] font-sans mt-1.5">Scroll to choose your birth year.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }} className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[20px] p-4 shadow-[0_2px_12px_rgba(74,43,51,0.03)]">
            <div className="flex items-center gap-2 mb-1.5"><span className="w-2 h-2 rounded-full bg-[#C99A86]"></span><span className="font-serif text-sm font-medium text-[#4A2B33]">Your cycle can change with age</span></div>
            <p className="text-xs text-[#7A5862] leading-relaxed">Hormone patterns and cycle regularity naturally shift through each decade of womanhood. This helps us speak with gentle, age-appropriate accuracy.</p>
          </motion.div>

          <div className="text-center pt-2">
            <span className="text-xs text-[#7A5862] block mb-1">Birth year selected</span>
            <div className="inline-flex items-center gap-2 bg-[#FAF6F0] border border-[#EADBCE] px-6 py-2 rounded-full shadow-2xs"><Calendar size={16} className="text-[#C99A86]" /><span className="font-serif text-2xl text-[#4A2B33] font-medium tracking-tight">{selectedYear}</span><span className="text-xs text-[#7A5862]">(~{approximateAge} years)</span></div>
          </div>

          <div className="relative max-w-[280px] mx-auto bg-[#FAF6F0] border border-[#EADBCE] rounded-[24px] shadow-[0_4px_20px_rgba(74,43,51,0.04)] p-2">
            <div className="flex justify-between px-4 pb-1 pt-1 text-[#7A5862]">
              <button type="button" onClick={() => handleStepYear(-1)} className="p-1 rounded-full hover:bg-[#EFE7DE] transition-colors" aria-label="Newer year"><ChevronUp size={18} /></button>
              <button type="button" onClick={() => handleStepYear(1)} className="p-1 rounded-full hover:bg-[#EFE7DE] transition-colors" aria-label="Older year"><ChevronDown size={18} /></button>
            </div>
            <div className="relative h-[208px] overflow-hidden">
              <div className="absolute left-6 right-6 top-[78px] h-[52px] border-y-2 border-[#C99A86] pointer-events-none z-10 rounded-xs bg-[#C99A86]/5" />
              <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-[#FAF6F0] via-[#FAF6F0]/80 to-transparent pointer-events-none z-20" />
              <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-[#FAF6F0] via-[#FAF6F0]/80 to-transparent pointer-events-none z-20" />
              <div ref={containerRef} onScroll={handleScroll} className="h-full overflow-y-auto scroll-smooth snap-y snap-mandatory py-[78px] no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {YEARS.map((year) => {
                  const isSelected = selectedYear === year;
                  const distance = Math.abs(YEARS.indexOf(year) - YEARS.indexOf(selectedYear));
                  return (
                    <div key={year} onClick={() => handleSelectYear(year)} style={{ height: `${ITEM_HEIGHT}px` }} className={`snap-center flex items-center justify-center cursor-pointer transition-all select-none ${isSelected ? 'font-serif text-2xl font-medium text-[#4A2B33] scale-110' : distance === 1 ? 'font-serif text-lg text-[#947D84]' : 'font-serif text-sm text-[#C8B8BE] opacity-60'}`}>{year}</div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5 space-y-2.5">
          <button type="button" onClick={() => onContinue(selectedYear)} className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"><span>Continue</span><span aria-hidden="true">→</span></button>
          <div className="text-center"><button type="button" onClick={onSkipAll} className="text-xs text-[#7A5862] hover:text-[#4A2B33] py-2 px-4 transition-colors">Skip all</button></div>
        </div>
      </div>
    </div>
  );
};