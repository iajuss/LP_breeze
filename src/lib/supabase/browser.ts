export const requiredPublicSupabaseEnvironment = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
] as const;

export function getPublicSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
  if (!publishableKey) throw new Error("Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");

  return { publishableKey, url };
}

export function createBrowserSupabaseClient() {
  const { publishableKey, url } = getPublicSupabaseConfig();
  return createBrowserClient(url, publishableKey);
}
import { createBrowserClient } from "@supabase/ssr";
