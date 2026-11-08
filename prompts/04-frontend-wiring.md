# Agent B4 — Frontend wiring to the API (src/lib/api.ts + src/App.tsx) — RUN LAST

You are wiring the **Womb Atlas Simple** frontend (Vite + React + TS SPA at
repo root) to its new backend API. Run from the repo root.

Prerequisites (previous agents completed these — if missing, STOP and report):
- API live on `http://localhost:4001` implementing the contract in
  `prompts/00-backend-architecture.md` (health/setup/session/me/entries)
- DB migrated + demo user seeded (agent B2), API server reachable (agent B3)
Read first: `prompts/00-backend-architecture.md` (API contract), `AGENTS.md`,
`src/App.tsx`.

Reference: https://cheat-sheets.org/ (TypeScript / JavaScript), fetch on
https://developer.mozilla.org/en-US/docs/Web/API/fetch

## You own these files (create/modify; nothing else)

- `src/lib/api.ts` (new)
- `src/App.tsx` (edits only)
- (ONLY if strictly necessary: tiny edits inside onboarding components so the
  unlock/verify callbacks can await promises — state your usage in the report;
  do not change their visual design)

Never redesign UI: colors, motion, copy stay as-is. The reviewer nav ("Flow
preview" pills, viewport switcher, "Reset first-run flow") stays.

## `src/lib/api.ts` — typed fetch client

- `const API_BASE = 'http://localhost:4001'` (later: import.meta.env override).
- Export small functions mirroring the contract 1:1, e.g.
  `getHealth`, `setup(pin)`, `createSession(pin)`, `getMe()`, `updateMe(patch)`,
  `listEntries({from,to}?)`, `putEntry(date, entry)`, `deleteEntry(date)`,
  `deleteSession()`.
- Every call: JSON in/out, `Authorization` header attached from a token
  injected via a module-level `setToken(token)`; 4xx → typed
  `ApiError {status, message}`; network failure → same shape as a
  client-side degradation, never an unhandled rejection.
- Expose `TokenStore` helpers: `saveToken/loadToken/clearToken` using
  `sessionStorage` key `wombatlas:v1:api-token` (session-scoped unlock variant
  of the previous plan — token replacement, NOT a passcode table).

## `src/App.tsx` — behavioral rework

1. **Session state machine (replace the pin/profile-side local flow):**
   - On mount: `getHealth()`; then read token → `getMe()`.
     - 200 → hydrate `userProfile` + `entries` (from `/api/me` + `/api/entries`)
       → straight to home (unlock already held by the token).
     - 401/no token → if `POST /api/setup` would 409 (ask health? NO — health
       must not leak setup state). Instead: attempt `createSession` only when
       the user enters a pin. Simplest: onboarding unlocks → setup-vs-login
       disambiguated by API status:
       - first run: `setup(pin)` fails 409 → user must have been set up before
         → treat as login attempt via `createSession(pin)`.
       - Implement helper `setupOrLogin(pin)` in api.ts attempting setup then
         falling back to session; the UnlockScreen's `onPasscodeSet` becomes
         async → resolves token → proceed to onboarding-name.
     - Display-name: user lands with `name` placeholder — after onboarding
       name step, `PUT /api/me {name}` persists it (REQUIRED name rule).
2. **Entries**: `handleSaveEntry` → `putEntry(date, entry)` → use returned
   `{ entry }` to update state atomically (optimistic update acceptable, but
   reconcile with server response). Deletions (History if any) → DELETE.
3. **Profile**: `handleOnboardingComplete` → `updateMe({...})`,
   `handleUpdatePeriodStart` → `updateMe({ lastPeriodStart })`. Rhythm slider
   edits → `updateMe` on finish.
4. **Seed/demo data**: the API seed (agent B2) supplies the demo user's
   entries/profile — frontend no longer uses `getSeedEntries` for this path
   (leave `seedData.ts` untouched; unused imports are fine or removed locally
   in App.tsx only).
5. **Tester reset**: "Reset first-run flow" → frontend-only reset is no longer
   meaningful data-wise; keep the button but repurpose its report line: reset
   state to the unlock screen with a small toast/line in the console that a
   full data reset is an API-side operation (or call DELETE session + clear
   token to simulate a fresh device — choose this).
6. **Failures degrade quietly**: if `getHealth()` fails or a store call errors,
   show nothing new — keep screens functional in memory where the existing
   code already supports it, console.warn details.

## Acceptance criteria

1. Repo root `npm run lint` passes; `cd backend && cargo check` still
   passes (nothing broken across the wire).
2. In-browser journey (`npm run dev` root + backend dev server running):
   - fresh session → health ok → unlock (1234 against seeded user) → onboarding
     → name persists via PUT → period start persists → rhythm persists →
     home phase-mode reflects server data;
   - save an entry → present after reload (token rehydrate) AND in Postgres
     (show the row via `podman exec … psql` or agent B3's curl snippet);
   - calendar phase learning-mode when no lastPeriodStart in DB;
   - "Reset first-run flow" → clears token → unlock screen returns.
3. Report: files created/modified, the setup-or-login decision implemented,
   token lifecycle, and the round-trip proof (frontend → API → DB → API →
   frontend).
