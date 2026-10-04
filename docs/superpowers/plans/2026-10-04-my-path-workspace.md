# CareerSaathi "My Path" Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the main "My Path" workspace at `/my-path` (and linked from `/counselling`) with 3 tailored recommendations, a side-by-side comparison modal/drawer, clear evidence tags, and decision status tracker.

**Architecture:** Server page with route-local client components under `src/app/my-path/components/`. Typed realistic trade mock data with verified local signals (ITI/centres, costs, duration, safety, salary growth) in English and Hindi. Floating Saathi AI trigger for instant contextual Q&A.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Lucide icons, Base UI / Tailwind styling.

**Spec:** `docs/superpowers/specs/2026-10-04-careersaathi-ui-ux-design.md`

## Global Constraints

- Build on existing `src/app/globals.css` design tokens (`background`, `foreground`, `primary`, `muted`, `accent`, `border`, `card`).
- Support both English and हिन्दी seamlessly.
- Highlight evidence levels: **Verified Local Data** (green/emerald), **Saathi Guidance** (primary/indigo), **Information to Confirm** (amber/muted).
- Large touch targets (48px+) and low-literacy friendly layout with optional Listen audio.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `src/app/my-path/page.tsx` | Next.js server route for My Path |
| `src/app/my-path/components/types.ts` | Types for CareerPath, ComparisonMetric, EvidenceLevel, DecisionStatus |
| `src/app/my-path/components/data.ts` | Realistic vocational trade recommendation data with Hindi/English content |
| `src/app/my-path/components/my-path-workspace.tsx` | Main interactive client dashboard |
| `src/app/my-path/components/career-card.tsx` | Detailed 3-card recommendation component with evidence badges |
| `src/app/my-path/components/compare-dialog.tsx` | Side-by-side comparison modal/sheet for 2-3 paths |
| `src/app/my-path/components/decision-progress.tsx` | Family/student decision stage tracker (*Learning → Comparing → Discussing → Next Step*) |

---

## Task 1: Define typed career recommendation data and evidence models

**Files:**
- Create: `src/app/my-path/components/types.ts`
- Create: `src/app/my-path/components/data.ts`
- Create: `scripts/check-my-path-data.mjs`

- [ ] **Step 1: Write failing data integrity script**
- [ ] **Step 2: Run script to verify it fails**
- [ ] **Step 3: Implement types and realistic bilingual career path data**
- [ ] **Step 4: Run script to verify it passes**
- [ ] **Step 5: Commit**

## Task 2: Build the My Path recommendation cards and comparison view

**Files:**
- Create: `src/app/my-path/components/career-card.tsx`
- Create: `src/app/my-path/components/compare-dialog.tsx`
- Create: `src/app/my-path/components/decision-progress.tsx`
- Create: `src/app/my-path/components/my-path-workspace.tsx`
- Create: `src/app/my-path/page.tsx`
- Modify: `src/app/onboarding/components/onboarding-flow.tsx` (route completion to `/my-path`)

- [ ] **Step 1: Implement DecisionProgress stage tracker**
- [ ] **Step 2: Implement CareerCard with verified data badges and listen support**
- [ ] **Step 3: Implement CompareDialog for side-by-side trade evaluation**
- [ ] **Step 4: Implement MyPathWorkspace combining cards, comparison, and language toggle**
- [ ] **Step 5: Render in `src/app/my-path/page.tsx` and update onboarding link**
- [ ] **Step 6: Run verification: `tsc --noEmit && pnpm lint`**
- [ ] **Step 7: Commit**
