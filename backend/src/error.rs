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

    #[error("Setup already completed")]
    SetupAlreadyCompleted,

    #[error("No user exists yet")]
    NoUserExists,

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
        let (status, message) = match self {
            ApiError::Database(e) => {
                tracing::error!("Database error: {}", e);
                // Check for unique constraint violations
                let msg = e.to_string();
                if msg.contains("duplicate key") || msg.contains("unique constraint") {
                    if msg.contains("token_hash") {
                        (StatusCode::CONFLICT, "Session conflict".to_string())
                    } else if msg.contains("users_name_key") || msg.contains("name") {
                        (StatusCode::CONFLICT, "Name already exists".to_string())
                    } else {
                        (StatusCode::CONFLICT, "Resource conflict".to_string())
                    }
                } else if msg.contains("foreign key") {
                    (StatusCode::BAD_REQUEST, "Invalid reference".to_string())
                } else if msg.contains("check constraint") {
                    if msg.contains("cycle_length") {
                        (StatusCode::BAD_REQUEST, "cycleLength must be between 21 and 35".to_string())
                    } else if msg.contains("period_length") {
                        (StatusCode::BAD_REQUEST, "periodLength must be between 2 and 7".to_string())
                    } else if msg.contains("pain") {
                        (StatusCode::BAD_REQUEST, "pain must be between 0 and 5".to_string())
                    } else if msg.contains("cycle_day") {
                        (StatusCode::BAD_REQUEST, "cycleDay must be between 1 and 35".to_string())
                    } else {
                        (StatusCode::BAD_REQUEST, "Constraint violation".to_string())
                    }
                } else {
                    (StatusCode::INTERNAL_SERVER_ERROR, "Database error".to_string())
                }
            }
            ApiError::InvalidCredentials => (StatusCode::UNAUTHORIZED, "invalid credentials".to_string()),
            ApiError::SetupAlreadyCompleted => (StatusCode::CONFLICT, "setup already completed".to_string()),
            ApiError::NoUserExists => (StatusCode::CONFLICT, "no user exists yet".to_string()),
            ApiError::InvalidPin(msg) => (StatusCode::BAD_REQUEST, msg),
            ApiError::InvalidName(msg) => (StatusCode::BAD_REQUEST, msg),
            ApiError::Validation(msg) => (StatusCode::BAD_REQUEST, msg),
            ApiError::Unauthorized => (StatusCode::UNAUTHORIZED, "unauthorized".to_string()),
            ApiError::TokenExpired => (StatusCode::UNAUTHORIZED, "token expired".to_string()),
            ApiError::EntryNotFound => (StatusCode::NOT_FOUND, "entry not found".to_string()),
            ApiError::Internal(msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg),
        };

        (status, Json(json!({ "error": message }))).into_response()
    }
}

pub type ApiResult<T> = Result<T, ApiError>;