# CareerSaathi Backend & Database Architecture Specification

**Status:** APPROVED FOR IMPLEMENTATION  
**Date:** 2026-10-05  
**Target Stack:** Next.js (App Router) + Supabase (PostgreSQL, Auth, Storage, Realtime) + Trigger.dev (Background Orchestration) + Sarvam AI (Indic TTS/STT)

---

## 1. System Overview & Architecture

CareerSaathi is an AI-enabled, family-centred vocational counselling and decision-support platform designed for India's rural and semi-urban learners and their parents.

```
                               ┌──────────────────────────────────────────────┐
                               │                 Client Apps                  │
                               │  (Learner, Zero-Auth Parent, Counsellor Hub) │
                               └──────────────────────┬───────────────────────┘
                                                      │
                                                      ▼
                               ┌──────────────────────────────────────────────┐
                               │           Next.js 16 App Router              │
                               │     (Server Components, Actions, API Routes) │
                               └──────┬───────────────────────────────┬───────┘
                                      │                               │
                                      ▼                               ▼
       ┌──────────────────────────────────────────────┐  ┌────────────────────────────┐
       │             Supabase Platform                │  │        Trigger.dev         │
       │  - PostgreSQL with Row Level Security (RLS)  │  │  (Background Task Engine)  │
       │  - Supabase Phone/OTP Auth                   │  ├────────────────────────────┤
       │  - Storage Buckets (docs, resumes, audio)    │  │ • Async Sentiment Engine   │
       │  - Realtime Subscriptions (telemetry/leads)  │  │ • Indic TTS (Sarvam AI)    │
       └──────────────────────────────────────────────┘  │ • WhatsApp/SMS Delivery    │
                                                         │ • SLA & Escalation Monitors│
                                                         └────────────────────────────┘
```

---

## 2. Core Relational Database Schema (PostgreSQL)

### 2.1 Enums
```sql
CREATE TYPE user_role AS ENUM ('learner', 'counsellor', 'admin');
CREATE TYPE qualification_level AS ENUM ('class_8', 'class_10', 'class_12', 'iti_diploma', 'graduate', 'other');
CREATE TYPE trade_category AS ENUM ('electrical', 'auto', 'digital', 'healthcare', 'construction', 'craft');
CREATE TYPE sentiment_level AS ENUM ('aligned', 'hesitant', 'conflicted', 'blocked');
CREATE TYPE callback_status AS ENUM ('pending', 'in_progress', 'resolved', 'follow_up_needed');
CREATE TYPE doc_type_enum AS ENUM ('marksheet_10th', 'aadhaar_card', 'domicile_certificate', 'income_certificate', 'bank_passbook_dbt', 'passport_photos', 'resume');
CREATE TYPE doc_status_enum AS ENUM ('pending', 'ready', 'verified', 'rejected');
CREATE TYPE center_type_enum AS ENUM ('govt_iti', 'pmkk', 'polytechnic', 'private_iti');
```

---

### 2.2 Tables

