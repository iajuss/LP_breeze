"use client";

import { type FormEvent, useState } from "react";
import { track } from "@/lib/analytics";
import { buildSearchUrl, validateSearch } from "@/lib/search";
import { DesktopSearchForm } from "./desktop-search-form";
import { MobileSearchSheet } from "./mobile-search-sheet";
import { emptySearchValues, type SearchErrors, type SearchValues } from "./search-types";

type VenueSearchProps = { entryPoint: "hero" | "corporate" };

export function VenueSearch({ entryPoint }: VenueSearchProps) {
  const [values, setValues] = useState<SearchValues>(emptySearchValues);
  const [errors, setErrors] = useState<SearchErrors>({});
  const [open, setOpen] = useState(false);

  const submit = () => {
    const nextErrors = validateSearch(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    track("search_submitted", { entryPoint });
    window.location.assign(buildSearchUrl(values));
  };
  const desktopSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); submit(); };
  const begin = () => { track("search_started", { entryPoint }); setOpen(true); };

  return <div className="w-full"><DesktopSearchForm errors={errors} onChange={setValues} onSubmit={desktopSubmit} values={values} /><button className="flex min-h-14 w-full items-center justify-between rounded-2xl bg-white px-5 text-left shadow-xl lg:hidden" onClick={begin} type="button"><span><span className="block text-sm text-[var(--muted)]">Planeje com leveza</span><span className="font-semibold">Encontrar um espaço</span></span><span aria-hidden="true" className="text-xl">→</span></button><MobileSearchSheet onChange={setValues} onClose={() => setOpen(false)} onSubmit={submit} open={open} values={values} /></div>;
}
