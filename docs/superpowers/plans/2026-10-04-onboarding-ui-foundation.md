# CareerSaathi Onboarding UI Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the minimal landing page with a mobile-first, low-literacy learner onboarding experience that collects a local-only UI profile and introduces Saathi help.

**Architecture:** Keep the route at `src/app/page.tsx` server-rendered and compose a route-local client onboarding component for transient form state and navigation. Keep screen copy and selectable options in a typed route-local data module, while small components each render one UI responsibility. No backend persistence, upload processing, AI agent connection, portal connection, or authentication is in this slice.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, existing shadcn/Base UI and Lucide packages.

**Spec:** `docs/superpowers/specs/2026-10-04-careersaathi-ui-ux-design.md`

## Global Constraints

- Build on the existing `src/app/globals.css` design tokens for all colors, spacing, typography, and component states; do not hard-code a separate product palette in feature components.
- Use semantic existing tokens for emphasis: `primary` for the next action, `muted` for supportive context, `destructive` for blocking errors, and only dedicated global status tokens for verified/completed states when required.
- Use brief everyday questions, the learner's selected language, labelled visual choices, and optional Listen help; never require technical vocabulary.
- Every onboarding step shows a named step, numeric progress, why the information helps, one primary action, and a Back action where applicable.
- Use 48px minimum touch targets, no hover-only controls, text labels for icons, clear non-colour confirmation, and a usable mobile layout.
- Preserve the in-progress answer while opening help, navigating back, or saving and exiting; optional inputs can be skipped.
- Resume and online-profile steps must say that portal passwords are never requested; uploads and links remain UI-only placeholders in this slice.
- Do not add dependencies. Reuse installed packages and native browser controls.

## Review Focus

- **Small screens / software keyboard:** the sticky navigation must remain reachable and not cover the selected choice or Continue action; manually verify at 320px width.
- **Keyboard-only use:** every choice, skip action, help control, and step navigation can receive focus and be activated; test manually using Tab, Shift+Tab, Space, and Enter.
- **Backward navigation:** changing an earlier answer and returning forward retains the updated value and does not reset unrelated choices; cover in the onboarding component interaction check.
- **Optional and unknown answers:** Resume, portals, constraints, and unknown factual information must offer a visible, working defer/skip route without blocking completion; cover in the interaction check.
- **No-JavaScript baseline:** the route must provide a clear client-runtime-required message rather than silently rendering an unusable blank form; verify production build output and the `noscript` fallback.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `src/app/layout.tsx` | Product metadata and root document language baseline. |
| `src/app/globals.css` | Existing global CSS-token system plus only the global utility styles required for readable focus and safe-area behavior. |
| `src/app/page.tsx` | Landing entry point linking/navigating to onboarding. |
| `src/app/onboarding/page.tsx` | Onboarding route server page. |
| `src/app/onboarding/components/types.ts` | Route-local profile, question, and answer types. |
| `src/app/onboarding/components/questions.ts` | Typed onboarding-step content, low-literacy copy, options, and per-step optionality. |
| `src/app/onboarding/components/onboarding-flow.tsx` | Client state machine for answers, step navigation, save/exit confirmation, and compact Saathi help sheet. |
| `src/app/onboarding/components/onboarding-question.tsx` | Accessible renderer for a single question and its choice/input controls. |
| `src/app/onboarding/components/onboarding-progress.tsx` | Named numeric progress display. |
| `src/app/onboarding/components/saathi-help-sheet.tsx` | Non-destructive help bottom sheet/panel with selected-language copy. |

## Task 1: Establish the onboarding route shell and project-safe checks

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Create: `src/app/onboarding/page.tsx`
- Create: `src/app/onboarding/components/onboarding-flow.tsx`

**Interfaces:**
- Produces: `export function OnboardingFlow(): React.JSX.Element` from `src/app/onboarding/components/onboarding-flow.tsx`.
- Consumes: existing CSS variables from `src/app/globals.css` and existing `Button` primitive from `src/components/ui/button.tsx`.

- [ ] **Step 1: Inspect installed scripts and packages for an existing test runner**

Run: `pnpm exec -- tsc --version` and inspect `package.json` plus `node_modules/.bin` for `vitest`, `jest`, `playwright`, or an equivalent test command.

Expected: record the existing runner if present. Do not install one; this UI slice uses lint, production build, and the manual acceptance script if none exists.

- [ ] **Step 2: Implement the server route shell and temporary client flow placeholder**

