import { canonicalLocation } from "@/data/search-options";
import { isInterestRegion } from "@/data/regions";

export type InterestPayload = {
  venueSlug: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  neighborhood: string;
  residentNeighborhood: string;
  regionInterest?: string;
  eventDate?: string;
  guestCount: number;
  budget?: string;
  marketingConsent: boolean;
  source?: string;
  campaign?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

type ValidationResult =
  | { ok: true; value: InterestPayload }
  | { ok: false; errors: Record<string, string> };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateInterestPayload(payload: unknown): ValidationResult {
  const value = payload as Partial<InterestPayload>;
  const errors: Record<string, string> = {};
  if (!value.venueSlug?.trim()) errors.venueSlug = "Escolha um espaço válido.";
  if (!value.name?.trim()) errors.name = "Informe seu nome.";
  if (!value.email?.trim() || !emailPattern.test(value.email)) errors.email = "Informe um e-mail válido.";
  if (!value.phone?.replace(/\D/g, "").match(/^\d{10,13}$/)) errors.phone = "Informe um telefone válido.";
  if (!value.eventType?.trim()) errors.eventType = "Escolha a ocasião do seu evento.";
  if (!canonicalLocation(value.neighborhood ?? "")) errors.neighborhood = "Selecione uma localização da lista em São Paulo.";
  if (!value.residentNeighborhood?.trim()) errors.residentNeighborhood = "Informe o bairro onde você mora.";
  if (value.residentNeighborhood && value.residentNeighborhood.trim().length > 100) errors.residentNeighborhood = "Informe um bairro com até 100 caracteres.";
  if (value.regionInterest && !isInterestRegion(value.regionInterest)) errors.regionInterest = "Selecione uma região válida em São Paulo.";
  if (!Number.isInteger(value.guestCount) || (value.guestCount ?? 0) < 1 || (value.guestCount ?? 0) > 5000) {
    errors.guestCount = "Informe entre 1 e 5.000 pessoas.";
  }
  if (value.eventDate && !/^\d{4}-\d{2}-\d{2}$/.test(value.eventDate)) errors.eventDate = "Informe uma data válida.";
  if (Object.keys(errors).length) return { ok: false, errors };

  return {
    ok: true,
    value: {
      venueSlug: value.venueSlug!.trim(),
      name: value.name!.trim(),
      email: value.email!.trim().toLowerCase(),
      phone: value.phone!.trim(),
      eventType: value.eventType!.trim(),
      neighborhood: canonicalLocation(value.neighborhood!)!,
      residentNeighborhood: value.residentNeighborhood!.trim(),
      regionInterest: value.regionInterest || undefined,
      eventDate: value.eventDate || undefined,
      guestCount: value.guestCount!,
      budget: value.budget?.trim() || undefined,
      marketingConsent: Boolean(value.marketingConsent),
      source: value.source,
      campaign: value.campaign,
      referrer: value.referrer,
      utmSource: value.utmSource,
      utmMedium: value.utmMedium,
      utmCampaign: value.utmCampaign,
    },
  };
}
