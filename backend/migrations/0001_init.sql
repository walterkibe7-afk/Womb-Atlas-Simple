-- enums
CREATE TYPE life_stage AS ENUM ('currently_cycling','postpartum','perimenopause','pregnant_recovering','not_sure');
CREATE TYPE flow AS ENUM ('spotting','light','medium','heavy','none');
CREATE TYPE mood AS ENUM ('calm','reflective','sensitive','low_energy','grounded','tender');

CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(80) NOT NULL,                  -- REQUIRED (no nameless user)
  pin_hash   VARCHAR(160),                          -- 'argon2id$m=19456,t=2,p=1$<saltHex>$<keyHex>', NULL until setup
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE profiles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  last_period_start DATE,
  life_stage   life_stage,
  cycle_length INTEGER NOT NULL DEFAULT 28 CHECK (cycle_length BETWEEN 21 AND 35),
  period_length INTEGER NOT NULL DEFAULT 5 CHECK (period_length BETWEEN 2 AND 7),
  uses_hormonal_birth_control BOOLEAN NOT NULL DEFAULT FALSE,
  has_completed_onboarding BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE entries (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  cycle_day  INTEGER NOT NULL CHECK (cycle_day BETWEEN 1 AND 35),
  flow       flow NOT NULL,
  pain       INTEGER NOT NULL CHECK (pain BETWEEN 0 AND 5),
  symptoms   TEXT[] NOT NULL DEFAULT '{}',
  mood       mood,
  note       VARCHAR(2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, entry_date)
);
CREATE INDEX idx_entries_user_date ON entries (user_id, entry_date DESC);

CREATE TABLE sessions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash VARCHAR(64) NOT NULL UNIQUE,           -- sha256 hex of the bearer token
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_sessions_user ON sessions (user_id);

-- updated_at touch triggers for users/profiles/entries (simple trigger fn)
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER trigger_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER trigger_entries_updated_at
BEFORE UPDATE ON entries
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();