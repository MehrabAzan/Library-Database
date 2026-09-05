import { useCallback, useEffect, useMemo, useState } from "react";
import { FetchJson, GetErrorMessage, ReadStoredUser } from "../api";
import { useMessage } from "../hooks/useMessage";

function FormatMoney(value) {
  return `$${Number(value ?? 0).toFixed(2)}`;
}

function FormatDateValue(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString();
}

function NormalizeStatus(fine) {
  const rawStatus = String(fine.fineStatus ?? fine.status ?? "")
    .trim()
    .toLowerCase();

  if (rawStatus.includes("waiv")) {
    return "Waived";
  }

  if (rawStatus.includes("unpaid")) {
    return "Open";
  }

  if (rawStatus.includes("paid")) {
    return "Paid";
  }

  if (Number(fine.remainingAmount ?? 0) <= 0) {
    return "Paid";
  }

  return "Open";
}

export default function Fines() {
  const { showSuccess, showError, showWarning } = useMessage();

  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingFineId, setPendingFineId] = useState(null);

  const [expandedFineId, setExpandedFineId] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  const user = ReadStoredUser();
  const userKey = user
    ? `${user.user_type ?? ""}:${user.patron_id ?? ""}:${user.staff_id ?? ""}`
    : "";

  const LoadFines = useCallback(
    async (currentUser = ReadStoredUser()) => {
      if (!currentUser) {
        setFines([]);
        setError("Please log in first.");
        setLoading(false);
        return;
      }

      if (currentUser.user_type !== "patron") {
        setFines([]);
        setError("Fines are currently only available for patron accounts.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await FetchJson("/api/fines");
        setFines(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(GetErrorMessage(err, "Failed to load fines."));
        showError(GetErrorMessage(err, "Failed to load fines."));
      } finally {
        setLoading(false);
      }
    },
    [showError],
  );

  useEffect(() => {
    LoadFines(ReadStoredUser());
  }, [userKey, LoadFines]);

  function OpenPaymentBox(fine) {
    const remainingAmount = Number(fine.remainingAmount ?? 0);
    const status = NormalizeStatus(fine);

    if (status === "Waived") {
      showWarning("This fine has been waived.");
      return;
    }

    if (remainingAmount <= 0) {
      showWarning("This fine has already been fully paid.");
      return;
    }

    setExpandedFineId(fine.fineId);
    setPaymentAmount(String(remainingAmount.toFixed(2)));
  }

  function ClosePaymentBox() {
    setExpandedFineId(null);
    setPaymentAmount("");
  }

  async function PayFine(fine) {
    const remainingAmount = Number(fine.remainingAmount ?? 0);
    const amount = Number(paymentAmount);

    if (remainingAmount <= 0) {
      showWarning("This fine has already been fully paid.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      showWarning("Please enter a valid payment amount.");
      return;
    }

    if (amount > remainingAmount) {
      showWarning(`Payment cannot exceed ${FormatMoney(remainingAmount)}.`);
      return;
    }

    try {
      setError("");
      setPendingFineId(fine.fineId);

      await FetchJson(`/api/fines/${fine.fineId}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      showSuccess("Fine payment recorded successfully!");
      ClosePaymentBox();
      await LoadFines(ReadStoredUser());
    } catch (err) {
      const message = GetErrorMessage(err, "Failed to pay fine.");
      setError(message);
      showError(message);
    } finally {
      setPendingFineId(null);
    }
  }

  const openFines = useMemo(
    () =>
      fines.filter((fine) => {
        const status = NormalizeStatus(fine);
        return status !== "Paid" && status !== "Waived";
      }),
    [fines],
  );

  const outstandingBalance = useMemo(
    () =>
      openFines.reduce(
        (sum, fine) => sum + Number(fine.remainingAmount ?? 0),
        0,
      ),
    [openFines],
  );

  const totalPaid = useMemo(
    () => fines.reduce((sum, fine) => sum + Number(fine.paidAmount ?? 0), 0),
    [fines],
  );

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">Balances</p>
        <h2 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight text-ink-deep mt-2 text-3xl">Fines</h2>
      </div>

      {!loading && !error ? (
        <div className="mt-2 grid gap-0 border-y border-ink/10 sm:grid-cols-2">
          <div className="border-b border-ink/10 bg-paper/80 p-5 sm:border-b-0 sm:border-r">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink/50">
              Open Balance
            </h3>
            <p className="mt-2 font-display text-2xl font-semibold text-ink-deep">
              {FormatMoney(outstandingBalance)}
            </p>
          </div>

          <div className="bg-paper/80 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink/50">
              Fine Records
            </h3>
            <p className="mt-2 font-display text-2xl font-semibold text-ink-deep">
              {fines.length}
            </p>
          </div>
        </div>
      ) : null}

      {loading ? (
        <p className="mt-6 text-ink/65 font-medium">Loading fines...</p>
      ) : null}

      {!loading && error ? (
        <p className="mt-6 text-danger font-medium">{error}</p>
      ) : null}

      {!loading && !error ? (
        <div className="mt-6 flex flex-col gap-4">
          {fines.length === 0 ? (
            <p className="text-ink/65 font-medium">No fines found.</p>
          ) : (
            fines.map((fine) => {
              const status = NormalizeStatus(fine);
              const remainingAmount = Number(fine.remainingAmount ?? 0);
              const paidAmount = Number(fine.paidAmount ?? 0);
              const fineAmount = Number(fine.amount ?? fine.fineAmount ?? 0);

              const isExpanded = expandedFineId === fine.fineId;
              const isPending = pendingFineId === fine.fineId;
              const canPay = status !== "Waived" && remainingAmount > 0;

              return (
                <div
                  key={fine.fineId}
                  className={`border bg-paper/80 p-5 transition-all duration-300 ${isExpanded ? "border-ink-soft" : "border-ink/10 hover:border-ink/25"}`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-ink/50">
                        Fine ID #{fine.fineId}
                      </div>

                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink-deep">
                        <span>Total: {FormatMoney(fineAmount)}</span>
                        <span>Paid: {FormatMoney(paidAmount)}</span>
                        <span
                          className={remainingAmount > 0 ? "text-danger" : ""}
                        >
                          Remaining: {FormatMoney(remainingAmount)}
                        </span>
                        <span>Status: {status}</span>
                      </div>

                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/65">
                        {fine.assignedDate ? (
                          <span>
                            Assigned: {FormatDateValue(fine.assignedDate)}
                          </span>
                        ) : null}

                        {fine.paidDate ? (
                          <span>
                            Paid date: {FormatDateValue(fine.paidDate)}
                          </span>
                        ) : null}

                        {fine.waivedDate ? (
                          <span>
                            Waived date: {FormatDateValue(fine.waivedDate)}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {canPay ? (
                        <button
                          type="button"
                          onClick={() => OpenPaymentBox(fine)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg px-[1.15rem] py-[0.65rem] text-sm font-semibold leading-tight transition-[background-color,color,border-color,transform] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass active:enabled:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 border border-ink/20 bg-transparent text-ink hover:enabled:border-ink/35 hover:enabled:bg-ink/5"
                        >
                          Pay Fine
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="inline-flex items-center justify-center gap-2 rounded-lg px-[1.15rem] py-[0.65rem] text-sm font-semibold leading-tight transition-[background-color,color,border-color,transform] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass active:enabled:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 border border-ink/20 bg-transparent text-ink hover:enabled:border-ink/35 hover:enabled:bg-ink/5 opacity-50"
                        >
                          {status === "Waived" ? "Waived" : "Paid"}
                        </button>
                      )}
                    </div>
                  </div>

                  {isExpanded ? (
                    <div className="mt-5 border border-ink/10 bg-mist/40 p-5">
                      <p className="text-sm font-medium text-ink/65">
                        Enter payment amount up to{" "}
                        <span className="font-bold text-ink-deep">
                          {FormatMoney(remainingAmount)}
                        </span>
                        .
                      </p>

                      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={paymentAmount}
                          onChange={(event) =>
                            setPaymentAmount(event.target.value)
                          }
                          placeholder="Payment amount"
                          className="block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)] sm:max-w-xs"
                        />

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => PayFine(fine)}
                            disabled={isPending}
                            className="inline-flex items-center justify-center gap-2 rounded-lg px-[1.15rem] py-[0.65rem] text-sm font-semibold leading-tight transition-[background-color,color,border-color,transform] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass active:enabled:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 bg-ink text-paper hover:enabled:bg-ink-soft"
                          >
                            {isPending ? "Processing..." : "Confirm Payment"}
                          </button>

                          <button
                            type="button"
                            onClick={ClosePaymentBox}
                            disabled={isPending}
                            className="inline-flex items-center justify-center gap-2 rounded-lg px-[1.15rem] py-[0.65rem] text-sm font-semibold leading-tight transition-[background-color,color,border-color,transform] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass active:enabled:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 border border-ink/20 bg-transparent text-ink hover:enabled:border-ink/35 hover:enabled:bg-ink/5"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      ) : null}
    </section>
  );
}
