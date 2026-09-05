import { useEffect } from "react";
import { ClearStoredAuth } from "../api";
import { useMessage } from "../hooks/useMessage";

export default function Logout() {
  const { showInfo } = useMessage();

  useEffect(() => {
    ClearStoredAuth();
    showInfo("You have been logged out.");

    const timeoutId = setTimeout(() => {
      window.location.href = "/login";
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [showInfo]);

  return (
    <section className="mx-auto w-full max-w-md border-t-[3px] border-brass bg-white/80 px-6 py-8 shadow-soft sm:px-9 sm:py-10 sm:pb-12 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">Session</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-deep">
        Logging out...
      </h1>
      <p className="mt-4 text-sm leading-6 text-ink/65">
        Your session has ended. Redirecting to login page.
      </p>
    </section>
  );
}
