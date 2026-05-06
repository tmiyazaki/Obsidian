# Obsidian

A modern web application built on the **2026 SaaS Stack** — Next.js 15, React 19, Tailwind v4, Drizzle, Better Auth, Biome, Vitest, Playwright.

## Quick start

```bash
# 1. Install (Bun is fastest; pnpm/npm also work)
bun install

# 2. Configure env
cp .env.example .env.local
# generate a strong secret:
openssl rand -base64 32   # paste into BETTER_AUTH_SECRET

# 3. (Optional) start a local Postgres — or point DATABASE_URL at Neon
docker run -d --name pg -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=obsidian postgres:16

# 4. Apply schema
bun run db:push

# 5. Run the dev server
bun run dev
```

Open <http://localhost:3000>.

## Scripts

| Command | What it does |
| --- | --- |
| `bun run dev` | Next.js dev server (Turbopack) |
| `bun run build` | Production build |
| `bun run lint` | Biome check (lint + format diagnostics) |
| `bun run lint:fix` | Biome auto-fix + format |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run test` | Vitest unit tests |
| `bun run test:e2e` | Playwright E2E (boots dev server) |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate` | Apply migrations |
| `bun run db:studio` | Drizzle Studio |

## Architecture

See [`CLAUDE.md`](./CLAUDE.md) for layout, conventions, and how to extend the project.

## Stack rationale (TL;DR)

- **Next.js 15 + RSC + PPR** — best-in-class React framework with static/dynamic hybrid
- **Bun** — install/run/test ~10× faster than npm; Node-compatible fallback ready
- **Tailwind v4** — Lightning CSS, native cascade layers, `@theme` design tokens
- **Drizzle** — light, edge-friendly, SQL-shaped types beat Prisma's runtime
- **Better Auth** — TypeScript-native, self-hostable, no vendor lock-in
- **Biome** — replaces ESLint + Prettier, ~25× faster, single config
- **Vitest + Playwright** — modern, ESM-native, fast

## License

Private.