#### `profiles` (User & Counsellor Identities)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK, FK `auth.users(id)` ON DELETE CASCADE | Matches authenticated Supabase user |
| `role` | `user_role` | NOT NULL, DEFAULT `'learner'` | Learner vs Counsellor vs Admin |
| `phone` | TEXT | UNIQUE, NOT NULL | Mobile number used for OTP |
| `full_name` | TEXT | NOT NULL | User's full name |
| `state` | TEXT | DEFAULT `'Bihar'` | State name |
| `district` | TEXT | DEFAULT `'Patna'` | District name |
| `pin_code` | TEXT | NULLABLE | 6-digit postal code |
| `highest_qualification`| `qualification_level` | DEFAULT `'class_10'` | Education qualification |
| `degree_detail` | TEXT | NULLABLE | Specific course/stream details |
| `preferred_language` | TEXT | DEFAULT `'en'` | UI language (`'en'` \| `'hi'`) |
| `spoken_dialects` | TEXT[] | DEFAULT `ARRAY['Hindi']` | Regional dialects understood |
| `interests` | TEXT[] | DEFAULT `ARRAY[]::TEXT[]` | Interest tags (electrical, auto, etc.) |
| `work_preference` | TEXT | DEFAULT `'near_home'` | `'near_home'` \| `'willing_relocate'` \| `'both'` |
| `goal` | TEXT | DEFAULT `'fast_earning'` | `'fast_earning'` \| `'higher_growth'` \| `'own_shop'` |
| `registered_portals` | TEXT[] | DEFAULT `ARRAY[]::TEXT[]` | `['ncs', 'eshram', 'apna']` |
| `shortlisted_trade_ids`| TEXT[] | DEFAULT `ARRAY[]::TEXT[]` | IDs chosen for side-by-side comparison |
| `dbt_eligible` | BOOLEAN | DEFAULT true | Direct Benefit Transfer eligibility |
| `audio_narration_enabled`| BOOLEAN | DEFAULT true | Low-literacy voice narration toggle |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Record creation time |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Record last update time |

---

#### `vocational_trades` (Verified Trades Catalog)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PK (e.g., `'electrician'`) | Identifier key |
| `title_en` / `title_hi` | TEXT | NOT NULL | Bilingual trade title |
| `category` | `trade_category` | NOT NULL | Sector category |
| `min_qualification` | `qualification_level`| NOT NULL | Minimum admission criteria |
| `duration_months` | INT | NOT NULL | Duration in months (e.g. 24 for 2-yr ITI) |
| `govt_annual_fee` | INT | NOT NULL | Regulated fee in INR |
| `private_annual_fee` | INT | NOT NULL | Private college comparison fee |
| `starting_monthly_pay_min`| INT | NOT NULL | Starting pay low range (INR) |
| `starting_monthly_pay_max`| INT | NOT NULL | Starting pay high range (INR) |
| `pay_growth_2yr_en` / `_hi` | TEXT | NOT NULL | Bilingual growth description |
| `description_en` / `_hi` | TEXT | NOT NULL | Detailed career scope text |
| `key_skills` | TEXT[] | DEFAULT `ARRAY[]::TEXT[]` | Practical trade skills learned |
| `safety_rating_en` / `_hi` | TEXT | NOT NULL | Safety standard badge text |
| `ncvt_approved` | BOOLEAN | DEFAULT true | National Council for Vocational Training |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Timestamp |

---

#### `training_centers` (Verified Local Institutes & ITIs)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK, DEFAULT `gen_random_uuid()` | Unique center ID |
| `trade_id` | TEXT | FK `vocational_trades(id)` | Associated trade |
| `name` | TEXT | NOT NULL | e.g. "Govt ITI Digha (Patna)" |
| `center_type` | `center_type_enum` | DEFAULT `'govt_iti'` | ITI vs PMKK |
| `district` | TEXT | NOT NULL | District name |
| `state` | TEXT | NOT NULL | State name |
| `address` | TEXT | NOT NULL | Full landmark/address |
| `travel_distance_km` | NUMERIC(5,2) | NULLABLE | Distance from district center |
| `bus_route_info_en` / `_hi` | TEXT | NULLABLE | Public transit / bus route details |
| `contact_phone` | TEXT | NULLABLE | Helpline phone number |
| `placement_rate_pct` | INT | DEFAULT 85 | Verified placement percentage |
| `is_verified` | BOOLEAN | DEFAULT true | Accreditation verified flag |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Timestamp |

---

#### `households` (Zero-Auth Parent Decision Room)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK, DEFAULT `gen_random_uuid()` | Household ID |
| `learner_id` | UUID | UNIQUE, FK `profiles(id)` | Associated student profile |
| `family_share_token` | TEXT | UNIQUE, NOT NULL, INDEXED | Secure zero-auth token for parent access |
| `parent_name` | TEXT | NULLABLE | Parent/Guardian name |
| `parent_relation` | TEXT | DEFAULT `'father'` | `'father'` \| `'mother'` \| `'guardian'` |
| `parent_phone` | TEXT | NULLABLE | WhatsApp/Phone for updates |
| `preferred_dialect` | TEXT | DEFAULT `'Bhojpuri / Hindi'` | Spoken dialect preference |
| `parent_consent_recorded`| BOOLEAN | DEFAULT false | Explicit approval toggle |
| `last_parent_viewed_at` | TIMESTAMPTZ | NULLABLE | Last visit timestamp |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

