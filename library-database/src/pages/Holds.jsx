import { useEffect, useMemo, useState } from "react";
import PrimaryButton, { SecondaryButton } from "../components/Buttons";
import { FetchJson, ReadStoredUser } from "../api";
import { FormatDate } from "../components/TimeFormats";
import { useMessage } from "../hooks/useMessage";

async function FetchCurrentHolds() {
  return FetchJson("/api/holds/current");
}

function SafeText(value) {
  return value == null ? "" : String(value);
}

function GetHoldStatusText(hold) {
  if (hold?.holdStatus) {
    return String(hold.holdStatus);
  }

  if (Number(hold?.holdStatusCode) === 2) {
    return "ready";
  }

  if (Number(hold?.holdStatusCode) === 1) {
    return "waiting";
  }

  return "unknown";
}

function GetHoldStatusBadgeClassName(hold) {
  const holdStatusCode = Number(hold?.holdStatusCode);

  // Updated to standard light-theme badge styles
  if (holdStatusCode === 2) {
    return "bg-success/10 text-success ring-1 ring-inset ring-success/25";
  }

  if (holdStatusCode === 1) {
    return "bg-brass/10 text-brass-deep ring-1 ring-inset ring-brass/25";
  }

  return "bg-mist/60 text-ink/70 ring-1 ring-inset ring-ink/20";
}

