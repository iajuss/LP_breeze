import { afterEach, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/admin", () => ({
  createServiceRoleSupabaseClient: vi.fn(),
}));

import { createServiceRoleSupabaseClient } from "@/lib/supabase/admin";
import { createPendingInterest } from "@/lib/repositories/interests";

afterEach(() => vi.clearAllMocks());

it("preserves a Supabase venue-query failure for the server log", async () => {
  const single = vi.fn().mockResolvedValue({ data: null, error: { message: "Invalid API key" } });
  const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: { message: "Invalid API key" } });
  const eq = vi.fn().mockReturnValue({ single, maybeSingle });
  const select = vi.fn().mockReturnValue({ eq });
  vi.mocked(createServiceRoleSupabaseClient).mockReturnValue({ from: vi.fn().mockReturnValue({ select }) } as never);

  await expect(createPendingInterest({
    venueSlug: "casa-vila-mariana", name: "Ana Souza", email: "ana@example.com", phone: "11999999999",
    eventType: "Festa", neighborhood: "Vila Mariana, São Paulo, SP", guestCount: 80, marketingConsent: false,
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
    eventType: "Festa", neighborhood: "Vila Mariana, São Paulo, SP", guestCount: 80, marketingConsent: false,
  })).rejects.toThrow("Espaço não encontrado.");
});
