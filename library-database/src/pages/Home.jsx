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
  { label: "Open Today", value: "10 AM–4 PM" },
  { label: "Location", value: "100 Innovation Drive" },
  { label: "Contact", value: "(555) 019-8372" },
];

function FeaturedShelf({ title, description, items, loading, error }) {
  return (
    <section className="dh-shelf space-y-4">
      <div className="flex flex-col justify-between gap-3 border-b border-ink/10 pb-3 sm:flex-row sm:items-end">
        <div>
          <p className="dh-kicker">New at Datahaven</p>
          <h2 className="dh-section-title mt-1">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink/65">
            {description}
          </p>
        </div>
        <NavLink to="/search" className="dh-link text-sm">
          Search catalog
        </NavLink>
      </div>

      <div className="min-h-48 border-y border-ink/10 bg-paper/50 py-4">
        {loading && (
          <p className="py-8 text-center text-sm font-medium text-ink/60">
            Loading collection highlights...
          </p>
        )}
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
    <div className="space-y-14">
      <section className="dh-hero -mx-4 -mt-6 sm:-mx-6 lg:-mx-8">
        <div className="dh-hero-media" aria-hidden="true" />
        <div className="dh-hero-scrim" aria-hidden="true" />
        <div className="dh-hero-content">
          <img
            src="/Datahaven.jpg"
            alt=""
            className="dh-brand-mark mb-5 h-14 w-14 border-paper/30"
          />
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Datahaven Libraries
          </h1>
          <p className="mt-4 max-w-xl text-lg font-medium sm:text-xl">
            {headline}
          </p>
          <p className="dh-hero-copy mt-3 max-w-xl text-base leading-7">
            Search the catalog, manage holds and loans, and check branch hours
            in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <NavLink to="/search" className="dh-btn dh-btn-accent">
              Search the Catalog
            </NavLink>
            <NavLink
              to={user ? "/account" : "/registration"}
              className="dh-btn dh-btn-ghost"
            >
              {user ? "View My Account" : "Get a Library Card"}
            </NavLink>
          </div>
        </div>
      </section>

      <section className="max-w-3xl">
        <p className="dh-kicker">Collections</p>
        <h2 className="dh-section-title mt-2">What you can borrow</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/65">
          Jump into the catalog by material type.
        </p>
        <div className="mt-6">
          {collections.map((collection) => (
            <NavLink
              key={collection.title}
              to={collection.to}
              className="dh-collection-link"
            >
              <span className="font-display text-xl font-semibold text-ink-deep">
                {collection.title}
              </span>
              <span className="mt-1 block text-sm leading-6 text-ink/60">
                {collection.description}
              </span>
            </NavLink>
          ))}
        </div>
      </section>

      <section className="grid gap-10 border-y border-ink/10 py-10 lg:grid-cols-2">
        <div>
          <p className="dh-kicker">Visit</p>
          <h2 className="dh-section-title mt-2">Plan your next trip</h2>
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
          <NavLink to="/hours" className="dh-link mt-6 inline-flex text-sm">
            Full hours and location
          </NavLink>
        </div>

        <div>
          <p className="dh-kicker">Patron services</p>
          <h2 className="dh-section-title mt-2">Holds, loans, and fines</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-ink/65">
            Signed-in patrons can place holds, check due dates, and review fine
            balances from their account.
          </p>
          <NavLink
            to={user ? "/account" : "/login"}
            className="dh-btn dh-btn-primary mt-6"
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
