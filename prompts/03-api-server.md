# Agent B3 — API server (Rust: axum + tokio + sqlx, port 4001)

You are building the API for **Womb Atlas Simple**, a private menstrual health
diary. Run from the repo root: `D:\Web Designs\Womb Atlas Simple`.

Prerequisites (previous agents completed these — if missing, STOP and report):
- Postgres healthy on 127.0.0.1:5433 (podman), `backend/.env` present
- `backend/migrations/0001_init.sql` applied (tables: users, profiles, entries,
  sessions; enums: life_stage, flow, mood) and `backend/src/seed.rs` ran
- `backend/Cargo.toml` exists with the seed-bin layout
Read first: `prompts/00-backend-architecture.md` — **the API contract table in
it is binding; implement it exactly.** `AGENTS.md` for tone/scope rules.

Reference: https://cheat-sheets.org/ (Rust section), https://docs.rs/axum,
https://docs.rs/sqlx, https://docs.rs/argon2, https://docs.rs/sha2

Toolchain facts: `cargo 1.99.1` / `rustc 1.99.1` installed natively on Windows;
DB reachable from Windows at 127.0.0.1:5433.

## You own these files (create/modify; nothing else)

- `backend/Cargo.toml` (extend the seed-only one)
- `backend/src/main.rs`, `backend/src/app.rs` (or a small module layout:
  `src/routes/{auth,me,entries,health}.rs`, `src/auth.rs`, `src/error.rs`,
  `src/state.rs`)
- `backend/src/validate.rs`

Frontend files, `compose.yaml`, migrations, seed: off-limits.

## Dependency set (extend Cargo.toml; nothing beyond these)

```toml
axum        = "0.7 or 0.8 (current stable)"   # web
tokio       = { version = "1", features = ["macros", "rt-multi-thread"] }
tower-http  = { version = "0.5/0.6", features = ["cors", "limit"] }
serde       = { version = "1", features = ["derive"] }
serde_json  = "1"
sqlx        = { version = "0.8", features = ["runtime-tokio", "tls-rustls", "postgres", "chrono", "uuid", "migrate"] }
chrono      = { version = "0.4", features = ["serde"] }
uuid        = { version = "1", features = ["v4", "serde"] }
sha2        = "0.10"     # session token hashing
hex         = "0.4"      # hex encode/decode
rand        = "0.8"      # token generation via rand::rngs::OsRng / getrandom
argon2      = { version = "0.5", features = ["std"] }   # pin hashing
thiserror   = "1 or 2"   # typed ApiError
tracing     = "0.1"      # optional but recommended; tracing-subscriber to see requests
```

(If minor versions drifted, use current stable; keep feature flags —
`tls-rustls` specifically, to avoid OpenSSL linking pain on Windows.)

## Implementation requirements (binding)

1. **Contract**: implement every row of the endpoint table in the architecture
   doc, exact status codes (201 setup incl. `Location` optional; 401 bad pin;
   409 conflicts). All errors: `{"error": "..."}`.
2. **Session token**: 32 random bytes hex (rand OsRng); store ONLY
   `sha256(token)` in `sessions.token_hash`; expiry now + 30 days; per-request
   middleware (axum extractor) rejects expired/unknown tokens with 401 and
   nullifies an expired row. Unknown-token response time must not differ
   usefully from an expired one.
3. **Argon2id pin hashing** (`argon2` crate, `Params` = m 19456 KiB, t 2, p 1,
   output 32 bytes, salt 16 random bytes). Public format for the DB column:
   `argon2id$m=19456,t=2,p=1$<saltHex>$<keyHex>`. Compare with
   `Argon2::verify_password` (constant time by construction). NEVER store or
   log the plain pin; `verify` failures return the same error as unknown-user
   ("invalid credentials").
4. **Zod-equivalent validation**: serde structs with `deny_unknown_fields` +
   manual range checks in `validate.rs` — cycleLength 21–35, periodLength 2–7,
   pain 0–5, cycleDay 1–35, symptoms ⊆ flow/mood/symptom enums (POSTgres enums
   reject strays anyway — map the error to 400, not 500), note ≤ 2000 chars,
   name trimmed 1–80 chars (empty → 400 "name is required"), dates strict
   `YYYY-MM-DD`. LIMITED symptom set (from architecture/types talking point):
   cramps, tender-breasts, fatigue, headache, bloating, backache.
5. **Setup semantics**: `POST /api/setup` — 201 when zero users exist: creates
   user + profile defaults, hashes pin, returns `{token, user}`. 409 when any
   user exists. `POST /api/session` — verify pin against the single user; 401
   bad pin; 409 when no user was ever created. `DELETE /api/session` deletes
   the caller's row (logout/lock).
6. **PUT /api/me** partial update: clamp+validate, write `profiles`, keep
   `updated_at` (DB trigger handles). GET /api/me creates the profile row with
   defaults on first touch if absent. name="" must never persist.
7. **Entries**: scope EVERYTHING by the authenticated userId. PUT
   `/api/entries/:date` upserts whole-entry for that date (UNIQUE constraint
   hit → UPDATE path); verify response shape `{entry}`; list DESC by
   entry_date with optional from/to filters (`?from=&to=`, ISO dates,
   validated). All user IDs are uuids from the session join.
8. **CORS**: exactly `ALLOWED_ORIGIN=http://localhost:3000`; body limit 64KB
   (tower-http limit); JSON only.
9. Runtime config from env (`PORT`, `ALLOWED_ORIGIN`, `DATABASE_URL`) — read
   from `backend/.env` (manual reader or `dotenvy` if you add it — it is a
   permitted extra dep only if needed; prefer manual).
10. Clean code: small modules, no `unwrap()` on request paths, all fallible
    paths mapped to ApiError; graceful shutdown on ctrl-c; startup waits for
    the DB (retry pool connect up to ~20s with backoff) and logs ready.

## Run/verify against the LIVE stack (all acceptance is runtime)

1. `cargo run` (alias script unnecessary) serves 4001 with DB retry.
2. Curl the ENTIRE contract happy-path + failure-path matrix:
   health → setup(1234) → setup-again(409) → session(wrong=401) →
   session(right) → GET/PUT me → PUT entry today → entries list (+from/to
   filters) → PUT same date upsert replaces (created_at preserved? created_at
   stays, updated_at moves — prove) → DELETE entry → invalid payloads (pin
   "12", pain 9, name "") → each 4xx with correct code. Prove
   `sessions.token_hash` is a 64-char hex (never raw token) via podman psql.
3. Restart resilience: token valid after server restart; expired/unknown → 401.
4. `cargo check` and `cargo clippy` (if present) — no warnings in YOUR modules.
5. Report: files created, module layout, the verify transcript (HTTP statuses
   only), and any contract deviation with a one-line justification.
