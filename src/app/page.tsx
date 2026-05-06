import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <header className="space-y-3">
        <p className="text-sm font-medium tracking-wider text-[color:var(--color-muted-foreground)] uppercase">
          2026 SaaS Stack
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Obsidian</h1>
        <p className="text-lg text-[color:var(--color-muted-foreground)]">
          Next.js 15 · React 19 · Tailwind v4 · Drizzle · Better Auth · Biome · Vitest · Playwright
        </p>
      </header>

      <section className="space-y-4 rounded-xl border border-[color:var(--color-border)] p-6">
        <h2 className="text-lg font-medium">Foundation ready</h2>
        <p className="text-sm text-[color:var(--color-muted-foreground)]">
          Run <code className="font-mono text-xs">bun install</code> and{' '}
          <code className="font-mono text-xs">bun dev</code> to get started.
        </p>
        <div className="flex gap-3">
          <Button>Primary action</Button>
          <Button variant="outline">Secondary</Button>
        </div>
      </section>
    </main>
  );
}
