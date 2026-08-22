import { createServiceRoleSupabaseClient } from "@/lib/supabase/admin";
import type { InterestPayload } from "@/lib/interest-validation";

type PendingInterest = {
  id: string;
  venue_id: string;
  name: string;
  email: string;
  phone: string;
  marketing_consent: boolean;
  event_type: string;
  neighborhood: string;
  event_date: string | null;
  guest_count: number;
  budget: string | null;
  source: string | null;
  campaign: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  interested_region: string | null;
  finalized_interest_id: string | null;
};

export async function createPendingInterest(payload: InterestPayload): Promise<{ id: string }> {
  const supabase = createServiceRoleSupabaseClient();
  const { data: venue, error: venueError } = await supabase.from("venues").select("id").eq("slug", payload.venueSlug).maybeSingle();
  if (venueError) throw new Error(`Falha ao consultar espaço no Supabase: ${venueError.message}`);
  if (!venue) throw new Error("Espaço não encontrado.");
  const venueId = (venue as { id: string }).id;
  const { data, error } = await supabase.from("pending_interests").insert({
    venue_id: venueId,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    marketing_consent: payload.marketingConsent,
    event_type: payload.eventType,
    neighborhood: payload.neighborhood,
    interested_region: payload.regionInterest || null,
    event_date: payload.eventDate || null,
    guest_count: payload.guestCount,
    budget: payload.budget || null,
    source: payload.source || null,
    campaign: payload.campaign || null,
    referrer: payload.referrer || null,
    utm_source: payload.utmSource || null,
    utm_medium: payload.utmMedium || null,
    utm_campaign: payload.utmCampaign || null,
  }).select("id").single();
  if (error || !data) throw new Error("Não foi possível registrar seu interesse.");
  return { id: (data as { id: string }).id };
}

export async function finalizePendingInterest(pendingId: string, user: { id: string; email?: string | null }): Promise<void> {
  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase.from("pending_interests").select("*").eq("id", pendingId).single();
  if (error || !data) throw new Error("Interesse pendente não encontrado.");
  const pending = data as PendingInterest;
  if (pending.finalized_interest_id) return;
  if (!user.email || user.email.toLowerCase() !== pending.email.toLowerCase()) throw new Error("Este link não corresponde ao e-mail informado.");
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id, name: pending.name, email: pending.email, phone: pending.phone, marketing_consent: pending.marketing_consent,
  });
  if (profileError) throw new Error("Não foi possível criar seu perfil.");
  const { data: interest, error: interestError } = await supabase.from("rental_interests").insert({
    user_id: user.id, venue_id: pending.venue_id, event_type: pending.event_type, neighborhood: pending.neighborhood, interested_region: pending.interested_region,
    event_date: pending.event_date, guest_count: pending.guest_count, budget: pending.budget,
    displayed_price: "Valor sob consulta", source: pending.source, campaign: pending.campaign, referrer: pending.referrer,
    utm_source: pending.utm_source, utm_medium: pending.utm_medium, utm_campaign: pending.utm_campaign,
  }).select("id").single();
  if (interestError || !interest) throw new Error("Não foi possível confirmar seu interesse.");
  const { error: pendingError } = await supabase.from("pending_interests").update({ finalized_interest_id: (interest as { id: string }).id, finalized_at: new Date().toISOString() }).eq("id", pendingId);
  if (pendingError) throw new Error("Não foi possível concluir a confirmação.");
}
