import { SubmitButton } from "../components/Buttons";
import { FetchJson } from "../api";
import { useMessage } from "../hooks/useMessage";

export default function StaffRegistration() {
  const { showSuccess, showError } = useMessage();

  // Standardized classes for light-mode visibility
  const inputClasses = "block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)]";

  const labelClasses = "mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70 text-left";

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col items-center border border-ink/10 bg-paper/80 p-8 sm:p-12">
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink-deep">
        Staff Registration
      </h1>

      <form
        className="w-full mt-6"
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);

          const staffData = {
            firstname: formData.get("firstname"),
            lastname: formData.get("lastname"),
            birthday: formData.get("birthday"),
            email: formData.get("email"),
            password: formData.get("password"),
            phone_number: formData.get("phonenumber"),
            address: formData.get("address"),
            staff_role_code: formData.get("staff_role_code"),
          };

          try {
            await FetchJson("/api/staff/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(staffData),
            });

            showSuccess("Staff registration successful!");
            e.target.reset();
          } catch (error) {
            showError(error.message || "Registration failed.");
          }
        }}
      >
        <div className="space-y-6">
          {/* Name Row */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label htmlFor="firstname" className={labelClasses}>
                First Name
              </label>
              <input
                required
                id="firstname"
                name="firstname"
                type="text"
                placeholder="Jane"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="lastname" className={labelClasses}>
                Last Name
              </label>
              <input
                required
                id="lastname"
                name="lastname"
                type="text"
                placeholder="Doe"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="birthday" className={labelClasses}>
                Date of Birth
              </label>
              <input
                required
                id="birthday"
                name="birthday"
                type="date"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Contact Row */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label htmlFor="address" className={labelClasses}>
                Residential Address
              </label>
              <input
                required
                id="address"
                name="address"
                type="text"
                placeholder="123 Library Way, City, State"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="phonenumber" className={labelClasses}>
                Phone Number
              </label>
              <input
                required
                id="phonenumber"
                name="phonenumber"
                type="tel"
                placeholder="555-0123"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Credentials Row */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className={labelClasses}>
                Email Address
              </label>
              <input
                required
                id="email"
                name="email"
                type="email"
                placeholder="staff@library.org"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="password" className={labelClasses}>
                Password
              </label>
              <input
                required
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Verification Row */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 items-end">
            <div>
              <label htmlFor="staff_role_code" className={labelClasses}>
                Assign Staff Role
              </label>
              <select
                required
                id="staff_role_code"
                name="staff_role_code"
                className={`${inputClasses} appearance-none cursor-pointer`}
              >
                <option value="1">Staff (General Access)</option>
                <option value="2">Admin (System Manager)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <SubmitButton
                title={"Complete Registration"}
                value={"OK"}
                fullwidth={true}
              />
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
