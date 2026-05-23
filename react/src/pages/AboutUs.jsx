import React from "react";

const AboutUs = () => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
          About the Library
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
          About <span className="text-sky-900">Datahaven</span>
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
          Datahaven is more than just a library. We are a haven for our
          community that provides knowledge and resources.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-sky-200 hover:shadow-md">
          <div className="flex flex-wrap items-center gap-4 text-center">
            <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-lg border border-sky-100 bg-sky-50">
              <svg
                className="w-7 h-7 text-sky-900"
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
            </div>
            <h2 className="text-2xl font-bold text-slate-950 mb-2 tracking-tight">
              Welcome
            </h2>
          </div>
          <p className="text-slate-600 leading-relaxed flex-1">
            Whether you are here to conduct research, borrow equipment, or
            simply dive into a good book, Datahaven is your space.
          </p>
        </div>
        <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-amber-200 hover:shadow-md">
          <div className="flex flex-wrap items-center gap-4 text-center">
            <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-lg border border-amber-100 bg-amber-50">
              <svg
                className="w-7 h-7 text-amber-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-950 mb-2 tracking-tight">
              Our Mission
            </h2>
          </div>
          <p className="text-slate-600 leading-relaxed flex-1">
            Our mission is to empower our community by providing access to
            knowledge, technology, and various resources. We strive to be a
            sanctuary for learning and collaboration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