Create `OnboardingFlow()` as a client component rendering the CareerSaathi title, a one-sentence plain-language introduction, and a labelled Continue button. Render it from `src/app/onboarding/page.tsx`. Provide a clear link/button from `src/app/page.tsx` to `/onboarding`.

Update root metadata to `CareerSaathi` and a concise vocational-guidance description. Keep `lang="en"` until language selection is implemented in Task 3.

- [ ] **Step 3: Add only global styles needed by the shell**

Retain existing token definitions. Add global focus-visible and safe-area-aware utility rules only if the route cannot meet visible focus and sticky action-bar requirements with Tailwind classes alone. Do not replace or hard-code the current color system.

- [ ] **Step 4: Verify the shell**

Run: `pnpm lint && pnpm build`

Expected: both commands exit 0.

- [ ] **Step 5: Commit the route shell**

```bash
git add src/app/layout.tsx src/app/page.tsx src/app/globals.css src/app/onboarding
git commit -m "feat: add onboarding route shell"
```

## Task 2: Define typed onboarding content and readable selection controls

**Files:**
- Create: `src/app/onboarding/components/types.ts`
- Create: `src/app/onboarding/components/questions.ts`
- Create: `src/app/onboarding/components/onboarding-progress.tsx`
- Create: `src/app/onboarding/components/onboarding-question.tsx`
- Modify: `src/app/onboarding/components/onboarding-flow.tsx`

**Interfaces:**
- Consumes: `OnboardingFlow()` from Task 1.
- Produces: `export type OnboardingAnswer = string | string[] | null`, `export interface OnboardingStep`, and `export const onboardingSteps: readonly OnboardingStep[]` from `questions.ts`.
- Produces: `export function OnboardingProgress({ currentStep, totalSteps, label }: { currentStep: number; totalSteps: number; label: string }): React.JSX.Element`.
- Produces: `export function OnboardingQuestion({ step, value, onChange }: { step: OnboardingStep; value: OnboardingAnswer; onChange: (value: OnboardingAnswer) => void }): React.JSX.Element`.

- [ ] **Step 1: Write a failing content integrity check using the runner found in Task 1, if available**

Assert that all eight steps have a non-empty label, question, why-copy, and a primary response route; assert that resume, portals, and constraints are optional. If Task 1 found no runner, create no test file and add these assertions to the manual acceptance script in Task 4.

- [ ] **Step 2: Run the content integrity check to verify it fails**

Run the runner identified in Task 1 against the new check.

Expected: FAIL because `onboardingSteps` does not exist. If no runner exists, skip this step and note the manual equivalent in the commit body.

- [ ] **Step 3: Implement typed step content**

Define exactly eight steps: Learner basics; Education and experience; Your interests; Work preferences; Goals and constraints; Upload your biodata/resume; Job-app profiles; Review your profile. Use everyday language and selectable cards wherever a choice is possible. Mark constraints, resume, and portal profiles optional; include `I don't know` / `Add later` choices where relevant.

- [ ] **Step 4: Implement the progress and question renderers**

Use semantic fieldsets and legends for choice groups, visible labels for all controls, image-free familiar symbols only as optional decoration, and 48px-or-larger interactive areas. Use `aria-describedby` to associate why-copy and optional-copy with the prompt. The renderer must support single-choice cards, multi-select interest cards capped at five, short text inputs, and the explicit skip/defer action supplied by the step.

- [ ] **Step 5: Replace the placeholder with the first step from `onboardingSteps`**

Render `OnboardingProgress` and `OnboardingQuestion` in `OnboardingFlow`, using component state for the current answer. This task intentionally does not yet advance steps.

- [ ] **Step 6: Run the integrity check and build**

Run: the Task 1 runner check when available, then `pnpm lint && pnpm build`.

Expected: all selected checks pass.

- [ ] **Step 7: Commit typed onboarding content**

```bash
git add src/app/onboarding/components
git commit -m "feat: add onboarding questions and controls"
```

## Task 3: Complete local onboarding navigation and Saathi help

**Files:**
- Create: `src/app/onboarding/components/saathi-help-sheet.tsx`
- Modify: `src/app/onboarding/components/onboarding-flow.tsx`
- Modify: `src/app/onboarding/components/onboarding-question.tsx`

**Interfaces:**
- Consumes: `onboardingSteps`, `OnboardingAnswer`, `OnboardingProgress`, and `OnboardingQuestion` from Task 2.
- Produces: `export function SaathiHelpSheet({ open, onOpenChange, language }: { open: boolean; onOpenChange: (open: boolean) => void; language: string }): React.JSX.Element`.
- Produces: an `OnboardingFlow` that maintains `answers: Record<string, OnboardingAnswer>` locally until the browser session ends.

