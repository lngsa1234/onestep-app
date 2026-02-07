-- ================================================
-- Supabase SQL Setup for Relationship Reflection
-- Run this in your Supabase SQL Editor
-- ================================================

-- 1. Create the table
CREATE TABLE assessment_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  language TEXT NOT NULL DEFAULT 'en',
  answers JSONB NOT NULL,
  total_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL DEFAULT 88,
  score_pct NUMERIC(5, 4) NOT NULL,
  category_scores JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Anyone can INSERT (anonymous submissions)
CREATE POLICY "Allow anonymous inserts"
  ON assessment_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 4. Policy: Only authenticated users can SELECT (dashboard access)
--    For now, we also allow anon to read so you can view the dashboard
--    without auth. Change this to 'authenticated' for production.
CREATE POLICY "Allow reads for dashboard"
  ON assessment_responses
  FOR SELECT
  TO anon
  USING (true);

-- 5. Create index for faster queries
CREATE INDEX idx_responses_created_at ON assessment_responses (created_at DESC);
CREATE INDEX idx_responses_language ON assessment_responses (language);

-- ================================================
-- OPTIONAL: If you want to restrict dashboard to
-- authenticated users only, replace policy #4 with:
--
-- CREATE POLICY "Authenticated reads only"
--   ON assessment_responses
--   FOR SELECT
--   TO authenticated
--   USING (true);
-- ================================================
