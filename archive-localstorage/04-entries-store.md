# Agent 4 — Entries table (entriesStore.ts)

You are building for **Womb Atlas Simple**, a local-first Vite + React +
TypeScript SPA — a private menstrual health diary. No server; persistence is
localStorage. Run from the repo root: `D:\Web Designs\Womb Atlas Simple`.

Before starting, read:
- `AGENTS.md` ("Locked decisions"; note: entries are real the moment the user
  saves — no moderation, never block on network)
- `prompts/00-storage-schema.md` (section 5 is your table; also section 2)
- `src/types.ts` — `DailyEntry`, `FlowLevel`, `Symptom`, `Mood` (import only)
- `src/utils/cycle.ts` — has `getTodayIso`/`toLocalIso` (import only)
- `src/data/seedData.ts` — has `getSeedEntries(todayIso)` (import only)
- `src/storage/core.ts` + `src/storage/schema.ts` — built by a sibling agent;
  code against `STORAGE_KEYS`, `SCHEMA_IDS`, `readEnvelope`, `writeEnvelope`
- Reference: https://cheat-sheets.org/ (TypeScript / JavaScript sections)

## You own this file (create it; modify NOTHING else)

- `src/storage/entriesStore.ts`

If `src/storage/core.ts` does not exist yet, STOP and report — agent 1 must run
first. Do not import from profileStore/passcodeVault.

## Exact API (all synchronous, all non-throwing)

```ts
/** Loads the entries table. When the table key does not exist at all (first
 *  run ever), seeds it from getSeedEntries(getTodayIso()) and PERSISTS the
 *  seed immediately, so the demo data never re-applies. Returns the entries
 *  sorted by date DESC. */
export function loadEntries(): DailyEntry[];

/** Applies on-device prototype seeding only if the table has never existed.
 *  (loadEntries does this automatically; this fn exists for explicit control.) */
export function seedIfEmpty(force?: boolean): DailyEntry[];

/** Upsert semantics: one entry per `date`, whole-entry replacement.
 *  Sanitizes/clamps first; maintains id as `entry-<date>`; returns the
 *  complete updated list (date DESC) on success, null on failure. */
export function upsertEntry(
  entry: Omit<DailyEntry, 'id' | 'createdAt'>
): DailyEntry[] | null;

/** Deletes the entry for a date (if any) and returns the updated list. */
export function deleteEntry(dateIso: string): DailyEntry[];

/** Wipes the table entirely (self-serve reset). Does NOT re-seed. */
export function clearEntries(): void;
```

Sanitizing on write (binding):

- `date`: must be a `YYYY-MM-DD` string; else reject (return null).
- `pain`: integer clamp to [0, 5].
- `flow`: must be one of `'spotting' | 'light' | 'medium' | 'heavy' | 'none'`;
  drop the entry's flow (treat as 'none') if invalid.
- `symptoms`: filter to the `Symptom` union, dedupe.
- `mood`: keep only if it is a valid `Mood`.
- `note`: trim; keep max 2000 chars; absent/empty → undefined.
- `cycleDay`: integer clamp to [1, 35]; keep undefined if missing/invalid.
- Derive `id` = `entry-<date>` (never trust a passed-in id; there is no id field
  in the Omit anyway).
- `createdAt` for the stored entry: preserve the existing value when
  overwriting a date that already exists; otherwise `new Date().toISOString()`.

Store shape (envelope data): `{ entries: DailyEntry[] }` always sorted by date
DESC and unique by `date`. Return values follow the same invariants. Never
persist anything not in the schema (no prime-age, no history fields).

Export nothing else — integration (agent 5) will map this API onto the app's
`entries` state; you are not to touch App code.

## Acceptance criteria

1. `npm run lint` passes with zero new errors; `npm run build` passes.
2. Demonstrable behaviors (devtools or scratch run — don't commit scratch):
   - fresh load with empty storage → seeds demo entries and persists them
     (localStorage key exists afterwards);
   - reload → data survives, no re-seeding;
   - upsert for today with a full entry → date gets one entry, `id` is
     `entry-<date>`, list stays sorted DESC and unique;
   - invalid payloads (pain 9, bogus flow) clamp/drop instead of throwing;
   - `clearEntries()` empties the table and does not re-seed on next read.
3. Report: file created, exact exported API, and lint/build results.
