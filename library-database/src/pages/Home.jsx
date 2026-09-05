import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { CarouselItem } from "../components/Items";
import { FetchJson, GetErrorMessage, ReadStoredUser } from "../api";

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
    to: "/search",
  },
  {
    title: "Media",
    description: "Films, recordings, and audiovisual learning materials.",
    to: "/search",
  },
  {
    title: "Periodicals",
    description: "Current magazines, journals, and reference serials.",
    to: "/search",
  },
  {
    title: "Equipment",
    description: "Borrowable technology and study support tools.",
    to: "/search",
  },
];

const visitHighlights = [
  { label: "Open Today", value: "Mon–Thu 8 AM–9 PM" },
  { label: "Location", value: "100 Innovation Drive" },
  { label: "Contact", value: "(555) 019-8372" },
];

function ShelfSkeleton() {
  return (
    <div className="flex gap-5 overflow-x-auto scroll-px-1 px-[0.15rem] py-1 pb-4 snap-x snap-proximity [scrollbar-width:thin] [scrollbar-color:rgb(20_85_95_/_0.35)_transparent]" aria-hidden="true">
      {[0, 1, 2, 3].map((index) => (
        <div key={index} className="w-[15.5rem] shrink-0 space-y-3 p-1">
          <div className="animate-pulse rounded-[0.35rem] bg-ink/10 mx-auto h-44 w-32" />
          <div className="animate-pulse rounded-[0.35rem] bg-ink/10 mx-auto h-4 w-36" />
          <div className="animate-pulse rounded-[0.35rem] bg-ink/10 mx-auto h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

function FeaturedShelf({ title, description, items, loading, error }) {
  return (
    <section className="animate-[rise_650ms_cubic-bezier(0.22,1,0.36,1)_both] space-y-4">
      <div className="flex flex-col justify-between gap-3 border-b border-ink/10 pb-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">New at Datahaven</p>
          <h2 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight text-ink-deep mt-1">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink/65">
            {description}
          </p>
        </div>
        <NavLink to="/search" className="font-semibold text-ink-soft underline decoration-ink-soft/35 underline-offset-[0.18em] transition-[color,text-decoration-color] duration-150 hover:text-ink hover:decoration-brass text-sm">
          Search catalog
        </NavLink>
      </div>

      <div className="min-h-48 border-y border-ink/10 bg-paper/40 py-5">
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
          <div className="flex gap-5 overflow-x-auto scroll-px-1 px-[0.15rem] py-1 pb-4 snap-x snap-proximity [scrollbar-width:thin] [scrollbar-color:rgb(20_85_95_/_0.35)_transparent]">
            {items.map((item) => (
              <CarouselItem key={`${item.category}-${item.itemId}`} itemData={item} />
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
    <div className="space-y-16">
      <section className="relative flex min-h-[min(72vh,520px)] items-end overflow-hidden text-white -mx-4 -mt-6 sm:-mx-6 lg:-mx-8">
        <div className="absolute inset-0 scale-[1.02] bg-ink-deep bg-[radial-gradient(ellipse_100%_80%_at_0%_0%,rgb(95_143_138_/_0.45),transparent_58%),radial-gradient(ellipse_80%_70%_at_100%_0%,rgb(212_169_74_/_0.28),transparent_52%),linear-gradient(135deg,#041c20_0%,#0b3a42_42%,#1a6b75_100%)] animate-[mediaSettle_1.4s_ease-out_both]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgb(4_28_32_/_0.72)_0%,rgb(4_28_32_/_0.35)_55%,transparent_78%),linear-gradient(0deg,rgb(4_28_32_/_0.65)_0%,transparent_48%)]" aria-hidden="true" />
        <div className="relative z-10 w-full max-w-xl px-5 pb-12 pt-14 text-white [text-shadow:0_2px_12px_rgb(4_28_32_/_0.45)] animate-[rise_700ms_cubic-bezier(0.22,1,0.36,1)_both] sm:px-8 sm:pb-14 sm:pt-[4.5rem] lg:px-12">
          <img
            src="/Datahaven.jpg"
            alt=""
            className="h-12 w-12 rounded-[0.4rem] border border-ink/15 bg-white object-cover mb-5 h-14 w-14 border-paper/30"
          />
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Datahaven Libraries
          </h1>
          <p className="mt-4 max-w-xl text-lg font-medium text-white sm:text-xl">
            {headline}
          </p>
          <p className="text-paper/90 mt-3 max-w-xl text-base leading-7 text-white/90">
            Search the catalog, manage holds and loans, and check branch hours
            in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <NavLink to="/search" className="inline-flex items-center justify-center gap-2 rounded-lg px-[1.15rem] py-[0.65rem] text-sm font-semibold leading-tight transition-[background-color,color,border-color,transform] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass active:enabled:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 bg-brass text-ink-deep shadow-[0_8px_24px_rgb(4_28_32_/_0.28)] hover:enabled:bg-brass-soft !text-ink-deep">
              Search the Catalog
            </NavLink>
            <NavLink
              to={user ? "/account" : "/registration"}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-[1.15rem] py-[0.65rem] text-sm font-semibold leading-tight transition-[background-color,color,border-color,transform] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass active:enabled:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 border border-white/70 bg-white/15 text-white hover:enabled:bg-white/25 !text-white"
            >
              {user ? "View My Account" : "Get a Library Card"}
            </NavLink>
          </div>
        </div>
      </section>

      <section className="max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">Collections</p>
        <h2 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight text-ink-deep mt-2">What you can borrow</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/65">
          Jump into the catalog by material type.
        </p>
        <div className="mt-8 grid gap-0 sm:grid-cols-2">
          {collections.map((collection, index) => (
            <NavLink
              key={collection.title}
              to={collection.to}
              className="block border-b border-ink/15 py-[1.15rem] transition-[padding,color,border-color] duration-150 hover:border-brass hover:pl-2 hover:text-ink-soft sm:px-1"
            >
              <span className="flex items-baseline gap-3">
                <span className="font-mono text-xs font-semibold tracking-widest text-brass-deep">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-xl font-semibold text-ink-deep">
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

      <section className="grid gap-10 border-y border-ink/10 py-12 lg:grid-cols-2 lg:gap-16">
        <div className="border-l-2 border-brass pl-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">Visit</p>
          <h2 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight text-ink-deep mt-2">Plan your next trip</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {visitHighlights.map((item) => (
              <div key={item.label}>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                  {item.label}
                </p>
                <p className="mt-1 text-base font-semibold text-ink-deep">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          <NavLink to="/hours" className="font-semibold text-ink-soft underline decoration-ink-soft/35 underline-offset-[0.18em] transition-[color,text-decoration-color] duration-150 hover:text-ink hover:decoration-brass mt-6 inline-flex text-sm">
            Full hours and location
          </NavLink>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">Patron services</p>
          <h2 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight text-ink-deep mt-2">Holds, loans, and fines</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-ink/65">
            Signed-in patrons can place holds, check due dates, and review fine
            balances from their account.
          </p>
          <NavLink
            to={user ? "/account" : "/login"}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-[1.15rem] py-[0.65rem] text-sm font-semibold leading-tight transition-[background-color,color,border-color,transform] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass active:enabled:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 bg-ink text-paper hover:enabled:bg-ink-soft mt-6"
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
      />
      <FeaturedShelf
        title="Recent Periodicals"
        description="Current issues and serial publications available through the library."
        items={data.periodicals}
        loading={loading}
        error={error}
      />
      <FeaturedShelf
        title="Recent Media"
        description="New audiovisual resources for entertainment, learning, and research."
        items={data.audiovisualmedia}
        loading={loading}
        error={error}
      />
      <FeaturedShelf
        title="Recent Equipment"
        description="Technology and equipment recently added to circulation."
        items={data.equipment}
        loading={loading}
        error={error}
      />
    </div>
  );
}
