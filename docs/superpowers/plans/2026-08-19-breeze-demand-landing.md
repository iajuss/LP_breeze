# Breeze Demand Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the responsive Breeze landing page that helps individuals and companies start a search for event spaces.

**Architecture:** Use a Next.js App Router application with a server-rendered homepage composed from focused presentational sections. Keep interactive search, header navigation, FAQ, favorites and analytics boundaries in small client components; all demo content lives in typed data modules so API/CMS replacement does not alter the UI tree.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS v4, `lucide-react`, Vitest, React Testing Library, `@testing-library/user-event`, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-18-breeze-landing-page-design.md`

## Global Constraints

- The landing is exclusively for **demand acquisition**; do not render owner, host, listing or supply-side calls to action.
- Keep the Breeze positioning and approved hero copy: `Onde boas ideias ganham cenário.`
- Use the approved tokens: `#F7F4EF`, `#FFFFFF`, `#1B2825`, `#6D7773`, `#174C43`, `#DDE7DD`, `#D9764E`, `#D9D8D2`, `#2D765A`, `#B87926`, `#B34842`.
- Use DM Serif Display for display headings and Manrope for UI/body text, with system fallbacks.
- Do not present mocked prices, ratings, testimonials, event counts or partner logos as real facts; mark demonstration content in its source data.
- Preserve semantic HTML, visible focus, keyboard navigation, 44 × 44 px touch targets and `prefers-reduced-motion` support.
- Prioritize LCP, CLS and INP: declare image dimensions, prioritize one LCP image, lazily load offscreen images and avoid unnecessary client components.
- The workspace is not a Git repository. Do not add commit steps; record verification commands in each task instead.

---

## File Structure

| Path | Responsibility |
| --- | --- |
| `package.json` | scripts and package boundaries |
| `next.config.ts` | remote image allow-list and Next configuration |
| `src/app/layout.tsx` | global metadata, font variables and root layout |
| `src/app/page.tsx` | server-composed Breeze homepage |
| `src/app/globals.css` | Tailwind import, design tokens, base/focus/reduced-motion rules |
| `src/app/robots.ts` and `src/app/sitemap.ts` | technical SEO endpoints |
| `src/components/layout/*` | header and footer |
| `src/components/search/*` | search state, desktop form and mobile sheet |
| `src/components/home/*` | section-level homepage composition |
| `src/components/ui/*` | small reusable controls such as button, dialog, favorite and accordion |
| `src/data/*` | typed mock content; no hardcoded marketing data in UI components |
| `src/lib/analytics.ts` | provider-neutral browser event dispatcher |
| `src/lib/search.ts` | pure query construction and validation |
| `src/types/content.ts` | shared content and search types |
| `src/test/*` | Vitest setup, component and utility tests |
| `e2e/home.spec.ts` | Playwright keyboard, desktop and mobile smoke coverage |

## Task 1: Establish the application shell and test harness

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `src/test/setup.ts`
- Create: `src/test/home.test.tsx`

**Interfaces:**
- Produces: a runnable `npm run dev`, `npm run test`, `npm run lint`, `npm run build` and `npm run test:e2e` foundation.
- Produces: `RootLayout({ children }: Readonly<{ children: React.ReactNode }>)` and default `HomePage(): JSX.Element`.

- [ ] **Step 1: Write the failing homepage render test**

