-- -----------------------------------------------------------------------------
-- CareerSaathi Database Schema Migration
-- Spec: docs/superpowers/specs/2026-10-05-backend-and-database-design.md
-- -----------------------------------------------------------------------------

-- 1. ENUMS & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('learner', 'counsellor', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE qualification_level AS ENUM ('class_8', 'class_10', 'class_12', 'iti_diploma', 'graduate', 'other');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE trade_category AS ENUM ('electrical', 'auto', 'digital', 'healthcare', 'construction', 'craft');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE sentiment_level AS ENUM ('aligned', 'hesitant', 'conflicted', 'blocked');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE callback_status AS ENUM ('pending', 'in_progress', 'resolved', 'follow_up_needed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE doc_type_enum AS ENUM ('marksheet_10th', 'aadhaar_card', 'domicile_certificate', 'income_certificate', 'bank_passbook_dbt', 'passport_photos', 'resume');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE doc_status_enum AS ENUM ('pending', 'ready', 'verified', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE center_type_enum AS ENUM ('govt_iti', 'pmkk', 'polytechnic', 'private_iti');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. CORE TABLES

-- 2.1 Profiles (User & Counsellor Identities)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'learner',
  phone TEXT UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  state TEXT DEFAULT 'Bihar',
  district TEXT DEFAULT 'Patna',
  pin_code TEXT,
  highest_qualification qualification_level DEFAULT 'class_10',
  degree_detail TEXT,
  preferred_language TEXT DEFAULT 'en',
  spoken_dialects TEXT[] DEFAULT ARRAY['Hindi']::TEXT[],
  interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  work_preference TEXT DEFAULT 'near_home',
  goal TEXT DEFAULT 'fast_earning',
  registered_portals TEXT[] DEFAULT ARRAY[]::TEXT[],
  shortlisted_trade_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  dbt_eligible BOOLEAN DEFAULT true,
  audio_narration_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.2 Vocational Trades (Verified Trades Catalog)
CREATE TABLE IF NOT EXISTS public.vocational_trades (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_hi TEXT NOT NULL,
  category trade_category NOT NULL,
  min_qualification qualification_level NOT NULL DEFAULT 'class_10',
  duration_months INT NOT NULL DEFAULT 24,
  govt_annual_fee INT NOT NULL DEFAULT 1500,
  private_annual_fee INT NOT NULL DEFAULT 35000,
  starting_monthly_pay_min INT NOT NULL DEFAULT 12000,
  starting_monthly_pay_max INT NOT NULL DEFAULT 22000,
  pay_growth_2yr_en TEXT NOT NULL,
  pay_growth_2yr_hi TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_hi TEXT NOT NULL,
  key_skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  safety_rating_en TEXT NOT NULL DEFAULT 'High',
  safety_rating_hi TEXT NOT NULL DEFAULT 'उच्च',
  ncvt_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.3 Training Centers (Verified Local Institutes & ITIs)
CREATE TABLE IF NOT EXISTS public.training_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id TEXT REFERENCES public.vocational_trades(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  center_type center_type_enum DEFAULT 'govt_iti',
  district TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'Bihar',
  address TEXT NOT NULL,
  travel_distance_km NUMERIC(5,2),
  bus_route_info_en TEXT,
  bus_route_info_hi TEXT,
  contact_phone TEXT,
  placement_rate_pct INT DEFAULT 85,
  is_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.4 Households (Zero-Auth Parent Decision Room)
CREATE TABLE IF NOT EXISTS public.households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  family_share_token TEXT UNIQUE NOT NULL,
  parent_name TEXT,
  parent_relation TEXT DEFAULT 'father',
  parent_phone TEXT,
  preferred_dialect TEXT DEFAULT 'Bhojpuri / Hindi',
  parent_consent_recorded BOOLEAN DEFAULT false,
  last_parent_viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_households_family_token ON public.households(family_share_token);

-- 2.5 Student Trade Selections (Active Trade Choices)
CREATE TABLE IF NOT EXISTS public.student_trade_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  trade_id TEXT NOT NULL REFERENCES public.vocational_trades(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT true,
  selected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_student_trades_learner ON public.student_trade_selections(learner_id);

-- 2.6 Counselling Sessions (AI 3D Avatar Calls & Transcripts)
CREATE TABLE IF NOT EXISTS public.counselling_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  trade_id TEXT REFERENCES public.vocational_trades(id) ON DELETE SET NULL,
  duration_seconds INT DEFAULT 0,
  transcript JSONB NOT NULL DEFAULT '[]'::JSONB,
  detected_sentiment sentiment_level DEFAULT 'aligned',
  extracted_concerns TEXT[] DEFAULT ARRAY[]::TEXT[],
  hud_widgets_shown JSONB DEFAULT '[]'::JSONB,
  audio_recording_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_counselling_learner ON public.counselling_sessions(learner_id);

-- 2.7 Family Callbacks (Dialect-Matched Counsellor Queue)
CREATE TABLE IF NOT EXISTS public.family_callbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  target_trade_id TEXT NOT NULL REFERENCES public.vocational_trades(id) ON DELETE CASCADE,
  parent_phone TEXT NOT NULL,
  preferred_time_slot TEXT DEFAULT 'evening',
  preferred_dialect TEXT NOT NULL,
  sentiment_level sentiment_level DEFAULT 'hesitant',
  primary_resistance TEXT NOT NULL,
  ai_transcript_snippet TEXT,
  status callback_status DEFAULT 'pending',
  assigned_counsellor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  counsellor_notes TEXT,
  scheduled_iti_visit_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_callbacks_status ON public.family_callbacks(status);

-- 2.8 Student Documents (Application Checklist & File Storage)
CREATE TABLE IF NOT EXISTS public.student_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doc_type doc_type_enum NOT NULL,
  storage_path TEXT,
  file_name TEXT,
  status doc_status_enum DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_student_docs_learner ON public.student_documents(learner_id);

-- 2.9 Admission Timelines (State ITI Milestones)
CREATE TABLE IF NOT EXISTS public.admission_timelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state TEXT NOT NULL DEFAULT 'Bihar',
  district TEXT,
  academic_year TEXT NOT NULL DEFAULT '2026-2027',
  step_number INT NOT NULL,
  title_en TEXT NOT NULL,
  title_hi TEXT NOT NULL,
  date_label_en TEXT NOT NULL,
  date_label_hi TEXT NOT NULL,
  status TEXT DEFAULT 'active'
);

-- 2.10 Activity Events (Live Realtime Telemetry Stream)
CREATE TABLE IF NOT EXISTS public.activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  learner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  trade_id TEXT,
  student_name TEXT NOT NULL,
  location TEXT NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_events_created ON public.activity_events(created_at DESC);

-- -----------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocational_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_trade_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselling_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_callbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin/counsellor from JWT claims
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'counsellor'),
    false
  );
$$;

-- 3.1 Profiles RLS
CREATE POLICY "Users can view own profile or staff can view all"
  ON public.profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id OR public.is_staff());

CREATE POLICY "Users can update own profile or staff can update"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id OR public.is_staff())
  WITH CHECK ((select auth.uid()) = id OR public.is_staff());

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

