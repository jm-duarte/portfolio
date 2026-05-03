# João's Portfolio Workspace

## Overview

pnpm workspace monorepo using TypeScript. React + Vite SPA portfolio backed by Sanity.io CMS (no custom backend or database).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **Frontend**: React 19 + Vite + Tailwind CSS 4 + Framer Motion
- **CMS**: Sanity.io (Content Lake + GROQ queries)
- **Routing**: wouter (SPA)
- **Internationalization**: EN/PT via in-app translation object + localStorage

## Artifacts

| Artifact | Path | Description |
|---|---|---|
| `artifacts/portfolio` | `/` | Main SPA portfolio frontend |
| `artifacts/sanity-studio` | local only | Sanity Studio for content management |
| `artifacts/mockup-sandbox` | canvas | UI prototyping sandbox |

## Content Model (Sanity)

- **project** — Public portfolio pieces (title, slug, tags, coverImage, gradient fallback, role, year, overview, orderRank, published)
- **uxCase** — Password-protected case studies (same fields + `content` Portable Text body)
- **aboutMe** (singleton) — Profile photo, bio, skills, tools, experience timeline
- **siteSettings** (singleton) — `uxCasePassword` string; controls UX Cases password gate

## Key Files

- `artifacts/portfolio/src/App.tsx` — Main SPA with all pages, Sanity data fetching, password gate
- `artifacts/portfolio/src/sanity/client.ts` — Sanity client (null when `VITE_SANITY_PROJECT_ID` not set)
- `artifacts/portfolio/src/sanity/queries.ts` — GROQ queries for all content types
- `artifacts/portfolio/src/sanity/portableText.tsx` — Portable Text renderer components
- `artifacts/sanity-studio/sanity.config.ts` — Studio config with structured sidebar
- `artifacts/sanity-studio/schemaTypes/` — All document type schema definitions

## Environment Secrets Required

| Secret | Where used | Description |
|---|---|---|
| `VITE_SANITY_PROJECT_ID` | portfolio frontend | Sanity project ID (8-char string from sanity.io) |
| `VITE_SANITY_DATASET` | portfolio frontend | Dataset name (default: `production`) |
| `SANITY_STUDIO_PROJECT_ID` | sanity-studio | Same project ID, for the Studio config |
| `SANITY_STUDIO_DATASET` | sanity-studio | Same dataset name |

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/portfolio run dev` — run portfolio locally
- `pnpm --filter @workspace/sanity-studio run dev` — run Studio locally
- `pnpm --filter @workspace/sanity-studio run deploy` — publish Studio to Sanity CDN

## Sanity Setup (one-time)

1. Create project at sanity.io → get Project ID
2. Add `VITE_SANITY_PROJECT_ID` (and optionally `VITE_SANITY_DATASET`) to Replit secrets
3. Add `SANITY_STUDIO_PROJECT_ID` + `SANITY_STUDIO_DATASET` to Replit secrets
4. Run `pnpm --filter @workspace/sanity-studio run deploy` to publish the Studio
5. Manage content at `https://your-project-id.sanity.studio`

## Data Fetching Pattern

Portfolio fetches all content on mount via `Promise.all` GROQ queries. Falls back to static default data when Sanity is unconfigured. A yellow dev-only banner notifies when the project ID is missing.

## Password Gate

UX Cases are protected by a password fetched from the `siteSettings` Sanity document (`uxCasePassword` field). Falls back to `"ux2024"` if Sanity is not yet connected. Rotate the password anytime from the Studio without a code deploy.

## Previous Architecture (removed)

- Express API server (`artifacts/api-server`) — removed
- PostgreSQL + Drizzle ORM (`lib/db`) — no longer used
- Custom `/admin` route + `Admin.tsx` — replaced by Sanity Studio
