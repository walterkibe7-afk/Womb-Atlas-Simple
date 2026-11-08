use axum::{extract::{State, Extension, Path, Query}, routing::{get, put, delete}, Json, Router};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::NaiveDate;
use sqlx::Row;
use crate::{state::AppState, error::{ApiError, ApiResult}, validate::{validate_cycle_day, validate_flow, validate_pain, validate_symptoms, validate_mood, validate_note, parse_date, validate_date_range}};

#[derive(Serialize)]
pub struct EntriesResponse {
    entries: Vec<EntryResponse>,
}

#[derive(Serialize)]
pub struct EntryResponse {
    #[serde(rename = "entryDate")]
    entry_date: NaiveDate,
    #[serde(rename = "cycleDay")]
    cycle_day: i32,
    flow: String,
    pain: i32,
    symptoms: Vec<String>,
    mood: Option<String>,
    note: Option<String>,
    #[serde(rename = "createdAt")]
    created_at: chrono::DateTime<chrono::Utc>,
    #[serde(rename = "updatedAt")]
    updated_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct UpsertEntryRequest {
    #[serde(rename = "cycleDay")]
    cycle_day: i32,
    flow: String,
    pain: i32,
    symptoms: Vec<String>,
    mood: Option<String>,
    note: Option<String>,
}

#[derive(Deserialize)]
pub struct EntriesQuery {
    from: Option<String>,
    to: Option<String>,
}

pub fn entries_routes() -> Router<AppState> {
    Router::new()
        .route("/api/entries", get(list_entries))
        .route("/api/entries/:date", put(upsert_entry).delete(delete_entry))
}

async fn list_entries(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    Query(query): Query<EntriesQuery>,
) -> ApiResult<Json<EntriesResponse>> {
    let (from_date, to_date) = validate_date_range(query.from.as_deref(), query.to.as_deref())?;

    let mut query_builder = sqlx::QueryBuilder::new(
        r#"
        SELECT entry_date, cycle_day, flow::text as flow, pain, symptoms, mood::text as mood, note, created_at, updated_at
        FROM entries
        WHERE user_id = "#
    );
    query_builder.push_bind(user_id);

    if let Some(from) = from_date {
        query_builder.push(" AND entry_date >= ");
        query_builder.push_bind(from);
    }

    if let Some(to) = to_date {
        query_builder.push(" AND entry_date <= ");
        query_builder.push_bind(to);
    }

    query_builder.push(" ORDER BY entry_date DESC");

    let rows = query_builder
        .build_query_as::<(NaiveDate, i32, String, i32, Vec<String>, Option<String>, Option<String>, chrono::DateTime<chrono::Utc>, chrono::DateTime<chrono::Utc>)>()
        .fetch_all(&state.pool)
        .await?;

    let entries = rows
        .into_iter()
        .map(|(entry_date, cycle_day, flow, pain, symptoms, mood, note, created_at, updated_at)| EntryResponse {
            entry_date,
            cycle_day,
            flow,
            pain,
            symptoms,
            mood,
            note,
            created_at,
            updated_at,
        })
        .collect();

    Ok(Json(EntriesResponse { entries }))
}

async fn upsert_entry(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    Path(date_str): Path<String>,
    Json(req): Json<UpsertEntryRequest>,
) -> ApiResult<Json<EntryResponse>> {
    validate_cycle_day(req.cycle_day)?;
    validate_flow(&req.flow)?;
    validate_pain(req.pain)?;
    validate_symptoms(&req.symptoms)?;
    validate_mood(req.mood.as_deref())?;
    validate_note(req.note.as_deref())?;

    let entry_date = parse_date(&date_str)?;

    // Upsert entry
    let row = sqlx::query(
        r#"
        INSERT INTO entries (id, user_id, entry_date, cycle_day, flow, pain, symptoms, mood, note, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5::flow, $6, $7, $8::mood, $9, now(), now())
        ON CONFLICT (user_id, entry_date) DO UPDATE SET
            cycle_day = EXCLUDED.cycle_day,
            flow = EXCLUDED.flow,
            pain = EXCLUDED.pain,
            symptoms = EXCLUDED.symptoms,
            mood = EXCLUDED.mood,
            note = EXCLUDED.note,
            updated_at = now()
        RETURNING entry_date, cycle_day, flow::text as flow, pain, symptoms, mood::text as mood, note, created_at, updated_at
        "#,
    )
    .bind(Uuid::new_v4())
    .bind(user_id)
    .bind(entry_date)
    .bind(req.cycle_day)
    .bind(&req.flow)
    .bind(req.pain)
    .bind(&req.symptoms)
    .bind(&req.mood)
    .bind(&req.note)
    .fetch_one(&state.pool)
    .await?;

    let entry = EntryResponse {
        entry_date: row.get("entry_date"),
        cycle_day: row.get("cycle_day"),
        flow: row.get("flow"),
        pain: row.get("pain"),
        symptoms: row.get("symptoms"),
        mood: row.get("mood"),
        note: row.get("note"),
        created_at: row.get("created_at"),
        updated_at: row.get("updated_at"),
    };

    Ok(Json(entry))
}

async fn delete_entry(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    Path(date_str): Path<String>,
) -> ApiResult<Json<serde_json::Value>> {
    let entry_date = parse_date(&date_str)?;

    let result = sqlx::query(
        "DELETE FROM entries WHERE user_id = $1 AND entry_date = $2"
    )
    .bind(user_id)
    .bind(entry_date)
    .execute(&state.pool)
    .await?;

    if result.rows_affected() == 0 {
        return Err(ApiError::EntryNotFound);
    }

    Ok(Json(serde_json::json!({ "ok": true })))
}