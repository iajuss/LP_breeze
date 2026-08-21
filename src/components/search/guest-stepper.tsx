type GuestStepperProps = {
  value: number;
  onChange: (value: number) => void;
};

const clamp = (value: number) => Math.min(5000, Math.max(1, value));

export function GuestStepper({ value, onChange }: GuestStepperProps) {
  const type = (nextValue: string) => {
    const digits = nextValue.replace(/\D/g, "").slice(0, 4);
    onChange(digits ? clamp(Number(digits)) : 0);
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] p-3">
      <span className="font-medium">Pessoas</span>
      <div className="flex items-center gap-2">
        <button aria-label="Diminuir pessoas" className="min-h-11 min-w-11 rounded-full border border-[var(--border)]" disabled={value <= 1} onClick={() => onChange(clamp(value - 1))} type="button">−</button>
        <input aria-label="Quantidade de pessoas" className="search-field min-h-11 w-16 [appearance:textfield] rounded-xl bg-[var(--background)] px-2 text-center font-semibold text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] hover:bg-[var(--secondary)] focus:bg-[var(--secondary)] focus:text-[var(--primary)] focus:outline-none focus-visible:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" inputMode="numeric" max="5000" min="1" onChange={(event) => type(event.target.value)} placeholder="1" type="number" value={value || ""} />
        <button aria-label="Aumentar pessoas" className="min-h-11 min-w-11 rounded-full border border-[var(--border)]" onClick={() => onChange(clamp((value || 0) + 1))} type="button">+</button>
      </div>
    </div>
  );
}
