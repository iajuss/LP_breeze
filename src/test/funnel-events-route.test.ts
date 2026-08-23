// @vitest-environment node

import { afterEach, expect, it, vi } from "vitest";

const { insert } = vi.hoisted(() => ({ insert: vi.fn() }));

vi.mock("@/lib/supabase/admin", () => ({
  createServiceRoleSupabaseClient: () => ({ from: () => ({ insert }) }),
}));

const { POST } = await import("@/app/api/funnel-events/route");

const post = (body: unknown) => POST(new Request("https://arcora.example/api/funnel-events", { method: "POST", body: JSON.stringify(body) }));

afterEach(() => insert.mockReset());

it("registra a região escolhida sem vincular a nenhum usuário", async () => {
  insert.mockResolvedValue({ error: null });

  const response = await post({ event: "region_interest_selected", properties: { regionInterest: "Norte", sessionId: "anon-123" } });

  expect(response.status).toBe(201);
  const row = insert.mock.calls[0][0] as Record<string, unknown>;
  expect(row).toMatchObject({ event_name: "region_interest_selected", interested_region: "Norte", session_id: "anon-123" });
  expect(Object.keys(row)).not.toContain("user_id");
  expect(row.occurred_at).toEqual(expect.any(String));
});

it("descarta uma região fora das cinco zonas de São Paulo", async () => {
  insert.mockResolvedValue({ error: null });

  await post({ event: "region_interest_selected", properties: { regionInterest: "Nordeste" } });

  expect(Object.keys(insert.mock.calls[0][0] as Record<string, unknown>)).not.toContain("interested_region");
});

it("omite a coluna de região nos demais eventos, para sobreviver a um deploy anterior à migration", async () => {
  insert.mockResolvedValue({ error: null });

  await post({ event: "search_started", properties: { sessionId: "anon-9" } });

  const row = insert.mock.calls[0][0] as Record<string, unknown>;
  expect(Object.keys(row)).not.toContain("interested_region");
  expect(row.event_name).toBe("search_started");
});

it("recusa um evento que não pertence ao funil", async () => {
  const response = await post({ event: "regiao_inventada", properties: {} });

  expect(response.status).toBe(422);
  expect(insert).not.toHaveBeenCalled();
});
