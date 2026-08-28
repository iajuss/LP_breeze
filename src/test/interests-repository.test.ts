import { afterEach, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/admin", () => ({
  createServiceRoleSupabaseClient: vi.fn(),
}));

import { createServiceRoleSupabaseClient } from "@/lib/supabase/admin";
import { createPendingInterest, finalizePendingInterest } from "@/lib/repositories/interests";

afterEach(() => vi.clearAllMocks());

it("preserves a Supabase venue-query failure for the server log", async () => {
  const single = vi.fn().mockResolvedValue({ data: null, error: { message: "Invalid API key" } });
  const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: { message: "Invalid API key" } });
  const eq = vi.fn().mockReturnValue({ single, maybeSingle });
  const select = vi.fn().mockReturnValue({ eq });
  vi.mocked(createServiceRoleSupabaseClient).mockReturnValue({ from: vi.fn().mockReturnValue({ select }) } as never);

  await expect(createPendingInterest({
    venueSlug: "casa-vila-mariana", name: "Ana Souza", email: "ana@example.com", phone: "11999999999",
    eventType: "Festa", neighborhood: "Vila Mariana, São Paulo, SP", residentNeighborhood: "Moema", guestCount: 80, marketingConsent: false,
  })).rejects.toThrow("Falha ao consultar espaço no Supabase: Invalid API key");
});

it("keeps a missing venue distinct from a Supabase query failure", async () => {
  const single = vi.fn().mockResolvedValue({ data: null, error: { message: "JSON object requested, multiple (or no) rows returned" } });
  const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
  const eq = vi.fn().mockReturnValue({ single, maybeSingle });
  const select = vi.fn().mockReturnValue({ eq });
  vi.mocked(createServiceRoleSupabaseClient).mockReturnValue({ from: vi.fn().mockReturnValue({ select }) } as never);

  await expect(createPendingInterest({
    venueSlug: "espaco-inexistente", name: "Ana Souza", email: "ana@example.com", phone: "11999999999",
    eventType: "Festa", neighborhood: "Vila Mariana, São Paulo, SP", residentNeighborhood: "Moema", guestCount: 80, marketingConsent: false,
  })).rejects.toThrow("Espaço não encontrado.");
});

it("persists the resident neighborhood while creating and finalizing an interest", async () => {
  const pendingInsert = vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { id: "pending-id" }, error: null }) }) });
  const rentalInsert = vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { id: "interest-id" }, error: null }) }) });
  const update = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });
  const pending = {
    id: "pending-id", venue_id: "venue-id", name: "Ana Souza", email: "ana@example.com", phone: "11999999999",
    marketing_consent: false, event_type: "Festa", neighborhood: "Vila Mariana, São Paulo, SP", resident_neighborhood: "Moema",
    interested_region: null, event_date: null, guest_count: 80, budget: null, source: null, campaign: null, referrer: null,
    utm_source: null, utm_medium: null, utm_campaign: null, finalized_interest_id: null,
  };
  const from = vi.fn((table: string) => {
    if (table === "venues") return { select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ maybeSingle: vi.fn().mockResolvedValue({ data: { id: "venue-id" }, error: null }) }) }) };
    if (table === "pending_interests") return { insert: pendingInsert, select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: pending, error: null }) }) }), update };
    if (table === "profiles") return { upsert: vi.fn().mockResolvedValue({ error: null }) };
    return { insert: rentalInsert };
  });
  vi.mocked(createServiceRoleSupabaseClient).mockReturnValue({ from } as never);

  await createPendingInterest({
    venueSlug: "casa-vila-mariana", name: "Ana Souza", email: "ana@example.com", phone: "11999999999",
    eventType: "Festa", neighborhood: "Vila Mariana, São Paulo, SP", residentNeighborhood: "Moema", guestCount: 80, marketingConsent: false,
  });
  await finalizePendingInterest("pending-id", { id: "user-id", email: "ana@example.com" });

  expect(pendingInsert).toHaveBeenCalledWith(expect.objectContaining({ resident_neighborhood: "Moema" }));
  expect(rentalInsert).toHaveBeenCalledWith(expect.objectContaining({ resident_neighborhood: "Moema" }));
});

const montarSupabase = (venueRow: unknown) => {
  const rentalInsert = vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { id: "interest-id" }, error: null }) }) });
  const pending = {
    id: "pending-id", venue_id: "venue-id", name: "Ana Souza", email: "ana@example.com", phone: "11999999999",
    marketing_consent: false, event_type: "Festa", neighborhood: "Pinheiros, São Paulo, SP", resident_neighborhood: "Moema",
    interested_region: null, event_date: null, guest_count: 80, budget: null, source: null, campaign: null, referrer: null,
    utm_source: null, utm_medium: null, utm_campaign: null, finalized_interest_id: null,
  };
  const from = vi.fn((table: string) => {
    if (table === "venues") return { select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ maybeSingle: vi.fn().mockResolvedValue({ data: venueRow, error: null }) }) }) };
    if (table === "pending_interests") return { select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: pending, error: null }) }) }), update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }) };
    if (table === "profiles") return { upsert: vi.fn().mockResolvedValue({ error: null }) };
    return { insert: rentalInsert };
  });
  vi.mocked(createServiceRoleSupabaseClient).mockReturnValue({ from } as never);
  return rentalInsert;
};

it("grava no lead o valor que estava na tela, não um texto fixo", async () => {
  const rentalInsert = montarSupabase({ slug: "casa-jardim-pinheiros" });

  await finalizePendingInterest("pending-id", { id: "user-id", email: "ana@example.com" });

  expect(rentalInsert).toHaveBeenCalledWith(expect.objectContaining({ displayed_price: "A partir de R$ 6.000" }));
});

it("confirma o lead mesmo sem conseguir resolver o valor exibido", async () => {
  const rentalInsert = montarSupabase(null);

  await finalizePendingInterest("pending-id", { id: "user-id", email: "ana@example.com" });

  expect(rentalInsert).toHaveBeenCalledWith(expect.objectContaining({ displayed_price: "Valor sob consulta" }));
});
