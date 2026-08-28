import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VenueSearch } from "@/components/search/venue-search";

const original = window.location;
let assign: ReturnType<typeof vi.fn>;
let eventos: Array<{ event: string; properties: Record<string, unknown> }>;
const ouvinte = (e: Event) => eventos.push((e as CustomEvent).detail);

beforeEach(() => {
  assign = vi.fn();
  Object.defineProperty(window, "location", { configurable: true, value: { ...original, assign } });
  vi.spyOn(window, "fetch").mockResolvedValue(new Response(null, { status: 201 }));
  eventos = [];
  window.addEventListener("arcora:analytics", ouvinte);
});

afterEach(() => {
  window.removeEventListener("arcora:analytics", ouvinte);
  Object.defineProperty(window, "location", { configurable: true, value: original });
  vi.restoreAllMocks();
});

const preencherEEnviar = async (comData: boolean) => {
  const user = userEvent.setup();
  render(<VenueSearch entryPoint="hero" />);

  await user.click(screen.getByRole("button", { name: /escolha uma ocasião/i }));
  await user.click(screen.getByRole("option", { name: "Casamento" }));
  await user.type(screen.getByPlaceholderText(/são paulo ou um bairro/i), "Pinheiros, São Paulo, SP");
  await user.type(screen.getByRole("spinbutton", { name: /pessoas/i }), "150");
  if (comData) await user.type(screen.getByLabelText(/quando/i), "12082026");
  await user.click(screen.getByRole("button", { name: "Buscar espaços" }));
};

describe("captação de intenção na busca", () => {
  it("envia vertical, praça, pessoas e data ao enviar a busca", async () => {
    await preencherEEnviar(true);

    expect(assign).toHaveBeenCalled();
    const enviado = eventos.find((e) => e.event === "search_submitted");
    expect(enviado?.properties).toMatchObject({
      eventType: "Casamento",
      neighborhood: "Pinheiros, São Paulo, SP",
      guestCount: 150,
      eventDate: "2026-08-12",
      source: "hero",
    });
    expect(enviado?.properties.sessionId).toEqual(expect.any(String));
  });

  it("omite a data quando ela não foi informada, em vez de mandar vazio", async () => {
    await preencherEEnviar(false);

    const enviado = eventos.find((e) => e.event === "search_submitted");
    expect(enviado?.properties).toMatchObject({ eventType: "Casamento", guestCount: 150 });
    expect(enviado?.properties).not.toHaveProperty("eventDate");
  });

  it("não registra intenção quando a busca é recusada pela validação", async () => {
    const user = userEvent.setup();
    render(<VenueSearch entryPoint="hero" />);

    await user.click(screen.getByRole("button", { name: "Buscar espaços" }));

    expect(eventos.some((e) => e.event === "search_submitted")).toBe(false);
    expect(assign).not.toHaveBeenCalled();
  });
});
