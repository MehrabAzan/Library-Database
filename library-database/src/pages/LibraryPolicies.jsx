const policies = [
  {
    title: "Borrowing & renewals",
    description:
      "All patrons may borrow items from Datahaven Library. The standard borrowing period is 14 days; students and faculty have 21-day and 28-day periods. Renewals are not offered at the moment; items may be re-checked out when there is no active hold.",
  },
  {
    title: "Fines & lost items",
    description:
      "Overdue items accrue daily fines: $0.25 for patrons, $0.20 for students, and $0.10 for faculty. Fines can be paid in person or online.",
  },
  {
    title: "Code of conduct",
    description:
      "Covered beverages and food are permitted, but not at computer tables. Use headphones when applicable and keep conversations at a respectful volume.",
  },
  {
    title: "Privacy",
    description:
      "Patron activities such as fines, loans, and holds are tracked and available through the account history page.",
  },
];

export default function LibraryPolicies() {
  return (
    <section className="space-y-10">
      <div className="max-w-3xl">
        <p className="dh-kicker">Patron Guidelines</p>
        <h1 className="dh-section-title mt-2 text-4xl sm:text-5xl">
          Library policies
        </h1>
        <p className="mt-4 text-base leading-7 text-ink/70">
          These guidelines help maintain a safe, equitable, and welcoming
          environment for everyone.
        </p>
      </div>

      <div className="divide-y divide-ink/10 border-y border-ink/10">
        {policies.map((policy) => (
          <article key={policy.title} className="py-6">
            <h2 className="font-display text-xl font-semibold text-ink-deep">
              {policy.title}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-ink/65">
              {policy.description}
            </p>
          </article>
        ))}
      </div>

      <p className="text-sm text-ink/60">
        Have a question not covered here? Ask staff at the front desk.
      </p>
    </section>
  );
}