- [ ] **Step 1: Write a failing interaction test or manual script for step progression**

With the runner from Task 1, assert: Continue is disabled on a required unanswered step; selecting an answer enables Continue; Back returns to the prior step retaining answers; optional Add later advances; opening and closing help preserves the current step and selection. Without a runner, write these exact checks as `docs/superpowers/plans/2026-10-04-onboarding-ui-foundation-manual-check.md` and use it in Step 4.

- [ ] **Step 2: Run the interaction check to verify it fails**

Run the configured test command, or perform the first manual check.

Expected: it fails because the flow cannot advance or preserve state yet.

- [ ] **Step 3: Implement `OnboardingFlow` local navigation**

Implement `goNext(): void`, `goBack(): void`, `setAnswer(stepId: string, value: OnboardingAnswer): void`, and `skipCurrentStep(): void` inside `OnboardingFlow`. Required steps cannot advance with null/empty answers. The interest step cannot accept more than five selections and provides a spoken-style explanation when the cap is reached. Save and exit displays an explicit “Saved on this device for now” UI confirmation; do not claim server persistence.

On the final review step, display answer groups as editable cards. Continue from review shows the approved completion copy and the actions **See my starting options** and **Talk to Saathi first** as non-network UI controls.

- [ ] **Step 4: Implement `SaathiHelpSheet`**

Render it as a modal/bottom-sheet pattern using installed Base UI if an appropriate installed primitive is already present; otherwise use native dialog semantics and minimal React state. It explains the current question in one short sentence, shows the active language, provides a close control, and never overwrites an answer or changes the current step.

- [ ] **Step 5: Run interaction and responsive checks**

Run: configured interaction test if available, `pnpm lint && pnpm build`, then execute every item in the Task 3 manual-check file at 320px and desktop width.

Expected: automated checks pass; every manual check records pass with no lost answer, hidden action bar, or blocked optional step.

- [ ] **Step 6: Commit the interactive flow**

```bash
git add src/app/onboarding/components docs/superpowers/plans/2026-10-04-onboarding-ui-foundation-manual-check.md
git commit -m "feat: complete learner onboarding flow"
```

## Task 4: Validate accessibility, trust copy, and production behavior

**Files:**
- Modify: `src/app/onboarding/components/questions.ts`
- Modify: `src/app/onboarding/components/onboarding-flow.tsx`
- Modify: `src/app/onboarding/components/onboarding-question.tsx`
- Modify: `src/app/onboarding/components/saathi-help-sheet.tsx`
- Modify: `src/app/onboarding/page.tsx`
- Modify: `docs/superpowers/plans/2026-10-04-onboarding-ui-foundation-manual-check.md`

**Interfaces:**
- Consumes: completed Task 3 route and components.
- Produces: an onboarding route that has a `noscript` fallback and passes the acceptance script.

- [ ] **Step 1: Add failing manual acceptance checks for trust boundaries and keyboard use**

Add exact checks: no portal-password field exists; upload/profile steps explicitly offer add later; all interactive controls have readable labels; Tab order reaches help, answer, skip, Back, and Continue; completion does not claim a completed recommendation or a submitted application; `noscript` content explains that JavaScript is needed.

- [ ] **Step 2: Perform the new checks and record failures**

Run the manual acceptance script against local development and production preview.

Expected: record each unmet item before changing code.

- [ ] **Step 3: Implement the smallest copy/semantic corrections**

Add a `noscript` fallback in the server route. Correct any missing labels, focus order, privacy lines, defer controls, or inaccurate claims discovered in Step 2. Do not add backend storage, external integrations, or unapproved application features.

- [ ] **Step 4: Execute the full acceptance script and production checks**

Run: `pnpm lint && pnpm build`; launch `pnpm start` after the build; perform the complete manual script at 320px and desktop widths.

Expected: commands exit 0 and every recorded acceptance check passes.

- [ ] **Step 5: Commit validation fixes**

```bash
git add src/app/onboarding docs/superpowers/plans/2026-10-04-onboarding-ui-foundation-manual-check.md
git commit -m "fix: harden onboarding accessibility and trust cues"
```

## Deferred Plans

Create follow-up plans after this slice has been reviewed:

1. **Recommendation workspace:** My Path, three starting options, comparison evidence labels, and Explore navigation.
2. **Saathi application workspace:** avatar agent panel, visible-context controls, document checklist, preview-before-submit UI, and human-counsellor escalation.
3. **Family workspace:** scoped invitations, parent-friendly evidence view, concerns, shared decision progress, and share controls.
