export default function Dropdown({ name, options }) {
  const inputClasses = "block w-full rounded-2xl border border-ink/20 bg-white px-3 py-2 text-sm text-ink-deep shadow-sm outline-none focus:ring-2 focus:ring-ink-soft transition-all";
  const labelClasses = "block text-sm font-bold text-ink/80 uppercase tracking-wide mb-2";

  return (
    <div>
      <label htmlFor={name} className={labelClasses}>{name}</label>
      <div className="mt-1">
        <select
          id={name}
          name={name}
          className={inputClasses}
        >
          {options.map((option, index) => (
            <option
              key={index}
              value={option}
              className="text-ink-deep"
            >
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function DisabledDropdown({ name }) {
  const inputClasses = "block w-full rounded-2xl border border-ink/15 bg-mist px-3 py-2 text-sm text-ink/40 shadow-sm outline-none cursor-not-allowed";
  const labelClasses = "block text-sm font-bold text-ink/40 uppercase tracking-wide mb-2";

  return (
    <div>
      <label htmlFor={name} className={labelClasses}>Loading {name}...</label>
      <div className="mt-1">
        <select
          required
          disabled
          id={name}
          name={name}
          className={inputClasses}
        ></select>
      </div>
    </div>
  );
}

export function ObjectDropdown({ name, options }) {
  const inputClasses = "block w-full rounded-2xl border border-ink/20 bg-white px-3 py-2 text-sm text-ink-deep shadow-sm outline-none focus:ring-2 focus:ring-ink-soft transition-all";
  const labelClasses = "block text-sm font-bold text-ink/80 uppercase tracking-wide mb-2";

  if (!Array.isArray(options) || options.length === 0) {
    return <DisabledDropdown name={name} />;
  }

  const keys = Object.keys(options[0] ?? {});
  const code = keys[0];
  const term = keys[1] ?? keys[0];

  if (!code) {
    return <DisabledDropdown name={name} />;
  }

  return (
    <div>
      <label htmlFor={name} className={labelClasses}>{name}</label>
      <div className="mt-1">
        <select
          required
          id={name}
          name={name}
          className={inputClasses}
        >
          {options.map((option) => {
            return (
              <option
                key={option[code]}
                value={option[code]}
                className="text-ink-deep"
              >
                {option[term]}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}