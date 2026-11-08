use anyhow::{Context, Result};
use chrono::{Duration, NaiveDate};
use sqlx::{PgPool, Row};
use std::env;
use std::fs;
use uuid::Uuid;

use womb_atlas_backend::auth::hash_pin;

#[derive(Debug)]
struct SeedEntry {
    entry_date: NaiveDate,
    cycle_day: i32,
    flow: String,
    pain: i32,
    symptoms: Vec<String>,
    mood: Option<String>,
    note: Option<String>,
}

fn load_env_file_if_exists(path: &str) -> Result<()> {
    if fs::metadata(path).is_ok() {
        let content = fs::read_to_string(path).context("Failed to read .env file")?;
        for line in content.lines() {
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
    }
    Ok(())
}

async fn get_today_from_db(pool: &PgPool) -> Result<NaiveDate> {
    let row = sqlx::query("SELECT CURRENT_DATE")
        .fetch_one(pool)
        .await
        .context("Failed to get current date from DB")?;
    let today: NaiveDate = row.get(0);
    Ok(today)
}

fn build_demo_entries(today: NaiveDate) -> Vec<SeedEntry> {
    let period_start = today - Duration::days(2); // period started 2 days ago (day 3 today)
    let prev_period_start = period_start - Duration::days(28); // previous cycle 28 days back

    vec![
        // Current cycle - 3 days of period ~2 days ago at declining pain
        SeedEntry {
            entry_date: period_start,           // Day 1 - heavy, pain 4
            cycle_day: 1,
            flow: "heavy".to_string(),
            pain: 4,
            symptoms: vec!["cramps".to_string(), "backache".to_string()],
            mood: Some("tender".to_string()),
            note: Some("First day arrival. Nourished with bone broth and quiet music.".to_string()),
        },
        SeedEntry {
            entry_date: period_start + Duration::days(1), // Day 2 - medium, pain 2
            cycle_day: 2,
            flow: "medium".to_string(),
            pain: 2,
            symptoms: vec!["cramps".to_string(), "fatigue".to_string()],
            mood: Some("reflective".to_string()),
            note: Some("Gentle dusk stroll through the garden. Early bedtime.".to_string()),
        },
        SeedEntry {
            entry_date: period_start + Duration::days(2), // Day 3 - light, pain 1 (today)
            cycle_day: 3,
            flow: "light".to_string(),
            pain: 1,
            symptoms: vec!["cramps".to_string()],
            mood: Some("calm".to_string()),
            note: Some("Sipped warm raspberry leaf infusion; the sharp tension has subsided.".to_string()),
        },
        // Previous cycle - 3 days (28 days back)
        SeedEntry {
            entry_date: prev_period_start,      // Day 1 - heavy, pain 4
            cycle_day: 1,
            flow: "heavy".to_string(),
            pain: 4,
            symptoms: vec!["cramps".to_string(), "backache".to_string()],
            mood: Some("tender".to_string()),
            note: Some("First day arrival. Nourished with bone broth and quiet music.".to_string()),
        },
        SeedEntry {
            entry_date: prev_period_start + Duration::days(1), // Day 2 - heavy, pain 3
            cycle_day: 2,
            flow: "heavy".to_string(),
            pain: 3,
            symptoms: vec!["cramps".to_string(), "headache".to_string()],
            mood: Some("low-energy".to_string()),
            note: Some("Took warm baths and stayed off screens.".to_string()),
        },
        SeedEntry {
            entry_date: prev_period_start + Duration::days(2), // Day 3 - medium, pain 2
            cycle_day: 3,
            flow: "medium".to_string(),
            pain: 2,
            symptoms: vec!["cramps".to_string()],
            mood: Some("calm".to_string()),
            note: Some("Noticeable drop in pain by evening, as usual for day 3.".to_string()),
        },
    ]
}

#[tokio::main]
async fn main() -> Result<()> {
    // Load .env manually only if file exists
    load_env_file_if_exists(".env").context("Failed to load .env file")?;

    // Require ALLOW_DEMO_SEED=1 to prevent accidental seeding in production
    let allow_demo_seed = env::var("ALLOW_DEMO_SEED").unwrap_or_default();
    if allow_demo_seed != "1" {
        eprintln!("Refusing to seed: ALLOW_DEMO_SEED=1 not set. This prevents seeding demo credentials into a production database.");
        std::process::exit(1);
    }

    let database_url = env::var("DATABASE_URL").context("DATABASE_URL not set")?;
    let pool = PgPool::connect(&database_url)
        .await
        .context("Failed to connect to database")?;

    // Check if demo user (achieng) already exists
    let existing_user: Option<(Uuid,)> = sqlx::query_as("SELECT id FROM users WHERE handle = 'achieng'")
        .fetch_optional(&pool)
        .await
        .context("Failed to query existing demo user")?;

    if existing_user.is_some() {
        println!("Already seeded.");
        return Ok(());
    }

    // Check for legacy user (name = 'Achieng' AND handle IS NULL) - upgrade in place
    let legacy_user: Option<(Uuid,)> = sqlx::query_as("SELECT id FROM users WHERE name = 'Achieng' AND handle IS NULL")
        .fetch_optional(&pool)
        .await
        .context("Failed to query legacy user")?;

    let user_id = if let Some((legacy_id,)) = legacy_user {
        // Upgrade legacy user: set handle and pin_hash
        let pin_hash = hash_pin("246810")?;
        sqlx::query(
            r#"
            UPDATE users SET handle = $1, pin_hash = $2, updated_at = now() WHERE id = $3
            "#,
        )
        .bind("achieng")
        .bind(&pin_hash)
        .bind(legacy_id)
        .execute(&pool)
        .await
        .context("Failed to upgrade legacy user")?;

        println!("Upgraded demo user.");
        legacy_id
    } else {
        // Create new demo user with handle and pin_hash
        let pin_hash = hash_pin("246810")?;
        let new_user_id = Uuid::new_v4();
        sqlx::query(
            r#"
            INSERT INTO users (id, name, handle, pin_hash, created_at, updated_at)
            VALUES ($1, $2, $3, $4, now(), now())
            "#,
        )
        .bind(new_user_id)
        .bind("Achieng")
        .bind("achieng")
        .bind(&pin_hash)
        .execute(&pool)
        .await
        .context("Failed to insert demo user")?;

        new_user_id
    };

    // Get today from DB clock
    let today = get_today_from_db(&pool).await?;
    let period_start = today - Duration::days(2);

    // Ensure profile exists and is completed (upgrade if needed)
    let existing_profile: Option<(Uuid,)> = sqlx::query_as("SELECT id FROM profiles WHERE user_id = $1")
        .bind(user_id)
        .fetch_optional(&pool)
        .await
        .context("Failed to query existing profile")?;

    if let Some((profile_id,)) = existing_profile {
        sqlx::query(
            r#"
            UPDATE profiles SET
                last_period_start = $1,
                life_stage = $2::life_stage,
                cycle_length = $3,
                period_length = $4,
                uses_hormonal_birth_control = $5,
                has_completed_onboarding = $6,
                updated_at = now()
            WHERE id = $7
            "#,
        )
        .bind(period_start)
        .bind("currently-cycling")
        .bind(28)
        .bind(5)
        .bind(false)
        .bind(true)
        .bind(profile_id)
        .execute(&pool)
        .await
        .context("Failed to update profile")?;
    } else {
        // Create completed profile for demo user
        sqlx::query(
            r#"
            INSERT INTO profiles (id, user_id, last_period_start, life_stage, cycle_length, period_length, uses_hormonal_birth_control, has_completed_onboarding, created_at, updated_at)
            VALUES ($1, $2, $3, $4::life_stage, $5, $6, $7, $8, now(), now())
            "#,
        )
        .bind(Uuid::new_v4())
        .bind(user_id)
        .bind(period_start)
        .bind("currently-cycling")
        .bind(28)
        .bind(5)
        .bind(false)
        .bind(true)
        .execute(&pool)
        .await
        .context("Failed to insert profile")?;
    }

    // Insert demo entries (idempotent - delete existing entries for this user first)
    sqlx::query("DELETE FROM entries WHERE user_id = $1")
        .bind(user_id)
        .execute(&pool)
        .await
        .context("Failed to clear existing entries")?;

    let entries = build_demo_entries(today);
    for entry in &entries {
        sqlx::query(
            r#"
            INSERT INTO entries (id, user_id, entry_date, cycle_day, flow, pain, symptoms, mood, note, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5::flow, $6, $7, $8::mood, $9, now(), now())
            "#,
        )
        .bind(Uuid::new_v4())
        .bind(user_id)
        .bind(entry.entry_date)
        .bind(entry.cycle_day)
        .bind(&entry.flow)
        .bind(entry.pain)
        .bind(&entry.symptoms)
        .bind(&entry.mood)
        .bind(&entry.note)
        .execute(&pool)
        .await
        .context("Failed to insert entry")?;
    }

    println!("Seeded demo user 'achieng' with profile and {} entries.", entries.len());
    Ok(())
}