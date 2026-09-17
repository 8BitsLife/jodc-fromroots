-- ==============================================================================
-- JODC — Repo of the Week Supabase Schema
-- ==============================================================================
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

-- 1. Repositories Table
CREATE TABLE IF NOT EXISTS public.repos (
    id TEXT PRIMARY KEY,
    rank INTEGER NOT NULL DEFAULT 0,
    name TEXT NOT NULL,
    full_name TEXT NOT NULL UNIQUE,
    tagline TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
    stars INTEGER NOT NULL DEFAULT 0,
    forks INTEGER NOT NULL DEFAULT 0,
    open_issues INTEGER NOT NULL DEFAULT 0,
    license TEXT NOT NULL DEFAULT 'MIT',
    version TEXT NOT NULL DEFAULT '',
    week TEXT NOT NULL DEFAULT '',
    date_range TEXT NOT NULL DEFAULT '',
    growth TEXT NOT NULL DEFAULT '',
    languages JSONB NOT NULL DEFAULT '[]'::jsonb,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    github_url TEXT NOT NULL,
    demo_url TEXT NOT NULL DEFAULT '',
    curator_review TEXT NOT NULL DEFAULT '',
    curator_author TEXT NOT NULL DEFAULT 'JODC Technical Board',
    builder JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'archived', 'pending')),
    is_active_spotlight BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Weekly Spotlights Archive Table
CREATE TABLE IF NOT EXISTS public.spotlights (
    id TEXT PRIMARY KEY,
    repo_id TEXT NOT NULL REFERENCES public.repos(id) ON DELETE CASCADE,
    week TEXT NOT NULL,
    date_range TEXT NOT NULL,
    growth TEXT NOT NULL DEFAULT '',
    is_current BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Community Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    github_url TEXT NOT NULL,
    repo_name TEXT NOT NULL,
    tagline TEXT,
    category TEXT,
    demo_url TEXT,
    submitter_name TEXT NOT NULL,
    submitter_email TEXT NOT NULL,
    submitter_handle TEXT,
    campus_year TEXT,
    pitch TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Indexes for fast retrieval
CREATE INDEX IF NOT EXISTS idx_repos_rank ON public.repos(rank ASC);
CREATE INDEX IF NOT EXISTS idx_repos_status ON public.repos(status);
CREATE INDEX IF NOT EXISTS idx_repos_is_active ON public.repos(is_active_spotlight);
CREATE INDEX IF NOT EXISTS idx_spotlights_is_current ON public.spotlights(is_current);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);

-- 5. Updated_at Trigger Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_repos_updated_at ON public.repos;
CREATE TRIGGER set_repos_updated_at
    BEFORE UPDATE ON public.repos
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_submissions_updated_at ON public.submissions;
CREATE TRIGGER set_submissions_updated_at
    BEFORE UPDATE ON public.submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. Row Level Security (RLS) Policies
ALTER TABLE public.repos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spotlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Repos: Public can read approved/active repos; service role can write
DROP POLICY IF EXISTS "Public can view approved repos" ON public.repos;
CREATE POLICY "Public can view approved repos"
    ON public.repos
    FOR SELECT
    USING (status = 'approved');

DROP POLICY IF EXISTS "Service role has full access to repos" ON public.repos;
CREATE POLICY "Service role has full access to repos"
    ON public.repos
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Spotlights: Public can read spotlights; service role can write
DROP POLICY IF EXISTS "Public can view spotlights" ON public.spotlights;
CREATE POLICY "Public can view spotlights"
    ON public.spotlights
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Service role has full access to spotlights" ON public.spotlights;
CREATE POLICY "Service role has full access to spotlights"
    ON public.spotlights
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Submissions: Anyone can submit a repository; only service role / admins can read or update
DROP POLICY IF EXISTS "Anyone can submit a repo" ON public.submissions;
CREATE POLICY "Anyone can submit a repo"
    ON public.submissions
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Service role has full access to submissions" ON public.submissions;
CREATE POLICY "Service role has full access to submissions"
    ON public.submissions
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
