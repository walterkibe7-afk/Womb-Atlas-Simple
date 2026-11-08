-- Enum renames to match API contract (hyphenated spelling)
ALTER TYPE life_stage RENAME VALUE 'currently_cycling'   TO 'currently-cycling';
ALTER TYPE life_stage RENAME VALUE 'pregnant_recovering' TO 'pregnant-recovering';
ALTER TYPE life_stage RENAME VALUE 'not_sure'            TO 'not-sure';
ALTER TYPE mood       RENAME VALUE 'low_energy'          TO 'low-energy';

-- Account columns on users
ALTER TABLE users
  ADD COLUMN handle          VARCHAR(24),
  ADD COLUMN failed_attempts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN locked_until    TIMESTAMPTZ;

ALTER TABLE users ADD CONSTRAINT users_handle_key UNIQUE (handle);
ALTER TABLE users ADD CONSTRAINT users_handle_format
  CHECK (handle IS NULL OR handle ~ '^[a-z0-9][a-z0-9._-]{2,23}$');