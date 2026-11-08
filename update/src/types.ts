export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export type FlowLevel = 'spotting' | 'light' | 'medium' | 'heavy' | 'none';

export type Symptom =
  | 'cramps'
  | 'tender-breasts'
  | 'fatigue'
  | 'headache'
  | 'bloating'
  | 'backache';

export type Mood =
  | 'calm'
  | 'reflective'
  | 'sensitive'
  | 'low-energy'
  | 'grounded'
  | 'tender';

export interface DailyEntry {
  id: string;
  date: string; // ISO YYYY-MM-DD
  cycleDay: number;
  flow: FlowLevel;
  pain: number; // 0 to 5
  symptoms: Symptom[];
  mood?: Mood;
  note?: string;
  createdAt?: string;
}

export interface CycleSummary {
  currentCycleDay: number;
  phase: CyclePhase;
  phaseName: string;
  phaseNurtureText: string;
  gentleInsight: string;
  cycleLength: number;
  periodLength: number;
}

export type LifeStage =
  | 'currently-cycling'
  | 'postpartum'
  | 'perimenopause'
  | 'pregnant-recovering'
  | 'not-sure';

export interface UserProfile {
  passcodeSet: boolean;
  passcode?: string;
  userName: string;
  lastPeriodStart?: string; // YYYY-MM-DD
  lifeStage?: LifeStage;
  cycleLength: number; // 21 - 35, default 28
  periodLength: number; // 2 - 7, default 5
  usesHormonalBirthControl: boolean;
  hasCompletedOnboarding: boolean;
}
