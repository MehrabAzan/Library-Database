const btn =
  "inline-flex items-center justify-center gap-2 rounded-lg px-[1.15rem] py-[0.65rem] text-sm font-semibold leading-tight transition-[background-color,color,border-color,transform] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass active:enabled:translate-y-px disabled:cursor-not-allowed disabled:opacity-50";

const btnPrimary = `${btn} bg-ink text-paper hover:enabled:bg-ink-soft`;
const btnSecondary = `${btn} border border-ink/20 bg-transparent text-ink hover:enabled:border-ink/35 hover:enabled:bg-ink/5`;

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
        className={btnPrimary}
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
        className={`${btnPrimary} w-full`}
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
        className={btnSecondary}
      >
        {title}
      </button>
    </div>
  );
}
