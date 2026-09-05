import { useEffect, useState } from "react";
import PrimaryButton from "../components/Buttons";
import {
  FetchJson,
  GetErrorMessage,
  ReadStoredUser,
  UpdateStoredUser,
} from "../api";

const inputClassName = "block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)] mt-2";
const labelClassName = "mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70 mt-4";

export default function AccountSettings() {
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [contactSaving, setContactSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const user = ReadStoredUser();
  const userKey = user
    ? `${user.user_type ?? ""}:${user.patron_id ?? ""}:${user.staff_id ?? ""}`
    : "";
  const isStaff = user?.user_type === "staff";

  useEffect(() => {
    let isMounted = true;
    const currentUser = ReadStoredUser();

    async function LoadAccountSettings() {
      if (!currentUser) {
        setError("Please log in to manage your account.");
        setLoading(false);
        return;
      }

      if (!["patron", "staff"].includes(currentUser.user_type)) {
        setError("Account settings are not available for this account.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await FetchJson("/api/account");

        if (isMounted) {
          setEmail(data.email ?? "");
          setFirstname(data.first_name ?? "");
          setLastname(data.last_name ?? "");
          setAddress(data.address ?? "");
          setPhoneNumber(data.phone_number ?? "");
        }
      } catch (err) {
        if (isMounted) {
          setError(GetErrorMessage(err, "Failed to load account settings."));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    LoadAccountSettings();

    return () => {
      isMounted = false;
    };
  }, [userKey]);

  async function HandleContactSubmit(event) {
    event.preventDefault();
    try {
      setContactSaving(true);
      setContactMessage("");
      setError("");
      const contactData = {
        firstname,
        lastname,
        email,
        address,
        phone_number: phonenumber,
      };
      const data = await FetchJson("/api/account/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });

      setEmail(data.email ?? email);
      UpdateStoredUser({ email: data.email ?? email });
      setFirstname(data.firstname ?? firstname);
      setLastname(data.lastname ?? lastname);
      setAddress(data.address ?? address);
      setPhoneNumber(data.phone_number ?? phonenumber);

      setContactMessage(
        data.message ?? "Contact information updated successfully.",
      );
    } catch (err) {
      setError(GetErrorMessage(err, "Failed to update contact information."));
    } finally {
      setContactSaving(false);
    }
  }

  async function HandlePasswordSubmit(event) {
    event.preventDefault();
    try {
      setPasswordSaving(true);
      setPasswordMessage("");
      setError("");
      const data = await FetchJson("/api/account/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordMessage(data.message ?? "Password updated successfully.");
    } catch (err) {
      setError(GetErrorMessage(err, "Failed to update password."));
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">Profile</p>
        <h2 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight text-ink-deep mt-2 text-3xl">Settings</h2>
        <p className="mt-2 text-sm leading-6 text-ink/65">
          Manage your profile and security preferences.
        </p>
      </div>

      {loading && (
        <p className="text-ink/65 animate-pulse">Loading settings...</p>
      )}
      {!loading && error && (
        <div className="rounded-xl bg-danger/10 border border-danger/25 p-4 text-danger text-sm font-medium">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-8 xl:grid-cols-2">
          {/* Contact Info Form */}
          <form
            onSubmit={HandleContactSubmit}
            className="border border-ink/10 bg-paper/80 p-5"
          >
            <h3 className="text-xl font-bold text-ink-deep">
              Contact Information
            </h3>
            <p className="mt-1 text-sm text-ink/65 italic">
              Self-service profile management.
            </p>

            <div className="space-y-1">
              <label htmlFor="email" className={labelClassName}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClassName}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstname" className={labelClassName}>
                    First Name
                  </label>
                  <input
                    required
                    id="firstname"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label htmlFor="lastname" className={labelClassName}>
                    Last Name
                  </label>
                  <input
                    required
                    id="lastname"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className={inputClassName}
                  />
                </div>
              </div>

              {isStaff && (
                <>
                  <label htmlFor="address" className={labelClassName}>
                    Home Address
                  </label>
                  <input
                    required
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={inputClassName}
                  />

                  <label htmlFor="phonenumber" className={labelClassName}>
                    Phone Number
                  </label>
                  <input
                    required
                    id="phonenumber"
                    type="tel"
                    value={phonenumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={inputClassName}
                  />
                </>
              )}
            </div>

            {contactMessage && (
              <p className="mt-4 text-sm font-medium text-success bg-success/10 p-2 rounded-lg border border-success/20">
                {contactMessage}
              </p>
            )}

            <div className="mt-8">
              <PrimaryButton
                type="submit"
                title={contactSaving ? "Saving..." : "Update Profile"}
                disabledValue={contactSaving}
              />
            </div>
          </form>

          {/* Password Form */}
          <form
            onSubmit={HandlePasswordSubmit}
            className="border border-ink/10 bg-paper/80 p-5"
          >
            <h3 className="text-xl font-bold text-ink-deep">Security</h3>
            <p className="mt-1 text-sm text-ink/65 italic">
              Update your account password.
            </p>

            <div className="space-y-1">
              <label htmlFor="currentPassword" className={labelClassName}>
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((c) => ({
                    ...c,
                    currentPassword: e.target.value,
                  }))
                }
                className={inputClassName}
              />

              <label htmlFor="newPassword" className={labelClassName}>
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                required
                minLength={8}
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((c) => ({
                    ...c,
                    newPassword: e.target.value,
                  }))
                }
                className={inputClassName}
              />

              <label htmlFor="confirmPassword" className={labelClassName}>
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={8}
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((c) => ({
                    ...c,
                    confirmPassword: e.target.value,
                  }))
                }
                className={inputClassName}
              />
            </div>

            {passwordMessage && (
              <p className="mt-4 text-sm font-medium text-success bg-success/10 p-2 rounded-lg border border-success/20">
                {passwordMessage}
              </p>
            )}

            <div className="mt-8">
              <PrimaryButton
                type="submit"
                title={passwordSaving ? "Updating..." : "Change Password"}
                disabledValue={passwordSaving}
              />
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
