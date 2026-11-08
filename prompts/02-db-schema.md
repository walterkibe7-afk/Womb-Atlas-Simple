# Agent B2 — Database schema (sqlx migrations) + seed

You are building the data layer for **Womb Atlas Simple**, a private menstrual
health diary. Run from the repo root: `D:\Web Designs\Womb Atlas Simple`.

Prerequisites (a previous agent completed these — if missing, STOP and report):
- healthy Postgres on **127.0.0.1:5433** via podman (`compose.yaml` at repo root)
- `backend/.env` present (a sibling agent created it from `.env.example`)
Read first: `prompts/00-backend-architecture.md` (data model section is
binding), `AGENTS.md` ("Locked decisions": name REQUIRED; NO age/DOB, NO
family/pregnancy/medical history columns — do not add any).

Reference: https://cheat-sheets.org/ (SQL, Rust sections);
https://docs.rs/sqlx (sqlx crate); https://www.postgresql.org/docs/

Build-and-run facts (updated 2026-11-08): backend builds go through podman —
`podman build -t womb-atlas-backend ./backend` (see `backend/Containerfile`).
No MSVC Build Tools / Windows SDK / GNU toolchain needed on the Windows host.
The DB answers on the host at `127.0.0.1:5433`.

## You own these files (create/modify; nothing else)

- `backend/migrations/0001_init.sql`   (sqlx-migrate naming)
- `backend/src/seed.rs`
- `backend/Cargo.toml`                 (CREATE it; seed-bin deps only — agent B3
                                        extends it later for the server)

Do NOT create the API server, main.rs server code, frontend files, or anything
else. If `backend/.env` or the DB is missing, stop and report (agent B1).

## Cargo.toml (minimal, seed-only)

```toml
[package]
name = "womb-atlas-backend"
version = "0.1.0"
edition = "2021"

[dependencies]
sqlx    = { version = "0.8", features = ["runtime-tokio", "tls-rustls", "postgres", "chrono", "migrate"] }
tokio   = { version = "1", features = ["macros", "rt-multi-thread"] }
chrono  = { version = "0.4", features = ["serde"] }
anyhow  = "1"
serde   = { version = "1", features = ["derive"] }
serde_json = "1"          # needed by agent B3 later; harmless here
argon2  = "0.5"           # needed later for seeder verification parity; harmless here
uuid    = { version = "1", features = ["v4", "serde"] }

# seed binary
[[bin]]
name = "seed"
path = "src/seed.rs"

[profile.dev]
opt-level = 0
```

(If a crate version has moved on, pick the current stable one — but keep the
feature sets: `tls-rustls` so no OpenSSL link errors on Windows.)

## Migration `0001_init.sql` — implement EXACTLY this shape as plain SQL

```sql
-- enums
CREATE TYPE life_stage AS ENUM ('currently_cycling','postpartum','perimenopause','pregnant_recovering','not_sure');
CREATE TYPE flow AS ENUM ('spotting','light','medium','heavy','none');
CREATE TYPE mood AS ENUM ('calm','reflective','sensitive','low_energy','grounded','tender');

CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(80) NOT NULL,                  -- REQUIRED (no nameless user)
  pin_hash   VARCHAR(160),                          -- 'argon2id$m=19456,t=2,p=1$<saltHex>$<keyHex>', NULL until setup
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE profiles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  last_period_start DATE,
  life_stage   life_stage,
  cycle_length INTEGER NOT NULL DEFAULT 28 CHECK (cycle_length BETWEEN 21 AND 35),
  period_length INTEGER NOT NULL DEFAULT 5 CHECK (period_length BETWEEN 2 AND 7),
  uses_hormonal_birth_control BOOLEAN NOT NULL DEFAULT FALSE,
  has_completed_onboarding BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE entries (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  cycle_day  INTEGER NOT NULL CHECK (cycle_day BETWEEN 1 AND 35),
  flow       flow NOT NULL,
  pain       INTEGER NOT NULL CHECK (pain BETWEEN 0 AND 5),
  symptoms   TEXT[] NOT NULL DEFAULT '{}',
  mood       mood,
  note       VARCHAR(2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, entry_date)
);
CREATE INDEX idx_entries_user_date ON entries (user_id, entry_date DESC);

CREATE TABLE sessions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash VARCHAR(64) NOT NULL UNIQUE,           -- sha256 hex of the bearer token
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_sessions_user ON sessions (user_id);

-- updated_at touch triggers for users/profiles/entries (simple trigger fn)
```

(DB-level CHECK constraints back the API clamps; the API re-validates too.)

## Seed — `backend/src/seed.rs` (dev-only demo data)

One demo user `Achieng` with:
- completed profile: plausible `last_period_start` relative to today (fresh
  from the DB clock, not hardcoded), `currently_cycling`, 28/5
- ~6 demo entries in the UI's story-arc (3 days of a period ~2 days ago at
  declining pain, then a second cycle 28 days back) with gentle note text in
  the tone of `src/data/seedData.ts` at the repo root (read it for tone; do not
  import — it's TypeScript)
- Connect string from the `DATABASE_URL` env var (`dotenv` crate acceptable,
  or read via std::env after the agent documents how it loads .env — simplest:
  read the file manually, no dotenv dependency unless needed)
- **Idempotent**: if any user row with `name='Achieng'` exists, print
  "Already seeded." and exit 0. Refuse to seed if OTHER users exist (report and
  exit non-zero without inserting).

## Procedure

1. Verify DB reachable (e.g. the seed run via the container fails cleanly
   with a clear connection error before migrate, or `podman exec` psql `\dt`).
2. Apply migrations with `sqlx` — via `sqlx-cli` if available
   (`sqlx migrate run`) else via a tiny `migrate` bin in seed.rs calling
   `sqlx::migrate!("./migrations")` (document which path you took).
3. Run the seed twice via the container (with `-e DATABASE_URL` targeting
   `host.containers.internal:5433`) → second run prints "Already seeded."
4. `podman build ./backend` succeeds with zero warnings in YOUR code
   (warnings surface in the build log).

## Acceptance criteria

1. 4 tables + 3 enums exist in the podman Postgres (prove via `podman exec ...
   psql ... \dt` / `\dT+`), indexes + checks + triggers present.
2. Seed ran; second run idempotent; demo rows visible in psql.
3. `podman build ./backend` passes; build log carries zero warnings in YOUR
   code.
4. Nothing outside `backend/migrations/`, `backend/src/seed.rs`,
   `backend/Cargo.toml`(+lock) was created or modified.
5. Report: files created, migration mechanism used, seed output, `\dt`/`\dT+`
   summary, and any version drift you had to apply.
