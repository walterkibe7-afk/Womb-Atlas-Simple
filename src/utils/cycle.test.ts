import test from 'node:test';
import assert from 'node:assert/strict';
import {
  determineCyclePhase,
  getGreeting,
  generateGentleInsight,
  summarizeEntry,
  getPhaseDetails,
  calculateCycleDayFromDate,
} from './cycle';
import { DailyEntry } from '../types';

test('determineCyclePhase identifies phases correctly', () => {
  assert.equal(determineCyclePhase(1), 'menstrual');
  assert.equal(determineCyclePhase(3), 'menstrual');
  assert.equal(determineCyclePhase(5), 'menstrual');
  assert.equal(determineCyclePhase(8), 'follicular');
  assert.equal(determineCyclePhase(14), 'ovulatory');
  assert.equal(determineCyclePhase(22), 'luteal');
});

test('getPhaseDetails returns warm, poetic descriptors', () => {
  const details = getPhaseDetails('menstrual', 3);
  assert.equal(details.label, 'Day 3 · Menstrual phase');
  assert.match(details.nurtureText, /resting and clearing space/);
});

test('getGreeting provides respectful time-appropriate greeting', () => {
  const morningDate = new Date(2026, 10, 7, 8, 30);
  assert.equal(getGreeting('Achieng', morningDate), 'Good morning, Achieng');

  const afternoonDate = new Date(2026, 10, 7, 14, 0);
  assert.equal(getGreeting('Achieng', afternoonDate), 'Good afternoon, Achieng');

  const eveningDate = new Date(2026, 10, 7, 20, 0);
  assert.equal(getGreeting('Achieng', eveningDate), 'Good evening, Achieng');
});

test('generateGentleInsight outputs calming guidance', () => {
  const dummyEntries: DailyEntry[] = [];
  const insightDay3 = generateGentleInsight(dummyEntries, 3);
  assert.equal(
    insightDay3,
    'Your pain is usually lighter on day 3 of your period'
  );
});

test('summarizeEntry generates readable single-line summary with dots', () => {
  const entry: DailyEntry = {
    id: 'test-1',
    date: '2026-11-06',
    cycleDay: 2,
    flow: 'medium',
    pain: 2,
    symptoms: ['cramps'],
    mood: 'reflective',
    note: 'Resting with warm tea.',
  };
  const summary = summarizeEntry(entry);
  assert.equal(summary, 'Medium flow · Noticeable ache · Cramps · Reflective');
});

test('calculateCycleDayFromDate computes correct cycle day', () => {
  assert.equal(calculateCycleDayFromDate('2026-11-05', '2026-11-07', 28), 3);
  assert.equal(calculateCycleDayFromDate(undefined, '2026-11-07', 28), null);
});

test('generateGentleInsight handles learning mode and hormonal birth control', () => {
  const dummyEntries: DailyEntry[] = [];
  const learningInsight = generateGentleInsight(dummyEntries, null, false);
  assert.match(learningInsight, /Atlas will begin charting your rhythm/);

  const hormonalInsight = generateGentleInsight(dummyEntries, 3, true);
  assert.match(hormonalInsight, /hormonal support/);
});
