export default function PrimaryButton({
  title,
  disabledValue = false,
  onClick,
  type = "button",
}) {
  return (
    <div className="inline">
      <button
        type={type}
        disabled={disabledValue}
        onClick={onClick}
        className="dh-btn dh-btn-primary"
      >
        {title}
      </button>
    </div>
  );
}

export function SubmitButton({
  title,
  disabledValue = false,
  onClick,
  fullwidth = false,
  halfwidth = false,
}) {
  return (
    <div className={fullwidth ? "w-full" : halfwidth ? "w-1/2" : null}>
      <button
        type="submit"
        disabled={disabledValue}
        onClick={onClick}
        className="dh-btn dh-btn-primary w-full"
      >
        {title}
      </button>
    </div>
  );
}

export function SecondaryButton({ title, onClick, disabled = false }) {
  return (
    <div className="inline">
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="dh-btn dh-btn-secondary"
      >
        {title}
      </button>
    </div>
  );
}
