# Agent 3 — Passcode table + unlock session (passcodeVault.ts)

You are building for **Womb Atlas Simple**, a local-first Vite + React +
TypeScript SPA — a private menstrual health diary. No server; persistence is
localStorage; the unlock state is sessionStorage. Run from the repo root:
`D:\Web Designs\Womb Atlas Simple`.

Before starting, read:
- `AGENTS.md` ("Locked decisions": a passcode must be HASHED before any
  persistence, NEVER stored in plain text)
- `prompts/00-storage-schema.md` (section 4 is your table; also section 2)
- `src/storage/core.ts` + `src/storage/schema.ts` — built by a sibling agent;
  code against the exact exports: `STORAGE_KEYS`, `SESSION_KEYS`,
  `SCHEMA_IDS`, `readEnvelope`, `writeEnvelope`, `readSession`, `writeSession`,
  `clearSession`.
- Reference: https://cheat-sheets.org/ (TypeScript / JavaScript sections);
  Web Crypto: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
  (specifically `randomUUID`, `getRandomValues`, `crypto.subtle.importKey`,
  `deriveBits`, `PBKDF2`, and constant-time comparison guidance)

## You own this file (create it; modify NOTHING else)

- `src/storage/passcodeVault.ts`

If `src/storage/core.ts` does not exist yet, STOP and report — agent 1 must run
first. Do not import from profileStore/entriesStore.

## Exact API

```ts
/** Was a passcode ever set? (synchronous, reads the table) */
export function hasPasscode(): boolean;

/** Sets/overwrites the passcode. Hashes with PBKDF2-SHA-256
 *  (210,000 iterations, random 16-byte salt, 32-byte derived key).
 *  Rejects (returns false and stores nothing) on pin shorter than 4 chars
 *  or longer than 12, or non-digit. ASYNC — Web Crypto is async.
 *  Returns the stored StoredPasscode on success. */
export async function setPasscode(pin: string): Promise<StoredPasscode | null>;

/** Verifies a candidate pin against the stored hash. Constant-time compare;
 *  returns false when no passcode exists. ASYNC. */
export async function verifyPasscode(pin: string): Promise<boolean>;

/** Marks this browser tab as unlocked (sessionStorage = unlock ISO time). */
export function rememberUnlocked(): void;

/** Is this tab currently unlocked? (sessionStorage presence check) */
export function isUnlocked(): boolean;

/** Clears the tab's unlock flag (user "lock" action). */
export function lockNow(): void;

/** Deletes the passcode table entirely (self-serve reset path).
 *  Also clears the session unlock flag. */
export function clearPasscode(): void;
```

Stored type (export it):

```ts
export interface StoredPasscode {
  passcodeSet: boolean; // true only after a successful set
  hash?: string;        // 'pbkdf2-sha256$<iterations>$<saltB64>$<dkB64>'
  createdAt?: string;   // ISO, when set
}
```

Implementation notes (binding):

1. **Never** store the plain pin anywhere — not in the table, not in
   sessionStorage, not in logs, not in error messages.
2. Hash format exactly:
   `pbkdf2-sha256$<iterations>$<salt base64>$<derivedKey base64>` (fixed
   iteration constant in code, e.g. `PBKDF2_ITERATIONS = 210_000`).
3. Salt: fresh random 16 bytes per `setPasscode` via `crypto.getRandomValues`.
4. Digest: `crypto.subtle.deriveBits` with PBKDF2 + SHA-256, 32-byte output.
5. Base64 encode/decode helper: implement locally (btoa/atob over Uint8Array) —
   no new dependencies.
6. Constant-time compare: XOR-fold over the byte arrays (or compare a SHA-256
   of both candidates), so timing does not reveal the pin length/prefix.
7. Sync/async split is deliberate: `hasPasscode` is sync (envelope read only);
   `setPasscode`/`verifyPasscode` are async (Web Crypto).
8. When `readEnvelope` returns corrupt/absent → `verifyPasscode` returns false,
   `hasPasscode` returns false; degrade, never throw.

## Acceptance criteria

1. `npm run lint` passes with zero new errors; `npm run build` passes.
2. Demonstrable behaviors (devtools or scratch run — don't commit scratch):
   - set "1234" → `hasPasscode()` true → `verifyPasscode('1234')` true,
     `verifyPasscode('9999')` false;
   - the raw `wombatlas:v1:passcode` value contains NO "1234" substring;
   - `rememberUnlocked()` → `isUnlocked()` true → new tab (different session)
     → `isUnlocked()` false;
   - `clearPasscode()` → back to `passcodeSet: false`.
3. Report: file created, exact exported API, and lint/build results.