```tsx
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

it("renders Breeze’s primary destination", () => {
  render(<HomePage />);
  expect(screen.getByRole("heading", { level: 1, name: /onde boas ideias ganham cenário/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails before the app exists**

Run: `npm run test -- src/test/home.test.tsx`

Expected: failure because the `@/app/page` module does not yet exist.

- [ ] **Step 3: Create the minimal Next and test configuration**

Use the current official App Router scaffold conventions, TypeScript, ESLint, Tailwind v4 PostCSS, Vitest with `jsdom`, and Playwright Chromium. Configure scripts exactly as follows:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

Create `RootLayout` with `lang="pt-BR"`, `suppressHydrationWarning={false}`, `metadataBase: new URL("https://breeze.example")`, and placeholder-safe title/description metadata. Add the minimal page with the approved `h1`; import `globals.css`. Define CSS custom properties for every approved token, `:focus-visible` outline, `scroll-behavior: smooth`, and a reduced-motion media rule.

- [ ] **Step 4: Run unit test, lint and production build**

Run: `npm run test -- src/test/home.test.tsx && npm run lint && npm run build`

Expected: all commands exit with code 0 and the build reports `/` as a generated route.

## Task 2: Define typed content, design primitives and provider-neutral analytics

**Files:**
- Create: `src/types/content.ts`
- Create: `src/data/categories.ts`
- Create: `src/data/venues.ts`
- Create: `src/data/styles.ts`
- Create: `src/data/cities.ts`
- Create: `src/data/editorial.ts`
- Create: `src/data/faqs.ts`
- Create: `src/data/trust.ts`
- Create: `src/lib/analytics.ts`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/section-heading.tsx`
- Create: `src/test/analytics.test.ts`

**Interfaces:**
- Produces: `Venue`, `Category`, `StyleCollection`, `City`, `Article`, `FaqItem` and `TrustItem` types.
- Produces: `track(event: AnalyticsEvent, properties?: Record<string, string | number | boolean>): void`.
- Consumes: no UI modules from later tasks.

- [ ] **Step 1: Write failing tests for analytics dispatch and mock integrity**

```ts
import { track } from "@/lib/analytics";
import { trustItems } from "@/data/trust";

it("dispatches a provider-neutral analytics event", () => {
  const listener = vi.fn();
  window.addEventListener("breeze:analytics", listener);
  track("search_started", { entryPoint: "hero" });
  expect(listener).toHaveBeenCalledTimes(1);
});

it("marks all demonstration trust content as demo", () => {
  expect(trustItems.every((item) => item.isDemo)).toBe(true);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test -- src/test/analytics.test.ts`

Expected: failure because the analytics and data modules do not exist.

- [ ] **Step 3: Implement data and primitives with explicit content boundaries**

Define `AnalyticsEvent` as the exact union from the spec, excluding any host or supply event:

```ts
export type AnalyticsEvent =
  | "search_started"
  | "search_submitted"
  | "activity_selected"
  | "location_selected"
  | "date_selected"
  | "guest_count_selected"
  | "venue_card_clicked"
  | "category_clicked"
  | "city_clicked"
  | "corporate_cta_clicked"
  | "signup_clicked";
```

Implement `track` as a safe browser-only `CustomEvent("breeze:analytics", { detail: { event, properties } })` dispatcher. Populate data modules with plausible Brazilian venue names, locations and capacities; use only `isDemo: true` for trust, reviews, ratings and any pricing fields. Use `Button` variants `primary`, `secondary` and `text`, all rendered with native `button` or `a` semantics rather than div click handlers.

- [ ] **Step 4: Run the focused tests and TypeScript/build checks**

Run: `npm run test -- src/test/analytics.test.ts && npm run lint && npm run build`

Expected: all commands exit with code 0.

## Task 3: Build and test the accessible conversion search flow

**Files:**
- Create: `src/lib/search.ts`
- Create: `src/components/search/search-types.ts`
- Create: `src/components/search/venue-search.tsx`
- Create: `src/components/search/desktop-search-form.tsx`
- Create: `src/components/search/mobile-search-sheet.tsx`
- Create: `src/components/search/guest-stepper.tsx`
- Create: `src/components/ui/dialog.tsx`
- Create: `src/app/buscar/page.tsx`
- Create: `src/test/search.test.tsx`
- Create: `src/test/search-utils.test.ts`

**Interfaces:**
- Produces: `SearchValues`, `buildSearchUrl(values: SearchValues): string`, `validateSearch(values: SearchValues): SearchErrors`.
- Produces: `<VenueSearch entryPoint="hero" />`, which triggers `search_started` and `search_submitted`.
- Produces: a minimal `/buscar` destination that acknowledges submitted demand filters without claiming inventory availability.
- Consumes: `track` from `src/lib/analytics.ts` and `Button` from `src/components/ui/button.tsx`.

