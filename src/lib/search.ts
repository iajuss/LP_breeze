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
  if (!values.activity) errors.activity = "Escolha a ocasião do seu evento.";
  if (!values.location.trim()) errors.location = "Escolha São Paulo ou um bairro sugerido.";
  else if (!canonicalLocation(values.location)) errors.location = "Selecione uma localização da lista em São Paulo.";
  if (!Number.isInteger(values.guests) || values.guests < 1 || values.guests > 5000) {
    errors.guests = "Informe entre 1 e 5.000 pessoas.";
  }
  return errors;
}
