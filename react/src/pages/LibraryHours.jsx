import React, { useState, useEffect } from "react";

const LibraryHours = () => {
  // Optional: A simple state to mock "Open" or "Closed" status based on current day
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const day = new Date().getDay();
    // 0 is Sunday. If it's Sunday, set to closed.
    setIsOpen(day !== 0);
  }, []);

  const schedule = [
    { day: "Monday - Thursday", time: "8:00 AM - 9:00 PM" },
    { day: "Friday", time: "8:00 AM - 6:00 PM" },
    { day: "Saturday", time: "10:00 AM - 4:00 PM" },
    { day: "Sunday", time: "Closed", closed: true },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
        <div className="w-full space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-stone-50 px-3 py-1">
              <span className="relative flex h-2.5 w-2.5">
                {isOpen && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOpen ? "bg-emerald-500" : "bg-rose-500"}`}
                ></span>
              </span>
              <span className="text-xs font-semibold tracking-wide text-slate-700 uppercase">
                {isOpen ? "Currently Open" : "Currently Closed"}
              </span>
            </div>

            <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
              Hours & Location
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              <span className="text-sky-900">Visiting?</span>
            </h1>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-slate-600">
              Datahaven Library offers a quiet sanctuary for deep work,
              collaborative spaces for innovation, and an extensive physical
              collection.
            </p>
          </div>

          <div className="max-w-md space-y-6 border-t border-slate-200 pt-6">
            <div className="flex items-start gap-4 group">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white transition-colors group-hover:border-sky-200 group-hover:bg-sky-50">
                <svg
                  className="w-6 h-6 text-sky-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-slate-900 font-semibold mb-1">Location</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  100 Innovation Drive
                  <br />
                  Tech District, TX 75001
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white transition-colors group-hover:border-sky-200 group-hover:bg-sky-50">
                <svg
                  className="w-6 h-6 text-sky-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.273-3.973-6.869-6.87l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-slate-900 font-semibold mb-1">
                  Contact Us
                </h3>
                <p className="text-slate-600 text-sm">
                  (555) 019-8372
                  <br />
                  hello@datahaven.lib
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-lg ml-auto">
          <div className="relative z-10 rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-sky-100 bg-sky-50">
                <svg
                  className="w-6 h-6 text-sky-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Library Hours
              </h2>
            </div>

            <div className="space-y-2">
              {schedule.map((item, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center p-4 rounded-lg transition-all duration-300 ${
                    item.closed
                      ? "bg-rose-50/50 border border-rose-100"
                      : "hover:bg-slate-50 border border-transparent hover:border-slate-200"
                  }`}
                >
                  <span
                    className={`text-[15px] font-medium ${item.closed ? "text-slate-500" : "text-slate-700"}`}
                  >
                    {item.day}
                  </span>
                  <span
                    className={`text-[15px] font-semibold ${item.closed ? "text-rose-700" : "text-sky-700"}`}
                  >
                    {item.time}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-xs text-slate-500 leading-relaxed text-center">
                * Hours may vary during national holidays.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryHours;
