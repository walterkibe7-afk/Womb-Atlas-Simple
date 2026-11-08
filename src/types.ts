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

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  provider: 'google' | 'apple' | 'email' | 'local';
  avatar?: string;
}

export type PeriodFeeling =
  | 'love-hate'
  | 'embarrassed'
  | 'hate'
  | 'understand-better'
  | 'friends';

export interface UserProfile {
  passcodeSet: boolean;
  passcode?: string;
  userName: string;
  currentUser?: AuthUser;
  birthYear?: number;
  discoverySource?: string;
  periodFeeling?: PeriodFeeling;
  agreedToPrivacyPolicy?: boolean;
  agreedToHealthData?: boolean;
  agreedToAppActivity?: boolean;
  periodKnowledge?: 'expert' | 'learning' | 'little' | 'whats-a-period';
  periodsRegular?: 'yes' | 'no' | 'not-sure';
  birthControl?: string;
  healthConditions?: string[];
  knowsDischargeChanges?: 'yes' | 'no';
  cycleSymptoms?: string[];
  todaySymptoms?: string[];
  impactsSleep?: 'yes' | 'no' | 'not-sure';
  mentalHealthImpacts?: string[];
  impactsEnergy?: 'yes' | 'no' | 'not-sure';
  impactsDiet?: 'yes' | 'no' | 'not-sure';
  heightUnit?: 'imperial' | 'metric';
  heightFeet?: number;
  heightInches?: number;
  heightCm?: number;
  weightUnit?: 'metric' | 'imperial';
  weightKg?: number;
  weightLbs?: number;
  hasCommitted?: boolean;
  notificationsAllowed?: boolean;
  selectedPlan?: 'yearly' | 'monthly' | 'trial';
  lastPeriodStart?: string; // YYYY-MM-DD
  lifeStage?: LifeStage;
  cycleLength: number; // 21 - 35, default 28
  periodLength: number; // 2 - 7, default 5
  usesHormonalBirthControl: boolean;
  hasCompletedOnboarding: boolean;
}
