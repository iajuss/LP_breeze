import type { AnalyticsEvent } from "@/types/content";

export function track(event: AnalyticsEvent, properties?: Record<string, string | number | boolean>): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("breeze:analytics", { detail: { event, properties } }));
}
