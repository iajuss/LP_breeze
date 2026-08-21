"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { GuestStepper } from "./guest-stepper";
import { activityOptions, locationOptions } from "@/data/search-options";
import type { SearchErrors, SearchValues } from "./search-types";

type MobileSearchSheetProps = {
  open: boolean;
  values: SearchValues;
  errors: SearchErrors;
  onClose: () => void;
  onChange: (values: SearchValues) => void;
  onSubmit: () => void;
};

export function MobileSearchSheet({ open, values, errors, onClose, onChange, onSubmit }: MobileSearchSheetProps) {
  const [step, setStep] = useState(0);
  const next = () => setStep((current) => Math.min(4, current + 1));
  const previous = () => setStep((current) => Math.max(0, current - 1));
  const close = () => {
    setStep(0);
    onClose();
  };

  const messages = [errors.activity, errors.location, errors.guests].filter(Boolean) as string[];

  const body = [
    <div key="activity" className="space-y-3"><p className="text-sm text-[var(--muted)]">Etapa 1 de 4</p><p className="text-sm text-[var(--muted)]">{values.activity ? `${values.activity} selecionada` : "Escolha a ocasião"}</p><div className="grid grid-cols-2 gap-2">{activityOptions.map((activity) => <button className="min-h-11 rounded-xl border border-[var(--border)] px-3 text-left font-medium hover:border-[var(--primary)]" key={activity} onClick={() => { onChange({ ...values, activity }); next(); }} type="button">{activity}</button>)}</div></div>,
    <label key="location" className="block space-y-3"><span className="text-sm text-[var(--muted)]">Etapa 2 de 4 · Onde será?</span><input autoFocus className="min-h-12 w-full rounded-xl border border-[var(--border)] px-4" list="mobile-sao-paulo-locations" onChange={(event) => onChange({ ...values, location: event.target.value })} placeholder="São Paulo ou um bairro" value={values.location} /><datalist id="mobile-sao-paulo-locations">{locationOptions.map((location) => <option key={location} value={location} />)}</datalist></label>,
    <label key="date" className="block space-y-3"><span className="text-sm text-[var(--muted)]">Etapa 3 de 4 · Quando?</span><input className="min-h-12 w-full rounded-xl border border-[var(--border)] px-4" onChange={(event) => onChange({ ...values, date: event.target.value })} type="date" value={values.date} /><p className="text-sm text-[var(--muted)]">Você pode deixar a data em aberto.</p></label>,
    <div key="guests" className="space-y-3"><p className="text-sm text-[var(--muted)]">Etapa 4 de 4 · Quantas pessoas?</p><GuestStepper onChange={(guests) => onChange({ ...values, guests })} value={values.guests} /></div>,
    <div key="review" className="space-y-4"><p className="text-sm text-[var(--muted)]">Revise sua busca</p><dl className="space-y-2 text-sm"><div className="flex justify-between gap-4"><dt>Ocasião</dt><dd>{values.activity || "Não definida"}</dd></div><div className="flex justify-between gap-4"><dt>Local</dt><dd>{values.location || "Não definido"}</dd></div><div className="flex justify-between gap-4"><dt>Pessoas</dt><dd>{values.guests || "Não definidas"}</dd></div></dl>{messages.length ? <div className="rounded-xl border border-[var(--destructive)] bg-white p-4" role="alert"><p className="text-sm font-semibold text-[var(--destructive)]">Complete os filtros para buscar espaços.</p><ul className="mt-2 space-y-1 text-sm text-[var(--foreground)]">{messages.map((message) => <li key={message}>· {message}</li>)}</ul></div> : null}</div>,
  ][step];

  return <Dialog onClose={close} open={open} title="Encontre seu espaço"><div className="space-y-6">{body}<div className="flex gap-3">{step === 0 ? <button className="min-h-11 rounded-xl border border-[var(--border)] px-4 font-semibold" onClick={close} type="button">Cancelar</button> : <button className="min-h-11 rounded-xl border border-[var(--border)] px-4 font-semibold" onClick={previous} type="button">Voltar</button>}{step < 4 ? <button className="min-h-11 flex-1 rounded-xl bg-[var(--primary)] px-4 font-semibold text-white" onClick={next} type="button">Continuar</button> : <button className="min-h-11 flex-1 rounded-xl bg-[var(--primary)] px-4 font-semibold text-white" onClick={onSubmit} type="button">Buscar espaços</button>}</div></div></Dialog>;
}