---

#### `student_trade_selections` (Active Trade Choice)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK, DEFAULT `gen_random_uuid()` | Selection record ID |
| `learner_id` | UUID | NOT NULL, FK `profiles(id)` | Student reference |
| `trade_id` | TEXT | NOT NULL, FK `vocational_trades(id)` | Chosen trade ID |
| `is_primary` | BOOLEAN | DEFAULT true | Primary roadmap choice flag |
| `selected_at` | TIMESTAMPTZ | DEFAULT NOW() | Timestamp |

---

#### `counselling_sessions` (AI 3D Avatar Calls & Transcripts)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK, DEFAULT `gen_random_uuid()` | Call session ID |
| `learner_id` | UUID | NOT NULL, FK `profiles(id)` | Student reference |
| `trade_id` | TEXT | FK `vocational_trades(id)` | Active trade discussed |
| `duration_seconds` | INT | DEFAULT 0 | Call duration |
| `transcript` | JSONB | NOT NULL, DEFAULT `'[]'::JSONB` | Array of `DialogueTurn` objects |
| `detected_sentiment` | `sentiment_level`| DEFAULT `'aligned'` | Auto-detected sentiment |
| `extracted_concerns` | TEXT[] | DEFAULT `ARRAY[]::TEXT[]` | Extracted objection tags |
| `hud_widgets_shown` | JSONB | DEFAULT `'[]'::JSONB` | Generative UI widgets rendered |
| `audio_recording_url` | TEXT | NULLABLE | Voice recording in Storage |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Timestamp |

---

#### `family_callbacks` (Dialect-Matched Counsellor Queue)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK, DEFAULT `gen_random_uuid()` | Callback lead ID |
| `household_id` | UUID | NOT NULL, FK `households(id)` | Household reference |
| `target_trade_id` | TEXT | NOT NULL, FK `vocational_trades(id)` | Chosen trade |
| `parent_phone` | TEXT | NOT NULL | Parent phone number |
| `preferred_time_slot` | TEXT | DEFAULT `'evening'` | `'morning'` \| `'afternoon'` \| `'evening'` |
| `preferred_dialect` | TEXT | NOT NULL | Matched dialect |
| `sentiment_level` | `sentiment_level`| DEFAULT `'hesitant'` | Current sentiment tag |
| `primary_resistance` | TEXT | NOT NULL | Extracted objection brief |
| `ai_transcript_snippet` | TEXT | NULLABLE | Context quote from Saathi call |
| `status` | `callback_status` | DEFAULT `'pending'` | Queue status |
| `assigned_counsellor_id`| UUID | FK `profiles(id)` | Senior Counsellor assigned |
| `counsellor_notes` | TEXT | NULLABLE | Call resolution notes |
| `scheduled_iti_visit_date`| DATE | NULLABLE | Booked campus tour |
| `created_at` / `updated_at`| TIMESTAMPTZ | DEFAULT NOW() | Timestamps |

---

#### `student_documents` (Application Checklist & File Storage)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK, DEFAULT `gen_random_uuid()` | Document ID |
| `learner_id` | UUID | NOT NULL, FK `profiles(id)` | Student reference |
| `doc_type` | `doc_type_enum` | NOT NULL | Document category |
| `storage_path` | TEXT | NULLABLE | Supabase storage bucket path |
| `file_name` | TEXT | NULLABLE | Original uploaded file name |
| `status` | `doc_status_enum`| DEFAULT `'pending'` | Document readiness |
| `verified_at` | TIMESTAMPTZ | NULLABLE | Counsellor verified timestamp |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Timestamp |

