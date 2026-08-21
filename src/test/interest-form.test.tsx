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
