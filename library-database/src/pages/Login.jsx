import { Link } from "react-router-dom";
import { FetchJson, WriteStoredAuth } from "../api";
import { useMessage } from "../hooks/useMessage";

export default function Login() {
  const { showSuccess, showWarning } = useMessage();

  return (
    <section className="mx-auto w-full max-w-md border-t-[3px] border-brass bg-white/80 px-6 py-8 shadow-soft sm:px-9 sm:py-10 sm:pb-12">
      <img
        src="/Datahaven.jpg"
        alt=""
        className="h-12 w-12 rounded-[0.4rem] border border-ink/15 bg-white object-cover mx-auto mb-4"
      />
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep text-center">Patron access</p>
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
        className="mt-8 w-full"
      >
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70">
            Email address
          </label>
          <input
            required
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            className="block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)]"
            autoComplete="email"
          />
        </div>

        <div className="mt-5">
          <label htmlFor="password" className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70">
            Password
          </label>
          <input
            required
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)]"
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg px-[1.15rem] py-[0.65rem] text-sm font-semibold leading-tight transition-[background-color,color,border-color,transform] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass active:enabled:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 bg-ink text-paper hover:enabled:bg-ink-soft mt-8 w-full">
          Sign In
        </button>
      </form>

      <div className="mt-8 space-y-3 text-center text-sm text-ink/60">
        <p>
          Don&apos;t have an account?{" "}
          <Link to="/registration" className="font-semibold text-ink-soft underline decoration-ink-soft/35 underline-offset-[0.18em] transition-[color,text-decoration-color] duration-150 hover:text-ink hover:decoration-brass">
            Create one
          </Link>
        </p>
        <p>
          <Link to="/forgotpassword" className="font-semibold text-ink-soft underline decoration-ink-soft/35 underline-offset-[0.18em] transition-[color,text-decoration-color] duration-150 hover:text-ink hover:decoration-brass">
            Forgot your password?
          </Link>
        </p>
      </div>
    </section>
  );
}
