import type { SearchErrors, SearchValues } from "@/components/search/search-types";

export function buildSearchUrl(values: SearchValues): string {
  const parameters = new URLSearchParams();
  if (values.activity) parameters.set("activity", values.activity);
  if (values.location) parameters.set("location", values.location);
  if (values.date) parameters.set("date", values.date);
  if (values.guests) parameters.set("guests", String(values.guests));
  const query = parameters.toString();
  return query ? `/buscar?${query}` : "/buscar";
}

export function validateSearch(values: SearchValues): SearchErrors {
  const errors: SearchErrors = {};
  if (!values.activity) errors.activity = "Escolha a ocasião do seu evento.";
  if (!values.location.trim()) errors.location = "Informe uma cidade, bairro ou região.";
  if (!Number.isInteger(values.guests) || values.guests < 1 || values.guests > 5000) {
    errors.guests = "Informe entre 1 e 5.000 pessoas.";
  }
  return errors;
}
