import React from "react";

const LibraryPolicies = () => {
  const policies = [
    {
      title: "Borrowing & Renewals",
      icon: (
        <svg
          className="w-7 h-7 text-sky-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
          />
        </svg>
      ),
      description: `All patrons are able to borrow items from Datahaven Library. The standard borrowing period is 14 days, while students and faculty have 21-day and 28-day periods respectively. Renewals are not offered at the moment; items may be re-checked out as long as there is no active hold for the item.`,
    },
    {
      title: "Fines & Lost Items",
      icon: (
        <svg
          className="w-7 h-7 text-sky-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
      description: `Overdue items will garner fines daily. Patrons receive a 0.25$ per day, students receive a 0.20$ fine per day, and faculty receive a 0.10$ fine per day the item overdue. Fines can be paid in person or online.`,
    },
    {
      title: "Code of Conduct",
      icon: (
        <svg
          className="w-7 h-7 text-sky-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
          />
        </svg>
      ),
      description:
        "Covered beverages and food are permitted in the library, but are not allowed at the computer tables. Please use headphones when applicable and keep conversations at a respectful volume.",
    },
    {
      title: "Privacy",
      icon: (
        <svg
          className="w-7 h-7 text-sky-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      ),
      description:
        "Patron activites, such as fine, loan, and holding activity is tracked and available through the account history page.",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
          Patron Guidelines
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
          Library <span className="text-sky-900">Policies</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-700">
          These guidelines help us maintain a safe, equitable, and welcoming
          environment for all patrons.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {policies.map((policy, index) => (
          <div
            key={index}
            className="group flex flex-col rounded-lg border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-sky-200 hover:shadow-md"
          >
            <div className="flex flex-wrap items-center gap-4 text-center">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg border border-sky-100 bg-sky-50 transition-colors duration-300 group-hover:bg-sky-100">
                {policy.icon}
              </div>
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-slate-950 transition-colors group-hover:text-sky-900">
                {policy.title}
              </h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">
              {policy.description}
            </p>
          </div>
        ))}
      </div>

      <div>
        <p className="inline-block rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm text-slate-600 shadow-sm">
          Have a question not covered here? Feel free to ask our staff at the
          front desk.
        </p>
      </div>
    </div>
  );
};

export default LibraryPolicies;
