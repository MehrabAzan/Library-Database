import { SubmitButton } from "../components/Buttons";
import { FetchJson } from "../api";
import { useMessage } from "../hooks/useMessage";
import { Link } from "react-router-dom";

export default function Registration() {
  const { showSuccess, showError } = useMessage();

  return (
    <section className="dh-auth-panel dh-auth-panel-wide">
      <p className="dh-kicker text-center">Membership</p>
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
              <label htmlFor="firstname" className="dh-label">
                First name
              </label>
              <input
                required
                id="firstname"
                name="firstname"
                type="text"
                placeholder="Jane"
                className="dh-input"
                autoComplete="given-name"
              />
            </div>
            <div>
              <label htmlFor="lastname" className="dh-label">
                Last name
              </label>
              <input
                required
                id="lastname"
                name="lastname"
                type="text"
                placeholder="Doe"
                className="dh-input"
                autoComplete="family-name"
              />
            </div>
            <div>
              <label htmlFor="birthday" className="dh-label">
                Date of birth
              </label>
              <input
                required
                id="birthday"
                name="birthday"
                type="date"
                className="dh-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="dh-label">
                Email address
              </label>
              <input
                required
                id="email"
                name="email"
                type="email"
                placeholder="jane@example.com"
                className="dh-input"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="dh-label">
                Password
              </label>
              <input
                required
                id="password"
                name="password"
                type="password"
                placeholder="Min. 8 characters"
                className="dh-input"
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
              <Link to="/login" className="dh-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </form>
    </section>
  );
}
