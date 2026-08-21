import type { AnalyticsEvent } from "@/types/content";

export function track(event: AnalyticsEvent, properties?: Record<string, string | number | boolean>): void {
  if (typeof window === "undefined") return;
  const detail = { event, properties };
  window.dispatchEvent(new CustomEvent("arcora:analytics", { detail }));
  void fetch("/api/funnel-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(detail),
  }).catch(() => undefined);
}
