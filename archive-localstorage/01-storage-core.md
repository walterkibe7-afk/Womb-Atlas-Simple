# Agent 1 — Storage core (schema.ts + core.ts)

You are building for **Womb Atlas Simple**, a local-first Vite + React +
TypeScript SPA — a private menstrual health diary. There is no server and no
database; persistence is localStorage + sessionStorage. React 19, TypeScript
strict mode, Tailwind v4. Run from the repo root: `D:\Web Designs\Womb Atlas Simple`.

Before starting, read these files for context:
- `AGENTS.md` (product contract; "Locked decisions" is binding)
- `prompts/00-storage-schema.md` — the schema you must implement exactly
- `src/types.ts` — existing business types (import only)
- Useful background/reference: https://cheat-sheets.org/ (see its TypeScript and
  JavaScript sections) and https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

## You own these files (create them; modify nothing else)

- `src/storage/schema.ts`
- `src/storage/core.ts`

Every other agent depends on the exact exports below. Do not rename or reshape
them, and never import from sibling table modules (`profileStore`,
`passcodeVault`, `entriesStore`) — you are their shared floor.

## File 1: `src/storage/schema.ts`

```ts
// Key registry — exact values from the schema doc:
export const STORAGE_KEYS = {
  profile: 'wombatlas:v1:profile',
  passcode: 'wombatlas:v1:passcode',
  entries: 'wombatlas:v1:entries',
} as const;

export const SESSION_KEYS = {
  unlocked: 'wombatlas:v1:unlocked',
} as const;

// Envelope used by every table:
export interface StorageEnvelope<T> {
  schema: string;
  version: 1;
  updatedAt: string; // ISO-8601 (UTC) of last write
  data: T;
}

// Table identifiers for the `schema` field:
export const SCHEMA_IDS = {
  profile: 'wombatlas/v1/profile',
  passcode: 'wombatlas/v1/passcode',
  entries: 'wombatlas/v1/entries',
} as const;
```

## File 2: `src/storage/core.ts`

Exact API (other agents code against this — keep names/signatures verbatim):

```ts
/** True when localStorage is readable+writable (SSR/plain files guard included). */
export function storageAvailable(): boolean;

/** Reads and validates an envelope. Returns null when:
 *  - the key is absent/empty
 *  - JSON.parse throws
 *  - envelope.schema !== expectedSchemaId, or version !== 1
 *  On corruption it REMOVEs the corrupt key (self-heal) and returns null.
 */
export function readEnvelope<T>(
  key: string,
  expectedSchemaId: string
): StorageEnvelope<T> | null;

/** Wraps data in an envelope (updatedAt = now ISO) and persists.
 *  Returns false (and leaves existing data intact) when storage is unavailable
 *  or the write throws (quota, privacy mode). */
export function writeEnvelope<T>(
  key: string,
  expectedSchemaId: string,
  data: T
): boolean;

/** Reads a raw sessionStorage string (null if absent). */
export function readSession(key: string): string | null;

/** Writes a raw sessionStorage string; returns success. */
export function writeSession(key: string, value: string): boolean;

/** Removes a session key. */
export function clearSession(key: string): void;
```

Implementation notes:

- All access guarded with try/catch — a full quota or disabled storage must
  degrade to "no persistence", never throw up into app code.
- `updatedAt` = `new Date().toISOString()`.
- No timestamp parsing helpers needed here; consumers own their data.

## Acceptance criteria (run all before reporting)

1. `npm run lint` (tsc --noEmit) passes with zero new errors.
2. `npm run build` passes.
3. Scratch-verify in a browser console or a temporary test run that:
   - writing then reading round-trips an envelope intact;
   - a deliberately corrupt value under a known key is removed and reported null;
   - with cookies/storage disabled (simulate by try/catch), functions degrade
     without throwing. (A tiny manual devtools test is fine; do not commit test
     throwaway files.)
4. Report back: files created, the exact exported signatures, and lint result.
