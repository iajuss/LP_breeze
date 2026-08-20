"use client";

import { useEffect, useRef, useState } from "react";

const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function formatTypedDate(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function parseTypedDate(value: string) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return null;
  const [day, month, year] = value.split("/").map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return `${year}-${pad(month)}-${pad(day)}`;
}

function dateFromIso(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

type DesktopDatePickerProps = {
  value: string;
  onChange: (value: string) => void;
};

export function DesktopDatePicker({ value, onChange }: DesktopDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(() => formatIsoDate(value));
  const [month, setMonth] = useState(() => value ? dateFromIso(value) : new Date());
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setText(formatIsoDate(value));
    if (value) setMonth(dateFromIso(value));
  }, [value]);

  useEffect(() => {
    const closeOnOutsidePointer = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsidePointer);
    return () => document.removeEventListener("mousedown", closeOnOutsidePointer);
  }, []);

  const firstWeekday = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const selectedDate = parseTypedDate(text);

  const selectDate = (day: number) => {
    const isoDate = `${month.getFullYear()}-${pad(month.getMonth() + 1)}-${pad(day)}`;
    setText(formatIsoDate(isoDate));
    onChange(isoDate);
    setOpen(false);
  };

  const updateText = (nextValue: string) => {
    const formatted = formatTypedDate(nextValue);
    setText(formatted);
    const isoDate = parseTypedDate(formatted);
    if (isoDate) onChange(isoDate);
    if (!formatted) onChange("");
  };

  return (
    <div className="relative mt-1" ref={pickerRef}>
      <input aria-label="Quando" className="search-field block w-full rounded-lg bg-transparent py-1 pr-9 text-base font-semibold outline-none transition hover:bg-[var(--secondary)]/70 focus:bg-[var(--secondary)] focus:text-[var(--primary)] focus:outline-none focus-visible:outline-none" inputMode="numeric" maxLength={10} onChange={(event) => updateText(event.target.value)} onFocus={() => setOpen(true)} onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }} placeholder="dd/mm/aaaa" type="text" value={text} />
      <button aria-expanded={open} aria-haspopup="dialog" aria-label="Abrir calendário" className="absolute inset-y-0 right-0 inline-flex w-8 items-center justify-center rounded-lg text-[var(--foreground)] hover:bg-[var(--secondary)] focus-visible:bg-[var(--secondary)] focus-visible:outline-none" onClick={() => setOpen((current) => !current)} type="button">
        <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect height="16" rx="2" width="18" x="3" y="5" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>
      </button>
      {open ? <div aria-label="Calendário" className="absolute -left-4 -right-4 top-full z-30 mt-2 rounded-xl bg-[var(--primary)] p-3 text-white shadow-2xl shadow-black/20" role="dialog">
        <div className="flex items-center justify-between gap-2">
          <button aria-label="Mês anterior" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/15 focus-visible:outline-white" onClick={() => setMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))} type="button">‹</button>
          <p className="text-sm font-semibold">{monthNames[month.getMonth()]} de {month.getFullYear()}</p>
          <button aria-label="Próximo mês" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/15 focus-visible:outline-white" onClick={() => setMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))} type="button">›</button>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs" role="grid">
          {weekDays.map((day, index) => <span className="py-1 text-white/60" key={`${day}-${index}`}>{day}</span>)}
          {Array.from({ length: firstWeekday }).map((_, index) => <span key={`empty-${index}`} />)}
          {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => {
            const isoDate = `${month.getFullYear()}-${pad(month.getMonth() + 1)}-${pad(day)}`;
            return <button aria-label={`Selecionar dia ${day} de ${monthNames[month.getMonth()]}`} className={`h-8 rounded-lg text-sm transition hover:bg-white/15 focus-visible:outline-white ${selectedDate === isoDate ? "bg-white text-[var(--primary)]" : ""}`} key={day} onClick={() => selectDate(day)} type="button">{day}</button>;
          })}
        </div>
      </div> : null}
    </div>
  );
}
