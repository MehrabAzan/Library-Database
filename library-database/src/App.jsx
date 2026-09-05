import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";

import Account from "./pages/Account.jsx";
import AccountActivity from "./pages/AccountActivity.jsx";
import AccountSettings from "./pages/AccountSettings.jsx";
import Fines from "./pages/Fines.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Home from "./pages/Home.jsx";
import ItemEntry from "./pages/ItemEntry.jsx";
import ItemManager from "./pages/ItemManager.jsx";
import Books from "./pages/Books.jsx";
import Periodicals from "./pages/Periodicals.jsx";
import AudiovisualMedia from "./pages/AudiovisualMedia.jsx";
import ChangeRole from "./pages/ChangeRole.jsx";
import Equipment from "./pages/Equipment.jsx";
import Loans from "./pages/Loans.jsx";
import Login from "./pages/Login.jsx";
import Registration from "./pages/Registration.jsx";
import Report from "./pages/Report.jsx";
import Search from "./pages/Search.jsx";
import StaffRegistration from "./pages/StaffRegistration.jsx";
import Logout from "./pages/Logout.jsx";
import PopularityReport from "./pages/PopularityReport.jsx";
import PatronSummaryReport from "./pages/PatronSummaryReport.jsx";
import OverdueReport from "./pages/OverdueReport.jsx";
import TestingReport from "./pages/TestingReport.jsx";
import FineSummaryReport from "./pages/FineSummaryReport";
import AccountHolds from "./pages/AccountHolds";
import StaffLoans from "./pages/StaffLoans";
import StaffFines from "./pages/StaffFines";
import Holds from "./pages/Holds";
import Lost from "./pages/Lost";
import AboutUs from "./pages/AboutUs.jsx";
import LibraryHours from "./pages/LibraryHours.jsx";
import LibraryPolicies from "./pages/LibraryPolicies.jsx";

import { ReadStoredUser } from "./api";
import { MessageProvider } from "./context/MessageContext.jsx";
import NotificationBell from "./components/NotificationBell.jsx";

function AccountRouter({ patronPage, staffPage }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return null;

  return user.user_type === "patron" ? patronPage : staffPage;
}

function MenuLink({ to, label, description, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `dh-menu-link ${isActive ? "dh-menu-link-active" : "dh-menu-link-idle"}`
      }
    >
      {({ isActive }) => (
        <>
          <span className="block font-semibold">{label}</span>
          {description ? (
            <span
              className={`mt-0.5 block text-xs leading-5 ${
                isActive ? "text-paper/75" : "text-ink/55"
              }`}
            >
              {description}
            </span>
          ) : null}
        </>
      )}
    </NavLink>
  );
}

function PublicNavLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `dh-nav-link ${isActive ? "dh-nav-link-active" : ""}`
      }
    >
      {label}
    </NavLink>
  );
}

