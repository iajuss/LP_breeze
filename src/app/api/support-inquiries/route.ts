import { NextResponse } from "next/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/admin";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json() as { venueSlug?: string; question?: string; contactEmail?: string };
  if (!body.venueSlug || !body.question || body.question.trim().length < 10 || !body.contactEmail || !emailPattern.test(body.contactEmail)) {
    return NextResponse.json({ error: "Preencha uma pergunta e um e-mail válidos." }, { status: 422 });
  }
  try {
    const supabase = createServiceRoleSupabaseClient();
    const { data: venue, error: venueError } = await supabase.from("venues").select("id").eq("slug", body.venueSlug).single();
    if (venueError || !venue) return NextResponse.json({ error: "Espaço não encontrado." }, { status: 404 });
    const { error } = await supabase.from("support_inquiries").insert({ venue_id: (venue as { id: string }).id, question: body.question.trim(), contact_email: body.contactEmail.trim().toLowerCase() });
    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Não foi possível salvar sua pergunta." }, { status: 500 });
  }
}
