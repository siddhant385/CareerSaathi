<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# CareerSaathi engineering guide

CareerSaathi is a Typescript repo for AI-Enabled Career Counselling and Family Decision-Support Platform for Vocational Education. Keep changes maintainable, tested, and consistent with the surrounding code.

## Product context

CareerSaathi is a full-stack, family-centred vocational counselling platform for India. It helps learners and parents make informed vocational-training decisions together, particularly in rural and semi-urban households where family perception can determine enrolment and retention.

Prioritize joint parent–learner conversations in English and regional languages, verified local outcome data for trades and training providers, low-jargon and low-literacy-friendly experiences, and clear escalation to human counsellors when AI cannot resolve a concern. Administrator-facing work should help identify family engagement, sentiment, and sources of resistance without treating counselling as learner-only guidance.

## Component location

Keep components that belong only to a route inside that route's `components/` directory. For example, counselling-only components live in `src/app/counselling/components/`.

Keep reusable, cross-route components in `src/components/`. Keep shadcn primitives in `src/components/ui/`.

## Package Manager
Use pnpm as the package manager.