function App() {
  const user = ReadStoredUser();
  const userType = user?.user_type;
  const roleCode = Number(user?.role);
  const version = "1.2.0";

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebarAfterNavigate = () => {
    setIsSidebarOpen(false);
  };

  const baseNavigationLinks = [
    { to: "/", label: "Home", description: "Library overview and highlights" },
    {
      to: "/search",
      label: "Catalog",
      description: "Find books, media, periodicals, and equipment",
    },
    ...(user
      ? [
          {
            to: "/account",
            label: "My Account",
            description:
              userType === "staff"
                ? "Profile and settings"
                : "Loans, holds, fines, and settings",
          },
        ]
      : []),
    {
      to: "/hours",
      label: "Hours & Location",
      description: "Plan a visit or contact the branch",
    },
    {
      to: "/policies",
      label: "Library Policies",
      description: "Review circulation rules and services",
    },
    {
      to: "/about",
      label: "About",
      description: "Learn about the library",
    },
  ];

  const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/search", label: "Catalog" },
    { to: "/hours", label: "Hours & Location" },
    { to: "/policies", label: "Library Policies" },
    { to: "/about", label: "About" },
  ];

  const staffLinks =
    userType === "staff" && (roleCode === 1 || roleCode === 2)
      ? [
          {
            to: "/itementry/manage",
            label: "Manage Items",
            description: "Add, update, and organize catalog records",
          },
          {
            to: "/staffloans",
            label: "Checkout & Returns",
            description: "Process active circulation",
          },
          {
            to: "/holds",
            label: "Hold Requests",
            description: "Review and fulfill patron holds",
          },
          {
            to: "/stafffines",
            label: "Fine Payments",
            description: "Look up and resolve fines",
          },
          {
            to: "/lost",
            label: "Lost Item Records",
            description: "Track missing or replacement items",
          },
        ]
      : [];

  const adminLinks =
    userType === "staff" && roleCode === 2
      ? [
          {
            to: "/report",
            label: "Reports",
            description: "Open circulation and account reports",
          },
          {
            to: "/changerole",
            label: "User Roles",
            description: "Update staff and patron access",
          },
          {
            to: "/staffregistration",
            label: "Register Staff",
            description: "Create a new staff account",
          },
        ]
      : [];

  const navigationLinks = [
    ...baseNavigationLinks,
    ...staffLinks,
    ...adminLinks,
  ];

  return (
    <MessageProvider>
      <BrowserRouter>
        <div className="dh-shell">
          <header className="dh-header">
            <div className="dh-utility-bar px-4 py-2 sm:px-6">
              <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                  <span>100 Innovation Drive, Tech District</span>
                  <span>Mon–Thu 8 AM–9 PM</span>
                  <span>(555) 019-8372</span>
                </div>
                <NavLink
                  to="/hours"
                  className="font-semibold text-brass-soft transition-colors hover:text-paper"
                >
                  View today&apos;s hours
                </NavLink>
              </div>
            </div>

            <div className="px-4 sm:px-6">
              <div className="mx-auto flex h-[4.75rem] w-full max-w-[1440px] items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="dh-btn dh-btn-secondary !px-3 !py-2"
                    aria-controls="library-navigation"
                    aria-expanded={isSidebarOpen}
                    aria-label={
                      isSidebarOpen
                        ? "Close library navigation"
                        : "Open library navigation"
                    }
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                    <span className="hidden sm:inline">
                      {isSidebarOpen ? "Hide menu" : "Menu"}
                    </span>
                  </button>

                  <NavLink
                    to="/"
                    className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-90"
                  >
                    <img
                      src="/Datahaven.jpg"
                      className="dh-brand-mark"
                      alt="Datahaven Libraries logo"
                    />
                    <div className="min-w-0">
                      <p className="font-display truncate text-xl font-semibold tracking-tight text-ink-deep sm:text-2xl">
                        Datahaven Libraries
                      </p>
                      <p className="hidden text-xs font-medium tracking-wide text-ink/55 md:block">
                        Catalog, services, and patron access
                      </p>
                    </div>
                  </NavLink>
                </div>

                <nav
                  className="hidden items-center gap-0.5 lg:flex"
                  aria-label="Primary navigation"
                >
                  {publicLinks.map((link) => (
                    <PublicNavLink key={link.to} {...link} />
                  ))}
                </nav>

                {!user ? (
                  <NavLink to="/login" className="dh-btn dh-btn-primary shrink-0">
                    Log in
                  </NavLink>
                ) : (
                  <div className="flex shrink-0 items-center gap-3">
                    {userType === "staff" ? null : <NotificationBell />}
                    <span className="hidden text-sm text-ink/65 sm:inline">
                      Hello{" "}
                      <span className="font-semibold text-ink">
                        {user.first_name || "User"}
                      </span>
                    </span>
                    <NavLink to="/logout" className="dh-btn dh-btn-secondary !py-1.5">
                      Logout
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 overflow-hidden">
            {isSidebarOpen ? (
              <button
                type="button"
                className="fixed inset-0 z-30 bg-ink-deep/40 lg:hidden"
                aria-label="Close navigation"
                onClick={() => setIsSidebarOpen(false)}
              />
            ) : null}

            <aside
              id="library-navigation"
              className={`fixed inset-y-0 left-0 z-40 w-80 max-w-[86vw] flex-shrink-0 overflow-hidden border-r border-ink/10 bg-mist transition-transform duration-200 ease-in-out lg:static lg:z-0 lg:max-w-none lg:transition-[width] ${
                isSidebarOpen
                  ? "translate-x-0 lg:w-80"
                  : "-translate-x-full lg:w-0 lg:translate-x-0"
              }`}
            >
              <div className="h-full overflow-y-auto">
                <div className="flex items-start justify-between gap-4 border-b border-ink/10 bg-paper/80 px-6 py-5">
                  <div>
                    <p className="font-display text-base font-semibold text-ink-deep">
                      Library Menu
                    </p>
                    <p className="mt-1 text-xs leading-5 text-ink/60">
                      Catalog, account, visits, and operations.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    className="dh-btn dh-btn-secondary !px-3 !py-1.5 text-xs lg:hidden"
                  >
                    Close
                  </button>
                </div>
                <nav
                  className="space-y-1 px-4 py-4"
                  aria-label="Library navigation"
                >
                  {navigationLinks.map((link) => (
                    <MenuLink
                      key={link.to}
                      {...link}
                      onNavigate={closeSidebarAfterNavigate}
                    />
                  ))}
                </nav>
              </div>
            </aside>

            <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
              <div className="mx-auto w-full max-w-[1440px]">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/hours" element={<LibraryHours />} />
                  <Route path="/policies" element={<LibraryPolicies />} />

                  <Route path="/account" element={<Account />}>
                    <Route
                      path="holds"
                      element={
                        <AccountRouter
                          patronPage={<AccountHolds />}
                          staffPage={<Holds />}
                        />
                      }
                    />
                    <Route
                      path="loans"
                      element={
                        <AccountRouter
                          patronPage={<Loans />}
                          staffPage={<StaffLoans />}
                        />
                      }
                    />
                    <Route
                      path="fines"
                      element={
                        <AccountRouter
                          patronPage={<Fines />}
                          staffPage={<StaffFines />}
                        />
                      }
                    />
                    <Route path="activity" element={<AccountActivity />} />
                    <Route path="settings" element={<AccountSettings />} />
                  </Route>

                  <Route path="/login" element={<Login />} />
                  <Route path="/registration" element={<Registration />} />
                  <Route path="/logout" element={<Logout />} />

                  <Route path="/staffloans" element={<StaffLoans />} />
                  <Route path="/stafffines" element={<StaffFines />} />
                  <Route path="/holds" element={<Holds />} />
                  <Route path="/lost" element={<Lost />} />

                  <Route path="/itementry" element={<ItemEntry />}>
                    <Route index element={<Navigate to="books" replace />} />
                    <Route path="books" element={<Books />} />
                    <Route path="periodicals" element={<Periodicals />} />
                    <Route
                      path="audiovisualmedia"
                      element={<AudiovisualMedia />}
                    />
                    <Route path="equipment" element={<Equipment />} />
                    <Route path="manage" element={<ItemManager />} />
                  </Route>

                  <Route path="/changerole" element={<ChangeRole />} />
                  <Route
                    path="/staffregistration"
                    element={<StaffRegistration />}
                  />

                  <Route path="/report" element={<Report />} />
                  <Route
                    path="/report/PopularityReport"
                    element={<PopularityReport />}
                  />
                  <Route
                    path="/report/patron-summary"
                    element={<PatronSummaryReport />}
                  />
                  <Route
                    path="/report/overduereport"
                    element={<OverdueReport />}
                  />
                  <Route
                    path="/report/fine-summary"
                    element={<FineSummaryReport />}
                  />
                  <Route path="/report/testing" element={<TestingReport />} />

                  <Route path="/forgotpassword" element={<ForgotPassword />} />
                </Routes>
              </div>
            </main>
          </div>

          <footer className="border-t border-ink/10 bg-ink-deep px-4 py-10 text-sm text-paper/80 sm:px-6">
            <div className="mx-auto grid w-full max-w-[1440px] gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
              <div>
                <div className="flex items-center gap-3">
                  <img
                    src="/Datahaven.jpg"
                    className="dh-brand-mark border-paper/20"
                    alt="Datahaven Libraries logo"
                  />
                  <div>
                    <h2 className="font-display text-lg font-semibold text-paper">
                      Datahaven Libraries
                    </h2>
                    <p className="text-paper/55">Version {version}</p>
                  </div>
                </div>
                <p className="mt-4 max-w-sm leading-relaxed text-paper/70">
                  100 Innovation Drive, Tech District, TX 75001
                </p>
                <p className="mt-2 font-semibold text-brass-soft">
                  (555) 019-8372
                </p>
              </div>

              <div>
                <h3 className="font-semibold tracking-wide text-paper">Visit</h3>
                <ul className="mt-3 space-y-2 text-paper/70">
                  <li>Mon–Thu: 8 AM–9 PM</li>
                  <li>Friday: 8 AM–6 PM</li>
                  <li>Saturday: 10 AM–4 PM</li>
                  <li>Sunday: Closed</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold tracking-wide text-paper">
                  Explore
                </h3>
                <ul className="mt-3 space-y-2">
                  {publicLinks.slice(1).map((link) => (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        className="text-paper/70 transition-colors hover:text-brass-soft"
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold tracking-wide text-paper">
                  Account
                </h3>
                <ul className="mt-3 space-y-2">
                  <li>
                    <NavLink
                      to={user ? "/account" : "/login"}
                      className="text-paper/70 transition-colors hover:text-brass-soft"
                    >
                      {user ? "My Account" : "Log in"}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/registration"
                      className="text-paper/70 transition-colors hover:text-brass-soft"
                    >
                      Get a Library Card
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </MessageProvider>
  );
}

export default App;
