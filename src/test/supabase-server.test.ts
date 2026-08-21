// @vitest-environment node

import { expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({ getAll: () => [], set: vi.fn() })),
}));

import { createServerSupabaseClient } from "@/lib/supabase/server";

it("creates a cookie-backed server client", async () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");

  await expect(createServerSupabaseClient()).resolves.toMatchObject({ auth: expect.anything() });
  vi.unstubAllEnvs();
});
