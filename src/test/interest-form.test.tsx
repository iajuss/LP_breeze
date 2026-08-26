import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { InterestForm } from "@/components/venue/interest-form";
import VenuePage from "@/app/espacos/[slug]/page";
import { activityOptions } from "@/data/search-options";

const form = <InterestForm defaultEventType="Festa" defaultGuests={80} defaultLocation="Pinheiros, São Paulo, SP" venueSlug="casa-jardim-pinheiros" />;

async function fillContactDetails(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Nome"), "Ana Souza");
  await user.type(screen.getByLabelText("E-mail"), "ana@example.com");
  await user.type(screen.getByLabelText("Telefone"), "11999999999");
  await user.type(screen.getByLabelText("Em que bairro você mora?"), "Moema");
}

it("collects a separate region of interest", () => {
  render(form);
  expect(screen.getByRole("combobox", { name: "Região de interesse" })).toBeInTheDocument();
});

it("keeps the resident neighborhood as a free-text field for anywhere in Brazil", () => {
  render(form);

  const residentNeighborhood = screen.getByLabelText("Em que bairro você mora?");
  expect(residentNeighborhood).not.toHaveAttribute("list");
  expect(residentNeighborhood).toHaveAttribute("placeholder", "Ex.: Recife, PE");
});

it("does not show explanatory copy below the resident neighborhood field", () => {
  render(form);

  expect(screen.queryByText("Usamos esta informação para entender de onde vem a demanda.")).not.toBeInTheDocument();
});

it("keeps branded selector triggers at the 44px touch target", () => {
  render(form);

  expect(screen.getByRole("combobox", { name: "Ocasião" })).toHaveClass("min-h-11");
  expect(screen.getByRole("combobox", { name: "Região de interesse" })).toHaveClass("min-h-11");
});

it("keeps branded selector options at the 44px touch target", async () => {
  const user = userEvent.setup();
  render(form);

  await user.click(screen.getByRole("combobox", { name: "Ocasião" }));
  expect(screen.getByRole("option", { name: "Ensaio" })).toHaveClass("min-h-11");
});

it("preselects the region carried from the discovery map", () => {
  render(<InterestForm defaultEventType="Festa" defaultGuests={80} defaultLocation="Pinheiros, São Paulo, SP" defaultInterestRegion="Leste" venueSlug="casa-jardim-pinheiros" />);

  expect(screen.getByRole("combobox", { name: "Região de interesse" })).toHaveTextContent("Leste");
});

it("uses only a valid regional preference from the venue query", async () => {
  render(await VenuePage({ params: Promise.resolve({ slug: "casa-jardim-pinheiros" }), searchParams: Promise.resolve({ regionInterest: "Leste" }) }));
  expect(screen.getByRole("combobox", { name: "Região de interesse" })).toHaveTextContent("Leste");
});

it("keeps the venue zone when the regional preference query is invalid", async () => {
  render(await VenuePage({ params: Promise.resolve({ slug: "casa-jardim-pinheiros" }), searchParams: Promise.resolve({ regionInterest: "Fora-do-mapa" }) }));
  expect(screen.getByRole("combobox", { name: "Região de interesse" })).toHaveTextContent("Oeste");
});

it("uses the requested compatible activity as the interest form default", async () => {
  render(await VenuePage({ params: Promise.resolve({ slug: "casa-jardim-pinheiros" }), searchParams: Promise.resolve({ activity: "Casamento" }) }));

  expect(screen.getByRole("combobox", { name: "Ocasião" })).toHaveTextContent("Casamento");
});

it("uses the requested activity when the venue accepts every occasion", async () => {
  render(await VenuePage({ params: Promise.resolve({ slug: "casa-jardim-pinheiros" }), searchParams: Promise.resolve({ activity: "Workshop" }) }));

  expect(screen.getByRole("combobox", { name: "Ocasião" })).toHaveTextContent("Workshop");
});

it("shows every occasion supported by the venue", async () => {
  render(await VenuePage({ params: Promise.resolve({ slug: "casa-jardim-pinheiros" }), searchParams: Promise.resolve({}) }));

  expect(screen.getByText(activityOptions.join(" · "))).toBeInTheDocument();
});

it("uses the branded occasion selector and submits its selected value", async () => {
  const user = userEvent.setup();
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
  vi.stubGlobal("fetch", fetchMock);
  render(form);

  await user.click(screen.getByRole("combobox", { name: "Ocasião" }));
  expect(screen.getByRole("listbox", { name: "Ocasião" })).toHaveClass("top-full", "bg-[var(--primary)]");
  await user.click(screen.getByRole("option", { name: "Ensaio" }));
  expect(screen.getByRole("combobox", { name: "Ocasião" })).toHaveFocus();
  await fillContactDetails(user);
  await user.click(screen.getByRole("button", { name: /enviar link de confirmação/i }));

  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ eventType: "Ensaio" });
  vi.unstubAllGlobals();
});

