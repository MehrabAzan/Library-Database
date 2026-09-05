import { SubmitButton } from "../components/Buttons";
import { useMessage } from "../hooks/useMessage";
import { FetchJson } from "../api";

export default function Equipment() {
  const { showSuccess, showError } = useMessage();
  return (
    <section className="border-y border-ink/10 bg-paper/80 py-6 px-2">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-deep">Catalog entry</p>
          <h2 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight text-ink-deep mt-2 text-3xl">Equipment Entry</h2>
        </div>
        <div className="max-w-md space-y-1 text-right">
          <p className="text-sm leading-6 text-ink/65">
            Enter equipment information below.
          </p>
          <p className="text-xs italic text-ink/50">
            Image upload is not enabled for equipment yet.
          </p>
        </div>
      </div>
      <div className="flex gap-4 flex-wrap justify-evenly mt-4">
        <form
          className="w-full"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);

            const equipmentData = {
              title: formData.get("title"),
              available: formData.get("available"),
            };

            try {
              await FetchJson("/api/itementry/equipment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(equipmentData),
              });

              showSuccess("Equipment entry successful!");
              setTimeout(() => {
                window.location.reload();
              }, 800);
            } catch (error) {
              console.error(error);
              showError(error.message || "Equipment entry failed.");
            }
          }}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-x-6">
              <div className="col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-bold text-ink/70 uppercase tracking-wide mb-2"
                >
                  Name
                </label>
                <div>
                  <input
                    required
                    id="title"
                    name="title"
                    placeholder="e.g. Sony Camera"
                    className="block w-full rounded-lg border border-ink/20 bg-white px-4 py-2 text-sm text-ink-deep outline-none focus:ring-2 focus:ring-ink-soft transition-all"
                  />
                </div>
              </div>
              <div className="sm:col-span-1">
                <label
                  htmlFor="available"
                  className="block text-sm font-bold text-ink/70 uppercase tracking-wide mb-2"
                >
                  Copies
                </label>
                <div>
                  <input
                    required
                    type="number"
                    id="available"
                    name="available"
                    placeholder="1"
                    min="1"
                    className="block w-full rounded-lg border border-ink/20 bg-white px-4 py-2 text-sm text-ink-deep outline-none focus:ring-2 focus:ring-ink-soft transition-all"
                  />
                </div>
              </div>
              <div className="flex items-end w-full">
                <SubmitButton title={"Submit"} value={"OK"} fullwidth={true} />
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
