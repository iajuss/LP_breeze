"use client";

import { useState } from "react";
import { DesktopDatePicker } from "@/components/search/desktop-date-picker";
import type { VenueFilters } from "@/lib/venue-results";

type SearchRefinementFormProps = {
  values: VenueFilters & { date?: string };
};

const fieldClassName = "min-h-11 w-full rounded-xl border border-transparent bg-[var(--secondary)] px-3 font-medium text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] hover:bg-[#dce8df] focus:bg-[#dce8df] focus:text-[var(--primary)] focus:outline-none focus-visible:outline-none";

export function SearchRefinementForm({ values }: SearchRefinementFormProps) {
  const [date, setDate] = useState(values.date ?? "");

  return <form action="/buscar" className="space-y-4 border-t border-[var(--border)] pt-6">
    {values.activity ? <input name="activity" type="hidden" value={values.activity} /> : null}
    {values.location ? <input name="location" type="hidden" value={values.location} /> : null}
    {values.style ? <input name="style" type="hidden" value={values.style} /> : null}
    <label className="block text-sm font-semibold text-[var(--foreground)]">Outra quantidade de pessoas
      <input aria-label="Outra quantidade de pessoas" className={`${fieldClassName} mt-2 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`} defaultValue={values.guests} inputMode="numeric" max="5000" min="1" name="guests" placeholder="Ex.: 120" type="number" />
    </label>
    <div className="relative z-10">
      <p className="text-sm font-semibold text-[var(--foreground)]">Data do evento</p>
      <DesktopDatePicker ariaLabel="Data do evento" className={`${fieldClassName} mt-2 pr-10`} menuClassName="left-0 right-0" onChange={setDate} value={date} />
      <input name="date" type="hidden" value={date} />
    </div>
    <button className="min-h-11 w-full rounded-xl bg-[var(--primary)] px-4 font-semibold text-white transition hover:bg-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]" type="submit">Aplicar filtros</button>
  </form>;
}
