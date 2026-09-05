import { SubmitButton } from "../components/Buttons";
import { ObjectDropdown, DisabledDropdown } from "../components/Dropdown";
import { FetchJson, GetErrorMessage, UploadImageFile } from "../api";
import { useMessage } from "../hooks/useMessage";
import { useEffect, useState } from "react";
import FileUploadField from "../components/FileUploadField";

export default function Periodicals() {
  const [languages, setLanguages] = useState([]);
  const [genres, setGenres] = useState([]);
  const [format, setFormat] = useState([]);
  const { showSuccess, showError, showWarning } = useMessage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function LoadDropdowns() {
      try {
        setLoading(true);
        const languageData = await FetchJson("/api/languages");
        setLanguages(languageData);
        const genreData = await FetchJson("/api/genres");
        setGenres(genreData);
        const formatData = await FetchJson("/api/periodical_types");
        setFormat(formatData);
      } catch (err) {
        setError(GetErrorMessage(err, "Failed to load dropdowns."));
      } finally {
        setLoading(false);
      }
    }
    LoadDropdowns();
  }, []);

  return (
    <section className="border-y border-ink/10 bg-paper/80 py-6 px-2">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">Catalog entry</p>
          <h2 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight text-ink-deep mt-2 text-3xl">Periodical Entry</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-ink/65">
          Enter periodical information below.
        </p>
      </div>

      <div className="mt-4">
        <form
          className="w-full"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            let coverImageUrl = "";

            const title = formData.get("title");
            const publisher = formData.get("publisher");
            const publicationdate = formData.get("publicationdate");
            const available = formData.get("available");
            const shelfnumber = formData.get("shelfnumber");

            if (
              !title ||
              !publisher ||
              !publicationdate ||
              !available ||
              !shelfnumber
            ) {
              showWarning("Please fill in all required fields.");
              return;
            }

            try {
              setSubmitting(true);
              if (selectedImageFile) {
                const uploadResult = await UploadImageFile(selectedImageFile);
                coverImageUrl =
                  String(uploadResult?.url ?? "").trim() || coverImageUrl;
              }

              const periodicalData = {
                title,
                available,
                shelfnumber,
                genre: formData.get("genre"),
                language: formData.get("language"),
                format: formData.get("format"),
                publisher,
                publicationdate,
                summary: formData.get("summary"),
                coverImageUrl,
              };

              await FetchJson("/api/itementry/periodical", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(periodicalData),
              });

              showSuccess("Periodical entry successful!");
              e.target.reset();
              setSelectedImageFile(null);
              setSelectedImageName("");
            } catch (error) {
              showError(error.message || "Periodical entry failed.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <div className="space-y-4">
            {/* Header Grid */}
            <div className="grid grid-cols-4 gap-6">
              <div className="col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-bold text-ink/70 uppercase tracking-wide mb-2"
                >
                  Title
                </label>
                <input
                  required
                  id="title"
                  name="title"
                  placeholder="Periodical Title"
                  className="block w-full rounded-lg border border-ink/20 bg-white px-4 py-2 text-sm text-ink-deep outline-none focus:ring-2 focus:ring-ink-soft transition-all"
                />
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="available"
                  className="block text-sm font-bold text-ink/70 uppercase tracking-wide mb-2"
                >
                  Copies
                </label>
                <input
                  required
                  type="number"
                  id="available"
                  name="available"
                  placeholder="Copy Count"
                  min="1"
                  className="block w-full rounded-lg border border-ink/20 bg-white px-4 py-2 text-sm text-ink-deep outline-none focus:ring-2 focus:ring-ink-soft transition-all"
                />
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="shelfnumber"
                  className="block text-sm font-bold text-ink/70 uppercase tracking-wide mb-2"
                >
                  Shelf
                </label>
                <input
                  required
                  type="number"
                  id="shelfnumber"
                  name="shelfnumber"
                  placeholder="Shelf No."
                  min="1"
                  className="block w-full rounded-lg border border-ink/20 bg-white px-4 py-2 text-sm text-ink-deep outline-none focus:ring-2 focus:ring-ink-soft transition-all"
                />
              </div>
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-3 gap-6">
              {loading && !error && (
                <>
                  <DisabledDropdown name="genres" />
                  <DisabledDropdown name="languages" />
                  <DisabledDropdown name="formats" />
                </>
              )}
              {!loading && error && (
                <div className="rounded-lg border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">
                  {error}
                </div>
              )}
              {!loading && !error && (
                <>
                  <ObjectDropdown name="genre" options={genres} />
                  <ObjectDropdown name="language" options={languages} />
                  <ObjectDropdown name="format" options={format} />
                </>
              )}
            </div>

            {/* Publisher Info */}
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <label
                  htmlFor="publisher"
                  className="block text-sm font-bold text-ink/70 uppercase tracking-wide mb-2"
                >
                  Publisher
                </label>
                <input
                  required
                  id="publisher"
                  name="publisher"
                  placeholder="Publishing Co."
                  className="block w-full rounded-lg border border-ink/20 bg-white px-4 py-2 text-sm text-ink-deep outline-none focus:ring-2 focus:ring-ink-soft transition-all"
                />
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="publicationdate"
                  className="block text-sm font-bold text-ink/70 uppercase tracking-wide mb-2"
                >
                  Release Date
                </label>
                <input
                  required
                  id="publicationdate"
                  name="publicationdate"
                  type="date"
                  className="block w-full rounded-lg border border-ink/20 bg-white px-4 py-2 text-sm text-ink-deep outline-none focus:ring-2 focus:ring-ink-soft transition-all"
                />
              </div>
            </div>
            <div className="grid colspan-3 grid-cols-2 gap-6">
              {/* Summary */}
              <div>
                <label
                  htmlFor="summary"
                  className="block text-sm font-bold text-ink/70 uppercase tracking-wide mb-2"
                >
                  Summary
                </label>
                <textarea
                  required
                  id="summary"
                  name="summary"
                  rows="5"
                  placeholder="Brief description..."
                  className="block w-full rounded-lg border border-ink/20 bg-white px-4 py-2 text-sm text-ink-deep outline-none focus:ring-2 focus:ring-ink-soft transition-all"
                />
              </div>
              {/* File Upload */}
              <div className="rounded-lg mt-7 border-2 border-dashed border-ink/10 p-4 bg-mist/50">
                <FileUploadField
                  id="coverImageFile"
                  label="Cover Image"
                  accept="image/*"
                  selectedFileName={selectedImageName}
                  onChange={(event) => {
                    const nextFile = event.target.files?.[0] ?? null;
                    setSelectedImageFile(nextFile);
                    setSelectedImageName(nextFile?.name ?? "");
                  }}
                />
              </div>
            </div>
            {/* Submit */}
            <div className="pt-4 flex justify-center">
              <SubmitButton
                title={submitting ? "Processing..." : "Submit Periodical"}
                value={"OK"}
                halfwidth={true}
                disabledValue={submitting}
              />
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
