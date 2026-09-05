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
      <div>
        <p className="dh-kicker">Datahaven Catalog</p>
        <h1 className="dh-section-title mt-2">Search the collection</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">
          Find books, media, periodicals, and equipment available at Datahaven
          Libraries.
        </p>
      </div>

      <form
        onSubmit={HandleSubmit}
        className="border-t border-ink/10 bg-paper/70 px-4 py-5 sm:px-6"
      >
        <div className="grid grid-cols-1 items-end gap-5 md:grid-cols-12">
          <div className="md:col-span-5">
            <label htmlFor="q" className="dh-label">
              Search Term
            </label>
            <input
              required
              id="q"
              name="q"
              placeholder="Title, author, keyword, or subject"
              className="dh-input"
            />
          </div>

          <div className="md:col-span-3">
            <label htmlFor="category" className="dh-label">
              Collection
            </label>
            <select
              required
              id="category"
              name="category"
              className="dh-input cursor-pointer appearance-none"
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

      <div id="results" className="border-t border-ink/10 pt-6">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <p className="animate-pulse text-sm font-medium text-ink/60">
              Searching the catalog...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="border border-danger/25 bg-danger/10 p-4 text-sm font-medium text-danger">
            {error}
          </div>
        )}

        {!loading && !error && !hasSearched && (
          <p className="py-6 text-center text-sm font-medium text-ink/50">
            Enter a search term to browse the catalog.
          </p>
        )}

        {!loading && !error && hasSearched && results.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-sm font-medium text-ink/55">
              No items match your search criteria.
            </p>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="flex flex-wrap justify-evenly gap-4">
            {results.map((item) => (
              <Item key={`${item.category}-${item.itemId}`} itemData={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
