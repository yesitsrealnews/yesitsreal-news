export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="absolute -left-[10000px] top-auto h-0 w-0 overflow-hidden" aria-hidden>
      <label htmlFor="company_url">Company website</label>
      <input
        id="company_url"
        name="company_url"
        tabIndex={-1}
        autoComplete="off"
        suppressHydrationWarning
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
