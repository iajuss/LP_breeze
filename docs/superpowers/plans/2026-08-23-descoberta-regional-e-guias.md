# Descoberta regional e guias Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir que visitantes escolham uma região de interesse no mapa da home, preservem essa preferência até o pedido confirmado e eliminem os destinos/controles de descoberta quebrados.

**Architecture:** Um componente cliente de mapa regional reutilizará MapLibre e botões acessíveis para gerar a URL de busca com `regionInterest`. A preferência seguirá como query string da busca para o detalhe e definirá o valor inicial do formulário; a API e o banco existentes continuam sendo o único lugar de persistência. Os cartões da home passam a usar dados de regiões de São Paulo, enquanto a rota dinâmica de guias resolve os artigos existentes.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, MapLibre GL, Vitest e Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-23-descoberta-por-regiao-e-guias.md`

## Global Constraints

- Reutilizar `interestRegions` e a validação `isInterestRegion`; não criar migration nem analytics de clique.
- Não adicionar dependências novas.
- Usar `var(--primary)` e área mínima de 44 px nos novos CTAs e controles.
- `regionInterest` é preferência, não filtro de disponibilidade: a busca não deve reduzir resultados por ela.
- A inicialização de MapLibre deve continuar bloqueada em JSDOM.
- Toda mudança de comportamento começa com um teste que falha pela ausência desse comportamento.

---

### Task 1: Dados de descoberta e taxonomia de ocasiões

**Files:**
- Modify: `src/data/home-interactions.ts`
- Modify: `src/data/search-options.ts`
- Modify: `src/lib/venue-results.ts`
- Test: `src/test/home-interactions.test.tsx`
- Test: `src/test/search-utils.test.ts`

**Interfaces:**
- Consumes: `PhotoRailItem`, `categories`, `Venue`, `filterVenues`.
- Produces: `cityRailItems` como três cartões Centro/Oeste/Sul e `activityOptions` com `Ensaio` e `Lançamento`; `filterVenues` resolve esses dois nomes para categorias compatíveis do catálogo atual.

- [ ] **Step 1: Escrever os testes que devem falhar**

```tsx
it("links the regional discovery cards to the search with the declared preference", () => {
  render(<DemandSections />);

  expect(screen.getAllByRole("link", { name: /centro/i })[0]).toHaveAttribute("href", "/buscar?regionInterest=Centro");
  expect(screen.getAllByRole("link", { name: /oeste/i })[0]).toHaveAttribute("href", "/buscar?regionInterest=Oeste");
  expect(screen.getAllByRole("link", { name: /sul/i })[0]).toHaveAttribute("href", "/buscar?regionInterest=Sul");
});
```

```ts
it("finds production venues for the new rehearsal activity", () => {
  expect(filterVenues(venues, { activity: "Ensaio" })).toContainEqual(expect.objectContaining({ slug: "galpao-da-luz" }));
});
```

- [ ] **Step 2: Rodar os testes para confirmar a falha**

Run: `npm test -- src/test/home-interactions.test.tsx src/test/search-utils.test.ts`

Expected: FAIL porque os cartões ainda apontam para `/espacos/sao-paulo` e a taxonomia não contém as novas ocasiões.

- [ ] **Step 3: Implementar o mínimo necessário**

```ts
export const cityRailItems: PhotoRailItem[] = [
  { id: "centro", title: "Centro", subtitle: "São Paulo", href: "/buscar?regionInterest=Centro", image: unsplash("1522083165195-3424ed129620"), imageAlt: "Centro de São Paulo" },
  { id: "oeste", title: "Oeste", subtitle: "São Paulo", href: "/buscar?regionInterest=Oeste", image: unsplash("1500534314209-a25ddb2bd429"), imageAlt: "Região oeste de São Paulo" },
  { id: "sul", title: "Sul", subtitle: "São Paulo", href: "/buscar?regionInterest=Sul", image: unsplash("1520301255226-bf5f144451c1"), imageAlt: "Região sul de São Paulo" },
];

