# Catálogo múltiplo e origem da demanda Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fazer a busca encontrar espaços ilustrativos compatíveis com múltiplas ocasiões e guardar o bairro residencial declarado em cada lead confirmado.

**Architecture:** O catálogo estático ganha `eventTypes` como fonte de verdade da descoberta, enquanto `category` permanece só como rótulo principal. A busca e o link de detalhe preservam a atividade escolhida para pré-selecionar o formulário. Uma migration aditiva acrescenta o bairro residencial nos registros de interesse e mantém a view operacional explícita quanto a bairro do evento e bairro da pessoa.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Supabase/PostgreSQL, Vitest e Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-24-catalogo-multiplo-e-origem-da-demanda.md`

## Global Constraints

- Os espaços são ilustrativos e mantêm disponibilidade sujeita a confirmação; não adicionar proprietário, preço fixo ou disponibilidade em tempo real.
- Não usar IP, GPS, CEP ou coleta invisível para origem da demanda.
- `residentNeighborhood` é obrigatório, texto livre normalizado de até 100 caracteres e não fica restrito a São Paulo.
- `neighborhood` continua sendo o bairro/local desejado para o evento, validado pela lista de localizações permitidas.
- A migration é aditiva e pode ser executada novamente sem apagar leads ou espaços existentes.
- Não modificar o fluxo de e-mail, suporte ou as políticas existentes além do necessário para a nova migration.
- Toda mudança de comportamento começa com teste que falha pela ausência dessa mudança.

---

### Task 1: Catálogo de ocasiões múltiplas e novos espaços ilustrativos

**Files:**
- Modify: `src/types/content.ts`
- Modify: `src/data/venues.ts`
- Modify: `src/data/search-options.ts`
- Modify: `src/lib/venue-results.ts`
- Test: `src/test/venue-results.test.ts`
- Test: `src/test/venue-card.test.tsx`

**Interfaces:**
- Consumes: `Venue`, `activityOptions`, `filterVenues`.
- Produces: `Venue.eventTypes: string[]`; 20 venues com bairros/capacidades/zonas coerentes; `filterVenues(venues, { activity })` avalia `eventTypes`.

- [ ] **Step 1: Escrever os testes que devem falhar**

```ts
it("finds the Pinheiros venue for a wedding even though Festa is its primary label", () => {
  expect(filterVenues(venues, { activity: "Casamento", location: "Pinheiros, São Paulo, SP" })
    .map((venue) => venue.slug)).toContain("casa-jardim-pinheiros");
});

it("keeps every selectable activity backed by at least one venue", () => {
  activityOptions.forEach((activity) => {
    expect(filterVenues(venues, { activity })).not.toEqual([]);
  });
});

it("exposes the twenty illustrative spaces with more than one occasion where configured", () => {
  expect(venues).toHaveLength(20);
  expect(venues.filter((venue) => venue.eventTypes.length > 1)).not.toEqual([]);
});
```

- [ ] **Step 2: Rodar os testes para confirmar a falha**

Run: `npm test -- src/test/venue-results.test.ts src/test/venue-card.test.tsx`

Expected: FAIL porque `Venue` não tem `eventTypes`, Casamento em Pinheiros não encontra a Casa Jardim Pinheiros e o catálogo tem somente 12 itens.

- [ ] **Step 3: Implementar o mínimo necessário**

```ts
export type Venue = {
  id: string;
  slug: string;
  name: string;
  city: string;
  region: string;
  zone: string;
  capacity: number;
  category: string;
  eventTypes: string[];
  styles: string[];
  image: string;
  imageAlt: string;
  latitude: number;
  longitude: number;
  summary: string;
};

