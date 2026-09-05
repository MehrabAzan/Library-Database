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
      <label htmlFor={id} className="dh-label">
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
            className="dh-input"
          />
        ) : type === "date" ? (
          <input
            required={required}
            pattern={pattern}
            type={type}
            id={id}
            name={id}
            className="dh-input"
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
            className="dh-input"
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
            className="dh-input"
          />
        )}
      </div>
    </div>
  );
}
