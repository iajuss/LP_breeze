import { NextResponse } from "next/server";
import { finalizePendingInterest } from "@/lib/repositories/interests";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { siteConfig } from "@/config/site";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const pending = url.searchParams.get("pending");
  if (!code || !pending) return NextResponse.redirect(new URL("/buscar?auth=invalid", siteConfig.url));
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) return NextResponse.redirect(new URL("/buscar?auth=failed", siteConfig.url));
  try {
    await finalizePendingInterest(pending, data.user);
    return NextResponse.redirect(new URL("/interesse-confirmado", siteConfig.url));
  } catch {
    return NextResponse.redirect(new URL("/buscar?auth=failed", siteConfig.url));
  }
}
