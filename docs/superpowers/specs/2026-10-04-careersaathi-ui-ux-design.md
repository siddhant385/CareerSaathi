# CareerSaathi UI/UX Design

**Date:** 2026-10-04  
**Scope:** UI/UX information architecture and interaction design only. No data model, authentication, AI integration, or application-submission implementation is included.

## Purpose

CareerSaathi helps Indian vocational learners and their families make confident, evidence-led career decisions. The learner first builds a profile through a guided onboarding flow. Saathi, a visible avatar agent, later uses the learner's explicitly available profile, resume, experience, and saved choices to provide career counselling and assist with application work.

The product must be welcoming to low-confidence, low-literacy, and mobile-first users; clear in regional languages; supportive of family participation; and honest about evidence and uncertainty.

## Principles

1. **One decision at a time.** Each screen has one clear question and one primary next action.
2. **Explain why.** Every information request says why it helps.
3. **User control and privacy.** Personal answers and resume stay private unless the learner explicitly shares them. The agent visibly states its active context.
4. **Family is invited, not imposed.** A parent or guardian is added after the learner receives starting options.
5. **Evidence over promises.** Local outcomes, pay, safety, and provider information are visibly classified as verified data, Saathi guidance, or information to confirm.
6. **Accessible by default.** Plain language, regional-language support, large tap targets, no hover-only actions, and optional voice assistance.
7. **Usable with low literacy.** Prefer pictures, audio, familiar choices, and short spoken-style prompts over reading-heavy forms or technical labels.
8. **Use the existing visual system.** UI colors, spacing, typography, and component states must build on the CSS tokens already defined in `src/app/globals.css`; do not introduce a separate fixed palette.

## Product Structure

### First-time journey

```text
Welcome / Language selection (English / हिन्दी)
  → Learner basics
  → Education and experience
  → Interests and working preferences
  → Goals and constraints
  → Resume or proof upload
  → Online profiles and portals
  → Review profile
  → Career conversation ready
  → My Path
```

The onboarding flow begins with an explicit language picker (`English` and `हिन्दी`). Selecting a language dynamically re-renders all UI copy (questions, choices, explanations, buttons, and Saathi help). The structure is designed as an extensible dictionary to easily support regional languages (e.g., Tamil, Telugu, Marathi, Bengali) in the future.

### Primary navigation

Use bottom navigation on mobile and an equivalent left sidebar on desktop:

| Area | User outcome |
| --- | --- |
| My Path | See recommendations, saved paths, decision progress, and the next step. |
| Explore | Browse and compare roles, trades, courses, costs, local outcomes, and income ranges. |
| Saathi | Get contextual counselling, document help, and application guidance. |
| Applications | Track document readiness, deadlines, form review, and submitted applications. |
| Family | Invite a parent/guardian and manage the shared decision space. |

## Onboarding

### Reusable screen pattern

```text
[ CareerSaathi ]                                      [ Save and exit ]

[ 3 of 8 · Your interests ]
[████████████░░░░░░░░░░░░] 38%

[ Plain-language question ]
[ Why we ask: This helps Saathi suggest work you may enjoy. ]

[ Large answer controls ]

[ Back ]                                  [ Continue → ]

[ Need help? Ask Saathi ]
```

- Name the current step and show numeric progress; do not use an ambiguous loading treatment.
- Preserve answers when users open help, move back, or save and exit.
- Permit skipping genuinely optional information. Explain that it can be added later.
- Finish with grouped, editable review cards rather than asking users to re-enter the whole flow.

### Question controls

| Information | UI treatment |
| --- | --- |
| Name, location, age range | Short fields with examples and inline validation. |
| Education and experience | Selectable timeline cards; allow Add another. |
| Interests | Image-supported choice cards; select up to five. |
| Work preferences | Clear trade-off cards such as near home/open to relocate and hands-on/office-based. |
| Financial or family constraints | Optional private-choice cards and Skip for now. |
| Resume or proof | File picker, camera upload, and visible file state; add later is always available. |
| Online profiles and portals | Optional recognizable provider cards; add a profile URL or choose I don't have one. |

Never ask for portal passwords or imply access to an account during onboarding. Later connections, if offered, require their own plain-language permission.

### Responsive behavior

**Mobile:** one-column content; sticky bottom action bar; 48px minimum touch targets; compact progress header; Saathi help opens in a bottom sheet without losing the current answer.

**Desktop:** a 560–640px central form column; quiet right-side Saathi card that explains help availability. Saathi should not auto-play or interrupt the form.

### Visual language

