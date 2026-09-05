import { useState, useEffect } from "react";

export default function LibraryHours() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const day = new Date().getDay();
    setIsOpen(day !== 0);
  }, []);

  const schedule = [
    { day: "Monday – Thursday", time: "8:00 AM – 9:00 PM" },
    { day: "Friday", time: "8:00 AM – 6:00 PM" },
    { day: "Saturday", time: "10:00 AM – 4:00 PM" },
    { day: "Sunday", time: "Closed", closed: true },
  ];

  return (
    <section className="space-y-10">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">Hours & Location</p>
        <h1 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight text-ink-deep mt-2 text-4xl sm:text-5xl">Visiting?</h1>
        <p className="mt-4 text-base leading-7 text-ink/70">
          Datahaven Library offers a quiet space for deep work, collaborative
          areas for study, and an extensive physical collection.
        </p>
        <p className="mt-4 text-sm font-semibold text-ink-deep">
          {isOpen ? "Currently open" : "Currently closed"}
        </p>
      </div>

      <div className="grid gap-10 border-t border-ink/10 pt-8 lg:grid-cols-2">
        <div className="space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
              Location
            </p>
            <p className="mt-2 text-base font-semibold text-ink-deep">
              100 Innovation Drive
            </p>
            <p className="mt-1 text-sm leading-6 text-ink/65">
              Tech District, TX 75001
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
              Contact
            </p>
            <p className="mt-2 text-base font-semibold text-ink-deep">
              (555) 019-8372
            </p>
            <p className="mt-1 text-sm leading-6 text-ink/65">
              hello@datahaven.lib
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-semibold text-ink-deep">
            Library hours
          </h2>
          <ul className="mt-5 divide-y divide-ink/10 border-y border-ink/10">
            {schedule.map((item) => (
              <li
                key={item.day}
                className="flex items-center justify-between gap-4 py-3.5"
              >
                <span className="text-sm font-medium text-ink/80">
                  {item.day}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    item.closed ? "text-danger" : "text-ink-deep"
                  }`}
                >
                  {item.time}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-5 text-ink/50">
            Hours may vary during national holidays.
          </p>
        </div>
      </div>
    </section>
  );
}
