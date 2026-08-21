import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { DesktopSearchForm } from "@/components/search/desktop-search-form";
import { Header } from "@/components/layout/header";
import { VenueSearch } from "@/components/search/venue-search";
import { emptySearchValues } from "@/components/search/search-types";

describe("VenueSearch", () => {
  it("opens the desktop occasion menu downward and selects an occasion", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DesktopSearchForm errors={{}} onChange={onChange} onSubmit={vi.fn()} values={emptySearchValues} />);

    await user.click(screen.getByRole("button", { name: /escolha uma ocasião/i }));

    expect(screen.getByRole("listbox")).toHaveClass("top-full", "-left-4", "-right-4");
    await user.click(screen.getByRole("option", { name: "Festa" }));

    expect(onChange).toHaveBeenCalledWith({ ...emptySearchValues, activity: "Festa" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("does not keep the occasion trigger highlighted after a selection", () => {
    render(<DesktopSearchForm errors={{}} onChange={vi.fn()} onSubmit={vi.fn()} values={{ ...emptySearchValues, activity: "Evento corporativo" }} />);

    expect(screen.getByRole("button", { name: /evento corporativo/i })).not.toHaveClass("bg-[var(--secondary)]");
  });

  it("closes the desktop occasion menu with Escape", async () => {
    const user = userEvent.setup();
    render(<DesktopSearchForm errors={{}} onChange={vi.fn()} onSubmit={vi.fn()} values={emptySearchValues} />);

    await user.click(screen.getByRole("button", { name: /escolha uma ocasião/i }));
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("hides the number-input arrows for guest quantity", () => {
    render(<DesktopSearchForm errors={{}} onChange={vi.fn()} onSubmit={vi.fn()} values={emptySearchValues} />);

    expect(screen.getByRole("spinbutton", { name: /pessoas/i })).toHaveClass("[appearance:textfield]");
  });

  it("uses the occasion field's soft green focus treatment for the remaining desktop inputs", () => {
    render(<DesktopSearchForm errors={{}} onChange={vi.fn()} onSubmit={vi.fn()} values={emptySearchValues} />);

    [screen.getByRole("combobox", { name: /onde/i }), screen.getByLabelText(/quando/i), screen.getByRole("spinbutton", { name: /pessoas/i })].forEach((input) => {
      expect(input).toHaveClass("search-field", "focus:bg-[var(--secondary)]", "focus:outline-none", "focus-visible:outline-none");
    });
  });

  it("formats a manually typed date and writes the ISO value used by search", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DesktopSearchForm errors={{}} onChange={onChange} onSubmit={vi.fn()} values={emptySearchValues} />);

    const dateInput = screen.getByLabelText(/quando/i);
    await user.type(dateInput, "12082026");

    expect(dateInput).toHaveValue("12/08/2026");
    expect(onChange).toHaveBeenLastCalledWith({ ...emptySearchValues, date: "2026-08-12" });
  });

  it("opens the desktop calendar below the date field", async () => {
    const user = userEvent.setup();
    render(<DesktopSearchForm errors={{}} onChange={vi.fn()} onSubmit={vi.fn()} values={emptySearchValues} />);

    await user.click(screen.getByRole("button", { name: /abrir calendário/i }));

    expect(screen.getByRole("dialog", { name: /calendário/i })).toHaveClass("top-full", "-left-4", "-right-4");
  });

  it("aligns each desktop field value with its label", () => {
    render(<DesktopSearchForm errors={{}} onChange={vi.fn()} onSubmit={vi.fn()} values={emptySearchValues} />);

    expect(screen.getByRole("button", { name: /o que você está planejando/i })).not.toHaveClass("px-2");
    [screen.getByRole("combobox", { name: /onde/i }), screen.getByLabelText(/quando/i), screen.getByRole("spinbutton", { name: /pessoas/i })].forEach((input) => {
      expect(input).not.toHaveClass("px-2");
    });
  });

  it("keeps desktop search labels readable over its white surface", () => {
    render(<VenueSearch entryPoint="hero" />);

    expect(screen.getByRole("button", { name: /o que você está planejando/i }).closest("form")).toHaveClass("text-[var(--foreground)]");
  });

  it("explains which filters are missing when the desktop search is submitted empty", async () => {
    const user = userEvent.setup();
    render(<VenueSearch entryPoint="hero" />);

    await user.click(screen.getByRole("button", { name: "Buscar espaços" }));

    const feedback = screen.getByRole("alert");
    expect(feedback).toHaveTextContent("Complete os filtros para buscar espaços.");
    expect(feedback).toHaveTextContent("Escolha a ocasião do seu evento.");
    expect(feedback).toHaveTextContent("Escolha São Paulo ou um bairro sugerido.");
    expect(feedback).toHaveTextContent("Informe entre 1 e 5.000 pessoas.");
    expect(screen.getByRole("combobox", { name: /onde/i })).toHaveAttribute("aria-invalid", "true");
  });

  it("drops each feedback line as soon as the matching filter is filled", async () => {
    const user = userEvent.setup();
    render(<VenueSearch entryPoint="hero" />);

    await user.click(screen.getByRole("button", { name: "Buscar espaços" }));
    await user.type(screen.getByRole("combobox", { name: /onde/i }), "São Paulo, SP");

    expect(screen.getByRole("alert")).not.toHaveTextContent("Escolha São Paulo ou um bairro sugerido.");
    expect(screen.getByRole("alert")).toHaveTextContent("Escolha a ocasião do seu evento.");
  });

  it("keeps mobile selections when returning to an earlier step", async () => {
    const user = userEvent.setup();
    render(<VenueSearch entryPoint="hero" />);

    await user.click(screen.getByRole("button", { name: /encontrar um espaço/i }));
    await user.click(screen.getByRole("button", { name: /^festa$/i }));
    await user.click(screen.getByRole("button", { name: /voltar/i }));

    expect(screen.getByText(/festa selecionada/i)).toBeInTheDocument();
  });

  it("shows readable controls and a cancel action in the first mobile step", async () => {
    const user = userEvent.setup();
    render(<VenueSearch entryPoint="hero" />);

    await user.click(screen.getByRole("button", { name: /encontrar um espaço/i }));

    expect(screen.getByRole("dialog")).toHaveClass("text-[var(--foreground)]");
    expect(screen.getByRole("button", { name: /fechar busca/i })).toHaveTextContent("Fechar");

    await user.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the mobile search from the header action", async () => {
    const user = userEvent.setup();
    render(<><Header /><VenueSearch entryPoint="hero" /></>);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "Buscar" }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("keeps the caret in the mobile location field while it is typed", async () => {
    const user = userEvent.setup();
    render(<VenueSearch entryPoint="hero" />);

    await user.click(screen.getByRole("button", { name: /encontrar um espaço/i }));
    await user.click(screen.getByRole("button", { name: /^festa$/i }));
    const location = within(screen.getByRole("dialog")).getByPlaceholderText(/são paulo ou um bairro/i);
    await user.click(location);
    await user.type(location, "Pinheiros, São Paulo, SP");

    expect(location).toHaveValue("Pinheiros, São Paulo, SP");
    expect(location).toHaveFocus();
  });

  it("accepts a typed guest count instead of only the stepper buttons", async () => {
    const user = userEvent.setup();
    render(<VenueSearch entryPoint="hero" />);

    await user.click(screen.getByRole("button", { name: /encontrar um espaço/i }));
    await user.click(screen.getByRole("button", { name: /^festa$/i }));
    await user.click(screen.getByRole("button", { name: /continuar/i }));
    await user.click(screen.getByRole("button", { name: /continuar/i }));
    const guests = screen.getByLabelText(/quantidade de pessoas/i);
    await user.type(guests, "250");

    expect(guests).toHaveValue(250);
    await user.click(screen.getByRole("button", { name: /diminuir pessoas/i }));
    expect(guests).toHaveValue(249);
  });

  it("renders the mobile sheet outside the hero stacking context", async () => {
    const user = userEvent.setup();
    render(<VenueSearch entryPoint="hero" />);

    await user.click(screen.getByRole("button", { name: /encontrar um espaço/i }));

    expect(screen.getByRole("dialog").closest('[role="presentation"]')?.parentElement).toBe(document.body);
  });

  it("restarts the mobile flow after it is closed", async () => {
    const user = userEvent.setup();
    render(<VenueSearch entryPoint="hero" />);

    await user.click(screen.getByRole("button", { name: /encontrar um espaço/i }));
    await user.click(screen.getByRole("button", { name: /^festa$/i }));
    await user.click(screen.getByRole("button", { name: /fechar busca/i }));
    await user.click(screen.getByRole("button", { name: /encontrar um espaço/i }));

    expect(screen.getByText("Etapa 1 de 4")).toBeInTheDocument();
  });
});
