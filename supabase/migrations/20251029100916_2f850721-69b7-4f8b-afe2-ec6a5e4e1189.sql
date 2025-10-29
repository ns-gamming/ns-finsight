-- Phase 2: Analytics & Activity Tracking Tables

-- User activity logs table
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_category TEXT NOT NULL,
  event_action TEXT NOT NULL,
  event_label TEXT,
  page_path TEXT,
  metadata JSONB DEFAULT '{}',
  ip_hash TEXT,
  user_agent TEXT,
  session_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User sessions table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start TIMESTAMPTZ DEFAULT NOW(),
  session_end TIMESTAMPTZ,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  ip_hash TEXT,
  pages_visited INT DEFAULT 0,
  actions_count INT DEFAULT 0,
  duration_seconds INT,
  metadata JSONB DEFAULT '{}'
);

-- Page analytics table
CREATE TABLE IF NOT EXISTS public.page_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  page_path TEXT NOT NULL,
  time_spent_seconds INT DEFAULT 0,
  scroll_depth_percent INT DEFAULT 0,
  interactions_count INT DEFAULT 0,
  entry_page BOOLEAN DEFAULT FALSE,
  exit_page BOOLEAN DEFAULT FALSE,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Phase 3: Enhanced Family System

-- Add new columns to family_members table
ALTER TABLE public.family_members 
  ADD COLUMN IF NOT EXISTS email TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS user_account_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member',
  ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{"view_own": true, "edit_own": true}',
  ADD COLUMN IF NOT EXISTS invite_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS invite_token TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS invited_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS joined_at TIMESTAMPTZ;

-- Family groups table
CREATE TABLE IF NOT EXISTS public.family_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  primary_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  settings JSONB DEFAULT '{"shared_view": true, "approval_required": false}'
);

-- Family group members junction table
CREATE TABLE IF NOT EXISTS public.family_group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  family_member_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  role TEXT NOT NULL DEFAULT 'member',
  permissions JSONB DEFAULT '{}',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(family_group_id, user_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_group_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_activity_logs
CREATE POLICY "Users can view own activity logs"
  ON public.user_activity_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity logs"
  ON public.user_activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_sessions
CREATE POLICY "Users can view own sessions"
  ON public.user_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON public.user_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON public.user_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for page_analytics
CREATE POLICY "Users can view own page analytics"
  ON public.page_analytics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own page analytics"
  ON public.page_analytics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for family_groups
CREATE POLICY "Users can view family groups they belong to"
  ON public.family_groups FOR SELECT
  USING (
    auth.uid() = primary_user_id OR
    EXISTS (
      SELECT 1 FROM family_group_members 
      WHERE family_group_id = family_groups.id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own family groups"
  ON public.family_groups FOR INSERT
  WITH CHECK (auth.uid() = primary_user_id);

CREATE POLICY "Primary users can update own family groups"
  ON public.family_groups FOR UPDATE
  USING (auth.uid() = primary_user_id);

CREATE POLICY "Primary users can delete own family groups"
  ON public.family_groups FOR DELETE
  USING (auth.uid() = primary_user_id);

-- RLS Policies for family_group_members
CREATE POLICY "Users can view family group members they belong to"
  ON public.family_group_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM family_groups 
      WHERE id = family_group_id 
      AND (primary_user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM family_group_members fgm
        WHERE fgm.family_group_id = family_groups.id
        AND fgm.user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Family group admins can insert members"
  ON public.family_group_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_groups 
      WHERE id = family_group_id 
      AND primary_user_id = auth.uid()
    )
  );

CREATE POLICY "Family group admins can update members"
  ON public.family_group_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM family_groups 
      WHERE id = family_group_id 
      AND primary_user_id = auth.uid()
    )
  );

CREATE POLICY "Family group admins can delete members"
  ON public.family_group_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM family_groups 
      WHERE id = family_group_id 
      AND primary_user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON public.user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON public.user_activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_page_analytics_user_id ON public.page_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_family_members_email ON public.family_members(email);
CREATE INDEX IF NOT EXISTS idx_family_members_invite_token ON public.family_members(invite_token);
CREATE INDEX IF NOT EXISTS idx_family_group_members_user_id ON public.family_group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_family_group_members_family_group_id ON public.family_group_members(family_group_id);