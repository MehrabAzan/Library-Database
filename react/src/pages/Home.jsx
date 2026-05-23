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
  { label: "Open Today", value: "10 AM-4 PM" },
  { label: "Location", value: "100 Innovation Drive" },
  { label: "Contact", value: "(555) 019-8372" },
];

function FeaturedShelf({ title, description, items, loading, error }) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
            New at Datahaven
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">
            {title}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
            {description}
          </p>
        </div>
        <NavLink
          to="/search"
          className="text-sm font-semibold text-sky-900 transition-colors hover:text-sky-700"
        >
          Search catalog
        </NavLink>
      </div>

      <div className="min-h-48 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        {loading && (
          <p className="py-8 text-center text-sm font-medium text-slate-600">
            Loading collection highlights...
          </p>
        )}
        {!loading && error && (
          <p className="py-8 text-center text-sm font-medium text-rose-700">
            {error}
          </p>
        )}
        {!loading && !error && items.length === 0 && (
          <p className="py-8 text-center text-sm font-medium text-slate-500">
            No recent items are available yet.
          </p>
        )}
        {!loading && !error && items.length > 0 && (
          <div className="flex gap-5 overflow-x-auto pb-2">
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

  const welcomeName = user?.first_name
    ? `Welcome back, ${user.first_name}.`
    : "Your community library, online.";

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
    <div className="space-y-10">
      <section className="relative min-h-[380px] overflow-hidden rounded-lg bg-slate-950 text-white shadow-lg">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/Datahaven.jpg')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-slate-950/70" aria-hidden="true" />
        <div className="relative flex min-h-[380px] max-w-4xl flex-col justify-end px-6 py-10 sm:px-10 lg:px-14">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-200">
            Datahaven Libraries
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {welcomeName}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-stone-100 sm:text-lg">
            Search the catalog, manage holds, review loans, and plan your visit
            from one place.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <NavLink
              to="/search"
              className="rounded-md bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-sm transition-colors hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Search the Catalog
            </NavLink>
            <NavLink
              to={user ? "/account" : "/registration"}
              className="rounded-md border border-white/40 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              {user ? "View My Account" : "Get a Library Card"}
            </NavLink>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {collections.map((collection) => (
          <NavLink
            key={collection.title}
            to={collection.to}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
          >
            <h2 className="text-lg font-bold text-slate-950">
              {collection.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {collection.description}
            </p>
          </NavLink>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
            Visit Datahaven
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            Plan your next library trip
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {visitHighlights.map((item) => (
              <div key={item.label} className="border-l-4 border-sky-900 pl-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  {item.label}
                </p>
                <p className="mt-1 text-base font-semibold text-slate-950">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-800">
            Patron Services
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            Holds, loans, and fines
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Signed-in patrons can place holds, check due dates, and review fine
            balances from their account dashboard.
          </p>
          <NavLink
            to={user ? "/account" : "/login"}
            className="mt-5 inline-flex rounded-md bg-sky-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-sky-800"
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
