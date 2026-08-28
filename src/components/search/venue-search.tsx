"use client";

import { type FormEvent, useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { buildSearchUrl, validateSearch } from "@/lib/search";
import { canonicalLocation } from "@/data/search-options";
import { DesktopSearchForm } from "./desktop-search-form";
import { MobileSearchSheet } from "./mobile-search-sheet";
import { emptySearchValues, openSearchEvent, type SearchErrors, type SearchValues } from "./search-types";
import { ChevronIcon } from "@/components/ui/chevron-icon";

type VenueSearchProps = { entryPoint: "hero" | "corporate" };

export function VenueSearch({ entryPoint }: VenueSearchProps) {
  const [values, setValues] = useState<SearchValues>(emptySearchValues);
  const [errors, setErrors] = useState<SearchErrors>({});
  const [open, setOpen] = useState(false);
  const messages = [errors.activity, errors.location, errors.guests].filter(Boolean) as string[];

  const change = (nextValues: SearchValues) => {
    setValues(nextValues);
    setErrors((current) => Object.keys(current).length ? validateSearch(nextValues) : current);
  };
  const submit = () => {
    const nextErrors = validateSearch(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    // A busca so chega aqui validada, entao ocasiao, local e pessoas existem.
    // Sem isso a linha gravada nao dizia nem a vertical nem a praca procurada.
    track("search_submitted", {
      entryPoint,
      source: entryPoint,
      eventType: values.activity,
      neighborhood: canonicalLocation(values.location) ?? values.location,
      guestCount: values.guests,
      ...(values.date ? { eventDate: values.date } : {}),
    });
    window.location.assign(buildSearchUrl(values));
  };
  const desktopSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); submit(); };
  const begin = () => { track("search_started", { entryPoint }); setOpen(true); };

  useEffect(() => {
    if (entryPoint !== "hero") return;
    const openFromHeader = () => { track("search_started", { entryPoint }); setOpen(true); };
    window.addEventListener(openSearchEvent, openFromHeader);
    return () => window.removeEventListener(openSearchEvent, openFromHeader);
  }, [entryPoint]);

  return <div className="w-full"><DesktopSearchForm errors={errors} feedbackId={messages.length ? "search-feedback" : undefined} onChange={change} onSubmit={desktopSubmit} values={values} /><button className="flex min-h-14 w-full items-center justify-between rounded-2xl bg-white px-5 text-left text-[var(--foreground)] shadow-xl lg:hidden" onClick={begin} type="button"><span><span className="block text-sm text-[var(--muted)]">Planeje com leveza</span><span className="font-semibold">Encontrar um espaço</span></span><ChevronIcon direction="right" /></button>{messages.length ? <div className="mt-3 rounded-2xl border border-[var(--destructive)] bg-white p-4 text-left shadow-lg" id="search-feedback" role="alert"><p className="text-sm font-semibold text-[var(--destructive)]">Complete os filtros para buscar espaços.</p><ul className="mt-2 space-y-1 text-sm text-[var(--foreground)]">{messages.map((message) => <li key={message}>· {message}</li>)}</ul></div> : null}<MobileSearchSheet errors={errors} onChange={change} onClose={() => setOpen(false)} onSubmit={submit} open={open} values={values} /></div>;
}
