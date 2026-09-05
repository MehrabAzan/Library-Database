export default function InputComponent({
  required = true,
  pattern = "",
  min = 1,
  max = 50,
  type = "",
  id,
  label,
  colspan = 1,
  placeholder = "",
}) {
  return (
    <div className={`col-span-${colspan}`}>
      <label htmlFor={id} className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-wide text-ink/70">
        {label}
      </label>
      <div className="mt-1">
        {type === "number" ? (
          <input
            required={required}
            pattern={pattern}
            type={type}
            id={id}
            name={id}
            min={min}
            max={max}
            placeholder={placeholder}
            className="block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)]"
          />
        ) : type === "date" ? (
          <input
            required={required}
            pattern={pattern}
            type={type}
            id={id}
            name={id}
            className="block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)]"
          />
        ) : type === "textarea" ? (
          <textarea
            required={required}
            id={id}
            name={id}
            rows={4}
            minLength={min}
            maxLength={max}
            placeholder={placeholder}
            className="block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)]"
          />
        ) : (
          <input
            required={required}
            pattern={pattern}
            type={type}
            id={id}
            name={id}
            minLength={min}
            maxLength={max}
            placeholder={placeholder}
            className="block w-full rounded-lg border border-ink/20 bg-white px-[0.9rem] py-[0.65rem] text-[0.9375rem] text-ink shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:border-ink-soft focus:shadow-[0_0_0_3px_rgb(20_85_95_/_0.18)]"
          />
        )}
      </div>
    </div>
  );
}
