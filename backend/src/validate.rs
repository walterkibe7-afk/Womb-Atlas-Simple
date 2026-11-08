use crate::error::{ApiError, ApiResult};
use chrono::NaiveDate;

const VALID_SYMPTOMS: &[&str] = &[
    "cramps",
    "tender-breasts",
    "fatigue",
    "headache",
    "bloating",
    "backache",
];

const VALID_FLOW: &[&str] = &["spotting", "light", "medium", "heavy", "none"];
const VALID_MOOD: &[&str] = &["calm", "reflective", "sensitive", "low-energy", "grounded", "tender"];
const VALID_LIFE_STAGE: &[&str] = &["currently-cycling", "postpartum", "perimenopause", "pregnant-recovering", "not-sure"];

pub fn validate_pin(pin: &str) -> ApiResult<()> {
    if pin.len() < 4 || pin.len() > 12 {
        return Err(ApiError::InvalidPin("pin must be 4-12 digits".to_string()));
    }
    if !pin.chars().all(|c| c.is_ascii_digit()) {
        return Err(ApiError::InvalidPin("pin must contain only digits".to_string()));
    }
    Ok(())
}

pub fn validate_name(name: &str) -> ApiResult<String> {
    let trimmed = name.trim();
    if trimmed.is_empty() {
        return Err(ApiError::InvalidName("name is required".to_string()));
    }
    if trimmed.len() > 80 {
        return Err(ApiError::InvalidName("name must be 80 characters or fewer".to_string()));
    }
    Ok(trimmed.to_string())
}

pub fn validate_cycle_length(length: i32) -> ApiResult<i32> {
    if !(21..=35).contains(&length) {
        return Err(ApiError::Validation("cycleLength must be between 21 and 35".to_string()));
    }
    Ok(length)
}

pub fn validate_period_length(length: i32) -> ApiResult<i32> {
    if !(2..=7).contains(&length) {
        return Err(ApiError::Validation("periodLength must be between 2 and 7".to_string()));
    }
    Ok(length)
}

pub fn validate_pain(pain: i32) -> ApiResult<i32> {
    if !(0..=5).contains(&pain) {
        return Err(ApiError::Validation("pain must be between 0 and 5".to_string()));
    }
    Ok(pain)
}

pub fn validate_cycle_day(day: i32) -> ApiResult<i32> {
    if !(1..=35).contains(&day) {
        return Err(ApiError::Validation("cycleDay must be between 1 and 35".to_string()));
    }
    Ok(day)
}

pub fn validate_flow(flow: &str) -> ApiResult<()> {
    if !VALID_FLOW.contains(&flow) {
        return Err(ApiError::Validation("invalid flow value".to_string()));
    }
    Ok(())
}

pub fn validate_mood(mood: Option<&str>) -> ApiResult<()> {
    if let Some(m) = mood {
        if !VALID_MOOD.contains(&m) {
            return Err(ApiError::Validation("invalid mood value".to_string()));
        }
    }
    Ok(())
}

pub fn validate_life_stage(stage: Option<&str>) -> ApiResult<()> {
    if let Some(s) = stage {
        if !VALID_LIFE_STAGE.contains(&s) {
            return Err(ApiError::Validation("invalid lifeStage value".to_string()));
        }
    }
    Ok(())
}

pub fn validate_symptoms(symptoms: &[String]) -> ApiResult<()> {
    for s in symptoms {
        if !VALID_SYMPTOMS.contains(&s.as_str()) {
            return Err(ApiError::Validation(format!("invalid symptom: {}", s)));
        }
    }
    Ok(())
}

pub fn validate_note(note: Option<&str>) -> ApiResult<()> {
    if let Some(n) = note {
        if n.len() > 2000 {
            return Err(ApiError::Validation("note must be 2000 characters or fewer".to_string()));
        }
    }
    Ok(())
}

pub fn parse_date(date_str: &str) -> ApiResult<NaiveDate> {
    NaiveDate::parse_from_str(date_str, "%Y-%m-%d")
        .map_err(|_| ApiError::Validation("invalid date format, expected YYYY-MM-DD".to_string()))
}

pub fn validate_date_range(from: Option<&str>, to: Option<&str>) -> ApiResult<(Option<NaiveDate>, Option<NaiveDate>)> {
    let from_date = match from {
        Some(s) => Some(parse_date(s)?),
        None => None,
    };
    let to_date = match to {
        Some(s) => Some(parse_date(s)?),
        None => None,
    };
    Ok((from_date, to_date))
}