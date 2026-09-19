/**
 * Spam-trap field: off-screen and hidden from assistive tech, so only bots
 * that fill every input put a value in it. Read it back by `id`.
 */
export default function Honeypot({
  id,
  value,
  onChange,
}: {
  id: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
      <label htmlFor={id}>Leave this field blank</label>
      <input
        id={id}
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...(onChange ? { value: value ?? "", onChange: (e) => onChange(e.target.value) } : {})}
      />
    </div>
  );
}
