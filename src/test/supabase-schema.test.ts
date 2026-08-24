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

it("stores a user's broader region preference separately from the venue location", () => {
  const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/202608210002_region_interest.sql"), "utf8");
  expect(migration).toContain("interested_region");
  expect(migration).toContain("lead_summary");
});

it("declares separate event and resident neighborhoods in the lead view", () => {
  const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/202608240001_catalog_multiple_and_demand_origin.sql"), "utf8");
  const leadView = migration.slice(migration.lastIndexOf("create or replace view public.lead_summary"));
  const legacyColumns = [
    "interest.id,", "interest.created_at,", "interest.status,", "profile.name,", "profile.email,", "profile.phone,",
    "venue.name as venue_name,", "venue.slug as venue_slug,", "venue.neighborhood as venue_neighborhood,", "interest.event_type,",
    "interest.event_date,", "interest.guest_count,", "interest.budget,", "interest.displayed_price,", "interest.source,",
    "interest.campaign,", "count(inquiry.id)::integer as inquiry_count,", "max(inquiry.created_at) as latest_inquiry_at,", "interest.interested_region,",
  ];
  const positions = legacyColumns.map((column) => leadView.indexOf(column));

  expect(positions.every((position) => position >= 0)).toBe(true);
  expect(positions).toEqual([...positions].sort((left, right) => left - right));
  expect(leadView.indexOf("interest.neighborhood as event_neighborhood,")).toBeGreaterThan(positions.at(-1)!);
  expect(migration).toContain("event_neighborhood");
  expect(migration).toContain("resident_neighborhood");
  expect(migration).toContain("grant select on public.lead_summary to service_role");
});

it("seeds every new illustrative venue and its event types", () => {
  const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/202608240001_catalog_multiple_and_demand_origin.sql"), "utf8");
  ["espaco-pompeia", "villa-butanta", "casa-aclimacao", "estudio-berrini", "pavilhao-ibirapuera", "sala-consolacao", "armazem-bras", "jardim-analia"].forEach((slug) => expect(migration).toContain(slug));
  expect(migration).toContain("event_types = excluded.event_types");
});

it("keeps migration coordinates aligned with the static venue catalogue", () => {
  const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/202608240001_catalog_multiple_and_demand_origin.sql"), "utf8");

  expect(migration).toContain("'espaco-pompeia', 'Espaço Pompeia', 'São Paulo', 'Pompeia', 'Oeste', -23.5290, -46.6900");
  expect(migration).toContain("'sala-consolacao', 'Sala Consolação', 'São Paulo', 'Consolação', 'Centro', -23.5530, -46.6600");
  expect(migration).toContain("'armazem-bras', 'Armazém Brás', 'São Paulo', 'Brás', 'Centro', -23.5470, -46.6160");
  expect(migration).toContain("'jardim-analia', 'Jardim Anália', 'São Paulo', 'Anália Franco', 'Leste', -23.5600, -46.5650");
});
