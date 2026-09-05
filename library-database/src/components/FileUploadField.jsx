export default function FileUploadField({
  id,
  label,
  selectedFileName = "",
  accept = "",
  onChange,
}) {
  const statusText = selectedFileName || "No file selected.";

  // Standardized high-visibility classes
  const containerClasses = 
    "mt-2 flex items-center gap-4 rounded-2xl border border-ink/20 bg-white px-4 py-2 shadow-sm transition-all focus-within:ring-2 focus-within:ring-ink-soft";
  
  const labelClasses = 
    "block text-sm font-bold text-ink/80 uppercase tracking-wide mb-1";

  const buttonClasses = 
    "inline-flex shrink-0 cursor-pointer rounded-xl bg-mist px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ink/80 transition hover:bg-ink hover:text-white border border-ink/15";

  return (
    <div>
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      <div className={containerClasses}>
        <label
          htmlFor={id}
          className={buttonClasses}
        >
          Browse...
        </label>
        <span className="min-w-0 truncate text-sm font-medium text-ink/50">
          {statusText}
        </span>
        <input
          id={id}
          name={id}
          type="file"
          accept={accept}
          onChange={onChange}
          className="sr-only"
        />
      </div>
    </div>
  );
}