---

#### `admission_timelines` (State ITI Milestones)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK, DEFAULT `gen_random_uuid()` | Milestone ID |
| `state` | TEXT | NOT NULL | State (e.g. 'Bihar') |
| `district` | TEXT | NULLABLE | District |
| `academic_year` | TEXT | NOT NULL | e.g. '2026-2027' |
| `step_number` | INT | NOT NULL | Sequential order 1..4 |
| `title_en` / `_hi` | TEXT | NOT NULL | Bilingual step title |
| `date_label_en` / `_hi` | TEXT | NOT NULL | Date string (e.g. "15 July 2026") |
| `status` | TEXT | DEFAULT `'active'` | Milestone status |

---

#### `activity_events` (Live Realtime Telemetry Stream)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK, DEFAULT `gen_random_uuid()` | Event ID |
| `event_type` | TEXT | NOT NULL | `'callback_requested'` \| `'trade_selected'` |
| `learner_id` | UUID | FK `profiles(id)` | Student |
| `trade_id` | TEXT | NULLABLE | Trade context |
| `student_name` | TEXT | NOT NULL | Display name |
| `location` | TEXT | NOT NULL | District/State |
| `details` | TEXT | NOT NULL | Event details |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Realtime timestamp |

---

## 3. Trigger.dev Background Orchestration Tasks

| Task Name | Trigger Event | Action Performed |
|---|---|---|
| `extract-family-sentiment` | `counselling_sessions.INSERT` | LLM analyzes dialogue turns → extracts parent resistance flags → auto-creates/updates `family_callbacks` lead. |
| `generate-vernacular-audio` | New Trade/Concern Created | Calls Sarvam AI Voice API → generates Hindi, Bhojpuri & Maithili `.mp3` → stores in Supabase Storage `audio-cache`. |
| `deliver-family-whatsapp` | `student_trade_selections.INSERT` | Formats bilingual 1-page summary → generates WhatsApp deep-link with `family_share_token` → sends via SMS/WhatsApp API. |
| `callback-sla-monitor` | Scheduled (Every 15m) | Checks for pending callbacks > 45 mins → sends reminder alert to assigned regional counsellor. |
| `admission-deadline-reminder` | Scheduled (Daily 09:00 IST) | Scans `admission_timelines` for dates closing in 3 days → sends SMS alert to students with ready document packets. |

---

## 4. Row-Level Security (RLS) Policy Specifications

1. **`profiles`**:
   - `SELECT`, `UPDATE`: `auth.uid() = id` OR `auth.jwt() ->> 'role' IN ('counsellor', 'admin')`.
2. **`student_trade_selections` & `student_documents` & `counselling_sessions`**:
   - `ALL`: `auth.uid() = learner_id` OR `auth.jwt() ->> 'role' IN ('counsellor', 'admin')`.
3. **`households`**:
   - `SELECT`: `auth.uid() = learner_id` OR `family_share_token = current_setting('request.jwt.claim.token', true)` OR `auth.jwt() ->> 'role' IN ('counsellor', 'admin')`.
4. **`family_callbacks` & `activity_events`**:
   - `SELECT`, `UPDATE`: `auth.jwt() ->> 'role' IN ('counsellor', 'admin')`.
   - `INSERT`: Allowed for public/authenticated users submitting a callback request.
5. **`vocational_trades` & `training_centers` & `admission_timelines`**:
   - `SELECT`: Public (`anon` and `authenticated`).
   - `INSERT`, `UPDATE`, `DELETE`: Admin/Counsellor only.

---

## 5. Next Steps & Implementation Path

1. Initialize Supabase client library (`@supabase/supabase-js`, `@supabase/ssr`).
2. Generate Supabase SQL migration files (`supabase/migrations/`).
3. Set up Trigger.dev v3 SDK (`@trigger.dev/sdk`) in Next.js.
4. Implement Supabase client/server singleton utilities and database TypeScript types.
