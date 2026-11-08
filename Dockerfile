# ============================================================
# Womb Atlas Simple — Fly.io production image
# Builds the Vite SPA and the Rust axum backend in one image.
# The backend serves both the API (/api/*) and the SPA static files.
# ============================================================

# ---------- Stage 1: Frontend (Vite SPA) ----------
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html tsconfig.json vite.config.ts ./
COPY src ./src
RUN npm run build

# ---------- Stage 2: Backend (Rust axum) ----------
FROM rust:1-slim AS backend
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends pkg-config libssl3 ca-certificates && rm -rf /var/lib/apt/lists/*
COPY backend/Cargo.toml backend/Cargo.lock ./
RUN mkdir -p src/routes && \
    echo 'fn main() {}' > src/main.rs && \
    echo 'fn main() {}' > src/seed.rs && \
    echo 'fn main() {}' > src/migrate.rs && \
    echo 'pub mod error; pub mod state; pub mod auth; pub mod validate; pub mod routes; pub mod app;' > src/lib.rs && \
    echo 'pub struct ApiError; impl ApiError { pub fn into_response(self) -> axum::response::Response { unimplemented!() } }' > src/error.rs && \
    echo 'pub struct AppState; impl AppState { pub async fn new(_: &str, _: String) -> anyhow::Result<Self> { unimplemented!() } pub async fn with_retry(_: &str, _: String, _: u32) -> anyhow::Result<Self> { unimplemented!() } }' > src/state.rs && \
    echo 'pub fn hash_pin(_: &str) -> anyhow::Result<String> { unimplemented!() } pub fn verify_pin(_: &str, _: &str) -> anyhow::Result<bool> { unimplemented!() } pub fn generate_token() -> String { unimplemented!() } pub fn hash_token(_: &str) -> String { unimplemented!() } pub async fn create_session(_: &sqlx::PgPool, _: uuid::Uuid) -> anyhow::Result<(String, chrono::DateTime<chrono::Utc>)> { unimplemented!() } pub async fn delete_session(_: &sqlx::PgPool, _: &str) -> anyhow::Result<()> { unimplemented!() } pub async fn validate_session(_: &sqlx::PgPool, _: &str) -> anyhow::Result<uuid::Uuid> { unimplemented!() }' > src/auth.rs && \
    echo 'pub fn validate_pin(_: &str) -> anyhow::Result<()> { unimplemented!() } pub fn validate_handle(_: &str) -> anyhow::Result<String> { unimplemented!() } pub fn validate_name(_: &str) -> anyhow::Result<String> { unimplemented!() } pub fn validate_cycle_length(_: i32) -> anyhow::Result<i32> { unimplemented!() } pub fn validate_period_length(_: i32) -> anyhow::Result<i32> { unimplemented!() } pub fn validate_pain(_: i32) -> anyhow::Result<i32> { unimplemented!() } pub fn validate_cycle_day(_: i32) -> anyhow::Result<i32> { unimplemented!() } pub fn validate_flow(_: &str) -> anyhow::Result<()> { unimplemented!() } pub fn validate_mood(_: Option<&str>) -> anyhow::Result<()> { unimplemented!() } pub fn validate_life_stage(_: Option<&str>) -> anyhow::Result<()> { unimplemented!() } pub fn validate_symptoms(_: &[String]) -> anyhow::Result<()> { unimplemented!() } pub fn validate_note(_: Option<&str>) -> anyhow::Result<()> { unimplemented!() } pub fn parse_date(_: &str) -> anyhow::Result<chrono::NaiveDate> { unimplemented!() } pub fn validate_date_range(_: Option<&str>, _: Option<&str>) -> anyhow::Result<(Option<chrono::NaiveDate>, Option<chrono::NaiveDate>)> { unimplemented!() }' > src/validate.rs && \
    echo 'pub mod health; pub mod auth; pub mod me; pub mod entries;' > src/routes/mod.rs && \
    echo 'pub fn health_routes() -> axum::Router<crate::state::AppState> { unimplemented!() }' > src/routes/health.rs && \
    echo 'pub fn auth_routes() -> axum::Router<crate::state::AppState> { unimplemented!() }' > src/routes/auth.rs && \
    echo 'pub fn me_routes() -> axum::Router<crate::state::AppState> { unimplemented!() }' > src/routes/me.rs && \
    echo 'pub fn entries_routes() -> axum::Router<crate::state::AppState> { unimplemented!() }' > src/routes/entries.rs && \
    echo 'pub fn create_app(_: crate::state::AppState) -> axum::Router { unimplemented!() }' > src/app.rs && \
    cargo build --release --bins
COPY backend/src ./src
COPY backend/migrations ./migrations
RUN rm -rf target/release/deps/womb_atlas_backend* target/release/deps/libwomb_atlas_backend* && \
    touch src/lib.rs src/main.rs src/seed.rs src/migrate.rs && \
    cargo build --release --bins

# ---------- Stage 3: Runtime ----------
FROM debian:bookworm-slim AS runtime
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates libssl3 && rm -rf /var/lib/apt/lists/*
COPY --from=frontend /app/dist ./dist
COPY --from=backend /app/target/release/womb-atlas-backend /app/womb-atlas-backend
COPY --from=backend /app/target/release/migrate /app/migrate
EXPOSE 4001
ENV PORT=4001
CMD ["/app/womb-atlas-backend"]