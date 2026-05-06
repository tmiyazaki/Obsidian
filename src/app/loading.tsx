export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div
        className="size-8 animate-spin rounded-full border-2 border-current border-t-transparent text-[color:var(--color-muted-foreground)]"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
