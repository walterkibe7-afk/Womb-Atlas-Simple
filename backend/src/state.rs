use sqlx::PgPool;
use std::time::Duration;

#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
    pub allowed_origin: String,
}

impl AppState {
    pub async fn new(database_url: &str, allowed_origin: String) -> anyhow::Result<Self> {
        let pool = PgPool::connect(database_url).await?;
        Ok(Self { pool, allowed_origin })
    }

    pub async fn with_retry(database_url: &str, allowed_origin: String, max_retries: u32) -> anyhow::Result<Self> {
        let mut last_err = None;
        for attempt in 0..=max_retries {
            match PgPool::connect(database_url).await {
                Ok(pool) => {
                    if attempt > 0 {
                        tracing::info!("Database connected after {} retries", attempt);
                    }
                    return Ok(Self { pool, allowed_origin });
                }
                Err(e) => {
                    last_err = Some(e);
                    if attempt < max_retries {
                        let delay = Duration::from_millis(500 * (2_u64.pow(attempt.min(5))));
                        tracing::warn!("Database connection failed (attempt {}/{}), retrying in {:?}...", attempt + 1, max_retries + 1, delay);
                        tokio::time::sleep(delay).await;
                    }
                }
            }
        }
        Err(last_err.unwrap().into())
    }
}