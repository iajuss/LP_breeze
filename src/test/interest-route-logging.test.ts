// @vitest-environment node

import { afterEach, expect, it, vi } from "vitest";

vi.mock("@/lib/repositories/interests", () => ({
  createPendingInterest: vi.fn(),
}));

import { createPendingInterest } from "@/lib/repositories/interests";
import { POST } from "@/app/api/interests/route";

afterEach(() => vi.restoreAllMocks());

it("logs a Supabase failure while returning a safe public interest response", async () => {
  const error = new Error("Falha ao consultar espaço no Supabase: Invalid API key");
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
  vi.mocked(createPendingInterest).mockRejectedValue(error);

  const response = await POST(new Request("https://arcora.example/api/interests", {
    method: "POST",
    body: JSON.stringify({
      venueSlug: "casa-vila-mariana", name: "Ana Souza", email: "ana@example.com", phone: "11999999999",
      eventType: "Festa", neighborhood: "Vila Mariana, São Paulo, SP", residentNeighborhood: "Moema", guestCount: 80, marketingConsent: false,
    }),
  }));
  const body = await response.json() as { error?: string; requestId?: string };

  expect(body.error).toBe("Não foi possível enviar o link de confirmação agora. Tente novamente em instantes.");
  expect(JSON.stringify(body)).not.toContain("Invalid API key");
  expect(consoleError).toHaveBeenCalledWith("Interest request failed", expect.objectContaining({ error, requestId: body.requestId }));
});
