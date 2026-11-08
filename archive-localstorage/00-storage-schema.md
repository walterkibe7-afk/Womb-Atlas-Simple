# Storage schema — the "tables" (single source of truth)

Womb Atlas Simple is a local-first Vite + React + TypeScript SPA. There is no
server, no database, no accounts. Persistence is `localStorage` (+
`sessionStorage` for short-lived session state). This document defines the
"tables" — namespaced localStorage keys, their exact JSON shapes, and the
envelope every table uses. Agents must match these shapes exactly.

## 1. Key registry (defined once in `src/storage/schema.ts`)

All keys are namespaced to guarantee zero collisions with anything else in the
browser:

| Table | Storage | Key | Written by |
|---|---|---|---|
| Profile | localStorage | `wombatlas:v1:profile` | profileStore |
| Passcode | localStorage | `wombatlas:v1:passcode` | passcodeVault |
| Entries | localStorage | `wombatlas:v1:entries` | entriesStore |
| Unlock session flag | sessionStorage | `wombatlas:v1:unlocked` | passcodeVault |

Types (to be exported from `schema.ts` by agent 1):

```ts
export const STORAGE_KEYS = {
  profile: 'wombatlas:v1:profile',
  passcode: 'wombatlas:v1:passcode',
  entries: 'wombatlas:v1:entries',
} as const;

export const SESSION_KEYS = {
  unlocked: 'wombatlas:v1:unlocked',
} as const;
```

## 2. Envelope (every table's stored value)

Every table's value is a JSON object with this envelope, so future migrations
are possible without ambiguity:

```ts
export interface StorageEnvelope<T> {
  schema: string;        // e.g. 'wombatlas/v1/profile'
  version: 1;            // integer schema version
  updatedAt: string;     // ISO-8601 timestamp (UTC) of last write
  data: T;               // the table's payload, typed below
}
```

When reading: if `localStorage.getItem(key)` is null/empty → treat as empty
table (return null). If JSON.parse throws, or `schema` does not match the
expected value, or `version !== 1` → treat as corrupt: remove the key and
return null (never crash the app over its own diary data).

## 3. Profile table — `wombatlas/v1/profile`

`data` payload mirrors `UserProfile` from `src/types.ts` (read that file; import
the type — do not redefine it, do not modify it). Serialized form disables
duplicated passcode fields; the passcode lives in its own table. Stored profile
shape:

```ts
// All of these already exist in src/types.ts (UserProfile).
// This table persists a projection of UserProfile WITHOUT passcode fields:
{
  userName: string;                    // required (locked decision)
  lastPeriodStart?: string;            // 'YYYY-MM-DD' or absent = learning mode
  lifeStage?: LifeStage;               // 'currently-cycling' | 'postpartum' | 'perimenopause' | 'pregnant-recovering' | 'not-sure'
  cycleLength: number;                 // 21–35, default 28
  periodLength: number;                // 2–7, default 5
  usesHormonalBirthControl: boolean;
  hasCompletedOnboarding: boolean;
  createdAt: string;                   // ISO, set on first save, preserved after
  updatedAt: string;                   // ISO, every write
}
```

Constraints on write: clamp `cycleLength` to [21, 35] and `periodLength` to
[2, 7]; trim `userName`; reject empty `userName` on save returning failure.

## 4. Passcode table — `wombatlas/v1/passcode`

`data` payload:

```ts
{
  passcodeSet: boolean;   // true only after a passcode was set
  hash?: string;          // algorithm-attributed string, PBKDF2
  createdAt?: string;     // ISO, when the passcode was set
}
```

The passcode hash format is:

```
pbkdf2-sha256$<iterations>$<salt base64>$<derivedKey base64>
```

- Algorithm: PBKDF2, SHA-256, 210,000 iterations (OWASP 2023+ base for
  government/no-context is 210k for PBKDF2-HMAC-SHA256), 32-byte derived key,
  random 16-byte salt per set.
- NEVER store the plain passcode anywhere (localStorage, sessionStorage,
  console, errors).
- Any change to the format must update the algorithm prefix, not version numbers.

Session unlock flag (`sessionStorage`): value is the ISO timestamp of unlock.
Its presence means unlocked for this tab session. It dies with the tab; not a
long-lived trust token.

## 5. Entries table — `wombatlas/v1/entries`

`data` payload:

```ts
{
  entries: DailyEntry[];  // exact type from src/types.ts, sorted date DESC, unique by `date`
}
```

- One entry per calendar date (`YYYY-MM-DD`, local timezone via
  `src/utils/cycle.ts` `toLocalIso`) — upsert semantics **replace** the whole
  entry for that date.
- Entry `id` format stays `entry-<date>` (upsert must not duplicate).
- Writing clamps: `pain` to [0,5] (integer), flow to the `FlowLevel` union,
  symptoms to the `Symptom` union, mood to the `Mood` union. Unknown values are
  dropped, not invented.
- The demo seed (`src/data/seedData.ts` `getSeedEntries(todayIso)`) is used only
  when the table is empty AND the envelope key is missing (first run ever) — so
  the prototype still looks alive; it is persisted immediately after seeding so
  the seed never re-applies.

## 6. Independence rules (why the schema is centralized here)

Each table module (`profileStore`, `passcodeVault`, `entriesStore`) only:

1. imports key names + envelope helpers from `src/storage/core.ts`,
2. imports business types read-only from `src/types.ts` / `src/utils/cycle.ts`
   / `src/data/seedData.ts`,
3. imports NOTHING from the other table modules.

This makes agents 2, 3, 4 fully parallel; agent 5 (wiring) consumes all of them.
