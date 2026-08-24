// @vitest-environment node

import { afterEach, expect, it, vi } from "vitest";
import { POST } from "@/app/api/interests/route";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

it("keeps Supabase configuration errors out of the public interest response", async () => {
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "sb_publishable_not_a_url");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-key");

  const response = await POST(new Request("https://arcora.example/api/interests", {
    method: "POST",
    body: JSON.stringify({
      venueSlug: "casa-jardim-pinheiros", name: "Ana Souza", email: "ana@example.com", phone: "11999999999",
      eventType: "Festa", neighborhood: "Pinheiros, São Paulo, SP", residentNeighborhood: "Moema", guestCount: 80, marketingConsent: false,
    }),
  }));
  const body = await response.json() as { error?: string; requestId?: string };

  expect(response.status).toBe(500);
  expect(body.error).toBe("Não foi possível enviar o link de confirmação agora. Tente novamente em instantes.");
  expect(body.requestId).toMatch(/^[\da-f-]{36}$/i);
  expect(consoleError).toHaveBeenCalledWith("Interest request failed", expect.objectContaining({ requestId: body.requestId }));
});
