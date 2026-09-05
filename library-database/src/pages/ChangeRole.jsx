import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton, { SecondaryButton } from "../components/Buttons";
import {
  FetchJson,
  GetErrorMessage,
  ReadStoredUser,
  UpdateStoredUser,
} from "../api";
import { useMessage } from "../hooks/useMessage";

const inputClassName = "block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)] mt-2";

const emptyFormState = {
  firstName: "",
  lastName: "",
  email: "",
  dateOfBirth: "",
  roleCode: "",
  isActive: "true",
  phoneNumber: "",
  address: "",
};

function BuildUserRecordKey(user) {
  if (!user) {
    return "";
  }
  return `${user.userType}:${user.userId}`;
}

function BuildFormState(user) {
  if (!user) {
    return emptyFormState;
  }

  return {
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email: user.email ?? "",
    dateOfBirth: user.dateOfBirth ? String(user.dateOfBirth).slice(0, 10) : "",
    roleCode: String(user.roleCode ?? ""),
    isActive: user.isActive ? "true" : "false",
    phoneNumber: user.phoneNumber ?? "",
    address: user.address ?? "",
  };
}

function BuildUserTitle(user) {
  if (!user) {
    return "";
  }
  return user.userType === "staff"
    ? `Staff #${user.userId}`
    : `Patron #${user.userId}`;
}

