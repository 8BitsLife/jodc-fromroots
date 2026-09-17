-- Run this in Supabase SQL Editor to add extended fields to public.submissions
ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS tagline TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS demo_url TEXT,
ADD COLUMN IF NOT EXISTS campus_year TEXT;
