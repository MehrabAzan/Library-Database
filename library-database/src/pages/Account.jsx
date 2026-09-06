import { NavLink, useOutlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { FetchJson, GetErrorMessage, ReadStoredUser } from "../api";

function FormatDateOfBirth(dateOfBirth) {
  if (!dateOfBirth) {
    return "Not provided";
  }

  const dateOnlyMatch =
    typeof dateOfBirth === "string"
      ? dateOfBirth.match(/^(\d{4})-(\d{2})-(\d{2})/)
      : null;

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    const parsedDate = new Date(
      Date.UTC(Number(year), Number(month) - 1, Number(day)),
    );

    return new Intl.DateTimeFormat("en-US", { timeZone: "UTC" }).format(
      parsedDate,
    );
  }

  const parsedDate = new Date(dateOfBirth);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateOfBirth;
  }

  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC" }).format(
    parsedDate,
  );
}

export default function Account() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const outlet = useOutlet();
  const user = ReadStoredUser();
  const userKey = user
    ? `${user.user_type ?? ""}:${user.patron_id ?? ""}:${user.staff_id ?? ""}`
    : "";
  const isPatron = user?.user_type === "patron";
  const isStaff = user?.user_type === "staff";

  const navLinks = isPatron
    ? [
        { to: ".", label: "Account", end: true },
        { to: "loans", label: "Loans/Holds" },
        { to: "fines", label: "Fines" },
        { to: "activity", label: "Activity" },
        { to: "settings", label: "Settings" },
      ]
    : isStaff
      ? [
          { to: ".", label: "Account", end: true },
          { to: "settings", label: "Settings" },
        ]
      : [];

  useEffect(() => {
    let isMounted = true;
    const currentUser = ReadStoredUser();

    async function LoadAccount() {
      if (!currentUser) {
        setAccount(null);
        setError("Please log in to access your account.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await FetchJson("/api/account");

        if (isMounted) {
          setAccount(data);
        }
      } catch (err) {
        if (isMounted) {
          setAccount(null);
          setError(
            GetErrorMessage(err, "Failed to load account. Please try again."),
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    LoadAccount();

    return () => {
      isMounted = false;
    };
  }, [userKey]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="border-l-[3px] border-brass pl-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">Membership</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink-deep">Account</h1>
          <p className="mt-2 text-sm text-ink/60">
            Profile, loans, holds, and settings in one place.
          </p>
        </div>
        <nav className="flex flex-wrap gap-1 rounded-md border border-ink/10 bg-white/80 p-1 shadow-soft">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                isActive ? "relative rounded-md px-[0.7rem] py-[0.45rem] text-sm font-semibold transition-colors bg-ink-soft/10 text-ink" : "relative rounded-md px-[0.7rem] py-[0.45rem] text-sm font-semibold text-ink/80 transition-colors hover:bg-ink/5 hover:text-ink"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {outlet ? (
        outlet
      ) : (
        <section className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink-deep">
              Information
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              {isPatron
                ? "View your membership details below. Use the menu to manage loans and settings."
                : isStaff
                  ? "Logged in as staff."
                  : "Account details are displayed below."}
            </p>
          </div>

          {loading && (
            <p className="animate-pulse text-sm font-medium text-ink/65">
              Loading account information...
            </p>
          )}

          {!loading && error && (
            <div className="border border-danger/25 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
              {error}
            </div>
          )}

          {!loading && !error && account && (
            <div className="grid grid-cols-1 gap-8 border-y border-ink/10 py-6 md:grid-cols-2">
              <div className="space-y-5">
                <div>
                  <span className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70">Full Name</span>
                  <span className="text-lg font-semibold text-ink-deep">
                    {account.first_name} {account.last_name}
                  </span>
                </div>
                <div>
                  <span className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70">Email Address</span>
                  <span className="text-lg font-semibold text-ink-deep">
                    {account.email}
                  </span>
                </div>
                <div>
                  <span className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70">
                    {account.user_type === "staff" ? "Staff ID" : "Member ID"}
                  </span>
                  <span className="font-mono text-lg font-semibold text-ink-deep">
                    #{account.staff_id ?? account.patron_id}
                  </span>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <span className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70">Date of Birth</span>
                  <span className="text-lg font-semibold text-ink-deep">
                    {FormatDateOfBirth(account.date_of_birth)}
                  </span>
                </div>
                {account.phone_number && (
                  <div>
                    <span className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70">Phone Number</span>
                    <span className="text-lg font-semibold text-ink-deep">
                      {account.phone_number}
                    </span>
                  </div>
                )}
                {account.address && (
                  <div>
                    <span className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70">Primary Address</span>
                    <span className="text-lg font-semibold leading-tight text-ink-deep">
                      {account.address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {!loading && !error && !account && (
            <p className="italic text-ink/65">No account records found.</p>
          )}
        </section>
      )}
    </div>
  );
}
