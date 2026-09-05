import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SubmitButton } from "../components/Buttons";
import { FetchJson, GetErrorMessage } from "../api";

function FormatExpiresAt(expiresAt) {
  if (!expiresAt) {
    return "";
  }
  const parsedDate = new Date(expiresAt);
  if (Number.isNaN(parsedDate.getTime())) {
    return String(expiresAt);
  }
  return parsedDate.toLocaleString();
}

export default function ForgotPassword() {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = String(searchParams.get("token") ?? "").trim();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [previewLink, setPreviewLink] = useState("");
  const [previewExpiresAt, setPreviewExpiresAt] = useState("");

  async function HandleRequestReset(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");
      setPreviewLink("");
      setPreviewExpiresAt("");

      const data = await FetchJson("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.get("email") }),
      });

      setMessage(data?.message ?? "Password reset request submitted.");
      setPreviewLink(data?.resetUrl ?? "");
      setPreviewExpiresAt(data?.expiresAt ?? "");
    } catch (caughtError) {
      setError(GetErrorMessage(caughtError, "Failed to start password reset."));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function HandleResetPassword(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");

      const data = await FetchJson("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: formData.get("newPassword"),
          confirmPassword: formData.get("confirmPassword"),
        }),
      });

      setSearchParams({}, { replace: true });
      setMessage(data?.message ?? "Password reset successful.");
      setPreviewLink("");
      setPreviewExpiresAt("");
      event.currentTarget.reset();
    } catch (caughtError) {
      setError(GetErrorMessage(caughtError, "Failed to reset password."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-md border-t-[3px] border-brass bg-white/80 px-6 py-8 shadow-soft sm:px-9 sm:py-10 sm:pb-12">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep text-center">Account recovery</p>
      <h1 className="mt-2 text-center font-display text-3xl font-semibold tracking-tight text-ink-deep sm:text-4xl">
        {token ? "Reset password" : "Forgot password"}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-ink/65">
        {token
          ? "Enter a new password to finish resetting your account."
          : "Enter your email and we will send a link to get back into your account."}
      </p>

      {message && (
        <div className="mt-6 w-full border border-success/25 bg-success/10 px-4 py-3 text-left text-sm font-medium text-success">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-6 w-full border border-danger/25 bg-danger/10 px-4 py-3 text-left text-sm font-medium text-danger">
          {error}
        </div>
      )}

      {token ? (
        <form className="mt-6 w-full" onSubmit={HandleResetPassword}>
          <label htmlFor="new-password" className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70">
            New password
          </label>
          <input
            required
            minLength={8}
            id="new-password"
            name="newPassword"
            type="password"
            placeholder="Min. 8 characters"
            className="block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)]"
            autoComplete="new-password"
          />

          <label htmlFor="confirm-password" className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70 mt-5">
            Confirm password
          </label>
          <input
            required
            minLength={8}
            id="confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            className="block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)]"
            autoComplete="new-password"
          />

          <div className="mt-8">
            <SubmitButton
              title={isSubmitting ? "Resetting..." : "Reset Password"}
              disabledValue={isSubmitting}
              fullwidth
            />
          </div>
        </form>
      ) : (
        <form className="mt-6 w-full" onSubmit={HandleRequestReset}>
          <label htmlFor="recovery-email" className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70">
            Email address
          </label>
          <input
            required
            id="recovery-email"
            name="email"
            type="email"
            placeholder="name@example.com"
            className="block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)]"
            autoComplete="email"
          />
          <div className="mt-8">
            <SubmitButton
              title={isSubmitting ? "Generating..." : "Send Reset Link"}
              disabledValue={isSubmitting}
              fullwidth
            />
          </div>
        </form>
      )}

      {!token && previewLink && (
        <div className="mt-8 w-full border border-ink/10 bg-mist/80 p-5 text-left">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">Development preview</p>
          <a href={previewLink} className="font-semibold text-ink-soft underline decoration-ink-soft/35 underline-offset-[0.18em] transition-[color,text-decoration-color] duration-150 hover:text-ink hover:decoration-brass mt-2 block break-all text-sm">
            {previewLink}
          </a>
          {previewExpiresAt && (
            <p className="mt-2 text-xs italic text-ink/50">
              Expires: {FormatExpiresAt(previewExpiresAt)}
            </p>
          )}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link to="/login" className="font-semibold text-ink-soft underline decoration-ink-soft/35 underline-offset-[0.18em] transition-[color,text-decoration-color] duration-150 hover:text-ink hover:decoration-brass text-sm">
          Return to login
        </Link>
      </div>
    </section>
  );
}