- [ ] **Step 1: Write failing tests for query construction and mobile progression**

```tsx
it("builds a stable query from selected search fields", () => {
  expect(buildSearchUrl({ activity: "Festa", location: "São Paulo, SP", date: "", guests: 80 }))
    .toBe("/buscar?activity=Festa&location=S%C3%A3o+Paulo%2C+SP&guests=80");
});

it("keeps mobile selections when returning to an earlier step", async () => {
  const user = userEvent.setup();
  render(<VenueSearch entryPoint="hero" />);
  await user.click(screen.getByRole("button", { name: /encontrar um espaço/i }));
  await user.click(screen.getByRole("button", { name: /festa/i }));
  await user.click(screen.getByRole("button", { name: /voltar/i }));
  expect(screen.getByText(/festa selecionada/i)).toBeInTheDocument();
});

it("keeps submitted search intent in the destination URL", () => {
  expect(buildSearchUrl({ activity: "Reunião", location: "Campinas, SP", date: "", guests: 12 }))
    .toContain("activity=Reuni%C3%A3o");
});
```

- [ ] **Step 2: Run the search tests to verify they fail**

Run: `npm run test -- src/test/search-utils.test.ts src/test/search.test.tsx`

Expected: failure because the search implementation does not exist.

- [ ] **Step 3: Implement validation and responsive search controls**

Implement `buildSearchUrl` with `URLSearchParams`, omitting empty fields. `validateSearch` requires activity and location, treats date as optional, and requires guests to be an integer from 1 to 5,000.

The desktop form uses labelled buttons/inputs for activity, location, date and guests. The mobile version opens a modal dialog with `aria-modal="true"`, traps focus, has an explicit close button and progresses through occasion, location, date, guests and review. Preserve `SearchValues` in parent state. On submit, call `track("search_submitted", { entryPoint })` and navigate with `useRouter().push(buildSearchUrl(values))`.

Implement `src/app/buscar/page.tsx` as a server page that reads `activity`, `location`, `date` and `guests` search parameters, shows them in a semantic `h1` and summary, and offers a `Voltar para a Breeze` link. This creates a valid hand-off destination without fabricating search results or availability.

- [ ] **Step 4: Run tests, keyboard smoke coverage and build**

Run: `npm run test -- src/test/search-utils.test.ts src/test/search.test.tsx && npm run lint && npm run build`

Expected: tests pass; tab order reaches controls and Escape closes the mobile dialog.

## Task 4: Compose the above-the-fold experience and discovery sections

**Files:**
- Create: `src/components/layout/header.tsx`
- Create: `src/components/home/hero.tsx`
- Create: `src/components/home/category-grid.tsx`
- Create: `src/components/home/venue-card.tsx`
- Create: `src/components/home/featured-venues.tsx`
- Create: `src/components/home/style-collections.tsx`
- Create: `src/components/ui/favorite-button.tsx`
- Modify: `src/app/page.tsx`
- Create: `src/test/venue-card.test.tsx`
- Create: `src/test/home-discovery.test.tsx`

**Interfaces:**
- Consumes: `VenueSearch`, typed data modules, `track`, `Button`, `SectionHeading`.
- Produces: `<Header />`, `<Hero />`, `<CategoryGrid />`, `<FeaturedVenues />`, `<StyleCollections />` and `<VenueCard venue={venue} />`.

- [ ] **Step 1: Write failing tests for card labeling and primary search availability**

```tsx
it("exposes venue details and a labeled favorite action", () => {
  render(<VenueCard venue={venues[0]} />);
  expect(screen.getByText(venues[0].name)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: new RegExp(`favoritar ${venues[0].name}`, "i") })).toBeInTheDocument();
});

it("renders the hero’s primary search action", () => {
  render(<HomePage />);
  expect(screen.getByRole("button", { name: /buscar espaços|encontrar um espaço/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test -- src/test/venue-card.test.tsx src/test/home-discovery.test.tsx`

