export default function TestPage() {
  return (
    <div className="space-y-4 border-y border-ink/10 bg-paper/80 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">Testing</p>
      <h1 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight text-ink-deep text-4xl">Test Page</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-ink/65">
        This view is set up for isolated component checks and quick UI
        validation.
      </p>
    </div>
  );
}
