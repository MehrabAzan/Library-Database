import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { CarouselItem } from "../components/Items";
import { FetchJson, GetErrorMessage, ReadStoredUser } from "../api";

const btn =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass active:enabled:translate-y-px";
const btnPrimary = `${btn} bg-ink text-paper hover:enabled:bg-ink-soft`;
const btnAccent = `${btn} bg-brass text-ink-deep shadow-[0_8px_24px_rgb(4_28_32_/_0.28)] hover:enabled:bg-brass-soft`;
const btnGhost = `${btn} border border-white/70 bg-white/15 text-white hover:enabled:bg-white/25`;
const link =
  "font-semibold text-ink-soft underline decoration-ink-soft/35 underline-offset-[0.18em] transition duration-150 hover:text-ink hover:decoration-brass";
const kicker =
  "text-xs font-bold uppercase tracking-[0.16em] text-brass-deep";
const sectionTitle =
  "font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight text-ink-deep";
const rail =
  "flex gap-5 overflow-x-auto px-1 py-1 pb-4 snap-x snap-proximity [scrollbar-width:thin] [scrollbar-color:rgb(20_85_95_/_0.35)_transparent]";

async function FetchCirculationData() {
  const payload = await FetchJson("/api/mainitems");

  return {
    books: payload.books ?? [],
    periodicals: payload.periodicals ?? [],
    audiovisualmedia: payload.audiovisualmedia ?? [],
    equipment: payload.equipment ?? [],
  };
}

const collections = [
  {
    title: "Books",
    description: "Fiction, nonfiction, research, and classroom support.",
    to: "/search?category=book",
  },
  {
    title: "Media",
    description: "Films, recordings, and audiovisual learning materials.",
    to: "/search?category=audiovisualmedia",
  },
  {
    title: "Periodicals",
    description: "Current magazines, journals, and reference serials.",
    to: "/search?category=periodical",
  },
  {
    title: "Equipment",
    description: "Borrowable technology and study support tools.",
    to: "/search?category=equipment",
  },
];

const visitHighlights = [
  { label: "Open Today", value: "Mon–Thu 8 AM–9 PM" },
  { label: "Location", value: "100 Innovation Drive" },
  { label: "Contact", value: "(555) 019-8372" },
];

function ShelfSkeleton() {
  return (
    <div className={rail} aria-hidden="true">
      {[0, 1, 2, 3].map((index) => (
        <div key={index} className="w-[15.5rem] shrink-0 space-y-3 p-1">
          <div className="mx-auto h-44 w-32 animate-pulse rounded-md bg-ink/10" />
          <div className="mx-auto h-4 w-36 animate-pulse rounded-md bg-ink/10" />
          <div className="mx-auto h-3 w-24 animate-pulse rounded-md bg-ink/10" />
        </div>
      ))}
    </div>
  );
}

