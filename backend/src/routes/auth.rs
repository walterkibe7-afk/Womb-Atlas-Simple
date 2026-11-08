use axum::{
    extract::{Request, State, Extension},
    middleware::Next,
    response::Response,
    routing::post,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use sqlx::Row;
use crate::{state::AppState, auth::{hash_pin, verify_pin, create_session, delete_session, validate_session, hash_token}, error::{ApiError, ApiResult}, validate::{validate_pin, validate_handle}};
use lazy_static::lazy_static;
use chrono::{DateTime, Utc, Duration};
use argon2::PasswordHasher;

lazy_static! {
    static ref DUMMY_HASH: String = {
        let params = argon2::Params::new(19456, 2, 1, Some(32)).unwrap();
        let salt = argon2::password_hash::SaltString::generate(&mut rand::rngs::OsRng);
        let argon2 = argon2::Argon2::new(argon2::Algorithm::Argon2id, argon2::Version::V0x13, params);
        argon2.hash_password(b"dummy", &salt).unwrap().to_string()
    };
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct RegisterRequest {
    #[serde(rename = "handle")]
    handle: String,
    #[serde(rename = "pin")]
    pin: String,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct SessionRequest {
    #[serde(rename = "handle")]
    handle: String,
    #[serde(rename = "pin")]
    pin: String,
}

#[derive(Serialize)]
pub struct AuthResponse {
    token: String,
    user: UserResponse,
}

#[derive(Serialize)]
pub struct UserResponse {
    id: Uuid,
    handle: String,
    name: String,
}

pub fn auth_routes() -> Router<AppState> {
    Router::new()
        .route("/api/register", post(register))
        .route("/api/session", post(session).delete(delete_session_handler))
}

async fn register(State(state): State<AppState>, Json(req): Json<RegisterRequest>) -> ApiResult<Json<AuthResponse>> {
    let handle = validate_handle(&req.handle)?;
    validate_pin(&req.pin)?;

    let pin_hash = hash_pin(&req.pin)?;

    let user_id = Uuid::new_v4();
    let result = sqlx::query(
        r#"
        INSERT INTO users (id, name, handle, pin_hash, created_at, updated_at)
        VALUES ($1, $2, $3, $4, now(), now())
        "#,
    )
    .bind(user_id)
    .bind("")
    .bind(&handle)
    .bind(&pin_hash)
    .execute(&state.pool)
    .await;

    // Handle unique constraint violation for handle
    if let Err(e) = &result {
        if let Some(db_err) = e.as_database_error() {
            if db_err.constraint() == Some("users_handle_key") {
                return Err(ApiError::HandleTaken);
            }
        }
    }
    result?;

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

    Ok(Json(AuthResponse {
        token,
        user: UserResponse { id: user_id, handle, name: String::new() },
    }))
}

async fn session(State(state): State<AppState>, Json(req): Json<SessionRequest>) -> ApiResult<Json<AuthResponse>> {
    let handle = validate_handle(&req.handle)?;
    validate_pin(&req.pin)?;

    // Lookup user by handle
    let row = sqlx::query(
        r#"
        SELECT id, name, handle, pin_hash, failed_attempts, locked_until FROM users WHERE handle = $1
        "#,
    )
    .bind(&handle)
    .fetch_optional(&state.pool)
    .await?;

    let (user_id, name, stored_handle, pin_hash, _failed_attempts, locked_until): (Uuid, String, Option<String>, Option<String>, i32, Option<DateTime<Utc>>) = match row {
        Some(r) => (
            r.get("id"),
            r.get("name"),
            r.get("handle"),
            r.get("pin_hash"),
            r.get("failed_attempts"),
            r.get("locked_until"),
        ),
        None => {
            // Unknown handle - run dummy verification to prevent timing attack
            let _ = verify_pin(&req.pin, &DUMMY_HASH);
            return Err(ApiError::InvalidCredentials);
        }
    };

    // Check if account is locked
    if let Some(locked) = locked_until {
        if Utc::now() < locked {
            let retry_after = (locked - Utc::now()).num_seconds().max(1);
            return Err(ApiError::TooManyAttempts { retry_after_seconds: retry_after });
        }
    }

    // Legacy row (no handle) or no pin_hash - treat as invalid credentials
    let pin_hash = match (stored_handle, pin_hash) {
        (Some(_), Some(h)) => h,
        _ => {
            let _ = verify_pin(&req.pin, &DUMMY_HASH);
            return Err(ApiError::InvalidCredentials);
        }
    };

    // Verify PIN
    if !verify_pin(&req.pin, &pin_hash)? {
        // Increment failed_attempts atomically, lock at 5
        let now = Utc::now();
        let lock_threshold: i32 = 5;
        let lock_duration = Duration::minutes(15);

        sqlx::query(
            r#"
            UPDATE users SET
                failed_attempts = CASE
                    WHEN failed_attempts + 1 >= $2 THEN 0
                    ELSE failed_attempts + 1
                END,
                locked_until = CASE
                    WHEN failed_attempts + 1 >= $2 THEN $3
                    ELSE locked_until
                END,
                updated_at = now()
            WHERE id = $1
            "#,
        )
        .bind(user_id)
        .bind(lock_threshold)
        .bind(now + lock_duration)
        .execute(&state.pool)
        .await?;

        return Err(ApiError::InvalidCredentials);
    }

    // Successful authentication - reset failed_attempts and locked_until
    sqlx::query(
        r#"
        UPDATE users SET failed_attempts = 0, locked_until = NULL, updated_at = now() WHERE id = $1
        "#,
    )
    .bind(user_id)
    .execute(&state.pool)
    .await?;

    // Delete expired sessions for this user
    sqlx::query("DELETE FROM sessions WHERE user_id = $1 AND expires_at < now()")
        .bind(user_id)
        .execute(&state.pool)
        .await?;

    let (token, _expires_at) = create_session(&state.pool, user_id).await?;

    Ok(Json(AuthResponse {
        token,
        user: UserResponse { id: user_id, handle, name },
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