export default function Holds() {
  const { showSuccess, showError, showWarning } = useMessage();
  const user = ReadStoredUser();

  const [holds, setHolds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchBy, setSearchBy] = useState("all");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const currentUser = ReadStoredUser();

    async function LoadHolds() {
      try {
        setIsLoading(true);
        setHolds(await FetchCurrentHolds());
      } catch (error) {
        console.error(error);
        showError(error.message || "Failed to load holds.");
      } finally {
        setIsLoading(false);
      }
    }

    if (!currentUser) {
      showWarning("Please log in first.");
      window.location.href = "/login";
      return;
    }

    if (currentUser.user_type !== "staff") {
      showWarning("Only staff can access the holds page.");
      window.location.href = "/";
      return;
    }

    LoadHolds();
  }, [user?.staff_id, user?.user_type, showError, showWarning]);

  async function ReloadHolds() {
    try {
      setIsLoading(true);
      setHolds(await FetchCurrentHolds());
    } catch (error) {
      console.error(error);
      showError(error.message || "Failed to reload holds.");
    } finally {
      setIsLoading(false);
    }
  }

  async function CancelHold(holdId) {
    try {
      await FetchJson(`/api/holds/${holdId}`, {
        method: "DELETE",
      });

      showSuccess("Hold cancelled successfully!");
      await ReloadHolds();
    } catch (error) {
      console.error(error);
      showError(error.message || "Failed to cancel hold.");
    }
  }

  async function CheckoutHold(holdId, holdStatusCode) {
    if (Number(holdStatusCode) !== 2) {
      showWarning("Only holds that are ready for pickup can be checked out.");
      return;
    }

    try {
      await FetchJson(`/api/holds/${holdId}/checkout`, {
        method: "POST",
      });

      showSuccess("Hold checked out successfully!");
      await ReloadHolds();
    } catch (error) {
      console.error(error);
      showError(error.message || "Failed to check out hold.");
    }
  }

  const filteredHolds = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    if (!normalizedSearch) {
      return holds;
    }

    return holds.filter((hold) => {
      const fields = {
        holdId: SafeText(hold.holdId),
        patronName: SafeText(hold.patronName),
        patronId: SafeText(hold.patronId),
        itemId: SafeText(hold.itemId),
        title: SafeText(hold.title),
        creator: SafeText(hold.creator),
        holdStatus: SafeText(hold.holdStatus),
      };

      if (searchBy === "all") {
        return Object.values(fields)
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      }

      const value = SafeText(fields[searchBy]).toLowerCase();

      if (
        searchBy === "loanId" ||
        searchBy === "patronId" ||
        searchBy === "itemId" ||
        searchBy === "fineId" ||
        searchBy === "holdId"
      ) {
        return value === normalizedSearch;
      }

      return value.includes(normalizedSearch);
    });
  }, [holds, searchBy, searchText]);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col border-y border-ink/10 bg-paper/80 py-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">Circulation</p>
      <h1 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight text-ink-deep mt-2 text-4xl">Current Holds</h1>

      <p className="mt-4 text-base leading-7 text-ink/65">
        View all active holds, search by selected fields, cancel them, or
        convert them into loans.
      </p>

      <div className="mt-6 grid w-full gap-4 grid-cols-4">
        <div>
          <label className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70">
            Search By
          </label>
          <select
            value={searchBy}
            onChange={(event) => setSearchBy(event.target.value)}
            className="block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)] mt-2"
          >
            <option value="all">All</option>
            <option value="holdId">Hold ID</option>
            <option value="patronName">Patron Name</option>
            <option value="patronId">Patron ID</option>
            <option value="itemId">Item ID</option>
            <option value="title">Item Title</option>
            <option value="creator">Creator</option>
            <option value="holdStatus">Status</option>
          </select>
        </div>

        <div className="col-span-3">
          <label className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70">
            Search Text
          </label>
          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Enter search text..."
            className="block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)] mt-2"
          />
        </div>
      </div>

      <div className="mt-6 space-y-4 max-h-screen overflow-auto pr-3">
        {isLoading ? (
          <div className="text-ink/65 font-medium">Loading holds...</div>
        ) : filteredHolds.length === 0 ? (
          <div className="text-ink/65 font-medium">
            No matching current holds found.
          </div>
        ) : (
          filteredHolds.map((hold) => {
            const holdStatusText = GetHoldStatusText(hold);
            const isReadyHold = Number(hold.holdStatusCode) === 2;
            const isWaitingHold = Number(hold.holdStatusCode) === 1;

            return (
              <div
                key={hold.holdId}
                className="grid grid-cols-1 gap-4 rounded-xl bg-mist/60 p-4 border border-ink/10 hover:border-ink/25 transition-colors lg:grid-cols-4"
              >
                <div className="lg:col-span-3">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="text-xl font-bold text-ink-deep">
                      {hold.title}
                    </div>

                    <div className="text-sm text-ink/50">
                      Hold ID: {hold.holdId}
                    </div>

                    <div className="text-sm text-ink/50">
                      Item ID: {hold.itemId}
                    </div>

                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${GetHoldStatusBadgeClassName(hold)}`}
                    >
                      {holdStatusText}
                    </span>
                  </div>

                  {hold.creator ? (
                    <div className="mt-1 font-medium text-ink-soft">
                      {hold.creator}
                    </div>
                  ) : null}

                  <div className="mt-3 font-medium text-ink/70">
                    Held by: {hold.patronName} (Patron ID: {hold.patronId})
                  </div>

                  <div className="mt-1 text-sm text-ink/65">
                    Hold date:{" "}
                    {hold.holdStart
                      ? FormatDate(new Date(hold.holdStart), true)
                      : "-"}
                  </div>

                  <div className="text-sm text-ink/65">
                    {isReadyHold
                      ? `Pickup expires: ${
                          hold.holdEnd
                            ? FormatDate(new Date(hold.holdEnd), true)
                            : "-"
                        }`
                      : isWaitingHold
                        ? "Waiting in queue for the next available copy."
                        : `Expires: ${
                            hold.holdEnd
                              ? FormatDate(new Date(hold.holdEnd), true)
                              : "-"
                          }`}
                  </div>
                </div>

                <div className="flex flex-col items-start justify-center gap-3 lg:items-end">
                  <SecondaryButton
                    title="Cancel Hold"
                    onClick={() => CancelHold(hold.holdId)}
                  />
                  <PrimaryButton
                    title={isReadyHold ? "Check Out" : "Waiting"}
                    onClick={() =>
                      CheckoutHold(hold.holdId, hold.holdStatusCode)
                    }
                    disabledValue={!isReadyHold}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
