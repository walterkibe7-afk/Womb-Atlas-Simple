import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FlowLevel, Symptom, Mood, DailyEntry } from '../types';

interface LogScreenProps {
  onSave: (entry: Omit<DailyEntry, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  existingEntry?: DailyEntry;
}

const FLOW_OPTIONS: { id: FlowLevel; label: string; desc: string }[] = [
  { id: 'spotting', label: 'Spotting', desc: 'A few drops' },
  { id: 'light', label: 'Light', desc: 'Gentle flow' },
  { id: 'medium', label: 'Medium', desc: 'Steady flow' },
  { id: 'heavy', label: 'Heavy', desc: 'Full flow' },
];

const PAIN_LABELS = [
  'No pain · completely at ease',
  'Mild ache · faint background sensation',
  'Noticeable cramps · warm tea helps',
  'Moderate cramps · calls for slowing down',
  'Intense pain · hot pack and quiet',
  'Rest needed · prioritizing stillness',
];

const SYMPTOM_OPTIONS: { id: Symptom; label: string }[] = [
  { id: 'cramps', label: 'Cramps' },
  { id: 'tender-breasts', label: 'Tender breasts' },
  { id: 'fatigue', label: 'Fatigue' },
  { id: 'headache', label: 'Headache' },
  { id: 'bloating', label: 'Bloating' },
  { id: 'backache', label: 'Backache' },
];

const MOOD_OPTIONS: { id: Mood; label: string }[] = [
  { id: 'calm', label: 'Calm' },
  { id: 'reflective', label: 'Reflective' },
  { id: 'sensitive', label: 'Sensitive' },
  { id: 'low-energy', label: 'Low energy' },
  { id: 'grounded', label: 'Grounded' },
  { id: 'tender', label: 'Tender' },
];

export const LogScreen: React.FC<LogScreenProps> = ({
  onSave,
  onCancel,
  existingEntry,
}) => {
  const [activeGroup, setActiveGroup] = useState<1 | 2 | 3>(1);
  const [flow, setFlow] = useState<FlowLevel>(existingEntry?.flow || 'light');
  const [pain, setPain] = useState<number>(existingEntry?.pain ?? 1);
  const [symptoms, setSymptoms] = useState<Symptom[]>(
    existingEntry?.symptoms || ['cramps']
  );
  const [mood, setMood] = useState<Mood>(existingEntry?.mood || 'calm');
  const [note, setNote] = useState<string>(existingEntry?.note || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleSymptom = (sym: Symptom) => {
    if (symptoms.includes(sym)) {
      setSymptoms(symptoms.filter((s) => s !== sym));
    } else {
      setSymptoms([...symptoms, sym]);
    }
  };

  const handleSave = () => {
    onSave({
      date: '2026-11-07',
      cycleDay: 3,
      flow,
      pain,
      symptoms,
      mood,
      note: note.trim() || undefined,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      onCancel();
    }, 600);
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-5 pt-4 pb-6 overflow-y-auto">
      {/* Header bar: Cancel button + 3 Simple Dots Progress */}
      <div className="flex items-center justify-between pb-3">
        <button
          onClick={onCancel}
          className="text-xs text-[#7A5862] hover:text-[#4A2B33] min-h-[44px] px-2 flex items-center"
        >
          ← Back to today
        </button>

        {/* 3 Simple Dots Progress */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((dot) => (
            <button
              key={dot}
              onClick={() => setActiveGroup(dot as 1 | 2 | 3)}
              aria-label={`Question group ${dot} of 3`}
              className={`transition-all ${
                activeGroup === dot
                  ? 'w-6 h-2 rounded-full bg-[#C99A86]'
                  : 'w-2 h-2 rounded-full bg-[#D8CCC1] hover:bg-[#BCAFA3]'
              }`}
            />
          ))}
        </div>

        <span className="text-xs text-[#7A5862] font-sans">
          Day 3 · Log
        </span>
      </div>

      {savedSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-auto text-center py-12"
        >
          <div className="w-14 h-14 rounded-full bg-[#EEF3ED] text-[#5B6D55] mx-auto flex items-center justify-center text-xl mb-3">
            ✓
          </div>
          <h2 className="font-serif text-2xl text-[#4A2B33] mb-1">
            Saved with care
          </h2>
          <p className="text-sm text-[#7A5862]">
            Your entry has been tenderly recorded.
          </p>
        </motion.div>
      )}

      {!savedSuccess && (
        <div className="flex-1 flex flex-col justify-between pt-1">
          <AnimatePresence mode="wait">
            {activeGroup === 1 && (
              <motion.div
                key="group1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-serif text-2xl font-normal text-[#4A2B33]">
                    Flow &amp; body sensation
                  </h2>
                  <p className="text-xs text-[#7A5862] mt-1 font-sans">
                    Notice what your body is releasing today.
                  </p>
                </div>

                {/* Flow level: 4 pill options */}
                <div>
                  <label className="block text-xs font-medium text-[#7A5862] mb-2.5">
                    Flow level
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {FLOW_OPTIONS.map((item) => {
                      const isSelected = flow === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFlow(item.id)}
                          className={`min-h-[54px] px-3.5 py-2.5 rounded-[18px] text-left transition-all border ${
                            isSelected
                              ? 'bg-[#FAF6F0] border-[#C99A86] ring-1 ring-[#C99A86] shadow-sm'
                              : 'bg-[#FAF6F0]/80 border-[#E8DFD5] hover:border-[#D6C7BB]'
                          }`}
                        >
                          <span className="block text-sm font-medium text-[#4A2B33]">
                            {item.label}
                          </span>
                          <span className="block text-[11px] text-[#7A5862] mt-0.5">
                            {item.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pain level: slider 0 to 5 */}
                <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[20px] p-4.5">
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="pain-slider"
                      className="text-xs font-medium text-[#7A5862]"
                    >
                      Pain or cramp intensity
                    </label>
                    <span className="font-serif text-lg text-[#C99A86] font-medium">
                      {pain} / 5
                    </span>
                  </div>

                  <input
                    id="pain-slider"
                    type="range"
                    min="0"
                    max="5"
                    step="1"
                    value={pain}
                    onChange={(e) => setPain(Number(e.target.value))}
                    className="w-full h-2 bg-[#EADFD5] rounded-lg appearance-none cursor-pointer accent-[#C99A86]"
                  />

                  <p className="text-xs text-[#4A2B33] font-sans mt-3 font-medium">
                    {PAIN_LABELS[pain]}
                  </p>
                </div>

                {/* Step navigation */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveGroup(2)}
                    className="min-h-[44px] px-5 py-2.5 rounded-[16px] bg-[#FAF6F0] border border-[#EADBCE] text-sm text-[#4A2B33] font-medium hover:border-[#C99A86] transition-colors"
                  >
                    Continue to symptoms →
                  </button>
                </div>
              </motion.div>
            )}

            {activeGroup === 2 && (
              <motion.div
                key="group2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-serif text-2xl font-normal text-[#4A2B33]">
                    Symptoms &amp; mood
                  </h2>
                  <p className="text-xs text-[#7A5862] mt-1 font-sans">
                    Select anything you are carrying right now.
                  </p>
                </div>

                {/* Top symptoms: max 6 chips */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-medium text-[#7A5862]">
                      Top symptoms
                    </label>
                    <span className="text-[11px] text-[#7A5862]">
                      {symptoms.length} selected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SYMPTOM_OPTIONS.map((sym) => {
                      const isSelected = symptoms.includes(sym.id);
                      return (
                        <button
                          key={sym.id}
                          type="button"
                          onClick={() => toggleSymptom(sym.id)}
                          className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-medium transition-all border ${
                            isSelected
                              ? 'bg-[#FAF6F0] border-[#C99A86] text-[#4A2B33] ring-1 ring-[#C99A86]'
                              : 'bg-[#FAF6F0]/70 border-[#E8DFD5] text-[#7A5862] hover:border-[#D6C7BB]'
                          }`}
                        >
                          {isSelected ? '✓ ' : ''}
                          {sym.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mood chips */}
                <div>
                  <label className="block text-xs font-medium text-[#7A5862] mb-2.5">
                    Emotional climate
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {MOOD_OPTIONS.map((m) => {
                      const isSelected = mood === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMood(m.id)}
                          className={`min-h-[44px] px-2 py-2 rounded-[16px] text-xs font-medium text-center transition-all border ${
                            isSelected
                              ? 'bg-[#EEF3ED] border-[#A8B5A2] text-[#4A2B33] ring-1 ring-[#A8B5A2]'
                              : 'bg-[#FAF6F0] border-[#E8DFD5] text-[#7A5862] hover:border-[#D6C7BB]'
                          }`}
                        >
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation between steps */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveGroup(1)}
                    className="min-h-[44px] px-4 py-2 text-xs text-[#7A5862] hover:text-[#4A2B33]"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveGroup(3)}
                    className="min-h-[44px] px-5 py-2.5 rounded-[16px] bg-[#FAF6F0] border border-[#EADBCE] text-sm text-[#4A2B33] font-medium hover:border-[#C99A86] transition-colors"
                  >
                    Continue to note →
                  </button>
                </div>
              </motion.div>
            )}

            {activeGroup === 3 && (
              <motion.div
                key="group3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="font-serif text-2xl font-normal text-[#4A2B33]">
                    Quiet reflection
                  </h2>
                  <p className="text-xs text-[#7A5862] mt-1 font-sans">
                    Any words for yourself or what comforted you today.
                  </p>
                </div>

                {/* Optional note field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="log-note"
                    className="block text-xs font-medium text-[#7A5862]"
                  >
                    A note to yourself (optional)
                  </label>
                  <textarea
                    id="log-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={4}
                    placeholder="Sipping chamomile or raspberry leaf tea, rested in the afternoon, early evening bath..."
                    className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-[18px] p-4 text-sm text-[#4A2B33] placeholder-[#A48F95] focus:outline-none focus:border-[#C99A86] focus:ring-1 focus:ring-[#C99A86] transition-all resize-none"
                  />
                </div>

                {/* Brief summary recap */}
                <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[18px] p-4 text-xs text-[#7A5862] space-y-1">
                  <span className="font-medium text-[#4A2B33] block mb-1">
                    Entry summary:
                  </span>
                  <div className="flex items-center justify-between">
                    <span>Flow &amp; pain:</span>
                    <span className="text-[#4A2B33]">
                      {flow.charAt(0).toUpperCase() + flow.slice(1)} flow · Pain {pain}/5
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Mood &amp; symptoms:</span>
                    <span className="text-[#4A2B33]">
                      {mood.charAt(0).toUpperCase() + mood.slice(1)} ·{' '}
                      {symptoms.length > 0
                        ? `${symptoms.length} symptoms`
                        : 'No symptoms'}
                    </span>
                  </div>
                </div>

                {/* Navigation and the ONLY PRIMARY BUTTON: Save entry */}
                <div className="pt-2 space-y-3">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="w-full min-h-[50px] py-3.5 px-5 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>Save entry</span>
                  </button>

                  <div className="flex justify-start">
                    <button
                      type="button"
                      onClick={() => setActiveGroup(2)}
                      className="min-h-[44px] px-3 py-2 text-xs text-[#7A5862] hover:text-[#4A2B33]"
                    >
                      ← Back to symptoms
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
