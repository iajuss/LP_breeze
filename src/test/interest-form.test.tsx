import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { InterestForm } from "@/components/venue/interest-form";

const form = <InterestForm defaultEventType="Festa" defaultGuests={80} defaultLocation="Pinheiros, São Paulo, SP" venueSlug="casa-jardim-pinheiros" />;

it("collects a separate region of interest", () => {
  render(form);
  expect(screen.getByLabelText("Região de interesse")).toBeInTheDocument();
});

it("shows a recoverable message when the interest request cannot reach the server", async () => {
  const user = userEvent.setup();
  vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce(new TypeError("Failed to fetch")));
  render(form);
  await user.type(screen.getByLabelText("Nome"), "Ana Souza");
  await user.type(screen.getByLabelText("E-mail"), "ana@example.com");
  await user.type(screen.getByLabelText("Telefone"), "11999999999");
  await user.click(screen.getByRole("button", { name: /enviar e receber magic link/i }));
  expect(await screen.findByRole("status")).toHaveTextContent("Não conseguimos conectar ao atendimento agora. Tente novamente em instantes.");
  vi.unstubAllGlobals();
});

it("uses the green calendar below the date field and submits its ISO date", async () => {
  const user = userEvent.setup();
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
  vi.stubGlobal("fetch", fetchMock);
  render(form);

  await user.type(screen.getByLabelText("Nome"), "Ana Souza");
  await user.type(screen.getByLabelText("E-mail"), "ana@example.com");
  await user.type(screen.getByLabelText("Telefone"), "11999999999");
  await user.click(screen.getByRole("button", { name: /abrir calendário/i }));
  expect(screen.getByRole("dialog", { name: /calendário/i })).toHaveClass("top-full", "bg-[var(--primary)]");

  await user.type(screen.getByLabelText("Data"), "12082026");
  await user.click(screen.getByRole("button", { name: /enviar e receber magic link/i }));

  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ eventDate: "2026-08-12" });
  vi.unstubAllGlobals();
});

it("does not submit a previously selected date after it becomes incomplete", async () => {
  const user = userEvent.setup();
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
  vi.stubGlobal("fetch", fetchMock);
  render(form);

  await user.type(screen.getByLabelText("Nome"), "Ana Souza");
  await user.type(screen.getByLabelText("E-mail"), "ana@example.com");
  await user.type(screen.getByLabelText("Telefone"), "11999999999");
  const date = screen.getByLabelText("Data");
  await user.type(date, "12082026");
  await user.click(date);
  await user.keyboard("{End}{Backspace}");
  await user.click(screen.getByRole("button", { name: /enviar e receber magic link/i }));

  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).not.toHaveProperty("eventDate");
  vi.unstubAllGlobals();
});
