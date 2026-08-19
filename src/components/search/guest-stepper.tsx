type GuestStepperProps = {
  value: number;
  onChange: (value: number) => void;
};

export function GuestStepper({ value, onChange }: GuestStepperProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3">
      <span className="font-medium">Pessoas</span>
      <div className="flex items-center gap-3">
        <button aria-label="Diminuir pessoas" className="min-h-11 min-w-11 rounded-full border border-[var(--border)]" disabled={value <= 1} onClick={() => onChange(Math.max(1, value - 1))} type="button">−</button>
        <output aria-live="polite" className="min-w-8 text-center font-semibold">{value || 1}</output>
        <button aria-label="Aumentar pessoas" className="min-h-11 min-w-11 rounded-full border border-[var(--border)]" onClick={() => onChange(Math.min(5000, (value || 1) + 1))} type="button">+</button>
      </div>
    </div>
  );
}