export const activityOptions = ["Festa", "Casamento", "Evento corporativo", "Reunião", "Workshop", "Produção", "Ensaio", "Lançamento"] as const;
```

Em `filterVenues`, aplicar aliases antes de comparar a atividade: `Ensaio` procura `Produção` e `Lançamento` procura `Evento corporativo`. Assim a nova opção retorna um espaço do catálogo sem alterar nome, foto, slug ou zona dos venues.

- [ ] **Step 4: Rodar os testes para confirmar que passam**

Run: `npm test -- src/test/home-interactions.test.tsx src/test/search-utils.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/home-interactions.ts src/data/search-options.ts src/data/venues.ts src/test/home-interactions.test.tsx src/test/search-utils.test.ts
git commit -m "feat: amplia descoberta por ocasião e região"
```

### Task 2: Mapa regional acessível na página inicial

**Files:**
- Create: `src/components/home/region-interest-map.tsx`
- Modify: `src/components/home/demand-sections.tsx`
- Test: `src/test/region-interest-map.test.tsx`

**Interfaces:**
- Consumes: `interestRegions`, `maplibregl.Map`, `next/link` ou `window.location` controlado pelo componente.
- Produces: `RegionInterestMap`, um componente cliente que aceita nenhuma prop e abre `/buscar?regionInterest=<InterestRegion>` somente após uma região válida ser selecionada.

- [ ] **Step 1: Escrever os testes que devem falhar**

```tsx
it("selects a region with an accessible button and exposes its search link", async () => {
  const user = userEvent.setup();
  render(<RegionInterestMap />);

  await user.click(screen.getByRole("button", { name: "Oeste" }));

  expect(screen.getByRole("button", { name: "Oeste" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("link", { name: /ver espaços nesta região/i })).toHaveAttribute("href", "/buscar?regionInterest=Oeste");
});

it("renders the five text alternatives without creating a map in JSDOM", () => {
  render(<RegionInterestMap />);
  expect(screen.getByLabelText("Mapa para escolher região de interesse")).toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: /centro|norte|sul|leste|oeste/i })).toHaveLength(5);
});
```

- [ ] **Step 2: Rodar o teste para confirmar a falha**

Run: `npm test -- src/test/region-interest-map.test.tsx`

Expected: FAIL porque `RegionInterestMap` ainda não existe.

- [ ] **Step 3: Implementar o mínimo necessário**

```tsx
const regionCoordinates: Record<InterestRegion, [number, number]> = {
  Centro: [-46.6337, -23.5505], Norte: [-46.6504, -23.4758],
  Sul: [-46.6377, -23.625], Leste: [-46.4900, -23.543], Oeste: [-46.7100, -23.555],
};

