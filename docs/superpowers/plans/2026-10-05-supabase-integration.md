# Supabase Integration & Data Seeding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Supabase with PostgreSQL DDL migrations, TypeScript database types, client/server singletons, seed scripts with verified trades & sample household data, Next.js Server Actions, and smooth fallback to local mock data when offline.

**Architecture:** Create structured Supabase SQL schema migrations and seed data in `supabase/migrations/` and `supabase/seed.sql`. Provide isomorphic Supabase clients (`src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts`) and Server Actions (`src/app/actions/`) for Profile, Trade Selection, Family Callbacks, and Documents. Connect UI workspaces with Server Actions while preserving client-side local fallback resilience.

**Tech Stack:** Next.js 16 (App Router), `@supabase/supabase-js`, `@supabase/ssr`, TypeScript 5, Node.js.

**Spec:** `docs/superpowers/specs/2026-10-05-backend-and-database-design.md`

## Global Constraints
- Package manager: `pnpm` exclusively.
- All Supabase client utilities must use `@supabase/ssr` with Next.js cookie handling.
- When Supabase credentials (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are missing, all actions and queries must gracefully degrade to local store mock data without crashing the UI.
- All changes must pass TypeScript validation (`node scripts/check-supabase-integration.mjs`).

## Review Focus
1. `NEXT_PUBLIC_SUPABASE_URL` undefined → server actions catch error and return mock/cached payload cleanly.
2. Parent accessing `/family?token=<token>` without authentication → zero-auth query finds linked household and trade record.
3. Student switches career on `/my-path` → Server Action records selection in `student_trade_selections` and broadcasts `careersaathi_career_changed`.
4. Parent requests callback on `/family` → creates row in `family_callbacks` and logs telemetry in `activity_events`.
5. Admin updates trade facts on `/admin` → updates `vocational_trades` and updates local state.

---

### Task 1: Supabase Database Schema & Seed Migrations

**Files:**
- Create: `supabase/migrations/20261005000000_initial_schema.sql`
- Create: `supabase/seed.sql`
- Test: `scripts/check-supabase-sql.mjs`

**Interfaces:**
- Produces: Complete PostgreSQL DDL tables (`profiles`, `vocational_trades`, `training_centers`, `households`, `student_trade_selections`, `counselling_sessions`, `family_callbacks`, `student_documents`, `admission_timelines`, `activity_events`) and 30+ verified seed trades with seed centers.

- [ ] **Step 1: Write SQL schema migration file**
Write `supabase/migrations/20261005000000_initial_schema.sql` with full ENUMs, 11 tables, indexes, and Row Level Security (RLS) policies according to spec.

- [ ] **Step 2: Write seed data script**
Write `supabase/seed.sql` converting all 30+ vocational trades from `src/app/explore/components/data.ts`, training centers, initial sample household leads, and admission timelines into SQL `INSERT INTO` statements.

- [ ] **Step 3: Write validation test script**
Create `scripts/check-supabase-sql.mjs` that verifies SQL files exist, contains all required table definitions (`CREATE TABLE profiles`, `CREATE TABLE vocational_trades`, etc.), and has valid syntax.

- [ ] **Step 4: Run validation test**
Run: `node scripts/check-supabase-sql.mjs`  
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add supabase/ scripts/check-supabase-sql.mjs
git commit -m "feat(db): add supabase schema migrations and comprehensive seed data"
```

---

### Task 2: Supabase TypeScript Database Definitions & Client Singletons

**Files:**
- Create: `src/lib/supabase/database.types.ts`
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/middleware.ts`
- Test: `scripts/check-supabase-types.mjs`

**Interfaces:**
- Produces: `Database` interface types, `createClient()` for browser, `createClient()` for Server Components/Actions with cookies.

- [ ] **Step 1: Write `src/lib/supabase/database.types.ts`**
Generate strongly typed definitions matching the 11 tables, enums, and column structures.

- [ ] **Step 2: Write `src/lib/supabase/client.ts`**
Implement browser client singleton using `createBrowserClient<Database>` from `@supabase/ssr` with safety check for dummy/unset env variables.

- [ ] **Step 3: Write `src/lib/supabase/server.ts`**
Implement server client generator using `createServerClient<Database>` with `cookies()` from `next/headers`.

- [ ] **Step 4: Write `src/lib/supabase/middleware.ts`**
Implement session refresh helper for Next.js middleware.

- [ ] **Step 5: Write test script & verify**
Create `scripts/check-supabase-types.mjs` asserting all table models exist in `Database["public"]["Tables"]`. Run `node scripts/check-supabase-types.mjs`.

- [ ] **Step 6: Commit**
```bash
git add src/lib/supabase/ scripts/check-supabase-types.mjs
git commit -m "feat(supabase): add typescript database definitions and ssr client singletons"
```

---

### Task 3: Next.js Server Actions with Local Mock Fallback

**Files:**
- Create: `src/app/actions/trades.ts`
- Create: `src/app/actions/profile.ts`
- Create: `src/app/actions/callbacks.ts`
- Create: `src/app/actions/family.ts`
- Test: `scripts/check-server-actions.mjs`

**Interfaces:**
- Produces:
  - `getTradesAction(category?: string, qualification?: string)`
  - `selectActiveTradeAction(learnerId: string, tradeId: string)`
  - `updateProfileAction(profileData: Partial<UserProfile>)`
  - `requestParentCallbackAction(callbackData: CallbackRequestPayload)`
  - `getHouseholdByTokenAction(shareToken: string)`
  - `updateTradeFactsAction(tradeId: string, updates: Partial<TradeEditorItem>)`

- [ ] **Step 1: Write `src/app/actions/trades.ts`**
Implement `getTradesAction` and `updateTradeFactsAction` querying Supabase `vocational_trades` with fallback to `getAllTrades()` from `src/app/explore/components/data.ts`.

- [ ] **Step 2: Write `src/app/actions/profile.ts`**
Implement `getProfileAction` and `updateProfileAction` updating `profiles` table with local storage profile fallback.

- [ ] **Step 3: Write `src/app/actions/callbacks.ts`**
Implement `requestParentCallbackAction` and `getAdminCallbacksAction` inserting into `family_callbacks` and `activity_events`.

- [ ] **Step 4: Write `src/app/actions/family.ts`**
Implement `getHouseholdByTokenAction` resolving zero-auth parent link `family_share_token` with linked selected trade.

- [ ] **Step 5: Write test script & verify**
Create `scripts/check-server-actions.mjs` executing server action logic with mock credentials. Run `node scripts/check-server-actions.mjs`.

- [ ] **Step 6: Commit**
```bash
git add src/app/actions/ scripts/check-server-actions.mjs
git commit -m "feat(actions): add next.js server actions for trades, profiles, callbacks, and zero-auth family token resolution"
```

---

### Task 4: Connect Front-End Workspaces to Server Actions

**Files:**
- Modify: `src/app/explore/components/explore-workspace.tsx`
- Modify: `src/app/my-path/components/my-path-workspace.tsx`
- Modify: `src/app/family/components/family-portal-workspace.tsx`
- Modify: `src/app/family/components/counsellor-connect.tsx`
- Modify: `src/app/admin/components/admin-workspace.tsx`

**Interfaces:**
- Consumes: Server Actions from `src/app/actions/*`.

- [ ] **Step 1: Connect Explore & My-Path Workspaces**
Wire `selectActiveTradeAction` inside `handleSelectTrade` / `handleSelectCareer` so choice syncs to server while keeping client toast & store broadcasts.

- [ ] **Step 2: Connect Family Portal & Callback Connect**
Wire `requestParentCallbackAction` in `counsellor-connect.tsx` to dispatch callback request to Supabase `family_callbacks` and stream telemetry event.

- [ ] **Step 3: Connect Admin Workspace**
Wire `updateTradeFactsAction` in `handleSaveTrade` and `getAdminCallbacksAction` in `AdminWorkspace` for real-time trade editing.

- [ ] **Step 4: Run integration self-check scripts**
Run all validation checks:
`node scripts/check-admin-data.mjs && node scripts/check-my-path-data.mjs && node scripts/check-supabase-sql.mjs && node scripts/check-supabase-types.mjs && node scripts/check-server-actions.mjs`  
Expected: ALL PASS

- [ ] **Step 5: Commit**
```bash
git add src/app/ scripts/
git commit -m "feat(ui): connect ui workspaces to server actions with resilient local fallback"
```

---

### Task 5: End-to-End Verification & Documentation

**Files:**
- Create: `scripts/verify-full-stack.mjs`
- Create: `.env.example`
- Modify: `README.md` (or relevant docs)

- [ ] **Step 1: Create `.env.example`**
Add placeholders for `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SARVAM_API_KEY`, `TRIGGER_SECRET_KEY`.

- [ ] **Step 2: Create comprehensive test suite `scripts/verify-full-stack.mjs`**
Write a single automated verification test that validates schema definitions, type exports, seed data integrity, server action handlers, and client store sync.

- [ ] **Step 3: Run comprehensive test**
Run: `node scripts/verify-full-stack.mjs`  
Expected: "ALL SYSTEM VERIFICATIONS PASSED (5/5)".

- [ ] **Step 4: Commit**
```bash
git add .env.example scripts/verify-full-stack.mjs
git commit -m "chore: add env example and full-stack automated verification suite"
```
