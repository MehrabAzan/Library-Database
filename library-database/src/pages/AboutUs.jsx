export default function AboutUs() {
  return (
    <section className="space-y-12">
      <div className="max-w-3xl">
        <p className="dh-kicker">About the Library</p>
        <h1 className="dh-section-title mt-2 text-4xl sm:text-5xl">
          About Datahaven
        </h1>
        <p className="mt-4 text-base leading-7 text-ink/70">
          Datahaven is more than a library. We are a community haven that
          provides knowledge, technology, and space to learn.
        </p>
      </div>

      <div className="grid gap-10 border-t border-ink/10 pt-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink-deep">
            Welcome
          </h2>
          <p className="mt-3 text-sm leading-7 text-ink/65">
            Whether you are here to research, borrow equipment, or dive into a
            good book, Datahaven is your space.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink-deep">
            Our mission
          </h2>
          <p className="mt-3 text-sm leading-7 text-ink/65">
            We empower the community by providing access to knowledge,
            technology, and resources — a sanctuary for learning and
            collaboration.
          </p>
        </div>
      </div>
    </section>
  );
}
