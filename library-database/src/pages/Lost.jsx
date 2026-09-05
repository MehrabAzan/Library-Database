import { useCallback, useEffect, useMemo, useState } from "react";
import PrimaryButton, { SecondaryButton } from "../components/Buttons";
import { FetchJson, ReadStoredUser } from "../api";
import { FormatDate } from "../components/TimeFormats";
import { useMessage } from "../hooks/useMessage";

async function FetchLostLoans() {
  return FetchJson("/api/loans/lost");
}

function SafeText(value) {
  return value == null ? "" : String(value);
}

export default function Lost() {
  const { showSuccess, showError, showWarning } = useMessage();

  const [lostLoans, setLostLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchBy, setSearchBy] = useState("all");
  const [searchText, setSearchText] = useState("");

  const LoadLost = useCallback(async () => {
    try {
      setIsLoading(true);

      const data = await FetchLostLoans();

      setLostLoans(data);
    } catch (error) {
      console.error(error);
      showError("Failed to load lost items.");
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    const user = ReadStoredUser();

    if (!user) {
      showWarning("Please login first.");
      window.location.href = "/login";
      return;
    }

    if (user.user_type !== "staff") {
      showWarning("Only staff can access lost items.");
      window.location.href = "/";
      return;
    }

    LoadLost();
  }, [LoadLost, showWarning]);

  async function MarkFound(loanId) {
    try {
      await FetchJson(`/api/loans/${loanId}/found`, {
        method: "POST",
      });

      showSuccess("Item marked as found.");

      LoadLost();
    } catch {
      showError("Failed to update item.");
    }
  }

  async function PermanentlyDelete(loanId) {
    try {
      await FetchJson(`/api/loans/${loanId}/delete-lost`, {
        method: "POST",
      });

      showSuccess("Item permanently removed.");

      LoadLost();
    } catch {
      showError("Delete failed.");
    }
  }

  const filteredLost = useMemo(() => {
    const text = searchText.trim().toLowerCase();

    if (!text) return lostLoans;

    return lostLoans.filter((loan) => {
      const fields = {
        loanId: SafeText(loan.loanId),
        patronName: SafeText(loan.patronName),
        patronId: SafeText(loan.patronId),
        itemId: SafeText(loan.itemId),
        title: SafeText(loan.title),
        creator: SafeText(loan.creator),
      };

      if (searchBy === "all") {
        return Object.values(fields).join(" ").toLowerCase().includes(text);
      }

      const value = fields[searchBy]?.toLowerCase() ?? "";

      if (["loanId", "patronId", "itemId"].includes(searchBy)) {
        return value === text;
      }

      return value.includes(text);
    });
  }, [lostLoans, searchText, searchBy]);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col border-y border-ink/10 bg-paper/80 py-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">Circulation</p>
      <h1 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight text-ink-deep mt-2 text-4xl">Lost Items</h1>

      <div className="mt-6 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70">
            Search By
          </label>

          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            className="block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)] mt-2"
          >
            <option value="all">All</option>
            <option value="loanId">Loan ID</option>
            <option value="patronName">Patron Name</option>
            <option value="patronId">Patron ID</option>
            <option value="itemId">Item ID</option>
            <option value="title">Item Title</option>
            <option value="creator">Creator</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70">
            Search Text
          </label>

          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)] mt-2"
          />
        </div>
      </div>

      <div className="mt-6 space-y-4 max-h-screen overflow-auto pr-3">
        {isLoading ? (
          <div className="text-ink/65 font-medium">
            Loading lost items...
          </div>
        ) : filteredLost.length === 0 ? (
          <div className="text-ink/65 font-medium">No lost items.</div>
        ) : (
          filteredLost.map((loan) => (
            <div
              key={loan.loanId}
              className="grid grid-cols-1 gap-4 rounded-xl bg-mist/60 p-4 border border-ink/10 hover:border-ink/25 transition-colors lg:grid-cols-4"
            >
              <div className="lg:col-span-3">
                <div className="text-xl font-bold text-ink-deep">
                  {loan.title}
                </div>

                <div className="text-ink/50 text-sm mt-1">
                  Loan ID: {loan.loanId}
                </div>

                <div className="text-ink/50 text-sm">
                  Item ID: {loan.itemId}
                </div>

                <div className="text-ink/70 mt-3 font-medium">
                  Patron: {loan.patronName} ({loan.patronId})
                </div>

                <div className="text-ink/65 text-sm mt-1">
                  Lost Date:{" "}
                  {loan.LostDate
                    ? FormatDate(new Date(loan.LostDate), true)
                    : "-"}
                </div>
              </div>

              <div className="flex flex-col gap-2 items-end justify-center">
                <PrimaryButton
                  title="Found"
                  onClick={() => MarkFound(loan.loanId)}
                />

                <SecondaryButton
                  title="Permanent Delete"
                  onClick={() => PermanentlyDelete(loan.loanId)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
