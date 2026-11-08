# Womb Atlas Simple — Backend

## Database (PostgreSQL 16 via Podman)

The database runs in a Podman container on host port **5433** (container port 5432). Port 5432 is reserved for the old project's database.

### Start the database

```bash
# From the repo root (D:\Web Designs\Womb Atlas Simple)
podman compose up -d
```

This is idempotent — running it twice does not duplicate or error.

### Verify it's running

```bash
# Check container status
podman ps

# Should show: womb-atlas-postgres  Up (healthy)

# Test connectivity from host (PowerShell)
Test-NetConnection 127.0.0.1 -Port 5433

# Or via podman exec
podman exec -it womb-atlas-postgres pg_isready -U womb_atlas -d womb_atlas

# Run a trivial query
podman exec -it womb-atlas-postgres psql -U womb_atlas -d womb_atlas -c "SELECT version();"
```

### Environment

Copy `.env.example` to `.env` (later agents will do this too):

```bash
cp backend/.env.example backend/.env
```

The dev password (`womb_atlas_dev_2026`) is in both `compose.yaml` and `.env.example` — this is acceptable for a private project's development setup.

### Run migrations and seed (from the built image)

```bash
# Build the backend image
podman compose up -d --build backend

# Run migrations (requires DATABASE_URL only, no .env file needed)
podman run --rm \
  -e DATABASE_URL="postgresql://womb_atlas:womb_atlas_dev_2026@host.containers.internal:5433/womb_atlas" \
  womb-atlas-backend /app/migrate

# Seed demo user (requires ALLOW_DEMO_SEED=1)
podman run --rm \
  -e ALLOW_DEMO_SEED=1 \
  -e DATABASE_URL="postgresql://womb_atlas:womb_atlas_dev_2026@host.containers.internal:5433/womb_atlas" \
  womb-atlas-backend /app/seed
```

**Demo credentials (dev-only):**
- Handle: `achieng`
- Passcode: `246810`

### What's next

After the database is healthy, the following agents will add:

1. **Agent B2** (`02-db-schema.md`) — sqlx migrations + seed data
2. **Agent B3** (`03-api-server.md`) — Rust axum API server on port 4001
3. **Agent B4** (`04-frontend-wiring.md`) — Frontend API client wiring

### Notes

- Data persists in the named volume `womb-atlas-pgdata` (survives `podman compose down`)
- Timezone is UTC
- Healthcheck uses `pg_isready`
- Restart policy: `unless-stopped`
- Do not run `podman compose down` as part of acceptance — leave the container running