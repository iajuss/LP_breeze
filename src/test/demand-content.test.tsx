import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Faq } from "@/components/home/faq";
import { faqs } from "@/data/faqs";

it("opens an FAQ answer with the keyboard", async () => {
  const user = userEvent.setup();
  render(<Faq items={faqs} />);
  const trigger = screen.getByRole("button", { name: /como encontro um espaço/i });
  trigger.focus();
  await user.keyboard("{Enter}");
  expect(trigger).toHaveAttribute("aria-expanded", "true");
});
