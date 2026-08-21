import { NextResponse } from "next/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/admin";

const eventNames = new Set([
  "search_started", "search_submitted", "activity_selected", "location_selected", "date_selected",
  "guest_count_selected", "venue_card_clicked", "category_clicked", "city_clicked", "corporate_cta_clicked", "signup_clicked",
]);

export async function POST(request: Request) {
  const payload = await request.json() as { event?: unknown; properties?: Record<string, unknown> };
  if (typeof payload.event !== "string" || !eventNames.has(payload.event)) return NextResponse.json({ error: "Evento inválido." }, { status: 422 });
  const properties = payload.properties ?? {};
  try {
    const supabase = createServiceRoleSupabaseClient();
    const { error } = await supabase.from("funnel_events").insert({
      event_name: payload.event,
      venue_id: typeof properties.venueId === "string" ? properties.venueId : null,
      event_type: typeof properties.eventType === "string" ? properties.eventType : null,
      neighborhood: typeof properties.neighborhood === "string" ? properties.neighborhood : null,
      event_date: typeof properties.eventDate === "string" ? properties.eventDate : null,
      guest_count: typeof properties.guestCount === "number" ? properties.guestCount : null,
      budget: typeof properties.budget === "string" ? properties.budget : null,
      displayed_price: typeof properties.displayedPrice === "string" ? properties.displayedPrice : null,
      source: typeof properties.source === "string" ? properties.source : null,
      campaign: typeof properties.campaign === "string" ? properties.campaign : null,
      session_id: typeof properties.sessionId === "string" ? properties.sessionId : null,
      occurred_at: new Date().toISOString(),
    });
    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Não foi possível registrar o evento." }, { status: 500 });
  }
}
