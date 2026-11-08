use axum::{extract::{State, Extension}, routing::{get, put}, Json, Router};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::NaiveDate;
use sqlx::Row;
use crate::{state::AppState, error::ApiResult, validate::{validate_name, validate_cycle_length, validate_period_length, validate_life_stage, parse_date}};

#[derive(Serialize)]
pub struct MeResponse {
    user: UserResponse,
    profile: ProfileResponse,
}

#[derive(Serialize)]
pub struct UserResponse {
    id: Uuid,
    name: String,
}

#[derive(Serialize)]
pub struct ProfileResponse {
    #[serde(rename = "lastPeriodStart")]
    last_period_start: Option<NaiveDate>,
    #[serde(rename = "lifeStage")]
    life_stage: Option<String>,
    #[serde(rename = "cycleLength")]
    cycle_length: i32,
    #[serde(rename = "periodLength")]
    period_length: i32,
    #[serde(rename = "usesHormonalBirthControl")]
    uses_hormonal_birth_control: bool,
    #[serde(rename = "hasCompletedOnboarding")]
    has_completed_onboarding: bool,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct UpdateMeRequest {
    name: Option<String>,
    #[serde(rename = "lastPeriodStart")]
    last_period_start: Option<Option<String>>,
    #[serde(rename = "lifeStage")]
    life_stage: Option<Option<String>>,
    #[serde(rename = "cycleLength")]
    cycle_length: Option<i32>,
    #[serde(rename = "periodLength")]
    period_length: Option<i32>,
    #[serde(rename = "usesHormonalBirthControl")]
    uses_hormonal_birth_control: Option<bool>,
    #[serde(rename = "hasCompletedOnboarding")]
    has_completed_onboarding: Option<bool>,
}

pub fn me_routes() -> Router<AppState> {
    Router::new()
        .route("/api/me", get(get_me).put(put_me))
}

async fn get_me(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
) -> ApiResult<Json<MeResponse>> {
    // Get user
    let user_row = sqlx::query("SELECT id, name FROM users WHERE id = $1")
        .bind(user_id)
        .fetch_one(&state.pool)
        .await?;
    let user = UserResponse {
        id: user_row.get("id"),
        name: user_row.get("name"),
    };

    // Get or create profile
    let profile_row = sqlx::query(
        r#"
        SELECT last_period_start, life_stage::text as life_stage, cycle_length, period_length, uses_hormonal_birth_control, has_completed_onboarding
        FROM profiles WHERE user_id = $1
        "#,
    )
    .bind(user_id)
    .fetch_optional(&state.pool)
    .await?;

    let profile = match profile_row {
        Some(row) => ProfileResponse {
            last_period_start: row.get("last_period_start"),
            life_stage: row.get::<Option<String>, _>("life_stage").map(|s| s),
            cycle_length: row.get("cycle_length"),
            period_length: row.get("period_length"),
            uses_hormonal_birth_control: row.get("uses_hormonal_birth_control"),
            has_completed_onboarding: row.get("has_completed_onboarding"),
        },
        None => {
            // Create default profile
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

            ProfileResponse {
                last_period_start: None,
                life_stage: None,
                cycle_length: 28,
                period_length: 5,
                uses_hormonal_birth_control: false,
                has_completed_onboarding: false,
            }
        }
    };

    Ok(Json(MeResponse { user, profile }))
}

async fn put_me(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    Json(req): Json<UpdateMeRequest>,
) -> ApiResult<Json<MeResponse>> {
    // Update user name if provided
    if let Some(name) = req.name {
        let validated_name = validate_name(&name)?;
        sqlx::query("UPDATE users SET name = $1 WHERE id = $2")
            .bind(&validated_name)
            .bind(user_id)
            .execute(&state.pool)
            .await?;
    }

    // Update profile fields
    if let Some(last_period_start) = req.last_period_start {
        match last_period_start {
            Some(date_str) => {
                let date = parse_date(&date_str)?;
                sqlx::query("UPDATE profiles SET last_period_start = $1 WHERE user_id = $2")
                    .bind(date)
                    .bind(user_id)
                    .execute(&state.pool)
                    .await?;
            }
            None => {
                sqlx::query("UPDATE profiles SET last_period_start = NULL WHERE user_id = $1")
                    .bind(user_id)
                    .execute(&state.pool)
                    .await?;
            }
        }
    }

    if let Some(life_stage) = req.life_stage {
        match life_stage {
            Some(stage) => {
                validate_life_stage(Some(&stage))?;
                let db_stage = stage.replace('-', "_");
                sqlx::query("UPDATE profiles SET life_stage = $1::life_stage WHERE user_id = $2")
                    .bind(db_stage)
                    .bind(user_id)
                    .execute(&state.pool)
                    .await?;
            }
            None => {
                sqlx::query("UPDATE profiles SET life_stage = NULL WHERE user_id = $1")
                    .bind(user_id)
                    .execute(&state.pool)
                    .await?;
            }
        }
    }

    if let Some(cycle_length) = req.cycle_length {
        let cl = validate_cycle_length(cycle_length)?;
        sqlx::query("UPDATE profiles SET cycle_length = $1 WHERE user_id = $2")
            .bind(cl)
            .bind(user_id)
            .execute(&state.pool)
            .await?;
    }

    if let Some(period_length) = req.period_length {
        let pl = validate_period_length(period_length)?;
        sqlx::query("UPDATE profiles SET period_length = $1 WHERE user_id = $2")
            .bind(pl)
            .bind(user_id)
            .execute(&state.pool)
            .await?;
    }

    if let Some(uses_hormonal_birth_control) = req.uses_hormonal_birth_control {
        sqlx::query("UPDATE profiles SET uses_hormonal_birth_control = $1 WHERE user_id = $2")
            .bind(uses_hormonal_birth_control)
            .bind(user_id)
            .execute(&state.pool)
            .await?;
    }

    if let Some(has_completed_onboarding) = req.has_completed_onboarding {
        sqlx::query("UPDATE profiles SET has_completed_onboarding = $1 WHERE user_id = $2")
            .bind(has_completed_onboarding)
            .bind(user_id)
            .execute(&state.pool)
            .await?;
    }

    // Return updated me
    get_me(State(state), Extension(user_id)).await
}