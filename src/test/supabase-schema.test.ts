import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";

const migrationPath = resolve(process.cwd(), "supabase/migrations/202608210001_arcora_mvp.sql");

it("creates the private lead view and the operational demand tables", () => {
  const migration = readFileSync(migrationPath, "utf8");

  ["venues", "profiles", "pending_interests", "rental_interests", "support_inquiries", "funnel_events"].forEach((table) => {
    expect(migration).toContain(`create table public.${table}`);
  });
  expect(migration).toContain("create view public.lead_summary");
  expect(migration).toContain("alter table public.rental_interests enable row level security");
  expect(migration).toContain("insert into public.venues");
  expect(migration).not.toContain("'Rio de Janeiro'");
});
