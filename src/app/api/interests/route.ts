import { NextResponse } from "next/server";
import { createPendingInterest } from "@/lib/repositories/interests";
import { validateInterestPayload } from "@/lib/interest-validation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { siteConfig } from "@/config/site";

function isEmailRateLimited(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "over_email_send_rate_limit";
}

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
    if (isEmailRateLimited(error)) {
      return NextResponse.json({ error: "Aguarde alguns segundos antes de pedir outro link de confirmação." }, { status: 429 });
    }
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    const requestId = crypto.randomUUID();
    console.error("Interest request failed", { error, requestId });
    return NextResponse.json({ error: "Não foi possível enviar o link de confirmação agora. Tente novamente em instantes.", requestId }, { status: 500 });
  }
}
