import { Link } from "react-router-dom";
import { FetchJson, WriteStoredAuth } from "../api";
import { useMessage } from "../hooks/useMessage";

const inputClass =
  "block w-full rounded-lg border border-ink/20 bg-white px-3.5 py-2.5 text-[0.9375rem] text-ink shadow-soft outline-none transition duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)]";
const labelClass =
  "mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70";
const linkClass =
  "font-semibold text-ink-soft underline decoration-ink-soft/35 underline-offset-[0.18em] transition duration-150 hover:text-ink hover:decoration-brass";

export default function Login() {
  const { showSuccess, showWarning } = useMessage();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg items-center px-1 py-8">
      <section className="w-full border-t-[3px] border-brass bg-white/85 px-6 py-9 shadow-soft sm:px-10 sm:py-11">
        <img
          src="/Datahaven.jpg"
          alt=""
          className="mx-auto mb-5 h-14 w-14 rounded-md border border-ink/15 bg-white object-cover shadow-soft"
        />
        <p className="text-center text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">
          Patron access
        </p>
        <h1 className="mt-2 text-center font-display text-3xl font-semibold tracking-tight text-ink-deep sm:text-4xl">
          Sign in to Datahaven
        </h1>
        <p className="mt-3 text-center text-sm leading-6 text-ink/65">
          Use your library email to manage holds, loans, and fines.
        </p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);

            const loginData = {
              email: formData.get("email"),
              password: formData.get("password"),
            };

            try {
              const data = await FetchJson("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
              });
              WriteStoredAuth({
                user: data.user,
                sessionToken: data.sessionToken,
                sessionExpiresAt: data.sessionExpiresAt,
              });
              showSuccess("Login successful!");
              setTimeout(() => {
                window.location.href = "/";
              }, 1500);
            } catch (error) {
              showWarning(error.message || "Login failed.");
            }
          }}
          className="mt-9 w-full"
        >
          <div>
            <label htmlFor="email" className={labelClass}>
              Email address
            </label>
            <input
              required
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              className={inputClass}
              autoComplete="email"
            />
          </div>

          <div className="mt-5">
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              required
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className={inputClass}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition duration-150 hover:enabled:bg-ink-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 space-y-3 text-center text-sm text-ink/60">
          <p>
            Don&apos;t have an account?{" "}
            <Link to="/registration" className={linkClass}>
              Create one
            </Link>
          </p>
          <p>
            <Link to="/forgotpassword" className={linkClass}>
              Forgot your password?
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
