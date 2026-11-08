use anyhow::{Context, Result};
use sqlx::PgPool;
use std::env;

#[tokio::main]
async fn main() -> Result<()> {
    // Load .env manually
    let env_content = std::fs::read_to_string(".env")?;
    for line in env_content.lines() {
        let line = line.trim();
        if line.is_empty() || line.starts_with('#') {
            continue;
        }
        if let Some((key, value)) = line.split_once('=') {
            let key = key.trim();
            let value = value.trim().trim_matches('"');
            env::set_var(key, value);
        }
    }

    let database_url = env::var("DATABASE_URL").context("DATABASE_URL not set")?;
    let pool = PgPool::connect(&database_url).await?;

    // Run migrations
    sqlx::migrate!("./migrations").run(&pool).await?;

    println!("Migrations applied successfully.");
    Ok(())
}