export const venues: Venue[] = [
  { id: "casa-jardim-pinheiros", slug: "casa-jardim-pinheiros", name: "Casa Jardim Pinheiros", city: "São Paulo", region: "Pinheiros", zone: "Oeste", capacity: 120, category: "Festa", eventTypes: ["Festa", "Casamento", "Ensaio"], styles: ["Jardim", "Moderno"], image: photo("1519167758481-83f550bb49b3"), imageAlt: "Casa com jardim para eventos", latitude: -23.5614, longitude: -46.6912, summary: "Casa com área externa para encontros, celebrações e eventos diurnos." },
  { id: "galpao-da-luz", slug: "galpao-da-luz", name: "Galpão da Luz", city: "São Paulo", region: "Luz", zone: "Centro", capacity: 300, category: "Produção", eventTypes: ["Produção", "Workshop", "Lançamento"], styles: ["Industrial", "Estúdio"], image: photo("1497366811353-6870744d04b2"), imageAlt: "Galpão industrial amplo", latitude: -23.5347, longitude: -46.6357, summary: "Galpão amplo, com estrutura flexível para produções e ativações." },
  { id: "terraco-vila-madalena", slug: "terraco-vila-madalena", name: "Terraço Vila Madalena", city: "São Paulo", region: "Vila Madalena", zone: "Oeste", capacity: 180, category: "Evento corporativo", eventTypes: ["Evento corporativo", "Workshop", "Lançamento", "Festa"], styles: ["Rooftop", "Moderno"], image: photo("1497366754035-f200968a6e72"), imageAlt: "Terraço com vista urbana", latitude: -23.5527, longitude: -46.6915, summary: "Terraço urbano para encontros corporativos, workshops e confraternizações." },
];
```

Adicionar os oito itens aprovados com estes valores: Espaço Pompeia (Pompeia/Oeste/220/Festa, Evento corporativo, Lançamento), Villa Butantã (Butantã/Oeste/150/Casamento, Festa, Ensaio), Casa Aclimação (Aclimação/Centro/100/Casamento, Festa, Workshop), Estúdio Berrini (Brooklin/Sul/120/Produção, Evento corporativo, Lançamento), Pavilhão Ibirapuera (Ibirapuera/Sul/350/Evento corporativo, Lançamento, Festa), Sala Consolação (Consolação/Centro/60/Reunião, Workshop), Armazém Brás (Brás/Centro/450/Produção, Lançamento, Festa) e Jardim Anália (Anália Franco/Leste/140/Casamento, Festa, Ensaio). Usar respectivamente `photo("1522083165195-3424ed129620")`, `photo("1511578314322-379afb476865")`, `photo("1464366400600-7168b8af9bc3")`, `photo("1497366754035-f200968a6e72")`, `photo("1521737604893-d14cc237f11d")`, `photo("1497366216548-37526070297c")`, `photo("1531058020387-3be344556be6")` e `photo("1497250681960-ef046c08a56e")`, com texto alternativo específico para cada espaço.

Atualizar os doze existentes assim: Casa Jardim Pinheiros (Festa, Casamento, Ensaio), Galpão da Luz (Produção, Workshop, Lançamento), Terraço Vila Madalena (Evento corporativo, Workshop, Lançamento, Festa), Casa Vila Mariana (Casamento, Festa, Ensaio), Salão Bela Vista (Workshop, Reunião, Evento corporativo), Sobrado Perdizes (Reunião, Workshop), Ateliê Santana (Workshop, Produção, Ensaio), Pátio Casa Verde (Festa, Casamento, Lançamento), Galeria Tatuapé (Evento corporativo, Lançamento, Produção), Armazém Mooca (Produção, Festa, Lançamento), Jardim Moema (Casamento, Festa, Ensaio) e Estúdio Santo Amaro (Produção, Ensaio, Workshop). Em `filterVenues`, comparar `venue.eventTypes.join(" ")` com a atividade canônica. Expandir `locationOptions` com Pompeia, Butantã, Aclimação, Brooklin, Ibirapuera, Consolação, Brás e Anália Franco para que o local desejado continue validado.

- [ ] **Step 4: Rodar os testes para confirmar que passam**

Run: `npm test -- src/test/venue-results.test.ts src/test/venue-card.test.tsx`

Expected: PASS, com Casamento em Pinheiros e toda ocasião retornando resultados.

- [ ] **Step 5: Commit**

```bash
git add src/types/content.ts src/data/venues.ts src/data/search-options.ts src/lib/venue-results.ts src/test/venue-results.test.ts src/test/venue-card.test.tsx
git commit -m "feat: amplia catálogo com ocasiões múltiplas"
```

### Task 2: Preservar a ocasião selecionada até o detalhe

**Files:**
- Modify: `src/components/home/venue-card.tsx`
- Modify: `src/app/buscar/page.tsx`
- Modify: `src/app/espacos/[slug]/page.tsx`
- Test: `src/test/venue-card.test.tsx`
- Test: `src/test/interest-form.test.tsx`

**Interfaces:**
- Consumes: `VenueCard({ venue, regionInterest?, activity? })`, `canonicalActivity`, `InterestForm({ defaultEventType })`.
- Produces: URLs `/espacos/<slug>?activity=<ocasião>&regionInterest=<região>` com query válida; detalhe mostra as ocasiões do espaço e usa a atividade solicitada quando ela pertence a `venue.eventTypes`.

- [ ] **Step 1: Escrever os testes que devem falhar**

```tsx
it("preserves the selected occasion when opening a compatible venue", () => {
  render(<VenueCard venue={venues[0]} activity="Casamento" />);
  expect(screen.getByRole("link", { name: /ver detalhes/i })).toHaveAttribute(
    "href", "/espacos/casa-jardim-pinheiros?activity=Casamento",
  );
});

