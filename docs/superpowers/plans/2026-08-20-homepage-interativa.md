# Homepage Interativa Breeze Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar as seções de descoberta e conversão da Breeze em experiências fotográficas interativas, distintas entre si e responsivas.

**Architecture:** Extrair módulos clientes focados para os padrões que realmente têm estado: trilhos fotográficos, painel de estilos, vitrine corporativa e linha do tempo de critérios. `DemandSections` continua como composição de servidor; dados demonstrativos de fotos e descrições ficam em um módulo dedicado, para que a apresentação não espalhe URLs e copy pelo JSX.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Vitest, React Testing Library e `@testing-library/user-event`.

**Spec:** `docs/superpowers/specs/2026-08-20-homepage-interativa-design.md`

## Global Constraints

- A landing continua exclusiva para aquisição de demanda; não incluir CTA ou mensagem para proprietários ou anúncio de espaços.
- Usar fotos demonstrativas variadas: arquitetura e ambientes para descoberta; pessoas usando os espaços para cenários corporativos.
- Não usar autoplay; todas as trocas de conteúdo são iniciadas pela pessoa.
- Preservar controles de ao menos 44 px, foco visível, navegação por teclado, texto alternativo e `prefers-reduced-motion`.
- Preservar as rotas atuais de categoria, estilo, cidade e CTA corporativo.
- Manter FAQ sem mudança de comportamento.
- Validar com `npm run test`, `npx tsc --noEmit`, `npm run lint`, inspeção em 390 px e desktop; não executar `npm run build` enquanto `npm run dev` estiver ativo.

---

## File Structure

| Path | Responsibility |
| --- | --- |
| `src/data/home-interactions.ts` | Fotos, alt texts, copy de estilo, cenários corporativos e detalhes de confiança demonstrativos. |
| `src/components/home/photo-rail.tsx` | Trilho horizontal reutilizável, com setas, rolagem e cards acessíveis. |
| `src/components/home/style-explorer.tsx` | Painel com abas de estilos e foto ativa. |
| `src/components/home/corporate-showcase.tsx` | Vitrine de cenários corporativos, foto e CTA de demanda. |
| `src/components/home/trust-timeline.tsx` | Linha do tempo interativa para os três critérios de escolha. |
| `src/components/home/demand-sections.tsx` | Composição dos novos módulos no lugar das grades e blocos estáticos. |
| `src/test/home-interactions.test.tsx` | Cobertura de navegação por controles, seleção de painéis e destinos. |
| `src/test/demand-content.test.tsx` | Regressão da seção existente “Como funciona”. |

### Task 1: Criar dados visuais e o trilho fotográfico reutilizável

**Files:**
- Create: `src/data/home-interactions.ts`
- Create: `src/components/home/photo-rail.tsx`
- Create: `src/test/home-interactions.test.tsx`

**Interfaces:**
- Produces: `PhotoRailItem` com `{ id, title, subtitle, href, image, imageAlt }`.
- Produces: `<PhotoRail ariaLabel={string} items={PhotoRailItem[]} />`, com rolagem por setas e cards em links semânticos.
- Consumes: nenhum componente de home existente.

- [ ] **Step 1: Escrever o teste que exige os controles do trilho**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PhotoRail } from "@/components/home/photo-rail";

