"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { DesktopDatePicker } from "./desktop-date-picker";
import type { SearchErrors, SearchValues } from "./search-types";

const activities = ["Festa", "Casamento", "Evento corporativo", "Reunião", "Workshop", "Produção"];

type DesktopSearchFormProps = {
  values: SearchValues;
  errors: SearchErrors;
  feedbackId?: string;
  onChange: (values: SearchValues) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function DesktopSearchForm({ values, errors, feedbackId, onChange, onSubmit }: DesktopSearchFormProps) {
  const [activityMenuOpen, setActivityMenuOpen] = useState(false);
  const activityMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsidePointer = (event: MouseEvent) => {
      if (activityMenuRef.current && !activityMenuRef.current.contains(event.target as Node)) setActivityMenuOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsidePointer);
    return () => document.removeEventListener("mousedown", closeOnOutsidePointer);
  }, []);

  const chooseActivity = (activity: string) => {
    onChange({ ...values, activity });
    setActivityMenuOpen(false);
  };

  return (
    <form className="hidden w-full grid-cols-[1.15fr_1fr_0.9fr_0.8fr_auto] rounded-2xl bg-white p-2 text-[var(--foreground)] shadow-xl lg:grid" onSubmit={onSubmit}>
      <div className="relative border-r border-[var(--border)] px-4 py-2 text-sm font-medium" ref={activityMenuRef}>
        <span>O que você está planejando?</span>
        <div className="relative">
          <button aria-describedby={errors.activity ? feedbackId : undefined} aria-expanded={activityMenuOpen} aria-haspopup="listbox" aria-label={`O que você está planejando? ${values.activity || "Escolha uma ocasião"}`} className="mt-1 flex w-full items-center justify-between rounded-lg py-1 text-left text-base font-semibold text-[var(--foreground)] transition hover:bg-[var(--secondary)]/70 focus-visible:outline-[var(--primary)]" onClick={() => setActivityMenuOpen((open) => !open)} onKeyDown={(event) => { if (event.key === "Escape") setActivityMenuOpen(false); if (event.key === "ArrowDown") setActivityMenuOpen(true); }} type="button">
            <span>{values.activity || "Escolha uma ocasião"}</span>
            <span aria-hidden="true" className={`ml-3 text-sm transition-transform ${activityMenuOpen ? "rotate-180" : ""}`}>⌄</span>
          </button>
          {activityMenuOpen ? <div className="absolute -left-4 -right-4 top-full z-30 mt-2 rounded-xl bg-[var(--primary)] p-2 text-white shadow-2xl shadow-black/20" role="listbox">
            {activities.map((activity) => <button aria-selected={values.activity === activity} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition hover:bg-white/15 focus-visible:outline-white ${values.activity === activity ? "bg-white/15" : ""}`} key={activity} onClick={() => chooseActivity(activity)} role="option" type="button"><span>{activity}</span>{values.activity === activity ? <span aria-label="Selecionada">✓</span> : null}</button>)}
          </div> : null}
        </div>
      </div>
      <label className="border-r border-[var(--border)] px-4 py-2 text-sm font-medium">Onde?
        <input aria-describedby={errors.location ? feedbackId : undefined} aria-invalid={Boolean(errors.location)} className="search-field mt-1 block w-full rounded-lg bg-transparent py-1 text-base font-semibold outline-none transition placeholder:text-[var(--muted)] hover:bg-[var(--secondary)]/70 focus:bg-[var(--secondary)] focus:text-[var(--primary)] focus:outline-none focus-visible:outline-none" onChange={(event) => onChange({ ...values, location: event.target.value })} placeholder="Cidade, bairro ou região" value={values.location} />
      </label>
      <div className="border-r border-[var(--border)] px-4 py-2 text-sm font-medium">Quando?
        <DesktopDatePicker onChange={(date) => onChange({ ...values, date })} value={values.date} />
      </div>
      <label className="px-4 py-2 text-sm font-medium">Pessoas
        <input aria-describedby={errors.guests ? feedbackId : undefined} aria-invalid={Boolean(errors.guests)} className="search-field mt-1 block w-full [appearance:textfield] rounded-lg bg-transparent py-1 text-base font-semibold outline-none transition placeholder:text-[var(--muted)] hover:bg-[var(--secondary)]/70 focus:bg-[var(--secondary)] focus:text-[var(--primary)] focus:outline-none focus-visible:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" min="1" onChange={(event) => onChange({ ...values, guests: Number(event.target.value) })} placeholder="Convidados" type="number" value={values.guests || ""} />
      </label>
      <button className="min-h-11 rounded-xl bg-[var(--primary)] px-6 font-semibold text-white transition hover:bg-[#103d35]" type="submit">Buscar espaços</button>
    </form>
  );
}
