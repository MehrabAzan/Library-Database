import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ReadStoredUser } from "../api";

const navLinks = [
  { to: "manage", label: "Manage Items" },
  { to: "books", label: "Books" },
  { to: "periodicals", label: "Periodicals" },
  { to: "audiovisualmedia", label: "Audiovisual Media" },
  { to: "equipment", label: "Equipment" },
];

export default function ItemEntry() {
  const navigate = useNavigate();
  const user = ReadStoredUser();
  const userKey = user ? `${user.user_type ?? ""}:${user.staff_id ?? ""}` : "";

  useEffect(() => {
    const currentUser = ReadStoredUser();

    if (!currentUser) {
      navigate("/login", { replace: true });
      return;
    }

    if (currentUser.user_type !== "staff") {
      navigate("/", { replace: true });
    }
  }, [navigate, userKey]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">Catalog</p>
          <h1 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight text-ink-deep mt-2 text-4xl">Item Management</h1>
        </div>
        <nav className="flex flex-wrap gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "relative rounded-md px-[0.7rem] py-[0.45rem] text-sm font-semibold transition-colors bg-ink-soft/10 text-ink" : "relative rounded-md px-[0.7rem] py-[0.45rem] text-sm font-semibold text-ink/80 transition-colors hover:bg-ink/5 hover:text-ink"
              }
            >
              {link.label == "Manage Items"
                ? link.label
                : link.label.at(-1) == "s"
                  ? link.label.slice(0, link.label.length - 1) + ` Entry`
                  : link.label + ` Entry`}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}
