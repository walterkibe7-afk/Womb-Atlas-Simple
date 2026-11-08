use axum::{routing::get, Json, Router};
use serde_json::json;
use crate::state::AppState;

pub fn health_routes() -> Router<AppState> {
    Router::new().route("/api/health", get(health))
}

async fn health() -> Json<serde_json::Value> {
    Json(json!({ "ok": true }))
}