-- Seed data for demo user Achieng
-- Run this after migration is applied

-- Check if Achieng already exists
DO $$
DECLARE
    v_user_id UUID;
    v_profile_id UUID;
    v_today DATE := CURRENT_DATE;
    v_period_start DATE := CURRENT_DATE - INTERVAL '2 days';
    v_prev_period_start DATE := CURRENT_DATE - INTERVAL '30 days';
BEGIN
    -- Check if Achieng exists
    SELECT id INTO v_user_id FROM users WHERE name = 'Achieng';
    
    IF v_user_id IS NOT NULL THEN
        RAISE NOTICE 'Already seeded.';
        RETURN;
    END IF;
    
    -- Check if any other users exist
    IF EXISTS (SELECT 1 FROM users WHERE name != 'Achieng') THEN
        RAISE EXCEPTION 'Refusing to seed: other users exist in the database.';
    END IF;
    
    -- Create user Achieng
    v_user_id := gen_random_uuid();
    INSERT INTO users (id, name, pin_hash, created_at, updated_at)
    VALUES (v_user_id, 'Achieng', NULL, now(), now());
    
    -- Create completed profile for Achieng
    v_profile_id := gen_random_uuid();
    INSERT INTO profiles (id, user_id, last_period_start, life_stage, cycle_length, period_length, uses_hormonal_birth_control, has_completed_onboarding, created_at, updated_at)
    VALUES (v_profile_id, v_user_id, v_period_start, 'currently_cycling', 28, 5, false, true, now(), now());
    
    -- Insert demo entries - current cycle (3 days of period ~2 days ago at declining pain)
    INSERT INTO entries (id, user_id, entry_date, cycle_day, flow, pain, symptoms, mood, note, created_at, updated_at) VALUES
    (gen_random_uuid(), v_user_id, v_period_start, 1, 'heavy', 4, ARRAY['cramps','backache'], 'tender', 'First day arrival. Nourished with bone broth and quiet music.', now(), now()),
    (gen_random_uuid(), v_user_id, v_period_start + INTERVAL '1 day', 2, 'medium', 2, ARRAY['cramps','fatigue'], 'reflective', 'Gentle dusk stroll through the garden. Early bedtime.', now(), now()),
    (gen_random_uuid(), v_user_id, v_period_start + INTERVAL '2 days', 3, 'light', 1, ARRAY['cramps'], 'calm', 'Sipped warm raspberry leaf infusion; the sharp tension has subsided.', now(), now());
    
    -- Previous cycle (28 days back)
    INSERT INTO entries (id, user_id, entry_date, cycle_day, flow, pain, symptoms, mood, note, created_at, updated_at) VALUES
    (gen_random_uuid(), v_user_id, v_prev_period_start, 1, 'heavy', 4, ARRAY['cramps','backache'], 'tender', 'First day arrival. Nourished with bone broth and quiet music.', now(), now()),
    (gen_random_uuid(), v_user_id, v_prev_period_start + INTERVAL '1 day', 2, 'heavy', 3, ARRAY['cramps','headache'], 'low_energy', 'Took warm baths and stayed off screens.', now(), now()),
    (gen_random_uuid(), v_user_id, v_prev_period_start + INTERVAL '2 days', 3, 'medium', 2, ARRAY['cramps'], 'calm', 'Noticeable drop in pain by evening, as usual for day 3.', now(), now());
    
    RAISE NOTICE 'Seeded demo user Achieng with profile and 6 entries.';
END $$;