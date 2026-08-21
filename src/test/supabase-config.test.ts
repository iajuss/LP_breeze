import { afterEach, expect, it, vi } from "vitest";
import { createBrowserSupabaseClient, getPublicSupabaseConfig, requiredPublicSupabaseEnvironment } from "@/lib/supabase/browser";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/admin";

afterEach(() => vi.unstubAllEnvs());

it("lists exactly the browser-visible Supabase variables", () => {
  expect(requiredPublicSupabaseEnvironment).toEqual([
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ]);
});

it("explains which public Supabase variable is missing", () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");

  expect(() => getPublicSupabaseConfig()).toThrow("NEXT_PUBLIC_SUPABASE_URL");
});

it("creates a browser client from the public configuration", () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");

  expect(createBrowserSupabaseClient().auth).toBeDefined();
});

it("does not create a service client without the private key", () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");

  expect(() => createServiceRoleSupabaseClient()).toThrow("SUPABASE_SERVICE_ROLE_KEY");
});
