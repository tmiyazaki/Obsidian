import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-sm font-medium text-[color:var(--color-muted-foreground)]">404</p>
      <h2 className="text-2xl font-semibold">Page not found</h2>
      <Link href="/" className="text-sm underline-offset-4 hover:underline">
        Return home
      </Link>
    </main>
  );
}
