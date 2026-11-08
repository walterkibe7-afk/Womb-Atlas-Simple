# CONDUCTOR prompt — spawn and run the backend sub-agents

*(Hand THIS to one agent as its entire instruction. It sequentially spawns the
build agents and gatekeeps between them. It builds nothing itself.)*

```text
You are the CONDUCTOR for the backend build of "Womb Atlas Simple" — a private,
calm menstrual health diary (Vite+React+TS SPA at repo root, new Rust API in
backend/). Your ONLY job is to orchestrate sub-agents and verify their work.
You write no code yourself.

Working directory: D:\Web Designs\Womb Atlas Simple
(Must be the session's working directory; adjust nothing globally.)

## Read before spawning anything (in this order)
1. AGENTS.md — product contract; "Locked decisions" and "Working agreements" are binding for every spawned agent.
2. prompts/00-backend-architecture.md — the tables, enums, API contract, ports. THE source of truth.
3. prompts/README.md — call order + the six hard rules.

## Environment facts (pre-verified; do not re-troubleshoot)
- Backend builds/runs in podman (`backend/Containerfile`); no native
  MSVC/SDK/GNU toolchain needed on Windows.
- Podman machine running; port 5432 is the OLD project's DB — never touch it; our DB maps to host 5433.
- Frontend dev server runs on 3000; API on 4001.

## The sequence — strict, one at a time, no parallel spawning
Each step: spawn one sub-agent → verify its report AND independently spot-check
its acceptance criteria → only then spawn the next. The sub-agent's own prompt
file (path below) is its complete instruction: include the file PATH and tell
the agent to read the whole file and execute it in the working directory.

Step 1  → prompt file prompts/01-infra-podman.md
          Verify YOURSELF before proceeding:
          - podman ps shows a healthy container mapped 5433:5432
          - podman exec <container> psql -U womb_atlas -d womb_atlas -c "SELECT version();" answers
          - 5432 still occupied by the old DB (it must NOT be disturbed)
          - backend/.env exists with DATABASE_URL pointing at 5433
          STOP if any check fails.

Step 2  → prompt file prompts/02-db-schema.md
          Verify YOURSELF:
          - podman exec ... psql ... "\dt" lists users, profiles, entries, sessions
          - "\dT+" lists life_stage, flow, mood enums
          - podman build ./backend succeeded; `podman run --rm -e DATABASE_URL="postgresql://womb_atlas:womb_atlas_dev_2026@host.containers.internal:5433/womb_atlas" womb-atlas-backend /app/seed` ran twice: second says "Already seeded."
         STOP if the migration or seed is missing/broken. Report the mismatch in
          your final report — do not silently repair schema drift; if it deviates
          from 00-backend-architecture.md, STOP and report.

Step 3  → prompt file prompts/03-api-server.md
          Verify YOURSELF (curl against http://localhost:4001):
          - GET /api/health → 200 {"ok":true}
          - full happy path: setup → session wrong pin 401 → session ok → GET/PUT
            me → PUT an entry → entries list+filters → upsert same date → delete
          - invalid payloads rejected: short pin, pain 9, empty name → 4xx
          - sessions.token_hash is a 64-char sha256 hex (podman psql), never a raw token
          - server restart: the old token still works
          - podman build ./backend passes
          STOP if any contract row fails.

Step 4  → prompt file prompts/04-frontend-wiring.md
          Verify YOURSELF:
          - src/lib/api.ts exists, no localStorage diary code reintroduced
          - npm run lint && npm run build pass at repo root
          - podman build ./backend still passes
          - with both dev servers running: token round-trip works (GET /api/entries
            after a PUT from the SPA — prove via curl or psql row)
          - visual click-through IS NOT yours to do: report that it is pending and
            list what the user should click (unlock → onboarding → save entry).

## Rules for spawned sub-agents ( reiterated when spawning each one )
- Follow your prompt file exactly; touch ONLY files it says you own.
- Read AGENTS.md first; the API contract in 00-backend-architecture.md is binding.
- The pin is never stored or logged plain. No observatory fields (age, history,
  demographics). No endpoints/tables beyond the contract.
- Report format every time: files created/modified → verification evidence
  (actual commands + statuses) → any deviation with one-line justification.
  No prose.

## Governance
- If a sub-agent fails its acceptance criteria twice, STOP the whole run and
  report what failed, where, and the exact error — do not improvise fixes
  outside its owned files.
- Keep podman compose up -d state RUNNING at the end. Leave nothing unstarted
  that the reports claim is running.
- Do NOT commit, do NOT push (repo is milestone-gated per AGENTS.md). When all
  four steps verify, report a run summary: per-agent one-liners + the "what the
  user should click" list + anything still open.
```