export default function ChangeRole() {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning, showInfo } = useMessage();
  const storedUser = ReadStoredUser();
  const userKey = storedUser
    ? `${storedUser.user_type ?? ""}:${storedUser.staff_id ?? ""}:${storedUser.role ?? ""}`
    : "";

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserKey, setSelectedUserKey] = useState("");
  const [formState, setFormState] = useState(emptyFormState);

  const [patronRoles, setPatronRoles] = useState([]);
  const [staffRoles, setStaffRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  const [listLoading, setListLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const currentUser = ReadStoredUser();
    if (!currentUser) {
      navigate("/login", { replace: true });
      return;
    }
    if (currentUser.user_type !== "staff" || Number(currentUser.role) !== 2) {
      navigate("/", { replace: true });
    }
  }, [navigate, userKey]);

  useEffect(() => {
    let isMounted = true;
    async function LoadRoles() {
      try {
        setRolesLoading(true);
        const [patronRoleData, staffRoleData] = await Promise.all([
          FetchJson("/api/patronroles"),
          FetchJson("/api/staffroles"),
        ]);
        if (!isMounted) return;
        setPatronRoles(Array.isArray(patronRoleData) ? patronRoleData : []);
        setStaffRoles(Array.isArray(staffRoleData) ? staffRoleData : []);
      } catch (error) {
        if (isMounted)
          showError(GetErrorMessage(error, "Failed to load roles."));
      } finally {
        if (isMounted) setRolesLoading(false);
      }
    }
    LoadRoles();
    return () => {
      isMounted = false;
    };
  }, [showError]);

  useEffect(() => {
    let isMounted = true;
    const currentUser = ReadStoredUser();
    if (
      !currentUser ||
      currentUser.user_type !== "staff" ||
      Number(currentUser.role) !== 2
    )
      return;

    async function LoadUsers() {
      try {
        setListLoading(true);
        const params = new URLSearchParams();
        params.set("userType", userTypeFilter);
        if (submittedSearch.trim()) params.set("q", submittedSearch.trim());

        const data = await FetchJson(`/api/admin/users?${params.toString()}`);
        const nextUsers = Array.isArray(data) ? data : [];
        if (!isMounted) return;

        setUsers(nextUsers);
        const nextSelectedUser =
          nextUsers.find(
            (user) => BuildUserRecordKey(user) === selectedUserKey,
          ) ??
          nextUsers[0] ??
          null;

        setSelectedUser(nextSelectedUser);
        setSelectedUserKey(BuildUserRecordKey(nextSelectedUser));
        setFormState(BuildFormState(nextSelectedUser));
      } catch (error) {
        if (isMounted) {
          setUsers([]);
          showError(GetErrorMessage(error, "Failed to load users."));
        }
      } finally {
        if (isMounted) setListLoading(false);
      }
    }
    LoadUsers();
    return () => {
      isMounted = false;
    };
  }, [userKey, userTypeFilter, submittedSearch, refreshKey, showError]);

  const selectedRoleOptions = useMemo(() => {
    if (!selectedUser) return [];
    return selectedUser.userType === "staff" ? staffRoles : patronRoles;
  }, [selectedUser, staffRoles, patronRoles]);

  function HandleSelectUser(user) {
    setSelectedUser(user);
    setSelectedUserKey(BuildUserRecordKey(user));
    setFormState(BuildFormState(user));
  }

  function HandleSearchSubmit(event) {
    event.preventDefault();
    setSubmittedSearch(searchInput.trim());
  }

  function HandleResetFilters() {
    setSearchInput("");
    setSubmittedSearch("");
    setUserTypeFilter("all");
    showInfo("User filters reset.");
  }

  async function HandleSave(event) {
    event.preventDefault();
    if (!selectedUser) return;

    const payload = {
      ...formState,
      roleCode: Number(formState.roleCode),
      isActive: formState.isActive === "true",
    };

    try {
      setSaving(true);
      await FetchJson(
        `/api/admin/users/${selectedUser.userType}/${selectedUser.userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const currentUser = ReadStoredUser();
      if (
        currentUser &&
        currentUser.user_type === selectedUser.userType &&
        Number(currentUser.staff_id ?? currentUser.patron_id) ===
          Number(selectedUser.userId)
      ) {
        UpdateStoredUser({
          first_name: formState.firstName,
          last_name: formState.lastName,
          email: formState.email,
          role: Number(formState.roleCode),
        });
      }

      showSuccess("User updated successfully.");
      setRefreshKey((current) => current + 1);
    } catch (error) {
      showError(GetErrorMessage(error, "Failed to update user."));
    } finally {
      setSaving(false);
    }
  }

  async function HandleDelete() {
    if (!selectedUser) return;
    const confirmed = window.confirm(
      `Delete ${BuildUserTitle(selectedUser)}? This cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      setDeleting(true);
      await FetchJson(
        `/api/admin/users/${selectedUser.userType}/${selectedUser.userId}`,
        { method: "DELETE" },
      );
      showSuccess("User deleted successfully.");
      setSelectedUser(null);
      setSelectedUserKey("");
      setFormState(emptyFormState);
      setRefreshKey((current) => current + 1);
    } catch (error) {
      showError(GetErrorMessage(error, "Failed to delete user."));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="space-y-6 border-y border-ink/10 bg-paper/80 py-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">Admin</p>
        <h1 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight text-ink-deep mt-2 text-4xl">User Management</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-ink/65">
          Search, update, and delete patron or staff accounts. Use the search to
          find users by any field.
        </p>
      </div>

      <form
        onSubmit={HandleSearchSubmit}
        className="grid gap-4 rounded-lg border border-ink/10 bg-mist/60 p-6 lg:grid-cols-[1.2fr_220px_auto_auto]"
      >
        <div>
          <label
            htmlFor="user-search"
            className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70"
          >
            Search Detail
          </label>
          <input
            id="user-search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={inputClassName}
            placeholder="ID, Name, Email..."
          />
        </div>
        <div>
          <label
            htmlFor="user-type-filter"
            className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70"
          >
            Account Type
          </label>
          <select
            id="user-type-filter"
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value)}
            className={inputClassName}
          >
            <option value="all">All Accounts</option>
            <option value="patron">Patrons</option>
            <option value="staff">Staff</option>
          </select>
        </div>
        <div className="flex items-end">
          <PrimaryButton title="Search" type="submit" />
        </div>
        <div className="flex items-end">
          <SecondaryButton title="Reset" onClick={HandleResetFilters} />
        </div>
      </form>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)] ">
        <aside className="rounded-lg border border-ink/10 p-6 bg-white h-screen overflow-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-ink-deep">Accounts</h2>
            <span className="text-sm font-semibold text-ink/65">
              {users.length} Found
            </span>
          </div>

          <div className="mt-6 space-y-3 ">
            {listLoading && <p className="text-ink/65">Loading users...</p>}
            {!listLoading && users.length === 0 && (
              <p className="text-ink/65">No matches found.</p>
            )}
            {users.map((user) => {
              const isSelected = BuildUserRecordKey(user) === selectedUserKey;
              return (
                <button
                  key={BuildUserRecordKey(user)}
                  type="button"
                  onClick={() => HandleSelectUser(user)}
                  className={`w-full rounded-lg border px-4 py-4 text-left transition-all ${isSelected ? "border-ink/20 bg-mist" : "border-ink/10 shadow bg-white hover:border-ink/20 hover:bg-mist/80"}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-ink-deep">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs font-medium text-ink/65">
                        {BuildUserTitle(user)}
                      </p>
                    </div>
                    <span className="rounded-full bg-mist px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-ink/65">
                      {user.userType}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-ink/65 truncate">
                    {user.email}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="border-y border-ink/10 bg-paper/80 py-8">
          {!selectedUser ? (
            <div className="flex min-h-[20rem] items-center justify-center text-ink/65 font-medium">
              Select a user to manage their account.
            </div>
          ) : (
            <form onSubmit={HandleSave} className="space-y-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">
                    {selectedUser.userType} Account
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-ink-deep">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-ink/65">
                    {BuildUserTitle(selectedUser)}
                  </p>
                </div>
                <div className="flex gap-3">
                  <PrimaryButton
                    title={saving ? "Saving..." : "Save Changes"}
                    type="submit"
                    disabledValue={saving || deleting || rolesLoading}
                  />
                  <SecondaryButton
                    title={deleting ? "Deleting..." : "Delete User"}
                    onClick={HandleDelete}
                    disabled={saving || deleting}
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    value={formState.firstName}
                    onChange={(e) =>
                      setFormState((c) => ({ ...c, firstName: e.target.value }))
                    }
                    className={inputClassName}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    value={formState.lastName}
                    onChange={(e) =>
                      setFormState((c) => ({ ...c, lastName: e.target.value }))
                    }
                    className={inputClassName}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState((c) => ({ ...c, email: e.target.value }))
                    }
                    className={inputClassName}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70"
                  >
                    Date of Birth
                  </label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    value={formState.dateOfBirth}
                    onChange={(e) =>
                      setFormState((c) => ({
                        ...c,
                        dateOfBirth: e.target.value,
                      }))
                    }
                    className={inputClassName}
                    required={selectedUser.userType === "staff"}
                  />
                </div>
                <div>
                  <label
                    htmlFor="roleCode"
                    className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70"
                  >
                    System Role
                  </label>
                  <select
                    id="roleCode"
                    value={formState.roleCode}
                    onChange={(e) =>
                      setFormState((c) => ({ ...c, roleCode: e.target.value }))
                    }
                    className={inputClassName}
                    required
                  >
                    <option value="">Select Role</option>
                    {selectedRoleOptions.map((role) => (
                      <option
                        key={role[Object.keys(role)[0]]}
                        value={role[Object.keys(role)[0]]}
                      >
                        {role[Object.keys(role)[1]]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="isActive"
                    className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70"
                  >
                    Account Status
                  </label>
                  <select
                    id="isActive"
                    value={formState.isActive}
                    onChange={(e) =>
                      setFormState((c) => ({ ...c, isActive: e.target.value }))
                    }
                    className={inputClassName}
                    required
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                {selectedUser.userType === "staff" && (
                  <>
                    <div>
                      <label
                        htmlFor="phoneNumber"
                        className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70"
                      >
                        Phone Number
                      </label>
                      <input
                        id="phoneNumber"
                        value={formState.phoneNumber}
                        onChange={(e) =>
                          setFormState((c) => ({
                            ...c,
                            phoneNumber: e.target.value,
                          }))
                        }
                        className={inputClassName}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="address"
                        className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70"
                      >
                        Home Address
                      </label>
                      <input
                        id="address"
                        value={formState.address}
                        onChange={(e) =>
                          setFormState((c) => ({
                            ...c,
                            address: e.target.value,
                          }))
                        }
                        className={inputClassName}
                        required
                      />
                    </div>
                  </>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
