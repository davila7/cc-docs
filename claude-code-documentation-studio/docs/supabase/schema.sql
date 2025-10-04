-- =============================================
-- PROGRESS TRACKING SCHEMA
-- =============================================

-- User Progress Table
-- Tracks overall progress per user per section
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL DEFAULT 'claude-code', -- 'claude-code', 'advanced-course', etc.
  section_id TEXT NOT NULL, -- 'subagents', 'hooks', 'workflows'
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_pages INTEGER NOT NULL DEFAULT 0,
  completed_pages INTEGER NOT NULL DEFAULT 0,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id, section_id)
);

-- Page Visits Table
-- Tracks individual page visits
CREATE TABLE IF NOT EXISTS page_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL DEFAULT 'claude-code',
  section_id TEXT NOT NULL,
  page_id TEXT NOT NULL, -- Full path like '/docs/subagents/overview'
  page_title TEXT,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_spent_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Achievements Table (optional - for gamification)
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL, -- 'section_completed', 'first_visit', 'speed_reader', etc.
  section_id TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB, -- Additional data about the achievement
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_section_id ON user_progress(section_id);
CREATE INDEX IF NOT EXISTS idx_page_visits_user_id ON page_visits(user_id);
CREATE INDEX IF NOT EXISTS idx_page_visits_page_id ON page_visits(page_id);
CREATE INDEX IF NOT EXISTS idx_page_visits_section_id ON page_visits(section_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Policies for user_progress
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for page_visits
CREATE POLICY "Users can view own page visits"
  ON page_visits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own page visits"
  ON page_visits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies for user_achievements
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to update progress percentage
CREATE OR REPLACE FUNCTION update_progress_percentage()
RETURNS TRIGGER AS $$
BEGIN
  NEW.progress_percentage := CASE
    WHEN NEW.total_pages > 0 THEN (NEW.completed_pages::DECIMAL / NEW.total_pages::DECIMAL) * 100
    ELSE 0
  END;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate progress percentage
CREATE TRIGGER calculate_progress_percentage
  BEFORE INSERT OR UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_progress_percentage();

-- Function to get user's overall progress
CREATE OR REPLACE FUNCTION get_user_overall_progress(p_user_id UUID)
RETURNS TABLE (
  total_sections INTEGER,
  completed_sections INTEGER,
  overall_percentage DECIMAL,
  total_pages_visited INTEGER,
  total_time_spent INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT section_id)::INTEGER as total_sections,
    COUNT(DISTINCT section_id) FILTER (WHERE progress_percentage = 100)::INTEGER as completed_sections,
    COALESCE(AVG(progress_percentage), 0)::DECIMAL as overall_percentage,
    COUNT(DISTINCT pv.page_id)::INTEGER as total_pages_visited,
    COALESCE(SUM(pv.time_spent_seconds), 0)::INTEGER as total_time_spent
  FROM user_progress up
  LEFT JOIN page_visits pv ON up.user_id = pv.user_id AND up.section_id = pv.section_id
  WHERE up.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- SAMPLE DATA (for testing)
-- =============================================

-- Insert section configurations (you can customize this)
CREATE TABLE IF NOT EXISTS section_config (
  section_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  total_pages INTEGER NOT NULL,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO section_config (section_id, display_name, total_pages, icon, color) VALUES
  ('subagents', 'Subagents', 2, '🤖', '#f97316'),
  ('hooks', 'Hooks', 2, '🪝', '#3b82f6'),
  ('workflows', 'Workflows', 1, '⚡', '#10b981')
ON CONFLICT (section_id) DO NOTHING;
