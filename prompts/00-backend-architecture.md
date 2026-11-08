# Backend architecture — single source of truth

Womb Atlas Simple gains a REAL backend (user decision 2026-11-08; supersedes
the earlier local-first localStorage plan). The app is:

- **Front end**: the existing Vite + React + TS SPA (unchanged UI, unchanged
  design language) — talks to the API over HTTP on `http://localhost:4001`.
- **API server**: **Rust** (user decision 2026-11-08 — "rust for scaling"; no Python, no Node in the backend) — `axum` + `tokio` + `sqlx`, in `backend/` as a cargo project, port **4001**. Pin hashing via the pure-Rust `argon2` crate (Argon2id).
- **Database**: PostgreSQL 16 in a **podman** container (WSL machine, already
  installed). Host port **5433** (5432 is occupied by the old project's DB).

## Data model (the "tables")

4 tables, per the locked product scope (name REQUIRED; NO age/DOB, NO family/
pregnancy/medical history, no other observatory fields — the "tomorrow's
behavior" test still governs every column):

```
User          Profile (1:1)      Entry (1:N)             Session (N:1)
──────────    ────────────       ─────────────────       ─────────────
id            userId             userId                  id (token hash)
name          lastPeriodStart?   entryDate (DATE)        userId
pinHash       lifeStage? enum    cycleDay Int            createdAt
createdAt     cycleLength 28     flow enum               expiresAt
updatedAt     periodLength 5     pain Int [0..5]         (unique: token hash)
              usesHormonalBC     symptoms String[]
              hasCompletedOB     mood? enum
                                 note? ≤2000
                                 createdAt, updatedAt
                                 unique(userId, entryDate)
```

Enums (both DB and API validation):

- `LifeStage`: currently-cycling | postpartum | perimenopause | pregnant-recovering | not-sure
- `Flow`: spotting | light | medium | heavy | none
- `Mood`: calm | reflective | sensitive | low-energy | grounded | tender

Ranges: cycleLength 21–35 (default 28), periodLength 2–7 (default 5),
pain 0–5 integer, cycleDay 1–35, symptoms ⊆ enum, note ≤ 2000 chars.

Validation authority: the API re-clamps/rejects everything; the frontend
trusting the API is fine.

## API contract (fixed — frontend and agents code against this)

Base: `http://localhost:4001`. auth = `Authorization: Bearer <token>`.
All bodies JSON; errors `{ error: string }` with proper status codes.

| Method | Path | Auth | Body | Success | Notes |
|---|---|---|---|---|---|
| GET | `/api/health` | – | – | `{ ok: true }` | no DB dependency required |
| POST | `/api/setup` | – | `{ pin }` (4–12 digits) | 201 `{ token, user {id, name: "" } }` | **first run only**; 409 if a user with pinHash exists |
| POST | `/api/session` | – | `{ pin }` | 200 `{ token, user }` | unlock; 401 wrong pin; 409 no setup yet |
| GET | `/api/me` | ✓ | – | `{ user {id,name}, profile {...} }` | profile defaults if unused |
| PUT | `/api/me` | ✓ | any of `name?, lastPeriodStart? (YYYY-MM-DD or null), lifeStage?, cycleLength?, periodLength?, usesHormonalBirthControl?, hasCompletedOnboarding?` | `{ user, profile }` | clamps; `name: ""` rejected (name is REQUIRED) |
| GET | `/api/entries` | ✓ | query `?from=YYYY-MM-DD&to=YYYY-MM-DD` (optional) | `{ entries: Entry[] }` | sorted entryDate DESC |
| PUT | `/api/entries/:date` | ✓ | `{ cycleDay, flow, pain, symptoms, mood?, note? }` | 200 `{ entry }` | upsert whole-entry replacement for that date |
| DELETE | `/api/entries/:date` | ✓ | – | `{ ok: true }` | |
| DELETE | `/api/session` | ✓ | – | `{ ok: true }` | explicit lock/logout |

Session token: 32 random bytes → hex. **Only a SHA-256 hash is stored** in
DB (`Session.tokenHash`, unique). Expiry 30 days, checked per request (no
refresh flow in v1). Unlock = holding a valid token in memory (React state).

Pin hashing: **Argon2id** via the pure-Rust `argon2` crate (OWASP baseline:
m = 19 MiB, t = 2, p = 1), random 16-byte salt, stored as
`argon2id$m=19456,t=2,p=1$<saltHex>$<keyHex>` — never the plain pin, never in
logs or errors.

No comments endpoint, no review queue, no roles: **an entry is real the moment
its PUT succeeds.** That is the whole "no steward" decision carried over.

## Ports & processes (dev)

| Service | Port | Started by |
|---|---|---|
| Vite SPA | 3000 | `npm run dev` (root) |
| API server | 4001 | `npm run dev` (in `backend/`) |
| Postgres (podman) | 5433 → container 5432 | `podman compose up -d` (root repo) |
| (old project's DB) | 5432 | leave untouched |

## Folder shapes agents will produce

```
compose.yaml                    ← agent B1 (repo root; postgres service only)
backend/
  .env.example                  ← agent B1
  README.md                     ← agent B1
  Cargo.toml, Cargo.lock        ← agent B3 (axum/tokio/sqlx/serde/…), extended by B2 for the seed bin
  src/main.rs, src/app.rs, …    ← agent B3 (axum server)
  src/seed.rs                   ← agent B2 (demo seeding via sqlx)
  migrations/0001_init.sql, …   ← agent B2 (sqlx migrations, plain SQL)
src/lib/api.ts                 ← agent B4 (frontend fetch client)
src/App.tsx (edits only)       ← agent B4
```

Toolchain facts (verified): `cargo 1.99.1` and `rustc 1.99.1` are installed
natively on this Windows host; Postgres is reachable from Windows at
`127.0.0.1:5433` once agent B1 is done.

## Call order for subagents (real dependencies: sequential)

1. `01-infra-podman.md`  — container up & reachable on 5433
2. `02-db-schema.md`     — sqlx migrations + seed against that DB
3. `03-api-server.md`    — server implementing the contract above, tested end
   to end with curl against the live API
4. `04-frontend-wiring.md` — frontend speaks to the API; localStorage code
   is NOT reintroduced (it never existed — clean pivot)

A privacy note to carry over verbatim: the API holds nothing about a user
except her name, her cycle reference data, and her diary. Any future analytics
must come back to the "tomorrow's behavior" test before a column is added.
