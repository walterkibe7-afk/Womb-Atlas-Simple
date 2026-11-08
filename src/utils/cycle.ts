import { CyclePhase, DailyEntry, FlowLevel, Symptom, Mood, LifeStage } from '../types';

export function determineCyclePhase(
  cycleDay: number,
  cycleLength = 28,
  periodLength = 5
): CyclePhase {
  if (cycleDay <= periodLength) {
    return 'menstrual';
  }
  if (cycleDay < Math.floor(cycleLength / 2) - 1) {
    return 'follicular';
  }
  if (cycleDay <= Math.floor(cycleLength / 2) + 2) {
    return 'ovulatory';
  }
  return 'luteal';
}

export function getPhaseDetails(phase: CyclePhase, cycleDay: number) {
  switch (phase) {
    case 'menstrual':
      return {
        label: `Day ${cycleDay} · Menstrual phase`,
        nurtureText:
          'Your body is resting and clearing space. Be gentle with your pace today.',
        element: 'Earth & Water',
      };
    case 'follicular':
      return {
        label: `Day ${cycleDay} · Follicular phase`,
        nurtureText:
          'Energy is softly returning like morning light. Welcome new ideas quietly.',
        element: 'Air & Renewal',
      };
    case 'ovulatory':
      return {
        label: `Day ${cycleDay} · Ovulatory phase`,
        nurtureText:
          'Your vitality and warmth are at their peak. A time of openness and connection.',
        element: 'Fire & Warmth',
      };
    case 'luteal':
      return {
        label: `Day ${cycleDay} · Luteal phase`,
        nurtureText:
          'Turning inward to protect your peace. Slower rhythms will nourish you best.',
        element: 'Earth & Grounding',
      };
  }
}

export function getGreeting(userName = 'Achieng', date = new Date()): string {
  const hour = date.getHours();
  const nameToUse = userName.trim() || 'Achieng';
  if (hour >= 5 && hour < 12) {
    return `Good morning, ${nameToUse}`;
  }
  if (hour >= 12 && hour < 17) {
    return `Good afternoon, ${nameToUse}`;
  }
  return `Good evening, ${nameToUse}`;
}

export function calculateCycleDayFromDate(
  lastPeriodStartStr?: string,
  todayStr = '2026-11-07',
  cycleLength = 28
): number | null {
  if (!lastPeriodStartStr) return null;

  const [tY, tM, tD] = todayStr.split('-').map(Number);
  const [sY, sM, sD] = lastPeriodStartStr.split('-').map(Number);

  const today = new Date(tY, tM - 1, tD);
  const startDate = new Date(sY, sM - 1, sD);

  const diffMs = today.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 1; // date in future, fallback to day 1

  return (diffDays % cycleLength) + 1;
}

export function generateGentleInsight(
  entries: DailyEntry[],
  currentDay: number | null,
  isHormonalBirthControl = false,
  lifeStage?: LifeStage
): string {
  if (isHormonalBirthControl) {
    return 'With hormonal support, your bleeding cadence is gently held by steady hormone levels.';
  }

  if (lifeStage === 'postpartum') {
    return 'Your body is tenderly resting and finding its natural baseline after birth.';
  }

  if (lifeStage === 'perimenopause') {
    return 'Fluctuating rhythms are natural in this transitional season of wisdom.';
  }

  if (currentDay === null) {
    return 'The Atlas will begin charting your rhythm as soon as you record your first period.';
  }

  if (currentDay === 3) {
    return 'Your pain is usually lighter on day 3 of your period';
  }
  if (currentDay <= 2) {
    return 'Warm baths and warm drinks soften uterine tension on heavy flow days';
  }
  if (currentDay <= 5) {
    return 'Your flow is naturally tapering. Iron-rich foods gently restore vitality';
  }
  if (currentDay > 20) {
    return 'Progesterone levels encourage deeper sleep and quiet evening boundaries';
  }
  return 'Your cycle has held a steady 28-day cadence over recent months';
}

export function summarizeEntry(entry: DailyEntry): string {
  const parts: string[] = [];

  if (entry.flow && entry.flow !== 'none') {
    const flowMap: Record<FlowLevel, string> = {
      none: '',
      spotting: 'Spotting',
      light: 'Light flow',
      medium: 'Medium flow',
      heavy: 'Heavy flow',
    };
    parts.push(flowMap[entry.flow]);
  }

  if (entry.pain > 0) {
    const painMap: Record<number, string> = {
      1: 'Very mild ache',
      2: 'Noticeable ache',
      3: 'Moderate cramps',
      4: 'Intense cramps',
      5: 'Rest required',
    };
    parts.push(painMap[entry.pain] || `Pain ${entry.pain}/5`);
  } else if (entry.flow === 'none' && entry.symptoms.length === 0) {
    parts.push('Quiet day');
  }

  if (entry.symptoms.length > 0) {
    const symptomLabels: Record<Symptom, string> = {
      cramps: 'Cramps',
      'tender-breasts': 'Tender breasts',
      fatigue: 'Fatigue',
      headache: 'Headache',
      bloating: 'Bloating',
      backache: 'Backache',
    };
    parts.push(symptomLabels[entry.symptoms[0]]);
  }

  if (entry.mood) {
    const moodLabels: Record<Mood, string> = {
      calm: 'Calm',
      reflective: 'Reflective',
      sensitive: 'Sensitive',
      'low-energy': 'Low energy',
      grounded: 'Grounded',
      tender: 'Tender',
    };
    parts.push(moodLabels[entry.mood]);
  }

  return parts.length > 0 ? parts.join(' · ') : 'Gentle rhythm recorded';
}

export function formatFriendlyDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatFullDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
