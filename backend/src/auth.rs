use argon2::{
    password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2, Params,
};
use rand::{rngs::OsRng, Rng};
use sha2::{Digest, Sha256};
use hex;
use chrono::{DateTime, Utc};
use uuid::Uuid;
use sqlx::{PgPool, Row};
use crate::error::{ApiError, ApiResult};
use lazy_static::lazy_static;

lazy_static! {
    static ref ARGON2_PARAMS: Params = Params::new(19456, 2, 1, Some(32)).unwrap();
}
const TOKEN_BYTES: usize = 32;
const TOKEN_EXPIRY_DAYS: i64 = 30;

pub fn hash_pin(pin: &str) -> ApiResult<String> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::new(argon2::Algorithm::Argon2id, argon2::Version::V0x13, ARGON2_PARAMS.clone());
    let password_hash = argon2
        .hash_password(pin.as_bytes(), &salt)
        .map_err(|e| ApiError::Internal(format!("argon2 hash failed: {}", e)))?;
    Ok(password_hash.to_string())
}

pub fn verify_pin(pin: &str, hash: &str) -> ApiResult<bool> {
    let parsed_hash = PasswordHash::new(hash)
        .map_err(|e| ApiError::Internal(format!("argon2 parse failed: {}", e)))?;
    let argon2 = Argon2::new(argon2::Algorithm::Argon2id, argon2::Version::V0x13, ARGON2_PARAMS.clone());
    Ok(argon2.verify_password(pin.as_bytes(), &parsed_hash).is_ok())
}

pub fn generate_token() -> String {
    let mut bytes = [0u8; TOKEN_BYTES];
    OsRng.fill(&mut bytes);
    hex::encode(bytes)
}

pub fn hash_token(token: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(token.as_bytes());
    hex::encode(hasher.finalize())
}

pub async fn create_session(pool: &PgPool, user_id: Uuid) -> ApiResult<(String, DateTime<Utc>)> {
    let token = generate_token();
    let token_hash = hash_token(&token);
    let expires_at = Utc::now() + chrono::Duration::days(TOKEN_EXPIRY_DAYS);

    sqlx::query(
        r#"
        INSERT INTO sessions (id, token_hash, user_id, created_at, expires_at)
        VALUES ($1, $2, $3, now(), $4)
        "#,
    )
    .bind(Uuid::new_v4())
    .bind(&token_hash)
    .bind(user_id)
    .bind(expires_at)
    .execute(pool)
    .await?;

    Ok((token, expires_at))
}

pub async fn delete_session(pool: &PgPool, token_hash: &str) -> ApiResult<()> {
    sqlx::query("DELETE FROM sessions WHERE token_hash = $1")
        .bind(token_hash)
        .execute(pool)
        .await?;
    Ok(())
}

pub async fn validate_session(pool: &PgPool, token: &str) -> ApiResult<Uuid> {
    let token_hash = hash_token(token);

    let row = sqlx::query(
        r#"
        SELECT user_id, expires_at FROM sessions WHERE token_hash = $1
        "#,
    )
    .bind(&token_hash)
    .fetch_optional(pool)
    .await?;

    let (user_id, expires_at): (Uuid, DateTime<Utc>) = match row {
        Some(r) => (r.get("user_id"), r.get("expires_at")),
        None => return Err(ApiError::Unauthorized),
    };

    if Utc::now() > expires_at {
        // Clean up expired session
        sqlx::query("DELETE FROM sessions WHERE token_hash = $1")
            .bind(&token_hash)
            .execute(pool)
            .await?;
        return Err(ApiError::TokenExpired);
    }

    Ok(user_id)
}