export function RegionInterestMap() {
  const [selected, setSelected] = useState<InterestRegion>();
  const href = selected ? `/buscar?regionInterest=${encodeURIComponent(selected)}` : undefined;
  // O useEffect retorna imediatamente em JSDOM e cria um Marker por chave de regionCoordinates no navegador.
  // Cada marcador e cada botão executa setSelected(region); o Link condicional usa href.
}
```

Inserir a seção depois da trilha “Por ocasião”, com título “Onde você quer realizar seu evento?”, texto explicativo e grid de uma coluna no celular/duas no desktop. O container do mapa usa `aria-label="Mapa para escolher região de interesse"` e altura confortável para toque.

- [ ] **Step 4: Rodar o teste para confirmar que passa**

Run: `npm test -- src/test/region-interest-map.test.tsx src/test/home-interactions.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/region-interest-map.tsx src/components/home/demand-sections.tsx src/test/region-interest-map.test.tsx
git commit -m "feat: adiciona mapa de interesse por região"
```

### Task 3: Propagar a preferência até o formulário de interesse

**Files:**
- Modify: `src/components/home/venue-card.tsx`
- Modify: `src/app/buscar/page.tsx`
- Modify: `src/app/espacos/[slug]/page.tsx`
- Modify: `src/components/venue/interest-form.tsx`
- Test: `src/test/venue-card.test.tsx`
- Test: `src/test/interest-form.test.tsx`
- Test: `src/test/search.test.tsx`

**Interfaces:**
- Consumes: `isInterestRegion(value)`, `VenueCard({ venue, regionInterest? })`, `InterestForm({ defaultInterestRegion? })`.
- Produces: uma query `regionInterest` válida preservada da busca ao detalhe e usada como `defaultValue` do campo de interesse; query inválida não substitui a zona do espaço.

- [ ] **Step 1: Escrever os testes que devem falhar**

```tsx
it("preserves a declared region in the venue detail link", () => {
  render(<VenueCard venue={venues[0]} regionInterest="Oeste" />);
  expect(screen.getByRole("link", { name: /ver detalhes/i })).toHaveAttribute("href", "/espacos/casa-jardim-pinheiros?regionInterest=Oeste");
});
```

```tsx
it("preselects the region carried from the discovery map", () => {
  render(<InterestForm defaultEventType="Festa" defaultGuests={80} defaultLocation="Pinheiros, São Paulo, SP" defaultInterestRegion="Leste" venueSlug="casa-jardim-pinheiros" />);
  expect(screen.getByLabelText("Região de interesse")).toHaveTextContent("Leste");
});
```

Adicionar ao teste da busca uma asserção de que `regionInterest` aparece como “Região de interesse” no resumo, mas a contagem de resultados não é filtrada por ela.

- [ ] **Step 2: Rodar os testes para confirmar a falha**

Run: `npm test -- src/test/venue-card.test.tsx src/test/interest-form.test.tsx src/test/search.test.tsx`

Expected: FAIL porque `VenueCard` não aceita a prop, a busca não mostra a preferência e o formulário não recebe a query.

- [ ] **Step 3: Implementar o mínimo necessário**

```tsx
export function VenueCard({ venue, featured = false, regionInterest }: {
  venue: Venue; featured?: boolean; regionInterest?: InterestRegion;
}) {
  const href = regionInterest ? `/espacos/${venue.slug}?regionInterest=${encodeURIComponent(regionInterest)}` : `/espacos/${venue.slug}`;
  return <article><Link aria-label={`Ver detalhes de ${venue.name}`} href={href}><div role="img" /></Link><Link href={href}>{venue.name}</Link></article>;
}
```

Estender o tipo de search params com `regionInterest?: string`; validar com `isInterestRegion` no detalhe. Na busca, passar somente a região válida para cada `VenueCard`, exibir essa informação no resumo e mantê-la ao construir `searchHref`. No detalhe, passar a preferência válida para `InterestForm`, com `venue.zone` como fallback. Não alterar a chamada da API, pois ela já usa o campo do formulário.

- [ ] **Step 4: Rodar os testes para confirmar que passam**

Run: `npm test -- src/test/venue-card.test.tsx src/test/interest-form.test.tsx src/test/search.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/venue-card.tsx src/app/buscar/page.tsx src/app/espacos/[slug]/page.tsx src/components/venue/interest-form.tsx src/test/venue-card.test.tsx src/test/interest-form.test.tsx src/test/search.test.tsx
git commit -m "feat: preserva região até o pedido de interesse"
```

### Task 4: Seletor Arcora e CTA de suporte

**Files:**
- Create: `src/components/ui/arcora-select.tsx`
- Modify: `src/components/venue/interest-form.tsx`
- Modify: `src/components/venue/support-form.tsx`
- Test: `src/test/interest-form.test.tsx`
- Test: `src/test/support-form.test.tsx`

**Interfaces:**
- Consumes: `ArcoraSelect({ label, name, options, defaultValue })`, `activityOptions`, `interestRegions`.
- Produces: seletor de valor controlado por input oculto, botão `combobox`, menu `listbox` abaixo do campo e opções acessíveis; o `FormData` continua recebendo `eventType` e `regionInterest`.

- [ ] **Step 1: Escrever os testes que devem falhar**

```tsx
it("uses the branded occasion selector and submits its selected value", async () => {
  const user = userEvent.setup();
  render(form);
  await user.click(screen.getByRole("combobox", { name: "Ocasião" }));
  expect(screen.getByRole("listbox", { name: "Ocasião" })).toHaveClass("top-full", "bg-[var(--primary)]");
  await user.click(screen.getByRole("option", { name: "Ensaio" }));
  await user.type(screen.getByLabelText("Nome"), "Ana Souza");
  await user.type(screen.getByLabelText("E-mail"), "ana@example.com");
  await user.type(screen.getByLabelText("Telefone"), "11999999999");
  await user.click(screen.getByRole("button", { name: /enviar link de confirmação/i }));
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ eventType: "Ensaio" });
});
```

```tsx
it("uses the filled primary treatment for the support CTA", () => {
  render(<SupportForm venueSlug="casa-jardim-pinheiros" />);
  expect(screen.getByRole("button", { name: "Enviar pergunta" })).toHaveClass("bg-[var(--primary)]", "text-white");
});
```

- [ ] **Step 2: Rodar os testes para confirmar a falha**

Run: `npm test -- src/test/interest-form.test.tsx src/test/support-form.test.tsx`

Expected: FAIL porque o formulário ainda contém selects nativos e o CTA de suporte é contornado.

- [ ] **Step 3: Implementar o mínimo necessário**

```tsx
export function ArcoraSelect({ label, name, options, defaultValue }: Props) {
  const [value, setValue] = useState(defaultValue ?? options[0]?.value ?? "");
  const [open, setOpen] = useState(false);
  return <div className="relative">
    <input name={name} type="hidden" value={value} />
    <button aria-expanded={open} aria-haspopup="listbox" className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-left" role="combobox">{selectedLabel}<ArcoraChevron /></button>
    {open ? <div aria-label={label} className="absolute top-full z-20 mt-1 w-full rounded-xl bg-[var(--primary)] p-1 text-white shadow-lg" role="listbox">{options.map((option) => <button key={option.value} role="option" aria-selected={option.value === value}>{option.label}</button>)}</div> : null}
  </div>;
}
```

Implementar fechamento por Escape e seleção por clique/teclado, mantendo o foco no gatilho após escolha. Substituir apenas os dois selects de `InterestForm`, conservando os demais inputs. Tornar “Enviar pergunta” `bg-[var(--primary)] text-white` com hover e `min-h-12`.

- [ ] **Step 4: Rodar os testes para confirmar que passam**

Run: `npm test -- src/test/interest-form.test.tsx src/test/support-form.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/arcora-select.tsx src/components/venue/interest-form.tsx src/components/venue/support-form.tsx src/test/interest-form.test.tsx src/test/support-form.test.tsx
git commit -m "feat: padroniza seletores e CTA de suporte"
```

### Task 5: Páginas dos Guias Arcora

**Files:**
- Create: `src/app/guias/[slug]/page.tsx`
- Create: `src/test/guides.test.tsx`
- Modify: `src/components/home/demand-sections.tsx`
- Test: `src/test/home-interactions.test.tsx`

**Interfaces:**
- Consumes: `articles` de `src/data/editorial.ts`, `notFound`, `Link`.
- Produces: rota `/guias/[slug]` que encontra artigo por slug e exibe título, resumo, três recomendações específicas por artigo e CTA para `/buscar`; slug inválido chama `notFound()`.

- [ ] **Step 1: Escrever os testes que devem falhar**

```tsx
it("renders the corporate venue guide with its practical CTA", async () => {
  const page = await GuidePage({ params: Promise.resolve({ slug: "escolher-espaco-evento-corporativo" }) });
  render(page);
  expect(screen.getByRole("heading", { name: /como escolher um espaço/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /buscar espaços/i })).toHaveAttribute("href", "/buscar?activity=Evento+corporativo");
});
```

```tsx
it("returns notFound for an unknown guide slug", async () => {
  await expect(GuidePage({ params: Promise.resolve({ slug: "inexistente" }) })).rejects.toThrow();
});
```

- [ ] **Step 2: Rodar o teste para confirmar a falha**

Run: `npm test -- src/test/guides.test.tsx`

Expected: FAIL porque a rota não existe.

- [ ] **Step 3: Implementar o mínimo necessário**

```tsx
const guideDetails: Record<string, { points: string[]; href: string }> = {
  "escolher-espaco-evento-corporativo": { href: "/buscar?activity=Evento+corporativo", points: ["Defina o objetivo do encontro e o formato da agenda.", "Confirme capacidade, acessibilidade e infraestrutura técnica.", "Compare localização e experiência de chegada para sua equipe."] },
  "checklist-espaco-casamento": { href: "/buscar?activity=Casamento", points: ["Liste prioridades do casal e número estimado de convidados.", "Observe plano B para chuva, horários e regras do local.", "Visite os finalistas com fornecedores que precisam de estrutura."] },
  "calcular-capacidade-evento": { href: "/buscar", points: ["Comece pela quantidade esperada e inclua uma margem realista.", "Considere o formato: auditório, mesas, coquetel ou pista.", "Reserve circulação, apoio técnico e áreas de serviço no cálculo."] },
};
```

Criar uma página com leitura confortável no celular, breadcrumb para home, título e resumo do artigo, lista de recomendações e botão verde “Buscar espaços”. Atualizar o título da seção de regiões na home conforme a especificação.

- [ ] **Step 4: Rodar o teste para confirmar que passa**

Run: `npm test -- src/test/guides.test.tsx src/test/home-interactions.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/guias/[slug]/page.tsx src/components/home/demand-sections.tsx src/test/guides.test.tsx src/test/home-interactions.test.tsx
git commit -m "feat: publica guias Arcora"
```

### Task 6: Verificação integrada e revisão visual

**Files:**
- Modify: arquivos das tasks anteriores apenas se a verificação revelar um defeito.
- Test: toda a suíte `src/test` e os testes E2E existentes, se houverem.

**Interfaces:**
- Consumes: implementação final das tasks 1–5.
- Produces: build, lint e testes sem falhas; home e detalhe responsivos conferidos em navegador.

- [ ] **Step 1: Rodar a suíte e confirmar compatibilidade**

Run: `npm test`

Expected: PASS, incluindo testes antigos e novos.

- [ ] **Step 2: Executar as verificações de entrega**

Run: `npm run lint && npm run build`

Expected: ambos retornam código 0.

- [ ] **Step 3: Conferir visualmente os fluxos essenciais**

Run: `npm run dev`

Verificar em viewport de celular e desktop: seleção dos cinco botões de mapa, CTA de busca regional, URL preservada até o formulário, seleção da ocasião para baixo, CTA verde de pergunta, cartões regionais e três URLs de guia.

- [ ] **Step 4: Commit de correções de verificação, se necessárias**

```bash
git add src
git commit -m "fix: ajusta descoberta regional"
```
