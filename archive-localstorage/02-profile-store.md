# Agent 2 — Profile table (profileStore.ts)

You are building for **Womb Atlas Simple**, a local-first Vite + React +
TypeScript SPA — a private menstrual health diary. No server, no database;
persistence is localStorage. Run from the repo root:
`D:\Web Designs\Womb Atlas Simple`.

Before starting, read:
- `AGENTS.md` ("Locked decisions" section is binding: name REQUIRED, no age/DOB,
  no family/pregnancy/medical history — none of your business here, just don't
  invent extra fields)
- `prompts/00-storage-schema.md` (section 3 is your table; also section 2, envelope)
- `src/types.ts` — `UserProfile`, `LifeStage` (import only)
- `src/storage/core.ts` + `src/storage/schema.ts` — built by a sibling agent;
  code against the exact exports `STORAGE_KEYS`, `SCHEMA_IDS`, `readEnvelope`,
  `writeEnvelope` (Availability: `storageAvailable`).
- Reference: https://cheat-sheets.org/ (TypeScript / JavaScript sections)

## You own this file (create it; modify NOTHING else)

- `src/storage/profileStore.ts`

Do not modify `src/types.ts`, `src/utils/cycle.ts`, or any other existing file.
If `src/storage/core.ts` does not exist yet, STOP and report — agent 1 must run
first.

## Exact API (integration code will assume these verbatim)

```ts
import type { LifeStage, UserProfile } from '../types';

/** Defaults per the locked spec. createdAt/updatedAt added on first save. */
export const DEFAULT_PROFILE: Omit<UserProfile, 'passcodeSet'> & {
  passcodeSet?: never; // never include passcode fields in this table
  userName: string;
  lastPeriodStart?: undefined;
  lifeStage?: undefined;
  cycleLength: 28;
  periodLength: number; // 5
  usesHormonalBirthControl: false;
  hasCompletedOnboarding: false;
  createdAt?: string;
  updatedAt?: string;
};
```

Shape the exported profile type as a dedicated, exported interface (do not
re-declare inline — keep it clean and reusable by the wiring agent):

```ts
export interface StoredProfile {
  userName: string;
  lastPeriodStart?: string;
  lifeStage?: LifeStage;
  cycleLength: number;        // clamped 21–35
  periodLength: number;       // clamped 2–7
  usesHormonalBirthControl: boolean;
  hasCompletedOnboarding: boolean;
  createdAt: string;
  updatedAt: string;
}
```

Functions (all synchronous, all non-throwing):

```ts
/** Loads the profile table, or null when absent/corrupt/unavailable. */
export function loadProfile(): StoredProfile | null;

/** Validates + clamps + persists. Returns the StoredProfile on success,
 *  null on failure (unavailable storage, empty userName). Preserves the
 *  original createdAt when overwriting an existing record. */
export function saveProfile(
  input: Omit<StoredProfile, 'createdAt' | 'updatedAt'>
): StoredProfile | null;

/** Convenience for partial updates (e.g. only cycleLength changed).
 *  Merges onto the loaded record; null when nothing to merge onto. */
export function updateProfile(
  patch: Partial<Omit<StoredProfile, 'createdAt' | 'updatedAt'>>
): StoredProfile | null;

/** Deletes the table (self-serve reset). */
export function clearProfile(): void;
```

Mappings you must implement:

- IN (localStorage → profile): the stored shape is exactly `StoredProfile`;
  sanitize on read: trim `userName` (non-empty string else treat as corrupt →
  return null), clamp `cycleLength`/`periodLength`, coerce boolean, validate
  `lifeStage` against the 5-value union (drop if invalid), validate
  `lastPeriodStart` as `YYYY-MM-DD` string only (no Date math here).
- OUT (profile → localStorage): reject empty `userName` (locked decision:
  name is required — the UI already enforces disabled-Continue; the store is
  the backstop). Never persist passcode fields (they live in their own table).

Never store, log, or expose anything beyond the schema in
`prompts/00-storage-schema.md`.

## Acceptance criteria

1. `npm run lint` passes with zero new errors; `npm run build` passes.
2. A quick scenario you can demonstrate in devtools or a scratch run (do not
   commit scratch files): app loaded → profile table key exists after a save →
   reload → load returns the same record with values clamped.
3. Report: file created, exact exported API, and lint/build results.
