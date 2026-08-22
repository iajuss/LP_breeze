import { NextResponse } from "next/server";
import { createPendingInterest } from "@/lib/repositories/interests";
import { validateInterestPayload } from "@/lib/interest-validation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { siteConfig } from "@/config/site";

export async function POST(request: Request) {
  const validation = validateInterestPayload(await request.json());
  if (!validation.ok) return NextResponse.json({ errors: validation.errors }, { status: 422 });
  try {
    const pending = await createPendingInterest(validation.value);
    const supabase = await createServerSupabaseClient();
    const redirect = new URL("/auth/callback", siteConfig.url);
    redirect.searchParams.set("pending", pending.id);
    const { error } = await supabase.auth.signInWithOtp({
      email: validation.value.email,
      options: { emailRedirectTo: redirect.toString(), shouldCreateUser: true },
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    const requestId = crypto.randomUUID();
    console.error("Interest request failed", { error, requestId });
    return NextResponse.json({ error: "Não foi possível enviar o magic link agora. Tente novamente em instantes.", requestId }, { status: 500 });
  }
}
