use axum::{
    extract::{Request, State, Extension},
    middleware::Next,
    response::Response,
    routing::{post, delete},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use sqlx::Row;
use crate::{state::AppState, auth::{hash_pin, create_session, delete_session, validate_session, hash_token}, error::{ApiError, ApiResult}, validate::validate_pin};

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct SetupRequest {
    pin: String,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct SessionRequest {
    pin: String,
}

#[derive(Serialize)]
pub struct SetupResponse {
    token: String,
    user: UserResponse,
}

#[derive(Serialize)]
pub struct SessionResponse {
    token: String,
    user: UserResponse,
}

#[derive(Serialize)]
pub struct UserResponse {
    id: Uuid,
    name: String,
}

pub fn auth_routes() -> Router<AppState> {
    Router::new()
        .route("/api/setup", post(setup))
        .route("/api/session", post(session).delete(delete_session_handler))
}

async fn setup(State(state): State<AppState>, Json(req): Json<SetupRequest>) -> ApiResult<Json<SetupResponse>> {
    validate_pin(&req.pin)?;

    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM users")
        .fetch_one(&state.pool)
        .await?;

    if count > 0 {
        return Err(ApiError::SetupAlreadyCompleted);
    }

    let pin_hash = hash_pin(&req.pin)?;

    let user_id = Uuid::new_v4();
    sqlx::query(
        r#"
        INSERT INTO users (id, name, pin_hash, created_at, updated_at)
        VALUES ($1, $2, $3, now(), now())
        "#,
    )
    .bind(user_id)
    .bind("")
    .bind(&pin_hash)
    .execute(&state.pool)
    .await?;

    sqlx::query(
        r#"
        INSERT INTO profiles (id, user_id, cycle_length, period_length, uses_hormonal_birth_control, has_completed_onboarding, created_at, updated_at)
        VALUES ($1, $2, 28, 5, false, false, now(), now())
        "#,
    )
    .bind(Uuid::new_v4())
    .bind(user_id)
    .execute(&state.pool)
    .await?;

    let (token, _expires_at) = create_session(&state.pool, user_id).await?;

    Ok(Json(SetupResponse {
        token,
        user: UserResponse { id: user_id, name: String::new() },
    }))
}

async fn session(State(state): State<AppState>, Json(req): Json<SessionRequest>) -> ApiResult<Json<SessionResponse>> {
    validate_pin(&req.pin)?;

    let row = sqlx::query(
        r#"
        SELECT id, name, pin_hash FROM users LIMIT 1
        "#,
    )
    .fetch_optional(&state.pool)
    .await?;

    let (user_id, name, pin_hash): (Uuid, String, Option<String>) = match row {
        Some(r) => (r.get("id"), r.get("name"), r.get("pin_hash")),
        None => return Err(ApiError::NoUserExists),
    };

    let pin_hash = pin_hash.ok_or(ApiError::InvalidCredentials)?;

    if !crate::auth::verify_pin(&req.pin, &pin_hash)? {
        return Err(ApiError::InvalidCredentials);
    }

    let (token, _expires_at) = create_session(&state.pool, user_id).await?;

    Ok(Json(SessionResponse {
        token,
        user: UserResponse { id: user_id, name },
    }))
}

async fn delete_session_handler(
    State(state): State<AppState>,
    Extension(token_hash): Extension<String>,
) -> ApiResult<Json<serde_json::Value>> {
    delete_session(&state.pool, &token_hash).await?;
    Ok(Json(serde_json::json!({ "ok": true })))
}

pub async fn auth_middleware(
    State(state): State<AppState>,
    mut request: Request,
    next: Next,
) -> Result<Response, ApiError> {
    let auth_header = request
        .headers()
        .get("authorization")
        .and_then(|h| h.to_str().ok())
        .and_then(|s| s.strip_prefix("Bearer "));

    let token = match auth_header {
        Some(t) if !t.is_empty() => t,
        _ => return Err(ApiError::Unauthorized),
    };

    let token_hash = hash_token(token);
    let user_id = validate_session(&state.pool, token).await?;

    request.extensions_mut().insert(user_id);
    request.extensions_mut().insert(token_hash);

    Ok(next.run(request).await)
}