-- Migration: Create customer_interest_surveys table
-- Description: Stores customer survey responses for ONIT customer interest research

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create customer_interest_surveys table
CREATE TABLE IF NOT EXISTS public.customer_interest_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    age INTEGER,
    location TEXT,
    occupation TEXT NOT NULL,
    currently_uses_services TEXT,
    required_services JSONB DEFAULT '[]'::jsonb,
    other_service TEXT,
    service_frequency TEXT,
    provider_discovery_methods JSONB DEFAULT '[]'::jsonb,
    other_discovery_method TEXT,
    interested_in_online_platform TEXT,
    booking_challenges JSONB DEFAULT '[]'::jsonb,
    service_provider_criteria JSONB DEFAULT '{}'::jsonb,
    would_use_onit TEXT,
    referral_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add index on created_at for fast analytical queries & exports
CREATE INDEX IF NOT EXISTS idx_customer_interest_surveys_created_at 
ON public.customer_interest_surveys (created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.customer_interest_surveys ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow anonymous survey submissions" ON public.customer_interest_surveys;
DROP POLICY IF EXISTS "Allow read survey responses for admin dashboard" ON public.customer_interest_surveys;
DROP POLICY IF EXISTS "Deny public select" ON public.customer_interest_surveys;
DROP POLICY IF EXISTS "Deny public update" ON public.customer_interest_surveys;
DROP POLICY IF EXISTS "Deny public delete" ON public.customer_interest_surveys;

-- 1. Policy: Allow anon and authenticated roles to INSERT survey responses
CREATE POLICY "Allow anonymous survey submissions"
ON public.customer_interest_surveys
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 2. Policy: Allow anon and authenticated roles to SELECT survey responses for the /admin dashboard
CREATE POLICY "Allow read survey responses for admin dashboard"
ON public.customer_interest_surveys
FOR SELECT
TO anon, authenticated
USING (true);

COMMENT ON TABLE public.customer_interest_surveys IS 'ONIT Customer Interest Survey responses for home service research';