const items = [
  { id: "a", title: "Festas", subtitle: "Celebrações", href: "/buscar?activity=Festas", image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3", imageAlt: "Celebração em um salão" },
  { id: "b", title: "Casamentos", subtitle: "Momentos especiais", href: "/buscar?activity=Casamentos", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3", imageAlt: "Mesa de casamento" },
];

it("exposes photo-rail controls and preserves card destinations", async () => {
  const user = userEvent.setup();
  render(<PhotoRail ariaLabel="Ocasiões" items={items} />);
  await user.click(screen.getByRole("button", { name: "Avançar Ocasiões" }));
  expect(screen.getByRole("link", { name: /festas/i })).toHaveAttribute("href", "/buscar?activity=Festas");
});
```

- [ ] **Step 2: Rodar o teste para confirmar falha inicial**

Run: `npx vitest run src/test/home-interactions.test.tsx`  
Expected: FAIL porque `@/components/home/photo-rail` ainda não existe.

- [ ] **Step 3: Implementar os dados e o componente mínimo**

Criar `home-interactions.ts` com imagens Unsplash distintas para categorias, cidades, artigos, estilos, cenários corporativos e critérios de confiança. Exportar coleções já no formato abaixo, sem reusar a foto do hero nas novas seções:

```ts
export type PhotoRailItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
  imageAlt: string;
};
```

Implementar `PhotoRail` como componente cliente. Usar `useRef<HTMLDivElement>(null)` para o contêiner `overflow-x-auto snap-x snap-mandatory`; as setas chamam `scrollBy({ left: container.clientWidth * .82, behavior: "smooth" })` e a inversa para voltar. Os cards são `<Link>` com `min-w-[78vw] sm:min-w-[20rem] lg:min-w-[24rem]`, `snap-start`, foto de fundo, gradiente de contraste, título e subtítulo. Renderizar os botões somente como controles de rolagem, com `aria-label={`Voltar ${ariaLabel}`}` e `aria-label={`Avançar ${ariaLabel}`}`.

- [ ] **Step 4: Rodar o teste focado para confirmar aprovação**

Run: `npx vitest run src/test/home-interactions.test.tsx`  
Expected: PASS; o botão e o link com destino preservado são encontrados.

- [ ] **Step 5: Registrar o primeiro módulo**

```powershell
git add src/data/home-interactions.ts src/components/home/photo-rail.tsx src/test/home-interactions.test.tsx
git commit -m "Adiciona trilho fotografico reutilizavel"
```

### Task 2: Converter ocasião, cidades e guia em trilhos fotográficos

**Files:**
- Modify: `src/components/home/demand-sections.tsx`
- Modify: `src/test/home-interactions.test.tsx`

**Interfaces:**
- Consumes: `PhotoRail`, `categoryRailItems`, `cityRailItems` e `editorialRailItems` de `home-interactions.ts`.
- Produces: três seções de navegação horizontal com destinos existentes e fotos específicas.

- [ ] **Step 1: Escrever testes para os três destinos preservados**

```tsx
import { DemandSections } from "@/components/home/demand-sections";

it("keeps demand destinations in the interactive discovery rails", () => {
  render(<DemandSections />);
  expect(screen.getByRole("link", { name: /festas/i })).toHaveAttribute("href", "/buscar?activity=Festas");
  expect(screen.getByRole("link", { name: /são paulo/i })).toHaveAttribute("href", "/espacos/sao-paulo");
  expect(screen.getByRole("link", { name: /espaço para evento corporativo/i })).toHaveAttribute("href", "/guias/escolher-espaco-evento-corporativo");
});
```

- [ ] **Step 2: Rodar os testes e observar a falha esperada**

Run: `npx vitest run src/test/home-interactions.test.tsx`  
Expected: FAIL porque o Guia ainda não tem links editoriais e as seções ainda não usam os itens de trilho.

- [ ] **Step 3: Substituir as grades estáticas por trilhos**

Em `DemandSections`, trocar a grade de categoria, a grade de cidades e os cards editoriais por `PhotoRail`. Manter títulos, labels e `min-h-screen` das seções. Usar:

```tsx
<PhotoRail ariaLabel="Ocasiões" items={categoryRailItems} />
<PhotoRail ariaLabel="Cidades" items={cityRailItems} />
<PhotoRail ariaLabel="Guias Breeze" items={editorialRailItems} />
```

Os itens editoriais apontam para `/guias/${article.slug}`. Caso a rota ainda não exista, o link permanece uma navegação semântica futura e não afirma que o artigo está publicado; o card usa a etiqueta `Guia Breeze` em vez de `Conteúdo em breve`.

- [ ] **Step 4: Rodar os testes focados e a regressão de conteúdo**

Run: `npx vitest run src/test/home-interactions.test.tsx src/test/demand-content.test.tsx`  
Expected: PASS; FAQ e o carrossel “Como funciona” continuam passando.

- [ ] **Step 5: Registrar os trilhos de descoberta**

```powershell
git add src/components/home/demand-sections.tsx src/test/home-interactions.test.tsx
git commit -m "Transforma descoberta em trilhos fotograficos"
```

### Task 3: Criar o painel editorial de estilos

**Files:**
- Create: `src/components/home/style-explorer.tsx`
- Modify: `src/components/home/demand-sections.tsx`
- Modify: `src/test/home-interactions.test.tsx`

**Interfaces:**
- Consumes: `stylePanels` de `home-interactions.ts`, cada item com `id`, `name`, `slug`, `description`, `image` e `imageAlt`.
- Produces: `<StyleExplorer />` com `role="tablist"`, painel ativo e link `/buscar?style=${slug}`.

- [ ] **Step 1: Escrever o teste da troca de estilo**

```tsx
import { StyleExplorer } from "@/components/home/style-explorer";

it("changes the active style panel", async () => {
  const user = userEvent.setup();
  render(<StyleExplorer />);
  await user.click(screen.getByRole("tab", { name: "Jardim" }));
  expect(screen.getByRole("heading", { name: "Jardim" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /explorar espaços com estilo jardim/i })).toHaveAttribute("href", "/buscar?style=jardim");
});
```

- [ ] **Step 2: Rodar o teste e confirmar falha inicial**

Run: `npx vitest run src/test/home-interactions.test.tsx`  
Expected: FAIL porque `StyleExplorer` ainda não existe.

- [ ] **Step 3: Implementar painel e abas acessíveis**

Criar um componente cliente com `activeStyleId` iniciado em `rooftop`. Renderizar os nomes como botões com `role="tab"`, `aria-selected`, `aria-controls="painel-estilo"` e área mínima de 44 px. O painel usa `role="tabpanel"`, apresenta a imagem ativa em coluna superior no mobile e na metade direita no desktop, título, descrição e link acessível:

```tsx
<Link aria-label={`Explorar espaços com estilo ${activeStyle.name}`} href={`/buscar?style=${activeStyle.slug}`}>
  Explorar este estilo <span aria-hidden="true">→</span>
</Link>
```

Substituir somente a grade de estilos em `DemandSections`; preservar o texto introdutório e o título da seção.

- [ ] **Step 4: Rodar o teste focado após a implementação**

Run: `npx vitest run src/test/home-interactions.test.tsx`  
Expected: PASS; a aba Jardim muda o painel e mantém seu destino de busca.

- [ ] **Step 5: Registrar o painel de estilos**

```powershell
git add src/components/home/style-explorer.tsx src/components/home/demand-sections.tsx src/test/home-interactions.test.tsx
git commit -m "Adiciona painel interativo de estilos"
```

### Task 4: Criar a vitrine corporativa com fotografia e CTA de demanda

**Files:**
- Create: `src/components/home/corporate-showcase.tsx`
- Modify: `src/components/home/demand-sections.tsx`
- Modify: `src/test/home-interactions.test.tsx`

**Interfaces:**
- Consumes: `corporateScenarios` de `home-interactions.ts`, com `id`, `label`, `headline`, `description`, `image` e `imageAlt`.
- Produces: `<CorporateShowcase />`, com seleção de cenário e link para `/buscar?activity=Evento+corporativo`.

- [ ] **Step 1: Escrever o teste para cenário corporativo e CTA**

```tsx
import { CorporateShowcase } from "@/components/home/corporate-showcase";

it("shows the selected corporate scenario and keeps the demand CTA", async () => {
  const user = userEvent.setup();
  render(<CorporateShowcase />);
  await user.click(screen.getByRole("button", { name: "Workshop" }));
  expect(screen.getByRole("heading", { name: /workshops que aproximam equipes/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /encontrar espaço para minha empresa/i })).toHaveAttribute("href", "/buscar?activity=Evento+corporativo");
});
```

- [ ] **Step 2: Rodar o teste para confirmar falha inicial**

Run: `npx vitest run src/test/home-interactions.test.tsx`  
Expected: FAIL porque `CorporateShowcase` ainda não existe.

- [ ] **Step 3: Implementar a vitrine corporativa**

Criar componente cliente que inicia em Reunião e troca conteúdo por controles `Reunião`, `Workshop` e `Confraternização`. Usar foto ampla de pessoas no espaço, gradiente para contraste e transição de opacidade curta. Os controles são botões com `aria-pressed`; o ativo usa `bg-white text-[var(--primary)]` e os demais `bg-white/15 text-white`. O CTA é um `Link` para demanda, tem classe de toque `min-h-11` e texto fixo `Encontrar espaço para minha empresa`.

Trocar o card estático da seção `#empresas` por `<CorporateShowcase />`, mantendo o id para o menu de navegação.

- [ ] **Step 4: Rodar o teste focado para confirmar aprovação**

Run: `npx vitest run src/test/home-interactions.test.tsx`  
Expected: PASS; a seleção Workshop atualiza o título e o CTA não muda de propósito.

- [ ] **Step 5: Registrar a vitrine corporativa**

```powershell
git add src/components/home/corporate-showcase.tsx src/components/home/demand-sections.tsx src/test/home-interactions.test.tsx
git commit -m "Adiciona vitrine corporativa interativa"
```

### Task 5: Criar a linha do tempo “Escolha com clareza”

**Files:**
- Create: `src/components/home/trust-timeline.tsx`
- Modify: `src/components/home/demand-sections.tsx`
- Modify: `src/test/home-interactions.test.tsx`

**Interfaces:**
- Consumes: `trustTimelineItems` de `home-interactions.ts`, construídos a partir de `trustItems` e com foto demonstrativa adicional.
- Produces: `<TrustTimeline />`, que inicia em `Curadoria com contexto` e atualiza painel via botões de etapa.

- [ ] **Step 1: Escrever o teste de atualização da linha do tempo**

```tsx
import { TrustTimeline } from "@/components/home/trust-timeline";

it("updates the active clarity criterion", async () => {
  const user = userEvent.setup();
  render(<TrustTimeline />);
  await user.click(screen.getByRole("button", { name: "Conversa direta" }));
  expect(screen.getByRole("heading", { name: "Conversa direta" })).toBeInTheDocument();
  expect(screen.getByText("Demonstração")).toBeInTheDocument();
});
```

- [ ] **Step 2: Rodar o teste e confirmar falha inicial**

Run: `npx vitest run src/test/home-interactions.test.tsx`  
Expected: FAIL porque `TrustTimeline` ainda não existe.

- [ ] **Step 3: Implementar os três marcos e o painel ativo**

Criar componente cliente com estado pelo `id` do item ativo. No desktop, mostrar uma linha horizontal conectando três botões; no mobile, permitir rolagem horizontal dos botões sem cortar texto. Cada botão inclui o índice `01`, `02` ou `03`, `aria-pressed` e foco visível. O painel abaixo contém a foto ativa, a etiqueta persistente `Demonstração`, título e descrição de `trustItems`; não adicionar números, avaliações ou depoimentos.

Substituir a grade de três artigos pela nova linha do tempo, mantendo o fundo secundário, bordas e a seção de tela inteira.

- [ ] **Step 4: Rodar teste focado e regressão da página**

Run: `npx vitest run src/test/home-interactions.test.tsx src/test/home.test.tsx`  
Expected: PASS; o h1 da homepage e a troca de critério continuam acessíveis.

- [ ] **Step 5: Registrar a linha do tempo**

```powershell
git add src/components/home/trust-timeline.tsx src/components/home/demand-sections.tsx src/test/home-interactions.test.tsx
git commit -m "Adiciona linha do tempo de criterios"
```

### Task 6: Verificar integração visual, responsividade e qualidade

**Files:**
- Modify only if a concrete issue is found: `src/components/home/*.tsx`, `src/app/globals.css`
- Modify: `docs/README-BREEZE.md`

**Interfaces:**
- Consumes: todos os componentes interativos anteriores.
- Produces: documentação atualizada e uma homepage sem overflow em mobile.

- [ ] **Step 1: Escrever uma regressão para a ausência de conteúdo de oferta**

```tsx
import HomePage from "@/app/page";

it("keeps the interactive homepage focused on people seeking spaces", () => {
  render(<HomePage />);
  expect(screen.queryByText(/anuncie seu espaço|cadastre seu espaço|para proprietários/i)).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Rodar o teste e confirmar que ele protege o escopo**

Run: `npx vitest run src/test/home-interactions.test.tsx`  
Expected: PASS; o teste é uma regressão de conteúdo que não muda a implementação.

- [ ] **Step 3: Atualizar documentação e ajustar apenas defeitos observados**

Adicionar ao `docs/README-BREEZE.md` uma seção “Interações da homepage” citando os trilhos, painel de estilos, vitrine corporativa e linha do tempo. Em inspeção visual, corrigir somente: overflow horizontal, texto cortado, alvo de toque menor que 44 px, contraste insuficiente ou foto repetida. Não incluir novas bibliotecas ou autoplay.

- [ ] **Step 4: Rodar verificação completa**

Run:

```powershell
npm run test
npx tsc --noEmit
npm run lint
git diff --check
```

Expected: todos os testes passam, TypeScript e ESLint retornam código 0 e `git diff --check` não mostra erros de whitespace.

- [ ] **Step 5: Inspecionar no navegador e registrar a entrega**

Abrir `/` em 390 × 844 e 1440 × 900. Em ambos: navegar até cada nova seção; acionar uma seta de trilho, selecionar Jardim, selecionar Workshop e selecionar Conversa direta. Confirmar que não há scrollbar horizontal na página, controles e texto estão legíveis, e cada foto é distinta da anterior. Depois:

```powershell
git add docs/README-BREEZE.md src/test/home-interactions.test.tsx
git commit -m "Documenta interacoes da homepage"
git push origin feature/breeze-demand-landing
```

## Plan Self-Review

### Spec coverage

- Diversidade de fotografias e equilíbrio por objetivo: Tasks 1, 2, 3, 4 e 5.
- Trilhos para ocasião, cidades e guia: Task 2.
- Painel/linha do tempo de estilos: Task 3.
- Vitrine visual para empresas: Task 4.
- Linha do tempo para critérios de escolha: Task 5.
- FAQ sem alteração: Tasks 2 a 5 não o modificam; Task 6 protege a composição geral.
- Acessibilidade, sem autoplay, mobile e escopo de demanda: Global Constraints, testes e Task 6.

### Placeholder scan

O plano não contém marcadores pendentes, instruções de implementação futura ou etapas implícitas.

### Type consistency

`PhotoRailItem` é produzido na Task 1 e consumido na Task 2. `stylePanels`, `corporateScenarios` e `trustTimelineItems` são produzidos pelo módulo de dados da Task 1 e consumidos pelos respectivos componentes nas Tasks 3, 4 e 5.
