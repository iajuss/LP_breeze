export const requiredPublicSupabaseEnvironment = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

export function getPublicSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
  if (!anonKey) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY.");

  return { anonKey, url };
}

export function createBrowserSupabaseClient() {
  const { anonKey, url } = getPublicSupabaseConfig();
  return createBrowserClient(url, anonKey);
}
import { createBrowserClient } from "@supabase/ssr";
