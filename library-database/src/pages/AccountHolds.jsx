import { useEffect, useState } from "react";
import { FetchJson, GetErrorMessage } from "../api";

export default function AccountHolds() {
  const [holds, setHolds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function LoadHolds() {
      try {
        setLoading(true);
        setError("");
        const data = await FetchJson("/api/loans");

        if (isMounted) {
          setHolds(data.holds ?? []);
        }
      } catch (err) {
        if (isMounted) {
          setHolds([]);
          setError(GetErrorMessage(err, "Failed to load holds."));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    LoadHolds();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight text-ink-deep text-2xl">My Holds</h1>

      {loading && (
        <p className="text-sm font-medium text-ink/60">Loading holds...</p>
      )}

      {!loading && error && (
        <div className="border border-danger/25 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto border-y border-ink/10">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 bg-mist/60 text-ink/70">
              <tr>
                <th className="p-4 font-semibold">Hold ID</th>
                <th className="p-4 font-semibold">Item</th>
                <th className="p-4 font-semibold">Creator</th>
                <th className="p-4 font-semibold">Start</th>
                <th className="p-4 font-semibold">Expire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {holds.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-ink/50">
                    No active holds.
                  </td>
                </tr>
              ) : (
                holds.map((hold) => (
                  <tr
                    key={hold.holdId ?? hold.itemId}
                    className="text-ink/65 transition-colors hover:bg-mist/80"
                  >
                    <td className="p-4 font-medium text-ink-soft">
                      {hold.holdId}
                    </td>
                    <td className="p-4 font-medium text-ink-deep">
                      {hold.title}
                    </td>
                    <td className="p-4">{hold.creator}</td>
                    <td className="p-4">{hold.holdStart}</td>
                    <td className="p-4">{hold.holdEnd}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
