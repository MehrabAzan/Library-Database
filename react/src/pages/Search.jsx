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
    <section className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
          Datahaven Catalog
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Search the collection
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Find books, media, periodicals, and equipment available through
          Datahaven Libraries.
        </p>
      </div>

      <form
        onSubmit={HandleSubmit}
        className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="grid grid-cols-1 items-end gap-5 md:grid-cols-12">
          <div className="md:col-span-5">
            <label
              htmlFor="q"
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600"
            >
              Search Term
            </label>
            <input
              required
              id="q"
              name="q"
              placeholder="Title, author, keyword, or subject"
              className="block w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-all focus:border-sky-700 focus:ring-2 focus:ring-sky-700/20"
            />
          </div>

          <div className="md:col-span-3">
            <label
              htmlFor="category"
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600"
            >
              Collection
            </label>
            <select
              required
              id="category"
              name="category"
              className="block w-full cursor-pointer appearance-none rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-all focus:border-sky-700 focus:ring-2 focus:ring-sky-700/20"
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
                className="h-5 w-5 cursor-pointer rounded border-slate-300 text-sky-900 focus:ring-sky-700"
              />
              <span className="text-xs font-bold uppercase tracking-wide text-slate-700 transition-colors group-hover:text-sky-900">
                Available Only
              </span>
            </label>
          </div>

          <div className="md:col-span-2">
            <SubmitButton title="Search" fullwidth={true} />
          </div>
        </div>
      </form>

      <div
        id="results"
        className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      >
        {loading && (
          <div className="flex items-center justify-center py-8">
            <p className="animate-pulse font-medium text-slate-500">
              Searching the catalog...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && hasSearched && results.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-base font-medium text-slate-500">
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
