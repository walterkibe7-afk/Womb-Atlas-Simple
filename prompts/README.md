# Womb Atlas Simple — backend build prompts (for subagents)

The app now has a REAL backend (user decision 2026-11-08): Postgres in podman +
an axum (Rust) API + the existing Vite SPA on top. The parent session designed the
tables, API contract, and ports; these prompts hand each build step to a
dedicated subagent. **The user calls the agents**, not the parent session.

## Architecture (see `00-backend-architecture.md` for the full contract)

| Service | Where | Port |
|---|---|---|
| Vite SPA (frontend, untouched UI) | repo root | 3000 |
| Rust API (axum + tokio + sqlx) | `backend/` cargo project | 4001 |
| Postgres 16 (podman, WSL machine) | `compose.yaml` at root | host 5433 → container 5432 (5432 is occupied by the old project's DB — do not touch) |

## Call order — SEQUENTIAL (real dependencies at each step)

| Order | File | Agent builds | You own ONLY |
|---|---|---|---|
| 1 | `01-infra-podman.md` | podman Postgres up on 5433 | `compose.yaml`, `backend/.env(.example)`, `backend/README.md` |
| 2 | `02-db-schema.md` | 4 tables, 3 enums, sqlx migrations, seed | `backend/migrations/`, `backend/src/seed.rs`, `backend/Cargo.toml` (seed-bin deps) |
| 3 | `03-api-server.md` | Rust API implementing the full contract, curl-proven | `backend/src/**` (server), extends `backend/Cargo.toml` |
| 4 | `04-frontend-wiring.md` | SPA talks to the API (token unlock, persistence) | `src/lib/api.ts`, `src/App.tsx` |
| 5 | `05-accounts.md` | real accounts, enum fixes, migrate/seed from image, unlock→onboarding routing | `backend/migrations/0002_accounts.sql`, `backend/src/auth.rs`, `backend/src/error.rs`, `backend/src/validate.rs`, `backend/src/routes/auth.rs`, `backend/src/routes/me.rs`, `backend/src/seed.rs`, `backend/src/migrate.rs`, `backend/Containerfile`, `src/lib/api.ts`, `src/App.tsx`, `src/components/onboarding/UnlockScreen.tsx`, `AGENTS.md`, `prompts/00-backend-architecture.md`, `prompts/README.md`, `backend/README.md` |

 Unlike the earlier localStorage plan (archived in `archive-localstorage/`),
these steps cannot run in parallel: each one consumes the previous agent's
running output (DB → applied migrations → live API). Call one, check its report,
call the next.

## Hard rules for every agent (also stated in each prompt)

1. Touch ONLY the files listed in "You own these files".
2. The API contract in `00-backend-architecture.md` is binding — no invented
   endpoints, no renamed fields, no extra tables/columns.
3. Data-collection scope stays locked: name REQUIRED; NO age/DOB, NO family/
   pregnancy/medical history, nothing beyond the 4 tables. The server
   re-validates every range.
4. The pin is NEVER stored plain, neither in DB, localStorage, nor logs.
5. No new npm dependencies except those the prompts name.
6. Every agent verifies its own work (lint/build + the prompt's acceptance
   list) and reports statuses + files + deviations — not prose.

## Reference material

- Cheat sheets index (TypeScript, JavaScript, SQL, Linux): https://cheat-sheets.org/
- Rust book: https://doc.rust-lang.org/book/ · axum: https://docs.rs/axum · sqlx: https://docs.rs/sqlx
- Argon2 crate (pin hashing): https://docs.rs/argon2
- Web/API/DB docs: see the per-prompt links
- Product contract: `AGENTS.md` (the "Locked decisions" section is binding)
- `prompts/00-backend-architecture.md`: THE schema + contract (read this first)
- `prompts/00-backend-architecture.md` — supersedes the earlier localStorage-only plan
