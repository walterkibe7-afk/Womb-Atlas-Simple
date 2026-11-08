# Agent B1 — Infrastructure: Postgres in podman

You are building the backend foundation for **Womb Atlas Simple**, a private
menstrual health diary (Vite + React + TS SPA at repo root, API server coming
next in `backend/`). Run from the repo root:
`D:\Web Designs\Womb Atlas Simple`.

Read first: `AGENTS.md`, `prompts/00-backend-architecture.md` (your target:
"Ports & processes" + folder shapes). Reference: https://cheat-sheets.org/
(see Linux/Unix/SQL sections as needed).

Environment facts (verified by the parent session):
- Podman 5.8.3 installed; machine `podman-machine-default` (WSL, rootless) is
  RUNNING. `podman ps` works.
- Port **5432 is occupied** by another (old project's) Postgres — do not touch
  it. We map our container to host port **5433**.

## You own these files (create them; modify nothing else)

- `compose.yaml` (repo root)
- `backend/.env.example`
- `backend/README.md` (brief: how to start DB + what comes next)

Do NOT create the API server, migrations/schema SQL, or any source files — later
agents own those.

## Task 1 — `compose.yaml` (repo root, postgres service only)

PostgreSQL 16, Alpine image, with:

- container/network/brick names prefixed `womb-atlas-…`
- host port mapping **5433:5432**
- named volume for data (survives `podman compose down`)
- env: db name `womb_atlas`, user `womb_atlas`, a dev password (choose a
  non-trivial one; it lives in `.env.example` AND `compose.yaml` consistently —
  dev-only secrets are acceptable in-repo for this private project, note that
  in the README)
- healthcheck (`pg_isready`), restart policy `unless-stopped`
- time zone UTC

Backend `.env.example` must define:

```
# backend/.env.example
DATABASE_URL="postgresql://womb_atlas:<PASSWORD>@127.0.0.1:5433/womb_atlas?schema=public"
PORT=4001
ALLOWED_ORIGIN=http://localhost:3000
```

(`.env` itself: create it by copying `.env.example` — the later agents copy it
too; you may create `backend/.env` from it now so agent B2 can proceed.)

## Task 2 — bring it up and prove it

1. `podman compose up -d` (or `podman-compose`/`docker compose` fallback —
   note which worked in your report; podman 5.x has native compose support).
2. Wait for healthy, then verify from the host:
   - `podman ps` shows the container Up/(healthy)
   - connectivity on 5433 (e.g. `Test-NetConnection 127.0.0.1 -Port 5433` on
     Windows PowerShell, or `pg_isready` via `podman exec`)
   - run a trivial SQL through `podman exec -it <container> psql -U womb_atlas
     -d womb_atlas -c "SELECT version();"` to prove the DB answers.
3. Verify 5432 (the old project's) was not harmed: it must still be up.

## Acceptance criteria

1. `compose.yaml` + `backend/.env.example` + `backend/README.md` exist, and a
   live healthy Postgres answers on 127.0.0.1:5433.
2. `podman compose up -d` is idempotent (running it twice does not duplicate
   or error).
3. Run `podman compose down` is NOT part of acceptance — leave it RUNNING.
4. Report: exact files created, the compose mechanism used, verification
   outputs, and any deviation from the architecture doc.