-- 3.2 Vocational Trades RLS (Public read, staff write)
CREATE POLICY "Public can view trades"
  ON public.vocational_trades FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Staff can manage trades"
  ON public.vocational_trades FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- 3.3 Training Centers RLS (Public read, staff write)
CREATE POLICY "Public can view training centers"
  ON public.training_centers FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Staff can manage training centers"
  ON public.training_centers FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- 3.4 Households RLS (Learners view own, parent with share token, or staff)
CREATE POLICY "Learner or staff can view household"
  ON public.households FOR SELECT
  TO anon, authenticated
  USING (
    (select auth.uid()) = learner_id 
    OR public.is_staff()
    OR family_share_token = current_setting('request.headers', true)::json->>'x-family-token'
  );

CREATE POLICY "Learner can insert/update own household"
  ON public.households FOR ALL
  TO authenticated
  USING ((select auth.uid()) = learner_id OR public.is_staff())
  WITH CHECK ((select auth.uid()) = learner_id OR public.is_staff());

-- 3.5 Student Trade Selections RLS
CREATE POLICY "Learners can view and edit own trade selections"
  ON public.student_trade_selections FOR ALL
  TO authenticated
  USING ((select auth.uid()) = learner_id OR public.is_staff())
  WITH CHECK ((select auth.uid()) = learner_id OR public.is_staff());

-- 3.6 Counselling Sessions RLS
CREATE POLICY "Learners can view and create own sessions"
  ON public.counselling_sessions FOR ALL
  TO authenticated
  USING ((select auth.uid()) = learner_id OR public.is_staff())
  WITH CHECK ((select auth.uid()) = learner_id OR public.is_staff());

-- 3.7 Family Callbacks RLS
CREATE POLICY "Anyone can request callback"
  ON public.family_callbacks FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Staff can view and update callbacks"
  ON public.family_callbacks FOR SELECT
  TO authenticated
  USING (public.is_staff());

CREATE POLICY "Staff can modify callbacks"
  ON public.family_callbacks FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- 3.8 Student Documents RLS
CREATE POLICY "Learners can manage own documents"
  ON public.student_documents FOR ALL
  TO authenticated
  USING ((select auth.uid()) = learner_id OR public.is_staff())
  WITH CHECK ((select auth.uid()) = learner_id OR public.is_staff());

-- 3.9 Admission Timelines RLS
CREATE POLICY "Public can view admission timelines"
  ON public.admission_timelines FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Staff can manage admission timelines"
  ON public.admission_timelines FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- 3.10 Activity Events RLS
CREATE POLICY "Authenticated users or staff can insert activity events"
  ON public.activity_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Staff or users can view activity events"
  ON public.activity_events FOR SELECT
  TO anon, authenticated
  USING (true);

-- -----------------------------------------------------------------------------
-- 4. AUTOMATIC USER PROFILE CREATION TRIGGER
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_share_token TEXT;
BEGIN
  -- Generate unique family share token
  v_share_token := 'CS-' || upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8));

  -- Insert profile
  INSERT INTO public.profiles (
    id,
    role,
    phone,
    full_name,
    preferred_language
  ) VALUES (
    NEW.id,
    COALESCE((NEW.raw_app_meta_data->>'role')::public.user_role, 'learner'::public.user_role),
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Learner'),
    'en'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create household entry with family share token
  INSERT INTO public.households (
    learner_id,
    family_share_token
  ) VALUES (
    NEW.id,
    v_share_token
  )
  ON CONFLICT (learner_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
