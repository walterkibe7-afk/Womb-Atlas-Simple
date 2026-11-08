import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Stethoscope, Search, Share2, Radio, Compass, Check } from 'lucide-react';

interface DiscoverySourceScreenProps {
  onContinue: (source: string) => void;
  onBack?: () => void;
}

const SOURCES = [
  { id: 'friend', label: 'Friend or family recommendation', icon: Users, desc: 'Recommended by someone I trust' },
  { id: 'provider', label: 'Midwife or healthcare provider', icon: Stethoscope, desc: 'Recommended in clinical care' },
  { id: 'search', label: 'App store or web search', icon: Search, desc: 'Looking for a private tracker' },
  { id: 'social', label: 'Social media', icon: Share2, desc: 'Instagram, TikTok, or YouTube' },
  { id: 'podcast', label: 'Podcast, article, or book', icon: Radio, desc: 'Heard about Womb Atlas in health media' },
  { id: 'exploring', label: 'Other / Just exploring', icon: Compass, desc: 'Beginning my reproductive journey' },
];

export const DiscoverySourceScreen: React.FC<DiscoverySourceScreenProps> = ({
  onContinue,
  onBack,
}) => {
  const [selectedSource, setSelectedSource] = useState<string>('friend');

  return (
    <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-5 pt-4 pb-6 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3">
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#4A2B33] leading-snug">
              How did you find out about us?
            </h1>
            <p className="text-xs sm:text-sm text-[#7A5862] font-sans mt-1.5">
              Knowing how you arrived helps us nurture a welcoming space for our community.
            </p>
          </motion.div>

          {/* Sources List */}
          <div className="space-y-2.5 pt-1">
            {SOURCES.map((source, index) => {
              const Icon = source.icon;
              const isSelected = selectedSource === source.id;

              return (
                <motion.button
                  key={source.id}
                  type="button"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  onClick={() => setSelectedSource(source.id)}
                  className={`w-full p-3.5 rounded-[18px] border text-left transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#FAF6F0] border-[#C99A86] ring-1 ring-[#C99A86] shadow-xs'
                      : 'bg-[#FAF6F0]/70 border-[#EADBCE] hover:border-[#D6C7BB]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-[#4A2B33] text-[#F7F3EC]'
                          : 'bg-[#EFE7DE] text-[#7A5862]'
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <span className="font-medium text-xs sm:text-sm text-[#4A2B33] block">
                        {source.label}
                      </span>
                      <span className="text-[11px] text-[#7A5862]">
                        {source.desc}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#4A2B33] text-[#F7F3EC]'
                        : 'border border-[#D6C7BB]'
                    }`}
                  >
                    {isSelected && <Check size={12} className="stroke-[3]" />}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-5 space-y-2.5">
          <button
            type="button"
            onClick={() => onContinue(selectedSource)}
            className="w-full min-h-[50px] py-3.5 px-6 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>Continue</span>
            <span aria-hidden="true">→</span>
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => onContinue('unspecified')}
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
