-- Run this in your Supabase SQL editor to set up the required tables.

-- ─── Profiles ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             TEXT UNIQUE NOT NULL,          -- Clerk user ID
  degree_subject      TEXT,
  university          TEXT,
  graduation_year     INTEGER,
  sectors             TEXT[]   DEFAULT '{}',         -- e.g. {"Finance","Tech"}
  locations           TEXT[]   DEFAULT '{}',         -- e.g. {"London","Remote"}
  bio                 TEXT,
  onboarding_complete BOOLEAN  DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- ─── User applications (Kanban tracker) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_applications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       TEXT NOT NULL,                       -- Clerk user ID
  internship_id UUID REFERENCES internships(id) ON DELETE SET NULL,
  company       TEXT NOT NULL,
  role          TEXT NOT NULL,
  sector        TEXT,
  location      TEXT,
  deadline      DATE,
  salary        TEXT,
  link          TEXT,
  status        TEXT NOT NULL DEFAULT 'Wishlist',    -- Wishlist | Applied | OA/Test | Interview | AC | Offer | Rejected
  notes         TEXT DEFAULT '',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_applications_user_id_idx ON user_applications(user_id);

-- Optional: update updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_applications_updated_at
  BEFORE UPDATE ON user_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Row Level Security ────────────────────────────────────────────────────────
-- RLS is enabled on every table. The app talks to Supabase in two ways:
--
--   1. Server API routes use the SERVICE ROLE key, which bypasses RLS. Every
--      query there is explicitly scoped to the authenticated Clerk user_id, so
--      a user can only ever read or write their own rows.
--
--   2. If you also want the public anon/publishable key to read rows directly
--      from the browser (lib/supabase-client.js), configure Clerk's Supabase
--      third-party auth integration so the Clerk user ID arrives as the JWT
--      `sub` claim. The policies below then enforce per-user access for anon.

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_applications ENABLE ROW LEVEL SECURITY;

-- profiles: a user may only read/write the row whose user_id equals their
-- Clerk ID (the JWT `sub` claim).
CREATE POLICY "profiles: users manage own row"
  ON profiles
  FOR ALL
  USING (user_id = (auth.jwt() ->> 'sub'))
  WITH CHECK (user_id = (auth.jwt() ->> 'sub'));

-- user_applications: a user may only read/write their own application rows.
CREATE POLICY "applications: users manage own rows"
  ON user_applications
  FOR ALL
  USING (user_id = (auth.jwt() ->> 'sub'))
  WITH CHECK (user_id = (auth.jwt() ->> 'sub'));

-- ─── Internships (read-only for everyone) ─────────────────────────────────────
-- Create this table if it doesn't exist yet.
CREATE TABLE IF NOT EXISTS internships (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company     TEXT NOT NULL,
  role        TEXT NOT NULL,
  sector      TEXT,
  location    TEXT,
  deadline    DATE,
  salary      TEXT,
  link        TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE internships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "internships: public read"
  ON internships
  FOR SELECT
  USING (true);
