import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton, { SecondaryButton } from "../components/Buttons";
import FileUploadField from "../components/FileUploadField";
import {
  FetchJson,
  GetErrorMessage,
  ReadStoredUser,
  UploadImageFile,
} from "../api";
import { useMessage } from "../hooks/useMessage";

const inputClassName =
  "mt-2 w-full rounded-xl border border-ink/10 bg-mist/10 px-4 py-3 text-ink-deep outline-none focus:border-ink-soft focus:ring-1 focus:ring-ink-soft transition-all";

const emptyFormState = {
  title: "",
  totalCopies: "",
  shelfNumber: "",
  genreCode: "",
  languageCode: "",
  formatCode: "",
  publisher: "",
  publicationDate: "",
  summary: "",
  coverImageUrl: "",
  authorFirstName: "",
  authorLastName: "",
  runtime: "",
};

function BuildCategoryLabel(category) {
  if (category === "audiovisualmedia") {
    return "Audiovisual Media";
  }

  if (category === "periodical") {
    return "Periodical";
  }

  if (category === "equipment") {
    return "Equipment";
  }

  return "Book";
}

function BuildItemForm(item) {
  if (!item) {
    return emptyFormState;
  }

  return {
    title: item.title ?? "",
    totalCopies: String(item.totalCopies ?? ""),
    shelfNumber: item.shelfNumber == null ? "" : String(item.shelfNumber),
    genreCode: item.genreCode == null ? "" : String(item.genreCode),
    languageCode: item.languageCode == null ? "" : String(item.languageCode),
    formatCode: item.formatCode == null ? "" : String(item.formatCode),
    publisher: item.publisher ?? "",
    publicationDate: item.publicationDate
      ? String(item.publicationDate).slice(0, 10)
      : "",
    summary: item.summary ?? "",
    coverImageUrl: item.coverImageUrl ?? "",
    authorFirstName: item.authorFirstName ?? "",
    authorLastName: item.authorLastName ?? "",
    runtime: item.runtime == null ? "" : String(item.runtime),
  };
}

function BuildOptionKeys(option) {
  const keys = Object.keys(option ?? {});
  return {
    valueKey: keys[0],
    labelKey: keys[1],
  };
}