it("uses the requested compatible activity as the interest form default", async () => {
  const page = await VenuePage({
    params: Promise.resolve({ slug: "casa-jardim-pinheiros" }),
    searchParams: Promise.resolve({ activity: "Casamento" }),
  });
  render(page);
  expect(screen.getByRole("combobox", { name: "Ocasião" })).toHaveTextContent("Casamento");
});
```

- [ ] **Step 2: Rodar os testes para confirmar a falha**

Run: `npm test -- src/test/venue-card.test.tsx src/test/interest-form.test.tsx`

Expected: FAIL porque `VenueCard` não recebe `activity` e o detalhe sempre usa `venue.category`.

- [ ] **Step 3: Implementar o mínimo necessário**

```tsx
const parameters = new URLSearchParams();
if (activity) parameters.set("activity", activity);
if (regionInterest) parameters.set("regionInterest", regionInterest);
const href = parameters.size ? `/espacos/${venue.slug}?${parameters}` : `/espacos/${venue.slug}`;

const requestedActivity = activity && venue.eventTypes.includes(activity) ? activity : venue.category;
```

Na busca, passar `values.activity` a cada `VenueCard`. No detalhe, ler `activity` junto de `regionInterest`, canonicalizar o valor e escolher o fallback `venue.category` se a ocasião estiver ausente ou incompatível. Trocar o valor único de “Indicado para” por `venue.eventTypes.join(" · ")`.

- [ ] **Step 4: Rodar os testes para confirmar que passam**

Run: `npm test -- src/test/venue-card.test.tsx src/test/interest-form.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/venue-card.tsx src/app/buscar/page.tsx src/app/espacos/[slug]/page.tsx src/test/venue-card.test.tsx src/test/interest-form.test.tsx
git commit -m "feat: mantém ocasião até o interesse"
```

### Task 3: Bairro residencial no interesse confirmado

**Files:**
- Create: `supabase/migrations/202608240001_catalog_multiple_and_demand_origin.sql`
- Modify: `src/lib/interest-validation.ts`
- Modify: `src/lib/repositories/interests.ts`
- Test: `src/test/interest-validation.test.ts`
- Test: `src/test/interests-repository.test.ts`
- Test: `src/test/supabase-schema.test.ts`

**Interfaces:**
- Consumes: `InterestPayload.residentNeighborhood`, `pending_interests`, `rental_interests`.
- Produces: `resident_neighborhood` persistido no pedido pendente e no lead confirmado; view `lead_summary` com `event_neighborhood` e `resident_neighborhood`; `public.venues.event_types` alinhado aos vinte itens do catálogo estático.

- [ ] **Step 1: Escrever os testes que devem falhar**

```ts
it("requires and normalizes the resident neighborhood", () => {
  expect(validateInterestPayload({ ...validPayload, residentNeighborhood: "   Moema  " })).toMatchObject({
    ok: true,
    value: { residentNeighborhood: "Moema" },
  });
  expect(validateInterestPayload({ ...validPayload, residentNeighborhood: "" })).toEqual({
    ok: false,
    errors: { residentNeighborhood: "Informe o bairro onde você mora." },
  });
});

it("declares separate event and resident neighborhoods in the lead view", () => {
  const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/202608240001_catalog_multiple_and_demand_origin.sql"), "utf8");
  expect(migration).toContain("event_neighborhood");
  expect(migration).toContain("resident_neighborhood");
});

