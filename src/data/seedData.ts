import { DailyEntry } from '../types';
import { toLocalIso } from '../utils/cycle';

export const initialEntries: DailyEntry[] = [
  {
    id: 'entry-2026-11-07',
    date: '2026-11-07',
    cycleDay: 3,
    flow: 'light',
    pain: 1,
    symptoms: ['cramps'],
    mood: 'calm',
    note: 'Sipped warm raspberry leaf infusion; the sharp tension has subsided.',
    createdAt: '2026-11-07T09:15:00Z',
  },
  {
    id: 'entry-2026-11-06',
    date: '2026-11-06',
    cycleDay: 2,
    flow: 'medium',
    pain: 2,
    symptoms: ['cramps', 'fatigue'],
    mood: 'reflective',
    note: 'Gentle dusk stroll through the garden. Early bedtime.',
    createdAt: '2026-11-06T19:40:00Z',
  },
  {
    id: 'entry-2026-11-05',
    date: '2026-11-05',
    cycleDay: 1,
    flow: 'heavy',
    pain: 4,
    symptoms: ['cramps', 'backache', 'fatigue'],
    mood: 'sensitive',
    note: 'Period began at dawn. Kept the heat pack close and rested.',
    createdAt: '2026-11-05T08:20:00Z',
  },
  {
    id: 'entry-2026-10-12',
    date: '2026-10-12',
    cycleDay: 5,
    flow: 'spotting',
    pain: 0,
    symptoms: [],
    mood: 'grounded',
    note: 'Energy rising gently as bleeding ends.',
    createdAt: '2026-10-12T10:00:00Z',
  },
  {
    id: 'entry-2026-10-11',
    date: '2026-10-11',
    cycleDay: 4,
    flow: 'light',
    pain: 1,
    symptoms: ['fatigue'],
    mood: 'calm',
    note: 'Light stretching and fresh soup.',
    createdAt: '2026-10-11T14:30:00Z',
  },
  {
    id: 'entry-2026-10-10',
    date: '2026-10-10',
    cycleDay: 3,
    flow: 'medium',
    pain: 2,
    symptoms: ['cramps'],
    mood: 'calm',
    note: 'Noticeable drop in pain by evening, as usual for day 3.',
    createdAt: '2026-10-10T18:15:00Z',
  },
  {
    id: 'entry-2026-10-09',
    date: '2026-10-09',
    cycleDay: 2,
    flow: 'heavy',
    pain: 3,
    symptoms: ['cramps', 'headache'],
    mood: 'low-energy',
    note: 'Took warm baths and stayed off screens.',
    createdAt: '2026-10-09T16:00:00Z',
  },
  {
    id: 'entry-2026-10-08',
    date: '2026-10-08',
    cycleDay: 1,
    flow: 'heavy',
    pain: 4,
    symptoms: ['cramps', 'backache'],
    mood: 'tender',
    note: 'First day arrival. Nourished with bone broth and quiet music.',
    createdAt: '2026-10-08T09:00:00Z',
  },
  {
    id: 'entry-2026-09-14',
    date: '2026-09-14',
    cycleDay: 5,
    flow: 'spotting',
    pain: 0,
    symptoms: [],
    mood: 'grounded',
    note: 'Gentle walk.',
    createdAt: '2026-09-14T11:00:00Z',
  },
  {
    id: 'entry-2026-09-12',
    date: '2026-09-12',
    cycleDay: 3,
    flow: 'medium',
    pain: 1,
    symptoms: ['bloating'],
    mood: 'calm',
    note: 'A quiet, unhurried day.',
    createdAt: '2026-09-12T17:30:00Z',
  },
  {
    id: 'entry-2026-09-10',
    date: '2026-09-10',
    cycleDay: 1,
    flow: 'heavy',
    pain: 3,
    symptoms: ['cramps', 'fatigue'],
    mood: 'sensitive',
    note: 'Heavy flow, warm ginger tea.',
    createdAt: '2026-09-10T08:00:00Z',
  },
];

export interface CycleRhythmRecord {
  month: string;
  days: number;
}

// The newest seed entry is authored on this date; all seed dates are shifted
// so this entry lands on the current day whenever the app is opened.
const SEED_ANCHOR = '2026-11-07';

/** Returns the seed entries shifted so the newest one falls on `todayIso`,
 *  preserving the day-gaps between entries (keeps the demo coherent on any
 *  day it is run). */
export function getSeedEntries(todayIso: string): DailyEntry[] {
  const anchorMs = new Date(`${SEED_ANCHOR}T00:00:00`).getTime();
  const todayMs = new Date(`${todayIso}T00:00:00`).getTime();
  const offsetMs = todayMs - anchorMs;
  if (offsetMs === 0) return initialEntries;
  return initialEntries.map((entry) => {
    const newDateMs = new Date(`${entry.date}T00:00:00`).getTime() + offsetMs;
    const createdAtMs = entry.createdAt
      ? new Date(entry.createdAt).getTime() + offsetMs
      : newDateMs;
    return {
      ...entry,
      id: `entry-${toLocalIso(new Date(newDateMs))}`,
      date: toLocalIso(new Date(newDateMs)),
      createdAt: new Date(createdAtMs).toISOString(),
    };
  });
}

export const cycleHistoryCadence: CycleRhythmRecord[] = [
  { month: 'Jun', days: 28 },
  { month: 'Jul', days: 29 },
  { month: 'Aug', days: 28 },
  { month: 'Sep', days: 28 },
  { month: 'Oct', days: 28 },
];