function FeaturedShelf({ title, description, items, loading, error, delayMs = 0 }) {
  return (
    <section
      className="space-y-4 animate-[rise_650ms_cubic-bezier(0.22,1,0.36,1)_both]"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="flex flex-col justify-between gap-3 border-b border-ink/10 pb-4 sm:flex-row sm:items-end">
        <div className="border-l-[3px] border-brass pl-4">
          <p className={kicker}>New at Datahaven</p>
          <h2 className={`${sectionTitle} mt-1`}>{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink/65">
            {description}
          </p>
        </div>
        <NavLink to="/search" className={`${link} text-sm`}>
          Search catalog
        </NavLink>
      </div>

      <div className="min-h-48 border-y border-ink/10 bg-gradient-to-b from-paper/70 to-mist/40 py-5">
        {loading && <ShelfSkeleton />}
        {!loading && error && (
          <p className="py-8 text-center text-sm font-medium text-danger">
            {error}
          </p>
        )}
        {!loading && !error && items.length === 0 && (
          <p className="py-8 text-center text-sm font-medium text-ink/50">
            No recent items are available yet.
          </p>
        )}
        {!loading && !error && items.length > 0 && (
          <div className={rail}>
            {items.map((item) => (
              <CarouselItem
                key={`${item.category}-${item.itemId}`}
                itemData={item}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const user = ReadStoredUser();

  const headline = user?.first_name
    ? `Welcome back, ${user.first_name}.`
    : "Borrow, browse, and plan your visit.";

  const [data, setData] = useState({
    books: [],
    periodicals: [],
    audiovisualmedia: [],
    equipment: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function LoadCirculation() {
      try {
        setLoading(true);
        setError("");
        setData(await FetchCirculationData());
      } catch (err) {
        setError(GetErrorMessage(err, "Failed to load items."));
      } finally {
        setLoading(false);
      }
    }

    LoadCirculation();
  }, []);

  return (
    <div className="space-y-20">
      <section className="relative -mx-4 -mt-6 flex min-h-[min(78vh,560px)] items-end overflow-hidden text-white sm:-mx-6 lg:-mx-8">
        <div
          className="absolute inset-0 scale-[1.02] bg-ink-deep bg-[radial-gradient(ellipse_100%_80%_at_0%_0%,rgb(95_143_138_/_0.5),transparent_58%),radial-gradient(ellipse_80%_70%_at_100%_0%,rgb(212_169_74_/_0.32),transparent_52%),linear-gradient(135deg,#041c20_0%,#0b3a42_42%,#1a6b75_100%)] animate-[mediaSettle_1.4s_ease-out_both]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(105deg,rgb(4_28_32_/_0.78)_0%,rgb(4_28_32_/_0.4)_52%,transparent_80%),linear-gradient(0deg,rgb(4_28_32_/_0.7)_0%,transparent_45%)]"
          aria-hidden="true"
        />
        <div className="relative z-10 w-full max-w-2xl px-5 pb-14 pt-16 [text-shadow:0_2px_14px_rgb(4_28_32_/_0.5)] animate-[rise_700ms_cubic-bezier(0.22,1,0.36,1)_both] sm:px-8 sm:pb-16 sm:pt-20 lg:px-12">
          <img
            src="/Datahaven.jpg"
            alt=""
            className="mb-6 h-16 w-16 rounded-md border border-white/40 bg-white object-cover shadow-[0_10px_28px_rgb(4_28_32_/_0.4)]"
          />
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Datahaven Libraries
          </h1>
          <p className="mt-5 max-w-xl text-lg font-medium text-white sm:text-xl">
            {headline}
          </p>
          <p className="mt-3 max-w-xl text-base leading-7 text-paper/90">
            Search the catalog, manage holds and loans, and check branch hours
            in one place.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <NavLink to="/search" className={btnAccent}>
              Search the Catalog
            </NavLink>
            <NavLink
              to={user ? "/account" : "/registration"}
              className={btnGhost}
            >
              {user ? "View My Account" : "Get a Library Card"}
            </NavLink>
          </div>
        </div>
      </section>

      <section className="max-w-5xl animate-[rise_700ms_cubic-bezier(0.22,1,0.36,1)_both]">
        <p className={kicker}>Collections</p>
        <h2 className={`${sectionTitle} mt-2`}>What you can borrow</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/65">
          Jump into the catalog by material type.
        </p>
        <div className="mt-8 grid gap-0 sm:grid-cols-2">
          {collections.map((collection, index) => (
            <NavLink
              key={collection.title}
              to={collection.to}
              className="group block border-b border-ink/15 py-5 transition duration-150 hover:border-brass hover:bg-white/40 sm:px-2"
            >
              <span className="flex items-baseline gap-3">
                <span className="font-mono text-xs font-semibold tracking-widest text-brass-deep transition duration-150 group-hover:text-brass">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-xl font-semibold text-ink-deep transition duration-150 group-hover:text-ink-soft">
                  {collection.title}
                </span>
              </span>
              <span className="mt-1 block pl-9 text-sm leading-6 text-ink/60">
                {collection.description}
              </span>
            </NavLink>
          ))}
        </div>
      </section>

      <section className="grid gap-12 border-y border-ink/10 py-14 lg:grid-cols-2 lg:gap-20">
        <div className="border-l-[3px] border-brass pl-5">
          <p className={kicker}>Visit</p>
          <h2 className={`${sectionTitle} mt-2`}>Plan your next trip</h2>
          <div className="mt-7 grid gap-6 sm:grid-cols-3">
            {visitHighlights.map((item) => (
              <div key={item.label}>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                  {item.label}
                </p>
                <p className="mt-1.5 text-base font-semibold leading-snug text-ink-deep">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          <NavLink to="/hours" className={`${link} mt-7 inline-flex text-sm`}>
            Full hours and location
          </NavLink>
        </div>

        <div>
          <p className={kicker}>Patron services</p>
          <h2 className={`${sectionTitle} mt-2`}>Holds, loans, and fines</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-ink/65">
            Signed-in patrons can place holds, check due dates, and review fine
            balances from their account.
          </p>
          <NavLink
            to={user ? "/account" : "/login"}
            className={`${btnPrimary} mt-7`}
          >
            {user ? "Open Account" : "Log in"}
          </NavLink>
        </div>
      </section>

      <FeaturedShelf
        title="Recent Books"
        description="Recently added titles across the Datahaven collection."
        items={data.books}
        loading={loading}
        error={error}
        delayMs={40}
      />
      <FeaturedShelf
        title="Recent Periodicals"
        description="Current issues and serial publications available through the library."
        items={data.periodicals}
        loading={loading}
        error={error}
        delayMs={90}
      />
      <FeaturedShelf
        title="Recent Media"
        description="New audiovisual resources for entertainment, learning, and research."
        items={data.audiovisualmedia}
        loading={loading}
        error={error}
        delayMs={140}
      />
      <FeaturedShelf
        title="Recent Equipment"
        description="Technology and equipment recently added to circulation."
        items={data.equipment}
        loading={loading}
        error={error}
        delayMs={190}
      />
    </div>
  );
}