export default function ItemManager() {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning, showInfo } = useMessage();
  const storedUser = ReadStoredUser();
  const userKey = storedUser
    ? `${storedUser.user_type ?? ""}:${storedUser.staff_id ?? ""}:${storedUser.role ?? ""}`
    : "";

  const [items, setItems] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState("");

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formState, setFormState] = useState(emptyFormState);

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [languages, setLanguages] = useState([]);
  const [genres, setGenres] = useState([]);
  const [bookTypes, setBookTypes] = useState([]);
  const [periodicalTypes, setPeriodicalTypes] = useState([]);
  const [audiovisualTypes, setAudiovisualTypes] = useState([]);

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

  useEffect(() => {
    let isMounted = true;

    async function LoadOptions() {
      try {
        setOptionsLoading(true);
        const [
          languageData,
          genreData,
          bookTypeData,
          periodicalTypeData,
          audiovisualTypeData,
        ] = await Promise.all([
          FetchJson("/api/languages"),
          FetchJson("/api/genres"),
          FetchJson("/api/book_types"),
          FetchJson("/api/periodical_types"),
          FetchJson("/api/audiovisual_media_types"),
        ]);

        if (!isMounted) {
          return;
        }

        setLanguages(Array.isArray(languageData) ? languageData : []);
        setGenres(Array.isArray(genreData) ? genreData : []);
        setBookTypes(Array.isArray(bookTypeData) ? bookTypeData : []);
        setPeriodicalTypes(
          Array.isArray(periodicalTypeData) ? periodicalTypeData : [],
        );
        setAudiovisualTypes(
          Array.isArray(audiovisualTypeData) ? audiovisualTypeData : [],
        );
      } catch (error) {
        if (isMounted) {
          showError(GetErrorMessage(error, "Failed to load item metadata."));
        }
      } finally {
        if (isMounted) {
          setOptionsLoading(false);
        }
      }
    }

    LoadOptions();

    return () => {
      isMounted = false;
    };
  }, [showError]);

  useEffect(() => {
    let isMounted = true;
    const currentUser = ReadStoredUser();

    if (!currentUser || currentUser.user_type !== "staff") {
      return () => {
        isMounted = false;
      };
    }

    async function LoadItems() {
      try {
        setListLoading(true);
        const params = new URLSearchParams();
        params.set("category", categoryFilter);
        params.set("limit", "100");

        if (submittedSearch.trim()) {
          params.set("q", submittedSearch.trim());
        }

        const data = await FetchJson(`/api/items/manage?${params.toString()}`);
        const nextItems = Array.isArray(data) ? data : [];

        if (!isMounted) {
          return;
        }

        setItems(nextItems);

        const nextSelectedId = nextItems.some(
          (item) => Number(item.itemId) === Number(selectedItemId),
        )
          ? selectedItemId
          : (nextItems[0]?.itemId ?? null);

        setSelectedItemId(nextSelectedId);

        if (!nextSelectedId) {
          setSelectedItem(null);
          setFormState(emptyFormState);
        }
      } catch (error) {
        if (isMounted) {
          setItems([]);
          setSelectedItemId(null);
          setSelectedItem(null);
          setFormState(emptyFormState);
          showError(GetErrorMessage(error, "Failed to load items."));
        }
      } finally {
        if (isMounted) {
          setListLoading(false);
        }
      }
    }

    LoadItems();

    return () => {
      isMounted = false;
    };
  }, [userKey, categoryFilter, submittedSearch, refreshKey, showError]);

  useEffect(() => {
    let isMounted = true;

    if (!selectedItemId) {
      setSelectedItem(null);
      setFormState(emptyFormState);
      setSelectedImageFile(null);
      setSelectedImageName("");
      return () => {
        isMounted = false;
      };
    }

    async function LoadDetail() {
      try {
        setDetailLoading(true);
        const data = await FetchJson(`/api/items/manage/${selectedItemId}`);

        if (!isMounted) {
          return;
        }

        setSelectedItem(data);
        setFormState(BuildItemForm(data));
        setSelectedImageFile(null);
        setSelectedImageName("");
      } catch (error) {
        if (isMounted) {
          setSelectedItem(null);
          setFormState(emptyFormState);
          setSelectedImageFile(null);
          setSelectedImageName("");
          showError(GetErrorMessage(error, "Failed to load item details."));
        }
      } finally {
        if (isMounted) {
          setDetailLoading(false);
        }
      }
    }

    LoadDetail();

    return () => {
      isMounted = false;
    };
  }, [selectedItemId, refreshKey, showError]);

  const formatOptions = useMemo(() => {
    if (!selectedItem) {
      return [];
    }

    if (selectedItem.category === "book") {
      return bookTypes;
    }

    if (selectedItem.category === "periodical") {
      return periodicalTypes;
    }

    if (selectedItem.category === "audiovisualmedia") {
      return audiovisualTypes;
    }

    return [];
  }, [selectedItem, bookTypes, periodicalTypes, audiovisualTypes]);

  const lockedCopies =
    Number(selectedItem?.onHold ?? 0) + Number(selectedItem?.unavailable ?? 0);

  function HandleSearchSubmit(event) {
    event.preventDefault();
    setSubmittedSearch(searchInput.trim());
  }

  function HandleResetFilters() {
    setSearchInput("");
    setSubmittedSearch("");
    setCategoryFilter("all");
    showInfo("Item filters reset.");
  }

  async function HandleSave(event) {
    event.preventDefault();

    if (!selectedItem) {
      showWarning("Choose an item to edit first.");
      return;
    }

    let coverImageUrl = formState.coverImageUrl;

    const payload = {
      title: formState.title,
      totalCopies: Number(formState.totalCopies),
      shelfNumber:
        formState.shelfNumber === "" ? null : Number(formState.shelfNumber),
      genreCode:
        formState.genreCode === "" ? null : Number(formState.genreCode),
      languageCode:
        formState.languageCode === "" ? null : Number(formState.languageCode),
      formatCode:
        formState.formatCode === "" ? null : Number(formState.formatCode),
      publisher: formState.publisher,
      publicationDate: formState.publicationDate,
      summary: formState.summary,
      coverImageUrl,
      authorFirstName: formState.authorFirstName,
      authorLastName: formState.authorLastName,
      runtime: formState.runtime === "" ? null : Number(formState.runtime),
    };

    try {
      setSaving(true);

      if (selectedImageFile) {
        const uploadResult = await UploadImageFile(selectedImageFile);
        coverImageUrl = String(uploadResult?.url ?? "").trim() || coverImageUrl;
        payload.coverImageUrl = coverImageUrl;
      }

      await FetchJson(`/api/items/manage/${selectedItem.itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      showSuccess("Item updated successfully.");
      setSelectedImageFile(null);
      setSelectedImageName("");
      setRefreshKey((current) => current + 1);
    } catch (error) {
      showError(GetErrorMessage(error, "Failed to update item."));
    } finally {
      setSaving(false);
    }
  }

  async function HandleDelete() {
    if (!selectedItem) {
      showWarning("Choose an item to delete first.");
      return;
    }

    const confirmed = window.confirm(
      `Delete "${selectedItem.title}"? This only works when the item has no holds or loan history.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      await FetchJson(`/api/items/manage/${selectedItem.itemId}`, {
        method: "DELETE",
      });

      showSuccess("Item deleted successfully.");
      setSelectedItemId(null);
      setSelectedItem(null);
      setFormState(emptyFormState);
      setRefreshKey((current) => current + 1);
    } catch (error) {
      showError(GetErrorMessage(error, "Failed to delete item."));
    } finally {
      setDeleting(false);
    }
  }

  function RenderSelectField(id, label, value, onChange, options) {
    return (
      <div>
        <label
          htmlFor={id}
          className="ml-1 text-sm font-semibold uppercase text-ink-soft"
        >
          {label}
        </label>
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={inputClassName}
          required
        >
          <option value="">Select {label}</option>
          {options.map((option) => {
            const { valueKey, labelKey } = BuildOptionKeys(option);

            return (
              <option key={option[valueKey]} value={option[valueKey]}>
                {option[labelKey]}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  return (
    <section className="space-y-4 pt-2 rounded-xl bg-mist/40 border border-ink/10 p-4 ">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-ink-deep">
          Manage Items
        </h2>
        <p className="mt-2 max-w-3xl text-base leading-7 text-ink/65">
          Search the existing inventory, update item details, or delete records
          that have no hold or loan history.
        </p>
      </div>

      <form
        onSubmit={HandleSearchSubmit}
        className="grid gap-4 border border-ink/10 bg-paper/80 p-4 pt-2 lg:grid-cols-[1.2fr_220px_auto_auto]"
      >
        <div>
          <label
            htmlFor="item-search"
            className="ml-1 text-sm font-semibold uppercase tracking-[0.1em] text-ink-soft"
          >
            Search by title, creator, publisher, or summary
          </label>
          <input
            id="item-search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className={inputClassName}
            placeholder="Search inventory"
          />
        </div>

        <div>
          <label
            htmlFor="item-category-filter"
            className="ml-1 text-sm font-semibold uppercase tracking-[0.1em] text-ink-soft"
          >
            Category
          </label>
          <select
            id="item-category-filter"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className={inputClassName}
          >
            <option value="all">All Categories</option>
            <option value="book">Books</option>
            <option value="periodical">Periodicals</option>
            <option value="audiovisualmedia">Audiovisual Media</option>
            <option value="equipment">Equipment</option>
          </select>
        </div>

        <div className="flex items-end">
          <PrimaryButton title="Search" type="submit" />
        </div>

        <div className="flex items-end">
          <SecondaryButton title="Reset" onClick={HandleResetFilters} />
        </div>
      </form>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="border border-ink/10 bg-paper/80 p-6 overflow-auto h-dvh">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-ink-deep">Inventory</h3>
            <span className="text-sm font-semibold text-ink/50">
              {items.length} items
            </span>
          </div>

          {listLoading ? (
            <p className="mt-4 font-medium text-ink/65">Loading items...</p>
          ) : null}

          {!listLoading && items.length === 0 ? (
            <p className="mt-4 font-medium text-ink/65">
              No items match the current filters.
            </p>
          ) : null}

          <div className="mt-4 space-y-3">
            {items.map((item) => {
              const isSelected = Number(item.itemId) === Number(selectedItemId);

              return (
                <button
                  key={item.itemId}
                  type="button"
                  onClick={() => setSelectedItemId(item.itemId)}
                  className={`w-full rounded-lg border px-4 py-2 text-left transition-all ${
                    isSelected
                      ? "border-ink-soft bg-mist shadow-md"
                      : "border-ink/20 bg-mist/40 hover:border-ink/30 hover:bg-mist-deep/50"
                  }`}
                >
                  <p className="font-bold text-ink-deep">{item.title}</p>
                  <p className="text-sm font-medium text-ink/65">
                    {BuildCategoryLabel(item.category)} · Item #{item.itemId}
                  </p>
                  <p className="mt-1 text-sm font-medium text-ink/70">
                    Total copies: {item.totalCopies}
                  </p>
                  <p className="text-xs text-ink/65">
                    Available {item.available} · On hold {item.onHold} ·
                    Unavailable {item.unavailable}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="border-y border-ink/10 bg-paper/80 py-8">
          {!selectedItemId ? (
            <div className="flex min-h-[18rem] items-center justify-center text-center font-medium text-ink/50">
              Choose an item from the left to edit or delete that record.
            </div>
          ) : detailLoading ? (
            <div className="flex min-h-[18rem] items-center justify-center font-medium text-ink/50">
              Loading item details...
            </div>
          ) : !selectedItem ? (
            <div className="flex min-h-[18rem] items-center justify-center font-medium text-ink/50">
              Item details are unavailable.
            </div>
          ) : (
            <form onSubmit={HandleSave} className="space-y-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full">
                  <h3 className="mt-2 text-3xl font-bold text-ink-deep">
                    {selectedItem.title}
                  </h3>
                  <span className="text-md font-bold uppercase text-ink-soft">
                    {BuildCategoryLabel(selectedItem.category)}:
                  </span>{" "}
                  <span className="text-md font-medium text-ink/50">
                    Item #{selectedItem.itemId}
                  </span>
                </div>

                <div className="flex gap-3">
                  <PrimaryButton
                    title={saving ? "Saving..." : "Save Changes"}
                    type="submit"
                    disabledValue={saving || deleting || optionsLoading}
                  />
                  <SecondaryButton
                    title={deleting ? "Deleting..." : "Delete Item"}
                    onClick={HandleDelete}
                    disabled={saving || deleting}
                  />
                </div>
              </div>

              <div className="grid gap-4 rounded-lg border border-ink/10 bg-mist/60 p-5 text-sm text-ink/65 md:grid-cols-4 items-center text-center justify-evenly">
                <div>
                  <span className="font-bold text-ink-deep">Available:</span>{" "}
                  {selectedItem.available}
                </div>
                <div>
                  <span className="font-bold text-ink-deep">On Hold:</span>{" "}
                  {selectedItem.onHold}
                </div>
                <div>
                  <span className="font-bold text-ink-deep">Unavailable:</span>{" "}
                  {selectedItem.unavailable}
                </div>
                <div>
                  <span className="font-bold text-ink-deep">
                    Locked Copies:
                  </span>{" "}
                  {lockedCopies}
                </div>
              </div>

              {optionsLoading ? (
                <p className="font-medium text-ink/65">
                  Loading form options...
                </p>
              ) : null}

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="title"
                    className="ml-1 text-sm font-semibold uppercase text-ink-soft"
                  >
                    {selectedItem.category === "equipment"
                      ? "Equipment Name"
                      : "Title"}
                  </label>
                  <input
                    id="title"
                    value={formState.title}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    className={inputClassName}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="totalCopies"
                    className="ml-1 text-sm font-semibold uppercase text-ink-soft"
                  >
                    Total Copies
                  </label>
                  <input
                    id="totalCopies"
                    type="number"
                    min={Math.max(1, lockedCopies)}
                    value={formState.totalCopies}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        totalCopies: event.target.value,
                      }))
                    }
                    className={inputClassName}
                    required
                  />
                </div>

                {selectedItem.category !== "equipment" ? (
                  <>
                    <div>
                      <label
                        htmlFor="shelfNumber"
                        className="ml-1 text-sm font-semibold uppercase text-ink-soft"
                      >
                        Shelf Number
                      </label>
                      <input
                        id="shelfNumber"
                        type="number"
                        min="1"
                        value={formState.shelfNumber}
                        onChange={(event) =>
                          setFormState((current) => ({
                            ...current,
                            shelfNumber: event.target.value,
                          }))
                        }
                        className={inputClassName}
                        required
                      />
                    </div>

                    {RenderSelectField(
                      "genreCode",
                      "Genre",
                      formState.genreCode,
                      (event) =>
                        setFormState((current) => ({
                          ...current,
                          genreCode: event.target.value,
                        })),
                      genres,
                    )}

                    {RenderSelectField(
                      "languageCode",
                      "Language",
                      formState.languageCode,
                      (event) =>
                        setFormState((current) => ({
                          ...current,
                          languageCode: event.target.value,
                        })),
                      languages,
                    )}

                    {RenderSelectField(
                      "formatCode",
                      selectedItem.category === "book"
                        ? "Book Type"
                        : selectedItem.category === "periodical"
                          ? "Periodical Type"
                          : "Media Type",
                      formState.formatCode,
                      (event) =>
                        setFormState((current) => ({
                          ...current,
                          formatCode: event.target.value,
                        })),
                      formatOptions,
                    )}

                    <div>
                      <label
                        htmlFor="publisher"
                        className="ml-1 text-sm font-semibold uppercase text-ink-soft"
                      >
                        Publisher
                      </label>
                      <input
                        id="publisher"
                        value={formState.publisher}
                        onChange={(event) =>
                          setFormState((current) => ({
                            ...current,
                            publisher: event.target.value,
                          }))
                        }
                        className={inputClassName}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="publicationDate"
                        className="ml-1 text-sm font-semibold uppercase text-ink-soft"
                      >
                        Publication Date
                      </label>
                      <input
                        id="publicationDate"
                        type="date"
                        value={formState.publicationDate}
                        onChange={(event) =>
                          setFormState((current) => ({
                            ...current,
                            publicationDate: event.target.value,
                          }))
                        }
                        className={inputClassName}
                        required
                      />
                    </div>

                    {selectedItem.category === "book" ? (
                      <>
                        <div>
                          <label
                            htmlFor="authorFirstName"
                            className="ml-1 text-sm font-semibold uppercase text-ink-soft"
                          >
                            Author First Name
                          </label>
                          <input
                            id="authorFirstName"
                            value={formState.authorFirstName}
                            onChange={(event) =>
                              setFormState((current) => ({
                                ...current,
                                authorFirstName: event.target.value,
                              }))
                            }
                            className={inputClassName}
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="authorLastName"
                            className="ml-1 text-sm font-semibold uppercase text-ink-soft"
                          >
                            Author Last Name
                          </label>
                          <input
                            id="authorLastName"
                            value={formState.authorLastName}
                            onChange={(event) =>
                              setFormState((current) => ({
                                ...current,
                                authorLastName: event.target.value,
                              }))
                            }
                            className={inputClassName}
                            required
                          />
                        </div>
                      </>
                    ) : null}

                    {selectedItem.category === "audiovisualmedia" ? (
                      <div>
                        <label
                          htmlFor="runtime"
                          className="ml-1 text-sm font-semibold uppercase text-ink-soft"
                        >
                          Runtime (mins)
                        </label>
                        <input
                          id="runtime"
                          type="number"
                          min="1"
                          value={formState.runtime}
                          onChange={(event) =>
                            setFormState((current) => ({
                              ...current,
                              runtime: event.target.value,
                            }))
                          }
                          className={inputClassName}
                          required
                        />
                      </div>
                    ) : null}

                    <div className="md:col-span-2">
                      <label
                        htmlFor="summary"
                        className="ml-1 text-sm font-semibold uppercase text-ink-soft"
                      >
                        Summary
                      </label>
                      <textarea
                        id="summary"
                        value={formState.summary}
                        onChange={(event) =>
                          setFormState((current) => ({
                            ...current,
                            summary: event.target.value,
                          }))
                        }
                        className={`${inputClassName} min-h-32 resize-y`}
                        required
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2 ">
                      <FileUploadField
                        id="coverImageFile"
                        label="Upload Cover Image (Optional)"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        selectedFileName={selectedImageName}
                        onChange={(event) => {
                          const nextFile = event.target.files?.[0] ?? null;
                          setSelectedImageFile(nextFile);
                          setSelectedImageName(nextFile?.name ?? "");
                        }}
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
