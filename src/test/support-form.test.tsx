import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { SupportForm } from "@/components/venue/support-form";

it("uses the filled primary treatment for the support CTA", () => {
  render(<SupportForm venueSlug="casa-jardim-pinheiros" />);
  expect(screen.getByRole("button", { name: "Enviar pergunta" })).toHaveClass("min-h-12", "bg-[var(--primary)]", "text-white");
});

it("shows the safe error returned by the support API", async () => {
  const user = userEvent.setup();
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: "Não foi possível salvar sua pergunta." }) }));
  render(<SupportForm venueSlug="casa-jardim-pinheiros" />);

  await user.type(screen.getByLabelText("Sua pergunta"), "Quero saber se há estacionamento.");
  await user.type(screen.getByLabelText("E-mail para resposta"), "ana@example.com");
  await user.click(screen.getByRole("button", { name: /enviar pergunta/i }));

  expect(await screen.findByRole("status")).toHaveTextContent("Não foi possível salvar sua pergunta.");
  vi.unstubAllGlobals();
});

it("confirms the question when the support request succeeds", async () => {
  const user = userEvent.setup();
  vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) }));
  render(<SupportForm venueSlug="casa-jardim-pinheiros" />);

  await user.type(screen.getByLabelText("Sua pergunta"), "Quero saber se há estacionamento.");
  await user.type(screen.getByLabelText("E-mail para resposta"), "ana@example.com");
  await user.click(screen.getByRole("button", { name: /enviar pergunta/i }));

  expect(await screen.findByRole("status")).toHaveTextContent("Pergunta recebida. Retornaremos pelo e-mail informado.");
  vi.unstubAllGlobals();
});

it("does not send the resident neighborhood with support questions", async () => {
  const user = userEvent.setup();
  const fetchMock = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) });
  vi.stubGlobal("fetch", fetchMock);
  render(<SupportForm venueSlug="casa-jardim-pinheiros" />);

  await user.type(screen.getByLabelText("Sua pergunta"), "Quero saber se há estacionamento.");
  await user.type(screen.getByLabelText("E-mail para resposta"), "ana@example.com");
  await user.click(screen.getByRole("button", { name: /enviar pergunta/i }));

  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).not.toHaveProperty("residentNeighborhood");
  vi.unstubAllGlobals();
});

it("shows a recoverable message when the support request cannot reach the server", async () => {
  const user = userEvent.setup();
  vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce(new TypeError("Failed to fetch")));
  render(<SupportForm venueSlug="casa-jardim-pinheiros" />);

  await user.type(screen.getByLabelText("Sua pergunta"), "Quero saber se há estacionamento.");
  await user.type(screen.getByLabelText("E-mail para resposta"), "ana@example.com");
  await user.click(screen.getByRole("button", { name: /enviar pergunta/i }));

  expect(await screen.findByRole("status")).toHaveTextContent("Não conseguimos conectar ao atendimento agora. Tente novamente em instantes.");
  vi.unstubAllGlobals();
});
