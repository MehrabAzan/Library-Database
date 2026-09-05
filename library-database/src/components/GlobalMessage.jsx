import React from "react";

function getToastStyles(type) {
  if (type === "success") {
    return {
      bar: "bg-success",
      title: "Success",
    };
  }

  if (type === "error") {
    return {
      bar: "bg-danger",
      title: "Error",
    };
  }

  if (type === "warning") {
    return {
      bar: "bg-brass",
      title: "Warning",
    };
  }

  return {
    bar: "bg-ink-soft",
    title: "Info",
  };
}

export default function GlobalMessage({ type = "info", message, onClose }) {
  if (!message) {
    return null;
  }

  const styles = getToastStyles(type);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-5 z-[300] flex justify-center px-4">
      <div className="w-full max-w-lg overflow-hidden rounded-lg border border-ink/15 bg-paper text-ink shadow-[0_12px_28px_rgb(7_42_48_/_0.14)] animate-[rise_280ms_cubic-bezier(0.22,1,0.36,1)] pointer-events-auto">
        <div className={`h-1 w-full ${styles.bar}`} />

        <div className="flex items-start gap-4 px-5 py-4">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-ink/45">
              {styles.title}
            </div>
            <div className="mt-1 text-base font-semibold leading-7 text-ink-deep">
              {message}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-[1.15rem] py-[0.65rem] text-sm font-semibold leading-tight transition-[background-color,color,border-color,transform] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass active:enabled:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 border border-ink/20 bg-transparent text-ink hover:enabled:border-ink/35 hover:enabled:bg-ink/5 !px-3 !py-1.5 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