it("seeds every new illustrative venue and its event types", () => {
  const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/202608240001_catalog_multiple_and_demand_origin.sql"), "utf8");
  ["espaco-pompeia", "villa-butanta", "casa-aclimacao", "estudio-berrini", "pavilhao-ibirapuera", "sala-consolacao", "armazem-bras", "jardim-analia"].forEach((slug) => expect(migration).toContain(slug));
  expect(migration).toContain("event_types = excluded.event_types");
});
```

- [ ] **Step 2: Rodar os testes para confirmar a falha**

Run: `npm test -- src/test/interest-validation.test.ts src/test/interests-repository.test.ts src/test/supabase-schema.test.ts`

Expected: FAIL porque o payload não contém o campo, o repositório não o insere e a migration não existe.

- [ ] **Step 3: Implementar o mínimo necessário**

```sql
alter table public.pending_interests add column if not exists resident_neighborhood text;
alter table public.rental_interests add column if not exists resident_neighborhood text;
update public.pending_interests set resident_neighborhood = 'Não informado' where resident_neighborhood is null;
update public.rental_interests set resident_neighborhood = 'Não informado' where resident_neighborhood is null;
alter table public.pending_interests alter column resident_neighborhood set not null;
alter table public.rental_interests alter column resident_neighborhood set not null;
```

A migration também faz `create or replace view public.lead_summary` selecionando `interest.neighborhood as event_neighborhood` e `interest.resident_neighborhood`, além das colunas atuais de perfil, espaço, ocasião, data, pessoas, orçamento, origem, campanha e perguntas. Ela inclui `with (security_invoker = true)`, `revoke all on public.lead_summary from anon, authenticated` e `grant select on public.lead_summary to service_role`.

Na mesma migration, inserir os oito novos espaços por slug e atualizar todos os vinte com `on conflict (slug) do update set` para `name`, `neighborhood`, `zone`, `latitude`, `longitude`, `capacity`, `event_types`, `amenities` e `pricing_label`. Os oito valores novos são:

```sql
('espaco-pompeia', 'Espaço Pompeia', 'São Paulo', 'Pompeia', 'Oeste', -23.5290, -46.6850, 220, array['Festa', 'Evento corporativo', 'Lançamento'], array['Área ampla', 'Projeção'], 'Valor sob consulta'),
('villa-butanta', 'Villa Butantã', 'São Paulo', 'Butantã', 'Oeste', -23.5710, -46.7080, 150, array['Casamento', 'Festa', 'Ensaio'], array['Jardim', 'Plano B coberto'], 'Valor sob consulta'),
('casa-aclimacao', 'Casa Aclimação', 'São Paulo', 'Aclimação', 'Centro', -23.5740, -46.6320, 100, array['Casamento', 'Festa', 'Workshop'], array['Casa histórica', 'Área externa'], 'Valor sob consulta'),
('estudio-berrini', 'Estúdio Berrini', 'São Paulo', 'Brooklin', 'Sul', -23.6100, -46.6970, 120, array['Produção', 'Evento corporativo', 'Lançamento'], array['Estúdio', 'Estacionamento'], 'Valor sob consulta'),
('pavilhao-ibirapuera', 'Pavilhão Ibirapuera', 'São Paulo', 'Ibirapuera', 'Sul', -23.5870, -46.6570, 350, array['Evento corporativo', 'Lançamento', 'Festa'], array['Pavilhão', 'Acessibilidade'], 'Valor sob consulta'),
('sala-consolacao', 'Sala Consolação', 'São Paulo', 'Consolação', 'Centro', -23.5540, -46.6600, 60, array['Reunião', 'Workshop'], array['Sala reservada', 'Internet'], 'Valor sob consulta'),
('armazem-bras', 'Armazém Brás', 'São Paulo', 'Brás', 'Centro', -23.5450, -46.6070, 450, array['Produção', 'Lançamento', 'Festa'], array['Doca de carga', 'Pé-direito alto'], 'Valor sob consulta'),
('jardim-analia', 'Jardim Anália', 'São Paulo', 'Anália Franco', 'Leste', -23.5590, -46.5660, 140, array['Casamento', 'Festa', 'Ensaio'], array['Jardim', 'Terraço'], 'Valor sob consulta')
```

```ts
if (!value.residentNeighborhood?.trim()) errors.residentNeighborhood = "Informe o bairro onde você mora.";
if (value.residentNeighborhood && value.residentNeighborhood.trim().length > 100) errors.residentNeighborhood = "Informe um bairro com até 100 caracteres.";
```

Adicionar o campo ao tipo, à inserção de `pending_interests`, ao tipo `PendingInterest` e à inserção de `rental_interests` durante a finalização. Atualizar os dados válidos de testes para incluir `residentNeighborhood: "Moema"`.

- [ ] **Step 4: Rodar os testes para confirmar que passam**

Run: `npm test -- src/test/interest-validation.test.ts src/test/interests-repository.test.ts src/test/supabase-schema.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/202608240001_catalog_multiple_and_demand_origin.sql src/lib/interest-validation.ts src/lib/repositories/interests.ts src/test/interest-validation.test.ts src/test/interests-repository.test.ts src/test/supabase-schema.test.ts
git commit -m "feat: registra bairro residencial da demanda"
```

### Task 4: Campo residencial no formulário e verificação integrada

**Files:**
- Modify: `src/components/venue/interest-form.tsx`
- Modify: `src/test/interest-form.test.tsx`
- Modify: `src/test/interest-route.test.ts`
- Modify: `src/test/interest-route-logging.test.ts`

**Interfaces:**
- Consumes: `residentNeighborhood` validado por `/api/interests`, `locationOptions` como sugestões de datalist.
- Produces: formulário com “Onde quer realizar?” e “Em que bairro você mora?”, ambos enviados no payload; feedback de validação da API ao faltar o bairro residencial.

- [ ] **Step 1: Escrever os testes que devem falhar**

```tsx
it("sends the event location and resident neighborhood as separate fields", async () => {
  const user = userEvent.setup();
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
  vi.stubGlobal("fetch", fetchMock);
  render(form);
  await user.type(screen.getByLabelText("Nome"), "Ana Souza");
  await user.type(screen.getByLabelText("E-mail"), "ana@example.com");
  await user.type(screen.getByLabelText("Telefone"), "11999999999");
  await user.type(screen.getByLabelText("Em que bairro você mora?"), "Moema");
  await user.click(screen.getByRole("button", { name: /enviar link de confirmação/i }));
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
    neighborhood: "Pinheiros, São Paulo, SP", residentNeighborhood: "Moema",
  });
});
```

- [ ] **Step 2: Rodar os testes para confirmar a falha**

Run: `npm test -- src/test/interest-form.test.tsx src/test/interest-route.test.ts src/test/interest-route-logging.test.ts`

Expected: FAIL porque o formulário não tem o campo residencial e a rota recebe payload sem ele.

- [ ] **Step 3: Implementar o mínimo necessário**

```tsx
<label className="text-sm font-semibold">
  Onde quer realizar?
  <input defaultValue={defaultLocation} list="interest-locations" name="neighborhood" required />
</label>
<label className="text-sm font-semibold">
  Em que bairro você mora?
  <input aria-describedby="resident-neighborhood-help" list="resident-neighborhoods" name="residentNeighborhood" required />
  <span id="resident-neighborhood-help">Usamos esta informação para entender de onde vem a demanda.</span>
</label>
```

No corpo do `fetch`, incluir `residentNeighborhood: form.get("residentNeighborhood")`. Usar um datalist com `locationOptions` para sugestões, sem bloquear texto livre. Atualizar payloads de rota nos testes para incluir o novo campo.

- [ ] **Step 4: Rodar os testes para confirmar que passam**

Run: `npm test -- src/test/interest-form.test.tsx src/test/interest-route.test.ts src/test/interest-route-logging.test.ts`

Expected: PASS.

- [ ] **Step 5: Executar a verificação completa**

Run: `npm test && npm run lint && npm run build`

Expected: todos retornam código 0.

- [ ] **Step 6: Commit**

```bash
git add src/components/venue/interest-form.tsx src/test/interest-form.test.tsx src/test/interest-route.test.ts src/test/interest-route-logging.test.ts
git commit -m "feat: coleta origem residencial no interesse"
```
