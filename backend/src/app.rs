use axum::{Router, middleware, http::Method, response::IntoResponse, Json};
use tower_http::{cors::CorsLayer, limit::RequestBodyLimitLayer, services::ServeDir};
use crate::{state::AppState, routes::{health, auth, me, entries}};
use serde_json::json;

async fn not_found() -> impl IntoResponse {
    (axum::http::StatusCode::NOT_FOUND, Json(json!({ "error": "not found" })))
}

pub fn create_app(state: AppState) -> Router {
    let cors = CorsLayer::new()
        .allow_origin(state.allowed_origin.parse::<axum::http::HeaderValue>().unwrap())
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers([
            axum::http::header::CONTENT_TYPE,
            axum::http::header::AUTHORIZATION,
        ])
        .allow_credentials(true);

    let auth_middleware = middleware::from_fn_with_state(state.clone(), auth::auth_middleware);

    let protected_routes = Router::new()
        .merge(me::me_routes())
        .merge(entries::entries_routes())
        .layer(auth_middleware);

    let api = Router::new()
        .merge(health::health_routes())
        .merge(auth::auth_routes())
        .merge(protected_routes)
        .fallback(not_found)
        .layer(RequestBodyLimitLayer::new(64 * 1024))
        .layer(cors)
        .with_state(state);

    // Serve the built Vite SPA (./dist) alongside the API. API routes
    // (/api/*) are matched first; everything else falls back to the static
    // files, so the SPA loads at "/" with no client-side router needed.
    api.fallback_service(ServeDir::new("dist").append_index_html_on_directories(true))
}