it("sends the event location and resident neighborhood as separate fields", async () => {
  const user = userEvent.setup();
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
  vi.stubGlobal("fetch", fetchMock);
  render(form);

  await fillContactDetails(user);
  await user.click(screen.getByRole("button", { name: /enviar link de confirmação/i }));

  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
    neighborhood: "Pinheiros, São Paulo, SP",
    residentNeighborhood: "Moema",
  });
  vi.unstubAllGlobals();
});

it("closes the occasion selector with Escape", async () => {
  const user = userEvent.setup();
  render(form);

  const trigger = screen.getByRole("combobox", { name: "Ocasião" });
  await user.click(trigger);
  await user.keyboard("{Escape}");

  expect(screen.queryByRole("listbox", { name: "Ocasião" })).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

it("selects an occasion with the keyboard", async () => {
  const user = userEvent.setup();
  render(form);

  const trigger = screen.getByRole("combobox", { name: "Ocasião" });
  trigger.focus();
  await user.keyboard("{Enter}");
  expect(screen.getByRole("listbox", { name: "Ocasião" })).toBeInTheDocument();
  await user.keyboard("{ArrowDown}{Enter}");

  expect(trigger).toHaveTextContent("Casamento");
  expect(trigger).toHaveFocus();
});

it("restores both branded selectors to their defaults after a successful request", async () => {
  const user = userEvent.setup();
  vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) }));
  render(<InterestForm defaultEventType="Festa" defaultGuests={80} defaultInterestRegion="Oeste" defaultLocation="Pinheiros, São Paulo, SP" venueSlug="casa-jardim-pinheiros" />);

  await user.click(screen.getByRole("combobox", { name: "Ocasião" }));
  await user.click(screen.getByRole("option", { name: "Ensaio" }));
  await user.click(screen.getByRole("combobox", { name: "Região de interesse" }));
  await user.click(screen.getByRole("option", { name: "Leste" }));
  await fillContactDetails(user);
  await user.click(screen.getByRole("button", { name: /enviar link de confirmação/i }));

  await screen.findByRole("status");
  expect(screen.getByRole("combobox", { name: "Ocasião" })).toHaveTextContent("Festa");
  expect(screen.getByRole("combobox", { name: "Região de interesse" })).toHaveTextContent("Oeste");
  vi.unstubAllGlobals();
});

it("shows a recoverable message when the interest request cannot reach the server", async () => {
  const user = userEvent.setup();
  vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce(new TypeError("Failed to fetch")));
  render(form);
  await fillContactDetails(user);
  await user.click(screen.getByRole("button", { name: /enviar link de confirmação/i }));
  expect(await screen.findByRole("status")).toHaveTextContent("Não conseguimos conectar ao atendimento agora. Tente novamente em instantes.");
  vi.unstubAllGlobals();
});

it("confirms the request when the magic link is sent", async () => {
  const user = userEvent.setup();
  vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) }));
  render(form);

  await fillContactDetails(user);
  await user.click(screen.getByRole("button", { name: /enviar link de confirmação/i }));

  const feedback = await screen.findByRole("status");
  expect(feedback).toHaveTextContent("Pedido enviado");
  expect(feedback).toHaveTextContent("Enviamos um link de confirmação para o seu e-mail.");
  expect(feedback).not.toHaveTextContent("Não conseguimos conectar ao atendimento");
  vi.unstubAllGlobals();
});

it("uses the green calendar below the date field and submits its ISO date", async () => {
  const user = userEvent.setup();
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
  vi.stubGlobal("fetch", fetchMock);
  render(form);

  await fillContactDetails(user);
  await user.click(screen.getByRole("button", { name: /abrir calendário/i }));
  expect(screen.getByRole("dialog", { name: /calendário/i })).toHaveClass("top-full", "bg-[var(--primary)]");

  await user.type(screen.getByLabelText("Data"), "12082026");
  await user.click(screen.getByRole("button", { name: /enviar link de confirmação/i }));

  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ eventDate: "2026-08-12" });
  vi.unstubAllGlobals();
});

it("does not submit a previously selected date after it becomes incomplete", async () => {
  const user = userEvent.setup();
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
  vi.stubGlobal("fetch", fetchMock);
  render(form);

  await fillContactDetails(user);
  const date = screen.getByLabelText("Data");
  await user.type(date, "12082026");
  await user.click(date);
  await user.keyboard("{End}{Backspace}");
  await user.click(screen.getByRole("button", { name: /enviar link de confirmação/i }));

  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).not.toHaveProperty("eventDate");
  vi.unstubAllGlobals();
});
