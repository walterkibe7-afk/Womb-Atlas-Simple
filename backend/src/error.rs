use thiserror::Error;
use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;

#[derive(Debug, Error)]
pub enum ApiError {
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),

    #[error("Invalid credentials")]
    InvalidCredentials,

    #[error("Handle already taken")]
    HandleTaken,

    #[error("Too many attempts: {retry_after_seconds} seconds")]
    TooManyAttempts { retry_after_seconds: i64 },

    #[error("Invalid pin: {0}")]
    InvalidPin(String),

    #[error("Invalid name: {0}")]
    InvalidName(String),

    #[error("Validation error: {0}")]
    Validation(String),

    #[error("Unauthorized")]
    Unauthorized,

    #[error("Token expired")]
    TokenExpired,

    #[error("Entry not found")]
    EntryNotFound,

    #[error("Internal error: {0}")]
    Internal(String),
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, message, retry_after) = match self {
            ApiError::Database(e) => {
                tracing::error!("Database error: {}", e);
                // Check for unique constraint violations
                let msg = e.to_string();
                if msg.contains("duplicate key") || msg.contains("unique constraint") {
                    if msg.contains("token_hash") {
                        (StatusCode::CONFLICT, "Session conflict".to_string(), None)
                    } else if msg.contains("users_handle_key") {
                        (StatusCode::CONFLICT, "handle already taken".to_string(), None)
                    } else {
                        (StatusCode::CONFLICT, "Resource conflict".to_string(), None)
                    }
                } else if msg.contains("foreign key") {
                    (StatusCode::BAD_REQUEST, "Invalid reference".to_string(), None)
                } else if msg.contains("check constraint") {
                    if msg.contains("cycle_length") {
                        (StatusCode::BAD_REQUEST, "cycleLength must be between 21 and 35".to_string(), None)
                    } else if msg.contains("period_length") {
                        (StatusCode::BAD_REQUEST, "periodLength must be between 2 and 7".to_string(), None)
                    } else if msg.contains("pain") {
                        (StatusCode::BAD_REQUEST, "pain must be between 0 and 5".to_string(), None)
                    } else if msg.contains("cycle_day") {
                        (StatusCode::BAD_REQUEST, "cycleDay must be between 1 and 35".to_string(), None)
                    } else {
                        (StatusCode::BAD_REQUEST, "Constraint violation".to_string(), None)
                    }
                } else {
                    (StatusCode::INTERNAL_SERVER_ERROR, "Database error".to_string(), None)
                }
            }
            ApiError::InvalidCredentials => (StatusCode::UNAUTHORIZED, "invalid credentials".to_string(), None),
            ApiError::HandleTaken => (StatusCode::CONFLICT, "handle already taken".to_string(), None),
            ApiError::TooManyAttempts { retry_after_seconds } => {
                (StatusCode::TOO_MANY_REQUESTS, "too many attempts, try again later".to_string(), Some(retry_after_seconds))
            }
            ApiError::InvalidPin(msg) => (StatusCode::BAD_REQUEST, msg, None),
            ApiError::InvalidName(msg) => (StatusCode::BAD_REQUEST, msg, None),
            ApiError::Validation(msg) => (StatusCode::BAD_REQUEST, msg, None),
            ApiError::Unauthorized => (StatusCode::UNAUTHORIZED, "unauthorized".to_string(), None),
            ApiError::TokenExpired => (StatusCode::UNAUTHORIZED, "token expired".to_string(), None),
            ApiError::EntryNotFound => (StatusCode::NOT_FOUND, "entry not found".to_string(), None),
            ApiError::Internal(msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg, None),
        };

        let mut response = (status, Json(json!({ "error": message }))).into_response();
        if let Some(seconds) = retry_after {
            response.headers_mut().insert(
                axum::http::header::RETRY_AFTER,
                axum::http::HeaderValue::from_str(&seconds.to_string()).unwrap(),
            );
            // Also include retryAfterSeconds in JSON body
            let json_body = json!({ "error": message, "retryAfterSeconds": seconds });
            response = (status, Json(json_body)).into_response();
            if let Some(seconds) = retry_after {
                response.headers_mut().insert(
                    axum::http::header::RETRY_AFTER,
                    axum::http::HeaderValue::from_str(&seconds.to_string()).unwrap(),
                );
            }
        }
        response
    }
}

pub type ApiResult<T> = Result<T, ApiError>;