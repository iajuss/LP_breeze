// @vitest-environment node

import { afterEach, expect, it, vi } from "vitest";

vi.mock("@/lib/repositories/interests", () => ({
  createPendingInterest: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(),
}));

import { createPendingInterest } from "@/lib/repositories/interests";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { POST } from "@/app/api/interests/route";

afterEach(() => vi.restoreAllMocks());

it("explains when Supabase temporarily limits another magic-link email", async () => {
  vi.mocked(createPendingInterest).mockResolvedValue({ id: "pending-id" });
  vi.mocked(createServerSupabaseClient).mockResolvedValue({
    auth: { signInWithOtp: vi.fn().mockResolvedValue({ error: { code: "over_email_send_rate_limit" } }) },
  } as never);

  const response = await POST(new Request("https://arcora.example/api/interests", {
    method: "POST",
    body: JSON.stringify({
      venueSlug: "casa-vila-mariana", name: "Ana Souza", email: "ana@example.com", phone: "11999999999",
      eventType: "Festa", neighborhood: "Vila Mariana, São Paulo, SP", guestCount: 80, marketingConsent: false,
    }),
  }));
  const body = await response.json() as { error?: string };

  expect(response.status).toBe(429);
  expect(body.error).toBe("Aguarde alguns segundos antes de pedir outro link de confirmação.");
});
