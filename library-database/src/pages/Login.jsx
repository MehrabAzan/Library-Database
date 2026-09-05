import { Link } from "react-router-dom";
import { FetchJson, WriteStoredAuth } from "../api";
import { useMessage } from "../hooks/useMessage";

export default function Login() {
  const { showSuccess, showWarning } = useMessage();

  return (
    <section className="dh-auth-panel">
      <p className="dh-kicker text-center">Patron access</p>
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
          <label htmlFor="email" className="dh-label">
            Email address
          </label>
          <input
            required
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            className="dh-input"
            autoComplete="email"
          />
        </div>

        <div className="mt-5">
          <label htmlFor="password" className="dh-label">
            Password
          </label>
          <input
            required
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="dh-input"
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="dh-btn dh-btn-primary mt-8 w-full">
          Sign In
        </button>
      </form>

      <div className="mt-8 space-y-3 text-center text-sm text-ink/60">
        <p>
          Don&apos;t have an account?{" "}
          <Link to="/registration" className="dh-link">
            Create one
          </Link>
        </p>
        <p>
          <Link to="/forgotpassword" className="dh-link">
            Forgot your password?
          </Link>
        </p>
      </div>
    </section>
  );
}
