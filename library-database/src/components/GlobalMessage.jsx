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
      <div className="dh-toast pointer-events-auto">
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
            className="dh-btn dh-btn-secondary !px-3 !py-1.5 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
