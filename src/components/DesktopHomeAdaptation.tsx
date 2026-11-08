import React from 'react';
import { motion } from 'motion/react';
import { DailyEntry } from '../types';
import {
  getGreeting,
  determineCyclePhase,
  getPhaseDetails,
  generateGentleInsight,
  summarizeEntry,
} from '../utils/cycle';

interface DesktopHomeAdaptationProps {
  entries: DailyEntry[];
  onNavigateMobile: (screen: 'home' | 'log' | 'history') => void;
  userName?: string;
}

export const DesktopHomeAdaptation: React.FC<DesktopHomeAdaptationProps> = ({
  entries,
  onNavigateMobile,
  userName = 'Achieng',
}) => {
  const currentCycleDay = 3;
  const currentPhase = determineCyclePhase(currentCycleDay);
  const phaseDetails = getPhaseDetails(currentPhase, currentCycleDay);
  const greeting = getGreeting(userName);
  const gentleInsight = generateGentleInsight(entries, currentCycleDay);
  const todayEntry = entries.find((e) => e.date === '2026-11-07');

  const phases = [
    {
      name: 'Menstrual',
      days: 'Days 1–5',
      note: 'Rest, release & clearing space',
      active: true,
    },
    {
      name: 'Follicular',
      days: 'Days 6–11',
      note: 'Rising energy & gentle renewal',
      active: false,
    },
    {
      name: 'Ovulatory',
      days: 'Days 12–16',
      note: 'Warmth, vitality & connection',
      active: false,
    },
    {
      name: 'Luteal',
      days: 'Days 17–28',
      note: 'Turning inward & mindful boundaries',
      active: false,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F7F3EC] text-[#4A2B33] flex flex-col font-sans">
      {/* Desktop Top Navigation Bar (Top Bar Contract: 3 Zones) */}
      <header className="border-b border-[#EADBCE] bg-[#FAF6F0]/80 backdrop-blur-xs px-8 lg:px-16 py-4 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3">
          <span className="font-serif text-xl font-medium tracking-tight text-[#4A2B33]">
            Womb Atlas
          </span>
          <span className="text-xs text-[#7A5862] hidden sm:inline">
            · Saturday, November 7
          </span>
        </div>

        {/* Zone 2: Clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-[#7A5862]">
          <span className="text-[#4A2B33] font-medium border-b border-[#4A2B33] pb-0.5">
            Today
          </span>
          <button
            onClick={() => onNavigateMobile('log')}
            className="hover:text-[#4A2B33] transition-colors"
          >
            Daily entry
          </button>
          <button
            onClick={() => onNavigateMobile('history')}
            className="hover:text-[#4A2B33] transition-colors"
          >
            Cycle history
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateMobile('log')}
            className="min-h-[40px] px-5 py-2 rounded-full bg-[#4A2B33] text-[#F7F3EC] text-xs font-medium hover:bg-[#3B2229] transition-colors"
          >
            Log today
          </button>
        </div>
      </header>

      {/* Main Desktop Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 lg:px-12 py-6 lg:py-8">
        {/* Desktop Greeting Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#A8B5A2]"></span>
            <span className="text-xs font-medium text-[#7A5862]">
              Day 3 of 28 · Quiet rhythm
            </span>
          </div>
          <h1 className="font-serif text-3xl lg:text-4xl text-[#4A2B33] font-normal leading-tight">
            {greeting}
          </h1>
          <p className="text-sm text-[#7A5862] mt-1.5 max-w-xl">
            A quiet space to check in with yourself. No rush, no diagnostic alarms — just an unhurried map of your body&apos;s natural cadence.
          </p>
        </motion.div>

        {/* 2-Column Balanced Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Calm Status Card & Quick Links (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[24px] p-8 shadow-[0_4px_24px_rgba(74,43,51,0.03)]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-[#7A5862]">
                  Current cycle phase
                </span>
                <span className="text-xs font-serif italic text-[#C99A86]">
                  Winter / Inward season
                </span>
              </div>

              <h2 className="font-serif text-3xl font-normal text-[#4A2B33] mb-3">
                {phaseDetails.label}
              </h2>

              <p className="text-base text-[#7A5862] leading-relaxed mb-8 max-w-lg">
                {phaseDetails.nurtureText}
              </p>

              {/* Primary Call to Action */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => onNavigateMobile('log')}
                  className="min-h-[50px] px-8 py-3.5 rounded-[18px] bg-[#4A2B33] text-[#F7F3EC] font-sans text-sm font-medium hover:bg-[#3B2229] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>How are you feeling today?</span>
                  <span aria-hidden="true">→</span>
                </button>
                <button
                  onClick={() => onNavigateMobile('history')}
                  className="min-h-[50px] px-6 py-3.5 rounded-[18px] bg-[#FAF6F0] border border-[#EADBCE] text-sm text-[#4A2B33] font-medium hover:border-[#C99A86] transition-colors"
                >
                  View calendar history
                </button>
              </div>

              {todayEntry && (
                <div className="mt-6 pt-4 border-t border-[#EADBCE]/70 flex items-center justify-between text-xs text-[#7A5862]">
                  <span>Today&apos;s recorded note:</span>
                  <span className="text-[#4A2B33] font-medium">
                    {summarizeEntry(todayEntry)}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onNavigateMobile('log')}
                className="p-5 bg-[#FAF6F0] border border-[#EADBCE] rounded-[20px] text-left hover:border-[#C99A86] transition-all"
              >
                <span className="text-xs text-[#7A5862] block mb-1">
                  Daily journal
                </span>
                <span className="font-serif text-lg text-[#4A2B33] font-medium block">
                  Record today&apos;s symptoms
                </span>
                <span className="text-xs text-[#7A5862] mt-1 block">
                  Flow, cramps, mood &amp; note
                </span>
              </button>

              <button
                onClick={() => onNavigateMobile('history')}
                className="p-5 bg-[#FAF6F0] border border-[#EADBCE] rounded-[20px] text-left hover:border-[#C99A86] transition-all"
              >
                <span className="text-xs text-[#7A5862] block mb-1">
                  Gentle cadence
                </span>
                <span className="font-serif text-lg text-[#4A2B33] font-medium block">
                  Past 5 cycles
                </span>
                <span className="text-xs text-[#7A5862] mt-1 block">
                  Steady 28-day monthly flow
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Gentle Insight & Rhythm Map (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Gentle Insight Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-[#EEF3ED] border border-[#D7E3D4] rounded-[22px] p-6 shadow-[0_2px_16px_rgba(91,109,85,0.04)]"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#A8B5A2]"></span>
                <span className="text-xs font-medium text-[#5B6D55]">
                  Gentle insight
                </span>
              </div>
              <p className="font-serif text-xl italic leading-relaxed text-[#4A2B33]">
                &ldquo;{gentleInsight}&rdquo;
              </p>
              <p className="text-xs text-[#7A5862] mt-3">
                Observed gently from your previous 3 menstrual entries.
              </p>
            </motion.div>

            {/* Cycle Phases Natural Map */}
            <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[22px] p-6 space-y-3.5">
              <span className="text-xs font-medium text-[#7A5862] block mb-1">
                Your body&apos;s four phases
              </span>

              {phases.map((p) => (
                <div
                  key={p.name}
                  className={`p-3.5 rounded-[16px] border transition-all ${
                    p.active
                      ? 'bg-[#F7F3EC] border-[#C99A86] shadow-xs'
                      : 'border-transparent text-[#7A5862]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-serif text-sm font-medium ${
                        p.active ? 'text-[#4A2B33]' : 'text-[#7A5862]'
                      }`}
                    >
                      {p.name}
                    </span>
                    <span className="text-xs text-[#7A5862]">{p.days}</span>
                  </div>
                  <p className="text-xs text-[#7A5862] mt-0.5">{p.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Desktop Footer */}
      <footer className="border-t border-[#EADBCE] px-8 lg:px-16 py-6 text-xs text-[#7A5862] flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>Womb Atlas · Private, local-first menstrual care</span>
        <span>A calm companion for your reproductive health</span>
      </footer>
    </div>
  );
};
