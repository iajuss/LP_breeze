import { describe, expect, it, vi } from "vitest";
import { track } from "@/lib/analytics";
import { trustItems } from "@/data/trust";

describe("provider-neutral analytics", () => {
  it("dispatches a provider-neutral analytics event", () => {
    const listener = vi.fn();
    window.addEventListener("breeze:analytics", listener);

    track("search_started", { entryPoint: "hero" });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0]).toMatchObject({
      type: "breeze:analytics",
      detail: { event: "search_started", properties: { entryPoint: "hero" } },
    });
    window.removeEventListener("breeze:analytics", listener);
  });

  it("marks all demonstration trust content as demo", () => {
    expect(trustItems.every((item) => item.isDemo)).toBe(true);
  });
});
