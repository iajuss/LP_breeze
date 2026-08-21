import { describe, expect, it, vi } from "vitest";
import { track } from "@/lib/analytics";
import { trustItems } from "@/data/trust";

describe("provider-neutral analytics", () => {
  it("dispatches a provider-neutral analytics event", () => {
    const listener = vi.fn();
    window.addEventListener("arcora:analytics", listener);

    track("search_started", { entryPoint: "hero" });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0]).toMatchObject({
      type: "arcora:analytics",
      detail: { event: "search_started", properties: { entryPoint: "hero" } },
    });
    window.removeEventListener("arcora:analytics", listener);
  });

  it("uses neutral trust copy without invented proof points", () => {
    expect(trustItems.every((item) => !/mil|clientes|avali/i.test(item.description))).toBe(true);
  });
});
