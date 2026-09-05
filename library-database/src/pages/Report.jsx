import React from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/Buttons";

export default function Report() {
  const navigate = useNavigate();

  const reports = [
    {
      title: "Popularity",
      description: "Report of item popularity by categories and ranges.",
      path: "/report/popularityreport",
    },
    {
      title: "Operation",
      description:
        "Report of library activities including loans, returns, lost items, new items, and new patrons.",
      path: "/report/overduereport",
    },
    {
      title: "Fine Summary",
      description: "Report of fines, paid amounts, and remaining balances.",
      path: "/report/fine-summary",
    },
    {
      title: "User Overview",
      description:
        "Report of all users in the system by role, status, and other information.",
      path: "/report/patron-summary",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-4xl space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">Staff tools</p>
        <h1 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight text-ink-deep mt-2 text-4xl">Reports</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-ink/65">
          Reports are available below.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-0 border-y border-ink/10 md:grid-cols-2">
        {reports.map((report) => (
          <div
            key={report.path}
            className="border-b border-ink/10 bg-paper/80 p-6 last:border-b-0 md:border-b md:odd:border-r md:[&:nth-last-child(-n+2)]:border-b-0"
          >
            <h2 className="font-display text-xl font-semibold text-ink-deep">
              {report.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink/65">
              {report.description}
            </p>
            <div className="mt-6">
              <PrimaryButton
                title="Open Report"
                onClick={() => navigate(report.path)}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
