import { useState } from "react";
import { SubmitButton } from "../components/Buttons";
import Item from "../components/Items";
import { FetchJson } from "../api";

export default function Search() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  async function HandleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const q = String(formData.get("q") ?? "").trim();

    if (!q) {
      setError("Enter a search term.");
      setResults([]);
      return;
    }

    const params = new URLSearchParams({
      q,
      category: String(formData.get("category") ?? "book"),
      availableOnly: String(formData.get("availableOnly") === "on"),
      limit: "20",
    });

    try {
      setLoading(true);
      setError("");
      setHasSearched(true);
      const data = await FetchJson(`/api/search?${params.toString()}`);

      setResults(data.results ?? []);
    } catch (err) {
      setResults([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">Datahaven Catalog</p>
        <h1 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight text-ink-deep mt-2">Search the collection</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          Find books, media, periodicals, and equipment available at Datahaven
          Libraries.
        </p>
      </div>

      <form
        onSubmit={HandleSubmit}
        className="border-t-[3px] border-brass bg-white/70 shadow-soft px-4 py-5 sm:px-6"
      >
        <div className="grid grid-cols-1 items-end gap-5 md:grid-cols-12">
          <div className="md:col-span-5">
            <label htmlFor="q" className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70">
              Search Term
            </label>
            <input
              required
              id="q"
              name="q"
              placeholder="Title, author, keyword, or subject"
              className="block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)]"
            />
          </div>

          <div className="md:col-span-3">
            <label htmlFor="category" className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70">
              Collection
            </label>
            <select
              required
              id="category"
              name="category"
              className="block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)] cursor-pointer appearance-none"
            >
              <option value="book">Books</option>
              <option value="audiovisualmedia">Audiovisual Media</option>
              <option value="periodical">Periodicals</option>
              <option value="equipment">Equipment</option>
            </select>
          </div>

          <div className="flex items-center pb-2 md:col-span-2 md:justify-center">
            <label
              htmlFor="availableOnly"
              className="group flex cursor-pointer items-center gap-3"
            >
              <input
                type="checkbox"
                id="availableOnly"
                name="availableOnly"
                className="h-5 w-5 cursor-pointer rounded border-ink/25 text-ink focus:ring-ink-soft"
              />
              <span className="text-xs font-semibold uppercase tracking-wide text-ink/70 transition-colors group-hover:text-ink">
                Available Only
              </span>
            </label>
          </div>

          <div className="md:col-span-2">
            <SubmitButton title="Search" fullwidth={true} />
          </div>
        </div>
      </form>

      <div id="results" className="space-y-4 border-t border-ink/10 pt-6">
        {loading && (
          <div className="space-y-3 py-4" aria-live="polite">
            <p className="text-sm font-medium text-ink/60">
              Searching the catalog...
            </p>
            <div className="animate-pulse rounded-[0.35rem] bg-ink/10 h-28 w-full" />
            <div className="animate-pulse rounded-[0.35rem] bg-ink/10 h-28 w-full" />
          </div>
        )}

        {!loading && error && (
          <div className="border border-danger/25 bg-danger/10 p-4 text-sm font-medium text-danger">
            {error}
          </div>
        )}

        {!loading && !error && !hasSearched && (
          <div className="py-10 text-center">
            <p className="font-display text-xl font-semibold text-ink-deep">
              Ready when you are
            </p>
            <p className="mt-2 text-sm text-ink/55">
              Enter a search term to browse the catalog.
            </p>
          </div>
        )}

        {!loading && !error && hasSearched && results.length === 0 && (
          <div className="py-10 text-center">
            <p className="font-display text-xl font-semibold text-ink-deep">
              No matches
            </p>
            <p className="mt-2 text-sm text-ink/55">
              Try another keyword or a different collection.
            </p>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <>
            <p className="text-xs font-semibold uppercase tracking-widest text-ink/50">
              {results.length} result{results.length === 1 ? "" : "s"}
            </p>
            <div className="space-y-3">
              {results.map((item) => (
                <Item key={`${item.category}-${item.itemId}`} itemData={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
