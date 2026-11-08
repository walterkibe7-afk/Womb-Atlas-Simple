# Agent 5 — Wire the stores into the app (App.tsx only) — RUN LAST

You are building for **Womb Atlas Simple**, a local-first Vite + React +
TypeScript SPA — a private menstrual health diary. Run from the repo root:
`D:\Web Designs\Womb Atlas Simple`.

This task depends on four sibling agents' completed outputs (if any of these
files/exports are missing, STOP and report — they must run first):
- `src/storage/schema.ts`, `src/storage/core.ts` (agent 1)
- `src/storage/profileStore.ts` — `loadProfile`, `saveProfile`, `updateProfile`, `clearProfile`, `StoredProfile` (agent 2)
- `src/storage/passcodeVault.ts` — `hasPasscode`, `setPasscode`, `verifyPasscode`, `rememberUnlocked`, `isUnlocked`, `lockNow`, `clearPasscode` (agent 3)
- `src/storage/entriesStore.ts` — `loadEntries`, `upsertEntry`, `deleteEntry`, `clearEntries`, `seedIfEmpty` (agent 4)

Read first: `AGENTS.md`, `prompts/00-storage-schema.md`, and the current
`src/App.tsx`.

## You own this file (modify ONLY this application file)

- `src/App.tsx`

Do NOT redesign any screen. Colors, motion, copy, and component files stay
untouched. No new dependencies. No server calls. The reviewer conveniences
(viewport switcher, "Flow preview" pills, "Reset first-run flow") stay.

## What to implement (behavioral changes only)

### 1. Hydrate once on mount
- `entries` state initializes from `loadEntries()` (which already seeds for
  first-run demo) — replacing the current `getSeedEntries(TODAY_ISO)` init.
- `userProfile` state initializes from `loadProfile()`, else the same reset
  defaults already present in the file (keep `TODAY_ISO`/`DEMO_PERIOD_START`
  demo behavior ONLY when there is no stored profile).

### 2. Persist on change
- `handleSaveEntry` → build the entry exactly as today, then route it through
  `upsertEntry(...)`; use its returned list as `setEntries` state (or fall back
  to in-memory list when the store fails — the app must survive storage
  failures silently).
- Onboarding completion (`handleOnboardingComplete`) → `saveProfile(...)`
  (map the collected fields into the StoredProfile shape — passcode fields
  EXCLUDED, they belong to the vault).
- `handleUpdatePeriodStart` → `updateProfile({ lastPeriodStart })`.
- Every persisted write must update React state too (store return values).

### 3. Unlock gate (small state machine, no new screens)
- On mount: if `hasPasscode()` is true AND `isUnlocked()` is false → start at a
  NEW lightweight unlock view: reuse the existing `UnlockScreen`-mode
  interaction but for verification (reuse the same visual components/patterns
  already in the codebase — you may add ONE small wrapper component inside
  App.tsx or create `src/components/onboarding/VerifyUnlock.tsx` ONLY if the
  cleanliness demands; if created, that file joins your ownership list).
- Passphrase flow already implemented components: `passcodeSet` in profile
  state previously came from onboarding `UnlockScreen` — replace that hand-off
  with the vault: `UnlockScreen`'s `onPasscodeSet` → `await setPasscode(pin)`
  → `rememberUnlocked()` → continue to onboarding/home as before.
- If no passcode → behave exactly as today (no gate).
- Add nothing anywhere about failed-attempt counters (out of scope v1) — a
  failed verify simply leaves the dots cleared.

### 4. Reset first-run flow (tester button)
- Must now ALSO wipe persistence: `clearProfile()`, `clearEntries()`
  (which returns an empty list — then `seedIfEmpty(true)` to re-feed demo data
  so the reviewer still sees a living prototype), `clearPasscode()`.
- Then proceed exactly as the current reset does (state reset + jump to unlock).

### 5. Keep in-memory behavior when storage is unavailable
All store functions are safe/degradable; your job is to gracefully fall back to
the current in-memory behavior when they return null/false, with zero UI
changes and zero thrown errors.

## Acceptance criteria

1. `npm run lint` and `npm run build` pass with zero new errors.
2. Manual journey in the browser (`npm run dev`), verified by you before
   reporting:
   - fresh state → full first-run: unlock (set 1234) → name → period → rhythm →
     Home shows phase-mode; reload the tab → passcode gate appears → after
     entering 1234 → everything (profile + entries) is as you left it;
   - log an entry → reload → still there;
   - change rhythm sliders via reset→onboarding → phase math updates;
   - "Reset first-run flow" → stores wiped → demo re-seeds → clean first-run;
   - denied storage edge: sandbox-check by mocking the store return values —
     the app must still work in-memory (code-path reasoning is acceptable; say
     so in the report).
3. Report: every file changed, exact state-machine wiring, and lint/build
   results. No summary prose beyond that.
