import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPublicSupabaseConfig } from "./browser";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const { anonKey, url } = getPublicSupabaseConfig();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, options, value }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot update cookies; Route Handlers can.
        }
      },
    },
  });
}
