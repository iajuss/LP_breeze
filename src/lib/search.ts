import type { SearchErrors, SearchValues } from "@/components/search/search-types";
import { canonicalLocation } from "@/data/search-options";

export function buildSearchUrl(values: SearchValues): string {
  const parameters = new URLSearchParams();
  if (values.activity) parameters.set("activity", values.activity);
  const location = canonicalLocation(values.location);
  if (location) parameters.set("location", location);
  if (values.date) parameters.set("date", values.date);
  if (values.guests) parameters.set("guests", String(values.guests));
  const query = parameters.toString();
  return query ? `/buscar?${query}` : "/buscar";
}

export function validateSearch(values: SearchValues): SearchErrors {
  const errors: SearchErrors = {};
  // Nenhum filtro e obrigatorio: buscar sem preencher nada leva ao catalogo
  // inteiro. O que estiver preenchido, porem, precisa ser utilizavel.
  if (values.location.trim() && !canonicalLocation(values.location)) {
    errors.location = "Selecione uma localização da lista em São Paulo.";
  }
  if (values.guests && (!Number.isInteger(values.guests) || values.guests < 1 || values.guests > 5000)) {
    errors.guests = "Informe entre 1 e 5.000 pessoas.";
  }
  return errors;
}
