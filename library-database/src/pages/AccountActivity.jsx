import { useEffect, useState } from "react";
import { FetchJson, GetErrorMessage, ReadStoredUser } from "../api";

function FormatActivityDate(value) {
  if (!value) {
    return "Unknown date";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(parsedDate);
}

// Updated to use light-theme badge colors!
function GetStatusClass(status) {
  if (status === "Paid") {
    return "bg-success/15 text-success border-success/25";
  }

  if (status === "Waived") {
    return "bg-mist text-ink-deep border-ink/10";
  }

  if (status === "Overdue" || status === "Fine") {
    return "bg-danger/15 text-danger border-danger/25";
  }

  if (
    status === "Ready for pickup" ||
    status === "Hold" ||
    status === "Ready"
  ) {
    return "bg-brass/15 text-brass-deep border-brass/25";
  }

  if (status === "New") {
    return "bg-ink/10 text-ink-soft border-ink/20";
  }

  return "bg-mist text-ink/65 border-ink/10";
}

export default function AccountActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = ReadStoredUser();
  const userKey = user
    ? `${user.user_type ?? ""}:${user.patron_id ?? ""}:${user.staff_id ?? ""}`
    : "";

  useEffect(() => {
    const currentUser = ReadStoredUser();

    async function LoadActivity() {
      if (!currentUser) {
        setActivities([]);
        setError("Please log in to view account activity.");
        setLoading(false);
        return;
      }

      if (currentUser.user_type !== "patron") {
        setActivities([]);
        setError(
          "Account activity is currently only available for patron accounts.",
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await FetchJson("/api/account/activity");
        setActivities(data ?? []);
      } catch (err) {
        setError(GetErrorMessage(err, "Failed to load account activity."));
      } finally {
        setLoading(false);
      }
    }

    LoadActivity();
  }, [userKey]);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">History</p>
        <h2 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight text-ink-deep mt-2 text-3xl">Account Activity</h2>
      </div>

      {loading ? (
        <p className="text-ink/50 font-medium">Loading activity...</p>
      ) : null}
      {!loading && error ? (
        <p className="text-danger font-medium">{error}</p>
      ) : null}

      {!loading && !error ? (
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-ink/50">No account activity found.</p>
          ) : (
            activities.map((activity) => (
              <article
                key={activity.activityId}
                className="border-y border-ink/10 bg-paper/80 px-4 py-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">{activity.activityType}</p>
                    <h3 className="mt-1 text-xl font-bold text-ink-deep">
                      {activity.headline}
                    </h3>
                    {activity.title ? (
                      <p className="mt-2 text-base font-medium text-ink-deep">
                        {activity.title}
                      </p>
                    ) : null}
                    {activity.creator ? (
                      <p className="mt-1 text-sm font-medium text-ink-soft">
                        {activity.creator}
                      </p>
                    ) : null}
                    {activity.detail ? (
                      <p className="mt-2 text-sm text-ink/65">
                        {activity.detail}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <p className="text-sm font-medium text-ink/50">
                      {FormatActivityDate(activity.activityDate)}
                    </p>
                    {activity.status ? (
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${GetStatusClass(activity.status)}`}
                      >
                        {activity.status}
                      </span>
                    ) : null}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      ) : null}
    </section>
  );
}
