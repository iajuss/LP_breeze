import type { FormEvent } from "react";
import type { SearchErrors, SearchValues } from "./search-types";

const activities = ["Festa", "Casamento", "Evento corporativo", "Reunião", "Workshop", "Produção"];

type DesktopSearchFormProps = {
  values: SearchValues;
  errors: SearchErrors;
  onChange: (values: SearchValues) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function DesktopSearchForm({ values, errors, onChange, onSubmit }: DesktopSearchFormProps) {
  return (
    <form className="hidden w-full grid-cols-[1.15fr_1fr_0.9fr_0.8fr_auto] rounded-2xl bg-white p-2 shadow-xl lg:grid" onSubmit={onSubmit}>
      <label className="border-r border-[var(--border)] px-4 py-2 text-sm font-medium">O que você está planejando?
        <select aria-invalid={Boolean(errors.activity)} className="mt-1 block w-full bg-transparent text-base font-semibold outline-none" onChange={(event) => onChange({ ...values, activity: event.target.value })} value={values.activity}>
          <option value="">Escolha uma ocasião</option>
          {activities.map((activity) => <option key={activity} value={activity}>{activity}</option>)}
        </select>
      </label>
      <label className="border-r border-[var(--border)] px-4 py-2 text-sm font-medium">Onde?
        <input aria-invalid={Boolean(errors.location)} className="mt-1 block w-full bg-transparent text-base font-semibold outline-none" onChange={(event) => onChange({ ...values, location: event.target.value })} placeholder="Cidade, bairro ou região" value={values.location} />
      </label>
      <label className="border-r border-[var(--border)] px-4 py-2 text-sm font-medium">Quando?
        <input className="mt-1 block w-full bg-transparent text-base font-semibold outline-none" onChange={(event) => onChange({ ...values, date: event.target.value })} type="date" value={values.date} />
      </label>
      <label className="px-4 py-2 text-sm font-medium">Pessoas
        <input aria-invalid={Boolean(errors.guests)} className="mt-1 block w-full bg-transparent text-base font-semibold outline-none" min="1" onChange={(event) => onChange({ ...values, guests: Number(event.target.value) })} placeholder="Convidados" type="number" value={values.guests || ""} />
      </label>
      <button className="min-h-11 rounded-xl bg-[var(--primary)] px-6 font-semibold text-white transition hover:bg-[#103d35]" type="submit">Buscar espaços</button>
    </form>
  );
}