- Build on the existing `src/app/globals.css` design tokens for all colors, spacing, typography, and component states. Do not hard-code a separate product palette in feature components.
- Use semantic existing tokens for emphasis: `primary` for the next action, `muted` for supportive context, `destructive` for blocking errors, and only dedicated global status tokens for verified/completed states when required.
- Text labels accompany every icon. Use clear contrast, a readable default type size, and generous spacing.
- Use one concept per screen. Familiar illustrations or photographs may reinforce a choice, but never carry meaning without a visible label or optional spoken explanation.

### Low-literacy and rural-first interaction rules

- Write prompts as brief everyday questions: “What work do you enjoy?” rather than “Select your vocational preference.”
- Keep body copy to one or two short sentences; use the learner's selected regional language throughout, including error and privacy messages.
- Prefer large image-and-label choice cards, simple yes/no choices, and examples over free-text fields, long descriptions, or multi-select terminology.
- Provide a visible **Listen** control beside each question and important result; voice is optional and never the only way to proceed.
- Use familiar wording for files and portals: “Upload your biodata/resume” and “Do you have a job-app profile?” Explain unfamiliar terms in one sentence.
- Avoid asking for dates, costs, or official document details until necessary. When needed, show a local example and let the user choose “I don't know.”
- Use clear confirmations after every meaningful action, such as “Saved. You can continue later.” Do not rely on colour, animation, or a toast alone.
- Let a trusted helper assist on the same device without granting them permanent access; family sharing remains explicitly controlled by the learner.

## My Path and comparison

### Completion moment

After review, show:

> Thanks, [Name]. Saathi has enough to start guiding you. We'll build your best next step together.

Primary: **See my starting options**. Secondary: **Talk to Saathi first**.

### Recommendation cards

Show three starting paths. Each card includes the role/trade, match context, work style, training duration, location signal, starting income range, verified nearby providers, family questions status, and actions for Compare and Ask Saathi.

Do not present a long catalogue as the initial decision surface.

### Compare view

Compare two or three paths in parallel:

- Day in the life, in plain language
- Training time and expected total cost
- Verified nearby providers and travel distance
- Local employment or outcome evidence
- Entry-pay range and growth context, without guarantees
- Safety, hours, and relocation requirements
- Why it may fit the learner's recorded preferences
- Open questions to verify

Each fact must be visibly tagged: **Verified local data**, **Saathi's guidance**, or **Information to confirm**.

## Saathi avatar agent

Saathi is a persistent, compact floating help control, not a permanent full-screen character. Opening it displays a focused assistant panel with an avatar, language control, suggested actions, message input, and a visible context label such as `Using: profile + resume`.

The panel provides a clear **What can Saathi access?** control and a manage-access link. It may guide recommendations, answer questions, improve documents, and help prepare application work.

For application tasks, use an action workspace with a document checklist, reviewable form fields, and **Preview before submit**. Saathi must not silently complete or submit an application.

Voice input and output are optional. The selected language applies to Saathi and the family-facing experience. When Saathi cannot resolve a concern, or a sensitive family concern appears, surface **Talk to a counsellor** with the next available appointment or request route.

## Family experience

The learner explicitly invites a parent or guardian by WhatsApp, SMS, or a shareable link, and controls the shared information.

The family view prioritizes costs, location, safety, income ranges, and local proof. It offers a regional-language questions area and structured concerns such as cost, safety, job stability, and distance.

Show shared decision progress:

```text
Learning → Comparing → Discussing → Next step chosen
```

Personal learner responses and the resume remain private by default. Sharing occurs per item and is reversible from Family.

## Error, empty, and trust states

- Give inline validation beside fields and plain correction guidance.
- Upload failures retain the prior screen state and offer retry, a different upload method, or skip for now.
- Empty recommendations explain what profile information would improve them and offer profile editing or Saathi help.
- Unverified provider/outcome information is never styled as confirmed.
- Preserve a direct route to a human counsellor whenever uncertainty or harm-sensitive advice arises.

## UX Acceptance Checks

1. A first-time learner can finish core onboarding with only a phone and simple selection controls.
2. Every step displays progress, purpose, and a single primary action.
3. The user can save, resume, go back, and skip optional answers without data loss.
4. Saathi exposes what information it is using and lets the learner manage access.
5. The first recommendation surface shows only three starting paths and supports comparison.
6. Family access is opt-in, scoped, and does not expose the resume or private answers by default.
7. Application assistance requires a user-visible review before anything is submitted.
8. Mobile behavior works without hover, with clear labels and touch-sized controls.
9. All feature styling uses the existing `src/app/globals.css` tokens; no separate hard-coded palette is introduced.
10. A low-literacy user can answer using labelled visual choices and optional Listen help, without needing to understand technical vocabulary.
