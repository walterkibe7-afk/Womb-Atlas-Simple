# Womb Atlas Simple

A calm, private menstrual and reproductive health tracker — participant-side only.
Warm, minimal, mobile-first. Like a caring midwife, not a medical device.

## The product (v1 scope — three screens, nothing else)

1. **Home / Today** — greeting, cycle phase, a gentle insight, quick links to Log and History
2. **Log** — flow, pain, symptoms, mood, one optional note; one step per view; "Save entry"
3. **History** — month calendar with period/pain dots, list of past entries, one simple chart

Explicitly out of scope: multi-step wizards, admin panels, AI chat, translations, data export.

## Stack

- **Frontend**: Vite + React + TypeScript
- **Backend**: Rust (axum + tokio + sqlx) on port 4001
- **Database**: PostgreSQL 16 in podman (host port 5433)
- **Styling**: Tailwind CSS v4
- **Animation**: `motion/react` (Framer Motion)
- **Auth**: Argon2id pin hashing, SHA-256 session tokens (30-day expiry)
- **Data**: Persisted in PostgreSQL; session token in `sessionStorage`

See `AGENTS.md` for the full product contract, design language, and locked decisions.

## Run locally

### Prerequisites
- Podman machine running (`podman machine start`)
- Node.js 20+ (`npm install`)

### Start everything
```bash
# Start Postgres + Rust API
podman compose up -d --build

# Start frontend (in another terminal)
npm run dev
```

Frontend: http://localhost:3000
API: http://localhost:4001

### Database
Postgres runs at `127.0.0.1:5433` (container port 5432). DB name/user: `womb_atlas`.

### Type-check
```bash
npm run lint
```

### Backend build (standalone)
```bash
podman build ./backend
```

## Architecture

```
compose.yaml           # podman services: postgres + backend
backend/
  Containerfile        # multi-stage Rust build (debian:bookworm-slim runtime)
  Cargo.toml           # axum, sqlx, argon2, etc.
  src/
    main.rs            # server entry, graceful shutdown
    app.rs             # router + CORS + auth middleware
    auth.rs            # Argon2id pin, session tokens (sha256)
    state.rs           # AppState with DB pool + retry logic
    routes/            # health, auth (setup/session), me, entries
    validate.rs        # input validation (ranges, enums)
    error.rs           # ApiError with proper HTTP status codes
  migrations/0001_init.sql  # 4 tables + 3 enums
src/
  lib/api.ts           # typed fetch client, sessionStorage token store
  App.tsx              # API-wired session/profile/entries flow
```

## API Contract

Base: `http://localhost:4001`, auth: `Authorization: Bearer <token>`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | – | `{ ok: true }` |
| POST | `/api/setup` | – | First run only: `{ pin }` → 201 `{ token, user }` |
| POST | `/api/session` | – | Unlock: `{ pin }` → 200 `{ token, user }` |
| GET | `/api/me` | ✓ | User + profile |
| PUT | `/api/me` | ✓ | Update profile (name required, ranges clamped) |
| GET | `/api/entries` | ✓ | List entries (opt. `from`/`to`) |
| PUT | `/api/entries/:date` | ✓ | Upsert entry |
| DELETE | `/api/entries/:date` | ✓ | Delete entry |
| DELETE | `/api/session` | ✓ | Explicit logout |

## Milestone-gated deploys

Pushes to `main` trigger Cloudflare Pages builds **only after a named milestone is verified** (lint + build + local E2E click-through). See `docs/DEPLOYMENT.md`.