Expected: failure because the discovery components do not exist.

- [ ] **Step 3: Implement hero, header and discovery composition**

Use `next/image` for every photo, with a fixed aspect ratio and meaningful Portuguese alt text. In the hero, set only the lead image to `priority`; all content below the first viewport uses lazy loading. Build the desktop grid with the first venue spanning more grid area and add horizontal snap scrolling on mobile. Render the `isDemo` marker in venue metadata for any mock rating or price. `FavoriteButton` toggles `aria-pressed`, stays client-side and never blocks the venue link. Header mobile navigation uses a labelled menu button, not a compressed desktop link row.

Category, venue and style links call their matching analytics event before navigating to their semantic `/buscar` URL. Do not add owner-facing header content or any `Anuncie` action.

- [ ] **Step 4: Run discovery tests and inspect the rendered homepage**

Run: `npm run test -- src/test/venue-card.test.tsx src/test/home-discovery.test.tsx && npm run lint && npm run build`

Expected: all commands exit with code 0; no heading level skips; favorite state is announced by `aria-pressed`.

## Task 5: Build the demand-supporting lower-page sections and footer

**Files:**
- Create: `src/components/home/how-it-works.tsx`
- Create: `src/components/home/corporate-section.tsx`
- Create: `src/components/home/trust-section.tsx`
- Create: `src/components/home/city-grid.tsx`
- Create: `src/components/home/editorial-section.tsx`
- Create: `src/components/home/faq.tsx`
- Create: `src/components/layout/footer.tsx`
- Modify: `src/app/page.tsx`
- Create: `src/test/faq.test.tsx`
- Create: `src/test/no-supply-content.test.tsx`

**Interfaces:**
- Consumes: typed city, editorial, FAQ and trust data; `track`; `SectionHeading`; `Button`.
- Produces: lower-page sections with semantic headings and an accessible `<Faq />` accordion.

- [ ] **Step 1: Write failing tests for FAQ keyboard behavior and demand-only scope**

```tsx
it("opens an FAQ answer with the keyboard", async () => {
  const user = userEvent.setup();
  render(<Faq items={faqs} />);
  const trigger = screen.getByRole("button", { name: /como encontro um espaço/i });
  trigger.focus();
  await user.keyboard("{Enter}");
  expect(trigger).toHaveAttribute("aria-expanded", "true");
});

it("does not expose supply-side acquisition copy", () => {
  render(<HomePage />);
  expect(screen.queryByText(/anuncie seu espaço|cadastre seu espaço|para proprietários/i)).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/test/faq.test.tsx src/test/no-supply-content.test.tsx`

Expected: failure because the lower-page components and final page composition do not exist.

- [ ] **Step 3: Implement demand content and accessible FAQ**

Implement the three-step process as `Descubra`, `Compare` and `Converse`. Implement the corporate section with the CTA `Encontrar espaço para minha empresa`, tracking `corporate_cta_clicked`. Build trust content exclusively from `isDemo` data, adding visually readable `Demonstração` wording rather than fake social proof. Use native button controls for accordion triggers, with `aria-controls` and `aria-expanded`; render answer panels using `hidden` when collapsed. Footer contains exploration, events, cities, company and legal links only; no owner/listing column.

- [ ] **Step 4: Run the lower-page tests and full unit suite**

Run: `npm run test && npm run lint && npm run build`

Expected: every unit test passes; no owner-facing copy is present in the DOM.

## Task 6: Add metadata, structured data and crawlable routes

**Files:**
- Create: `src/lib/seo.ts`
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Create: `src/test/seo.test.ts`

**Interfaces:**
- Produces: `organizationJsonLd`, `websiteJsonLd` and `homeMetadata` from `src/lib/seo.ts`.
- Consumes: no third-party analytics or CMS system.

