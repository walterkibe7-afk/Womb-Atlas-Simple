import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FlowLevel, Symptom, Mood, DailyEntry } from '../../types';

interface DesktopLogProps {
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

export const DesktopLog: React.FC<DesktopLogProps> = ({
  onSave,
  onCancel,
  existingEntry,
}) => {
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
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#EADBCE]">
        <div>
          <button
            onClick={onCancel}
            className="text-xs text-[#7A5862] hover:text-[#4A2B33] mb-1 flex items-center gap-1 transition-colors"
          >
            ← Back to today
          </button>
          <h1 className="font-serif text-3xl text-[#4A2B33] font-normal">
            Daily Journal &amp; Check-in
          </h1>
          <p className="text-xs text-[#7A5862] mt-0.5">
            Saturday, November 7 · Day 3 of cycle
          </p>
        </div>

        {savedSuccess && (
          <div className="bg-[#EEF3ED] text-[#5B6D55] text-xs font-medium px-4 py-2 rounded-full border border-[#D7E3D4] flex items-center gap-1.5">
            <span>✓</span>
            <span>Saved with care</span>
          </div>
        )}
      </div>

      {/* Main 2-Column Desktop Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Column: Flow & Pain */}
        <div className="space-y-6">
          {/* Flow Level */}
          <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[22px] p-6 shadow-[0_2px_12px_rgba(74,43,51,0.02)]">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-medium text-[#7A5862]">
                Flow level
              </label>
              <span className="text-[11px] text-[#C99A86] capitalize font-medium">
                {flow} flow
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {FLOW_OPTIONS.map((item) => {
                const isSelected = flow === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFlow(item.id)}
                    className={`min-h-[58px] p-3 rounded-[16px] text-left transition-all border ${
                      isSelected
                        ? 'bg-[#FAF6F0] border-[#C99A86] ring-1 ring-[#C99A86] shadow-xs'
                        : 'bg-[#FAF6F0]/70 border-[#E8DFD5] hover:border-[#D6C7BB]'
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

          {/* Pain Slider */}
          <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[22px] p-6 shadow-[0_2px_12px_rgba(74,43,51,0.02)]">
            <div className="flex items-center justify-between mb-3">
              <label
                htmlFor="desktop-pain-slider"
                className="text-xs font-medium text-[#7A5862]"
              >
                Pain or cramp intensity
              </label>
              <span className="font-serif text-lg text-[#C99A86] font-medium">
                {pain} / 5
              </span>
            </div>

            <input
              id="desktop-pain-slider"
              type="range"
              min="0"
              max="5"
              step="1"
              value={pain}
              onChange={(e) => setPain(Number(e.target.value))}
              className="w-full h-2.5 bg-[#EADFD5] rounded-lg appearance-none cursor-pointer accent-[#C99A86] my-2"
            />

            <p className="text-xs text-[#4A2B33] font-sans mt-2 font-medium">
              {PAIN_LABELS[pain]}
            </p>
          </div>
        </div>

        {/* Right Column: Symptoms, Mood & Note */}
        <div className="space-y-6">
          {/* Symptoms */}
          <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[22px] p-6 shadow-[0_2px_12px_rgba(74,43,51,0.02)]">
            <div className="flex items-center justify-between mb-3">
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
                    className={`min-h-[40px] px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
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

          {/* Mood */}
          <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[22px] p-6 shadow-[0_2px_12px_rgba(74,43,51,0.02)]">
            <label className="block text-xs font-medium text-[#7A5862] mb-3">
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
                    className={`min-h-[40px] px-2 py-1.5 rounded-[14px] text-xs font-medium text-center transition-all border ${
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

          {/* Optional Note */}
          <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[22px] p-6 shadow-[0_2px_12px_rgba(74,43,51,0.02)]">
            <label
              htmlFor="desktop-log-note"
              className="block text-xs font-medium text-[#7A5862] mb-2"
            >
              A note to yourself (optional)
            </label>
            <textarea
              id="desktop-log-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Warm raspberry leaf tea, restful afternoon walk..."
              className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-[16px] p-3 text-xs leading-relaxed text-[#4A2B33] placeholder-[#A48F95] focus:outline-none focus:border-[#C99A86] focus:ring-1 focus:ring-[#C99A86] transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* Primary Action Button Bar */}
      <div className="pt-2 flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="min-h-[44px] px-5 py-2 text-xs text-[#7A5862] hover:text-[#4A2B33] transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="min-h-[48px] px-8 py-3 rounded-[16px] bg-[#4A2B33] text-[#F7F3EC] text-sm font-medium hover:bg-[#3B2229] transition-all shadow-sm"
        >
          Save entry
        </button>
      </div>
    </div>
  );
};
