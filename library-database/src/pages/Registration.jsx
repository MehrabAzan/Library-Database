import { SubmitButton } from "../components/Buttons";
import { FetchJson } from "../api";
import { useMessage } from "../hooks/useMessage";
import { Link } from "react-router-dom";

export default function Registration() {
  const { showSuccess, showError } = useMessage();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-1 py-8">
    <section className="w-full border-t-[3px] border-brass bg-white/85 px-6 py-9 shadow-soft sm:px-10 sm:py-11">
      <p className="text-center text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">Membership</p>
      <h1 className="mt-2 text-center font-display text-3xl font-semibold tracking-tight text-ink-deep sm:text-4xl">
        Get a library card
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-6 text-ink/65">
        Join Datahaven to borrow items, manage holds, and access digital
        resources.
      </p>

      <form
        className="mt-10 w-full"
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);

          const registrationData = {
            firstname: formData.get("firstname"),
            lastname: formData.get("lastname"),
            birthday: formData.get("birthday"),
            email: formData.get("email"),
            password: formData.get("password"),
          };

          try {
            await FetchJson("/api/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(registrationData),
            });

            showSuccess("Registration successful! Please sign in.");
            e.target.reset();
          } catch (error) {
            showError(error.message || "Registration failed.");
          }
        }}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label htmlFor="firstname" className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70">
                First name
              </label>
              <input
                required
                id="firstname"
                name="firstname"
                type="text"
                placeholder="Jane"
                className="block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)]"
                autoComplete="given-name"
              />
            </div>
            <div>
              <label htmlFor="lastname" className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70">
                Last name
              </label>
              <input
                required
                id="lastname"
                name="lastname"
                type="text"
                placeholder="Doe"
                className="block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)]"
                autoComplete="family-name"
              />
            </div>
            <div>
              <label htmlFor="birthday" className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70">
                Date of birth
              </label>
              <input
                required
                id="birthday"
                name="birthday"
                type="date"
                className="block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70">
                Email address
              </label>
              <input
                required
                id="email"
                name="email"
                type="email"
                placeholder="jane@example.com"
                className="block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)]"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70">
                Password
              </label>
              <input
                required
                id="password"
                name="password"
                type="password"
                placeholder="Min. 8 characters"
                className="block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)]"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="flex flex-col items-center pt-2">
            <SubmitButton
              title={"Register Account"}
              value={"OK"}
              halfwidth={true}
            />

            <p className="mt-8 text-sm text-ink/60">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-ink-soft underline decoration-ink-soft/35 underline-offset-[0.18em] transition-[color,text-decoration-color] duration-150 hover:text-ink hover:decoration-brass">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </form>
    </section>
    </div>
  );
}
