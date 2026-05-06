# Obsidian — Project Guide for Claude Code

A modern web application built on the **2026 SaaS Stack**. This file is read by Claude Code on every session — keep it concise and accurate.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, RSC, Partial Prerendering) |
| Runtime | React 19, Node.js 22, Bun 1.3 |
| Language | TypeScript 5.7 (strict + `noUncheckedIndexedAccess`) |
| Styling | Tailwind CSS v4 (zero-config, `@theme`) |
| UI primitives | shadcn-style components in `src/components/ui` |
| Data | Drizzle ORM + Postgres (Neon-ready) |
| Auth | Better Auth (email/password + OAuth-ready) |
| Validation | Zod + `@t3-oss/env-nextjs` |
| Server state | TanStack Query v5 |
| Forms | React Hook Form + `@hookform/resolvers` |
| Lint/Format | **Biome** (replaces ESLint + Prettier) |
| Tests | Vitest (unit) + Playwright (E2E) |
| Git hooks | lefthook + commitlint (Conventional Commits) |
| CI | GitHub Actions (lint / typecheck / test / build / E2E) |

## Layout

```
src/
  app/            # Next.js App Router (pages, layouts, route handlers)
    api/health/   # Liveness probe
    api/auth/     # Better Auth handler (catch-all)
  components/ui/  # Reusable UI primitives (Button, etc.)
  lib/
    env.ts        # Type-safe env vars (validate at build time)
    utils.ts      # cn(), small helpers
    db/           # Drizzle client + schema
    auth/         # Better Auth server + client
tests/
  unit/           # Vitest
  e2e/            # Playwright
drizzle/          # Generated migrations (do not edit by hand)
```

Path alias: `@/*` → `src/*`.

## Commands

```bash
bun install                  # install deps
bun run dev                  # dev server (Turbopack)
bun run build                # production build
bun run start                # start prod server
bun run lint                 # Biome check
bun run lint:fix             # Biome auto-fix
bun run typecheck            # tsc --noEmit
bun run test                 # Vitest (one-shot)
bun run test:watch           # Vitest watch
bun run test:e2e             # Playwright (boots dev server)
bun run db:generate          # generate Drizzle migration from schema diff
bun run db:migrate           # apply migrations
bun run db:studio            # browse DB
```

## Conventions

- **No comments on the obvious.** Only document non-obvious WHY (constraints, invariants, workarounds).
- **Server-first.** Default to Server Components and Server Actions; reach for `'use client'` only when needed (hooks, browser APIs, event handlers).
- **Validate at boundaries.** Every Server Action / route handler / form input goes through Zod. Internal code trusts its types.
- **No `any`.** Biome warns; prefer `unknown` + narrowing.
- **Imports.** Use `import type` for type-only. Biome organises imports automatically.
- **Commits.** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
- **Branches.** Feature work on `claude/*` or `feat/*`; PRs target `main`.

## Adding things

- **New UI primitive:** add under `src/components/ui/<name>.tsx`. Follow Button's CVA pattern.
- **New shadcn component:** copy from <https://ui.shadcn.com> into `src/components/ui/`. We own the code.
- **New table:** add to `src/lib/db/schema.ts`, run `bun run db:generate`, then `bun run db:migrate`.
- **New env var:** add to `.env.example` AND `src/lib/env.ts` (server or client block) — type safety is enforced.
- **New route:** create `src/app/<segment>/page.tsx`. For API: `src/app/api/<segment>/route.ts`.

## Auth

Better Auth is mounted at `/api/auth/[...all]`. Server-side: import `auth` from `@/lib/auth`. Client-side: use `authClient` from `@/lib/auth/client` (`signIn`, `signUp`, `signOut`, `useSession`).

## Database

Drizzle uses `postgres-js` against `DATABASE_URL`. For Neon, swap to `drizzle-orm/neon-http`. Migrations live in `./drizzle/`.

## Testing

- **Unit:** colocated `*.test.ts(x)` or under `tests/unit/`. Run with `bun run test`.
- **E2E:** `tests/e2e/*.spec.ts`. Playwright auto-starts the dev server. CI runs Chromium only — add Firefox/WebKit projects when needed.

## Don't

- Don't bypass `lib/env.ts` by reading `process.env` directly in app code.
- Don't add ESLint or Prettier — Biome owns lint + format.
- Don't `--no-verify` on commit. Fix the hook failure.
- Don't commit `.env*` (only `.env.example`).
