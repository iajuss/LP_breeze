import { describe, expect, it } from "vitest";
import { validateInterestPayload } from "@/lib/interest-validation";

const validPayload = {
  venueSlug: "casa-jardim-pinheiros",
  name: "Ana Souza",
  email: "ana@example.com",
  phone: "11999999999",
  eventType: "Festa",
  neighborhood: "Pinheiros, São Paulo, SP",
  residentNeighborhood: "Moema",
  eventDate: "2026-12-12",
  guestCount: 80,
  marketingConsent: false,
};

describe("validateInterestPayload", () => {
  it("accepts a complete interest for a São Paulo location", () => {
    expect(validateInterestPayload(validPayload)).toMatchObject({ ok: true, value: validPayload });
  });

  it("does not accept an uncontrolled location or invalid contact details", () => {
    expect(validateInterestPayload({ ...validPayload, email: "ana", neighborhood: "Rio de Janeiro" })).toEqual({
      ok: false,
      errors: {
        email: "Informe um e-mail válido.",
        neighborhood: "Selecione uma localização da lista em São Paulo.",
      },
    });
  });

  it("requires and normalizes the resident neighborhood", () => {
    expect(validateInterestPayload({ ...validPayload, residentNeighborhood: "   Moema  " })).toMatchObject({
      ok: true,
      value: { residentNeighborhood: "Moema" },
    });
    expect(validateInterestPayload({ ...validPayload, residentNeighborhood: "" })).toEqual({
      ok: false,
      errors: { residentNeighborhood: "Informe o bairro onde você mora." },
    });
  });

  it("limits the resident neighborhood to 100 characters", () => {
    expect(validateInterestPayload({ ...validPayload, residentNeighborhood: "a".repeat(101) })).toEqual({
      ok: false,
      errors: { residentNeighborhood: "Informe um bairro com até 100 caracteres." },
    });
  });
});