- [ ] **Step 1: Write failing tests for public metadata and JSON-LD shape**

```ts
import { homeMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

it("describes Breeze as a Portuguese event-space discovery product", () => {
  expect(homeMetadata.title).toMatch(/Breeze/);
  expect(homeMetadata.description).toMatch(/espaços/i);
  expect(organizationJsonLd["@type"]).toBe("Organization");
  expect(websiteJsonLd["@type"]).toBe("WebSite");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- src/test/seo.test.ts`

Expected: failure because `src/lib/seo.ts` does not exist.

- [ ] **Step 3: Implement SEO metadata and routes**

Set a canonical root URL, Open Graph locale `pt_BR`, Twitter card `summary_large_image`, descriptive title and description. Add Organization and WebSite JSON-LD using the placeholder-safe `https://breeze.example` origin; do not add `FAQPage` because commercial answers remain configurable. `robots.ts` allows `/` and points to `/sitemap.xml`; `sitemap.ts` includes only `/` until city and search routes exist.

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
/>
```

- [ ] **Step 4: Run SEO test and production build**

Run: `npm run test -- src/test/seo.test.ts && npm run build`

Expected: test and build pass; `/robots.txt` and `/sitemap.xml` are listed as generated metadata routes.

## Task 7: Verify responsive behavior, keyboard flows and production quality

**Files:**
- Create: `e2e/home.spec.ts`
- Modify: `src/app/globals.css` only if verification exposes a concrete layout or focus defect.

**Interfaces:**
- Consumes: completed home page, search flow and metadata routes.
- Produces: repeatable browser checks at desktop and mobile breakpoints.

- [ ] **Step 1: Write failing Playwright checks for the two highest-value journeys**

```ts
test("starts a desktop venue search", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /festa/i }).click();
  await page.getByRole("button", { name: /buscar espaços/i }).click();
  await expect(page).toHaveURL(/\/buscar\?activity=Festa/);
});

test("opens the mobile search sheet without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: /encontrar um espaço/i }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
});
```

- [ ] **Step 2: Run the browser tests to verify the initial behavior**

Run: `npm run test:e2e`

Expected: the initial run identifies any unavailable search route, selector mismatch, focus failure or horizontal overflow before declaring the page complete.

- [ ] **Step 3: Fix only concrete failures found by the browser tests**

For every failing assertion, first reproduce it with the exact Playwright command, then make the smallest change in the component responsible. Re-run the individual test after each correction. Do not add unrelated animation, dependency or layout changes during this task.

- [ ] **Step 4: Run the final verification set and inspect visual breakpoints**

Run: `npm run test && npm run lint && npm run build && npm run test:e2e`

Expected: all commands exit with code 0.

Use browser screenshots at 390 px, 768 px, 1440 px and 1920 px. Verify: no horizontal overflow; visible primary CTA; readable hero text; no deformed images; focus styling; usable mobile menu and search sheet; no false trust claims; no owner-facing content; and no meaningful console errors.

## Plan Self-Review

### Spec coverage

- Demand-only scope: Tasks 2, 4 and 5 explicitly prevent owner-facing content and events.
- Brand, color, typography, grid and motion: Tasks 1, 2 and 4 establish and use the approved system.
- Desktop/mobile search, states and analytics: Task 3.
- Categories, venues, styles, cities, corporate demand, trust, editorial, FAQ and footer: Tasks 4 and 5.
- Accessibility, performance and visual responsiveness: Tasks 1, 3, 4, 5 and 7.
- SEO/structured data: Task 6.
- Tests and production checks: every task has a focused test cycle; Task 7 runs the complete suite.

### Placeholder scan

No implementation instruction uses `TODO`, `TBD`, “implement later” or an unspecified test. Intentional configurable business rules are specified in the design document and are not substituted with factual content.

### Interface consistency

`AnalyticsEvent`, `track`, `SearchValues`, `VenueSearch`, typed content modules and SEO exports are named consistently between producing and consuming tasks.
