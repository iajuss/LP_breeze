# Arcora Demand MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Deliver a São Paulo-only marketplace funnel that turns a validated search into a persisted rental interest or contextual support inquiry.

**Architecture:** Next.js remains the UI and routing layer. Query parameters are the single source of truth for search; server Route Handlers validate and persist operational data in Supabase; a private Supabase view is the operational lead inbox. MapLibre renders the same filtered venue set used by the result list.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, Supabase Auth/Postgres, MapLibre GL JS, Vitest, Testing Library, Playwright.

**Spec:** docs/superpowers/specs/2026-08-21-arcora-demand-mvp-design.md

## Global Constraints

- Arcora is the only public brand. Do not retain Breeze, breeze, or legacy analytics names in user-facing code, metadata, analytics, tests, or product documentation.
- Public discovery covers São Paulo only; locations must be selected from the typed São Paulo taxonomy.
- Do not show invented ratings, testimonials, availability, venue prices, or demo labels.
- Query params eventType, neighborhood, date, guestCount, and optional budget are the only shared search-state source.
- A visible interaction must navigate to a real destination or perform a real operation; do not retain placeholder links or in-memory fake saves.
- Use magic-link authentication only after the interest CTA; never collect or track a password.
- Keep PII out of analytics. Marketing consent is optional and unchecked.
- Do not place Supabase service-role credentials in browser code. All lead and inquiry writes go through validated Route Handlers.
- MapLibre must degrade to the result list when the map cannot load.
- Write the failing focused test before every production implementation change and run the focused test before and after the change.

---

## File Structure

| Path | Responsibility |
|---|---|
| src/config/site.ts | Central temporary brand, default city and public metadata tokens. |
| src/types/domain.ts | Venue, search, lead, inquiry and analytics contracts shared by server and client. |
| src/data/neighborhoods.ts | Typed São Paulo location taxonomy and autocomplete lookup. |
| src/data/venues.ts | São Paulo catalog data with coordinates and non-fabricated pricing states. |
| src/lib/search.ts | URL serialization, parsing and validation of search state. |
| src/lib/venue-results.ts | Pure filtering and sorting of catalog results. |
| src/lib/analytics.ts | Allowlisted event contracts and client transport. |
| src/lib/supabase | Separate browser, cookie-session and service-role Supabase clients. |
| src/lib/repositories | Server-only persistence boundaries. |
| src/app/api | Validated public write endpoints. |
| src/app/auth/callback/route.ts | Exchanges magic-link code and finalizes a pending interest. |
| src/components/results | Query-backed results, filters and map/list UI. |
| src/components/venue | Detail, CTA, interest and support UI. |
| supabase/migrations/202608210001_arcora_mvp.sql | Database schema, RLS, indexes and private lead_summary view. |

### Task 1: Foundation, Supabase schema, and server boundaries

**Files:**
- Create: .env.example
- Create: supabase/migrations/202608210001_arcora_mvp.sql
- Create: src/types/domain.ts
- Create: src/lib/supabase/browser.ts, src/lib/supabase/server.ts, src/lib/supabase/admin.ts
- Create: src/lib/repositories/interests.ts
- Create: src/test/supabase-config.test.ts
- Modify: package.json

**Interfaces:**
- Produces createBrowserClient(), createServerClient(), createAdminClient().
- Produces createPendingInterest(input) and finalizePendingInterest(pendingId, authUserId, verifiedEmail).
- Consumes NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and server-only SUPABASE_SERVICE_ROLE_KEY.
- Produces SearchState with eventType, neighborhood, date, guestCount and optional budget, plus AcquisitionContext with source, campaign, referrer and UTM values.

- [ ] **Step 1: Write the failing configuration test**

~~~ts
it("lists the only browser-visible Supabase variables", () => {
  expect(requiredPublicSupabaseEnvironment).toEqual([
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ]);
});
~~~

- [ ] **Step 2: Run the focused test**

Run: npx vitest run src/test/supabase-config.test.ts

Expected: FAIL because the browser client module does not exist.

- [ ] **Step 3: Add dependencies and configuration**

Run: npm install @supabase/supabase-js @supabase/ssr maplibre-gl react-map-gl

Create .env.example with the three names above and no values. Implement three client factories; admin.ts throws outside server execution and is never imported by a Client Component.

- [ ] **Step 4: Add schema, privacy policy, and lead view**

Migration creates venues, profiles, pending_interests, rental_interests, support_inquiries, and funnel_events. Use UUID keys; add timestamps; constrain interest status to new, contacted, qualified, closed; index venue slug, neighborhood, interest status/creation and inquiry venue/creation.

Enable RLS. Anonymous users can read only public venue fields; no anonymous read is allowed for profile, interest, inquiry or event tables. Create private lead_summary view joining interest, profile and venue and exposing inquiry count/latest inquiry timestamp to the project team.

- [ ] **Step 5: Add shared domain contracts and idempotent repository logic**

Create src/types/domain.ts first, exporting SearchState and AcquisitionContext exactly as described above. The later search task only narrows validation and allowed values; it must not rename these fields.

~~~ts
export type PendingInterestInput = {
  venueId: string; name: string; email: string; phone: string;
  marketingConsent: boolean; search: SearchState; source: AcquisitionContext;
};

export async function createPendingInterest(input: PendingInterestInput): Promise<{ id: string }>;
export async function finalizePendingInterest(
  pendingId: string, authUserId: string, verifiedEmail: string,
): Promise<{ interestId: string }>;
~~~

Finalization validates the verified e-mail against the pending record, upserts profile, inserts one interest, marks the pending record finalized, and returns the original result on retry.

- [ ] **Step 6: Verify and commit**

Run: npx vitest run src/test/supabase-config.test.ts. Expected: PASS. Apply migration to the configured Supabase project; administrator can query lead_summary while anonymous key cannot query PII tables.

~~~bash
git add package.json package-lock.json .env.example supabase/migrations src/types/domain.ts src/lib/supabase src/lib/repositories/interests.ts src/test/supabase-config.test.ts
git commit -m "feat: add Supabase foundation for demand capture"
~~~

### Task 2: Centralize Arcora and make the catalog São Paulo-only

**Files:**
- Create: src/config/site.ts
- Modify: src/types/domain.ts, src/app/layout.tsx, src/lib/seo.ts, src/data/venues.ts, src/types/content.ts
- Modify: src/components/layout/header.tsx, src/components/layout/footer.tsx, src/components/home/demand-sections.tsx, src/components/home/featured-venues.tsx, src/components/home/trust-timeline.tsx, src/components/home/venue-card.tsx
- Modify: src/data/cities.ts, src/data/trust.ts, src/data/editorial.ts, src/data/home-interactions.ts, README.md, docs/README-BREEZE.md
- Test: src/test/site-config.test.ts, src/test/seo.test.ts, src/test/demand-content.test.tsx

**Interfaces:**
- Produces siteConfig with Arcora, São Paulo and SP.
- Produces domain types Venue, Pricing, SearchState, AcquisitionContext, RentalInterest, and SupportInquiry.

- [ ] **Step 1: Write failing identity/content tests**

~~~ts
it("uses the central Arcora brand in metadata", () => {
  expect(homeMetadata.title).toContain(siteConfig.name);
});

it("does not publish demonstration labels or ratings", () => {
  render(<VenueCard venue={venues[0]} />);
  expect(screen.queryByText(/demo|demonstração|avaliação/i)).not.toBeInTheDocument();
});
~~~

- [ ] **Step 2: Run them**

Run: npx vitest run src/test/site-config.test.ts src/test/seo.test.ts src/test/demand-content.test.tsx

Expected: FAIL because current metadata/components render Breeze/demo content.

- [ ] **Step 3: Implement configuration and content replacement**

Move public brand, metadata and JSON-LD tokens to siteConfig. Replace visible brand strings and legacy event namespace. Remove all non-São-Paulo city data, ratings, isDemo, and unverified numeric prices. Unknown pricing becomes an on-request label; do not render numeric price without verified inventory data.

Remove blog cards/navigation, dead footer links and in-memory favorites rather than disguising them as capabilities.

- [ ] **Step 4: Verify and commit**

Run: npx vitest run src/test/site-config.test.ts src/test/seo.test.ts src/test/demand-content.test.tsx. Expected: PASS.

Run: rg -n -i -e breeze -e demo -e demonstrativ --glob !node_modules/** --glob !.next/** src README.md. Expected: no public product references.

~~~bash
git add src/config src/types src/app/layout.tsx src/lib/seo.ts src/components src/data README.md docs/README-BREEZE.md src/test
git commit -m "feat: rebrand catalog for São Paulo"
~~~

### Task 3: Define controlled São Paulo search state and actual filtering

**Files:**
- Create: src/data/neighborhoods.ts, src/test/neighborhoods.test.ts
- Modify: src/lib/search.ts, src/lib/venue-results.ts
- Modify: src/test/search-utils.test.ts, src/test/venue-results.test.ts

**Interfaces:**
- Produces parseSearchState(searchParams), buildSearchUrl(state), validateSearchState(state), and findNeighborhoodSuggestions(query).
- SearchState.neighborhood is a taxonomy slug; filterVenues(venues, state) returns empty list for no match, never fallback catalog.

- [ ] **Step 1: Write failing search tests**

~~~ts
it("normalizes a selected neighborhood into a stable URL", () => {
  expect(buildSearchUrl({
    eventType: "aniversario", neighborhood: "pinheiros",
    date: "2026-11-15", guestCount: 80,
  })).toBe("/buscar?eventType=aniversario&neighborhood=pinheiros&date=2026-11-15&guestCount=80");
});

it("suggests Pinheiros and rejects arbitrary location text", () => {
  expect(findNeighborhoodSuggestions("pinh")[0]).toMatchObject({
    slug: "pinheiros", name: "Pinheiros", zone: "Zona Oeste",
  });
  expect(validateSearchState({
    eventType: "aniversario", neighborhood: "ghasuhsuhdiuh", date: "", guestCount: 80,
  })).toHaveProperty("neighborhood");
});
~~~

- [ ] **Step 2: Run focused tests**

Run: npx vitest run src/test/neighborhoods.test.ts src/test/search-utils.test.ts src/test/venue-results.test.ts

Expected: FAIL because current code accepts arbitrary location and legacy parameter names.

- [ ] **Step 3: Implement taxonomy and parser**

Taxonomy contains Pinheiros, Vila Madalena, Itaim Bibi, Jardins, Moema, Vila Olímpia, Brooklin, Morumbi, Perdizes, Higienópolis, Bela Vista, Liberdade, Centro, Santana, Tatuapé and Vila Mariana. Each has slug, display name, zone and aliases. Reject unknown slugs, invalid ISO date and guests outside 1–5,000.

- [ ] **Step 4: Implement exact results**

Filter by canonical event type, selected neighborhood, capacity, and numeric verified price only when that price exists. Keep date as context, not an availability promise. Preserve explicit empty result rather than showing every venue.

- [ ] **Step 5: Verify and commit**

Run: npx vitest run src/test/neighborhoods.test.ts src/test/search-utils.test.ts src/test/venue-results.test.ts. Expected: PASS.

~~~bash
git add src/data/neighborhoods.ts src/lib/search.ts src/lib/venue-results.ts src/test/neighborhoods.test.ts src/test/search-utils.test.ts src/test/venue-results.test.ts
git commit -m "feat: validate São Paulo search state"
~~~

### Task 4: Build autocomplete and URL-backed results

**Files:**
- Create: src/components/search/location-autocomplete.tsx, src/components/results/search-results-experience.tsx, src/components/results/search-filter-panel.tsx
- Modify: src/components/search/venue-search.tsx, src/components/search/desktop-search-form.tsx, src/components/search/mobile-search-sheet.tsx, src/components/search/search-refinement-form.tsx, src/components/search/search-types.ts
- Modify: src/app/buscar/page.tsx
- Modify: src/test/search.test.tsx, src/test/search-refinement.test.tsx, src/test/home.test.tsx, e2e/search.spec.ts

**Interfaces:**
- LocationAutocomplete({ value, onSelect, error }) emits a Neighborhood only on explicit choice.
- SearchResultsExperience({ initialState, venues }) renders filters from URL state and an honest empty state.
- Every submit calls buildSearchUrl(state).

- [ ] **Step 1: Write failing interaction tests**

~~~tsx
it("requires a selected neighborhood before submitting", async () => {
  const user = userEvent.setup();
  render(<VenueSearch entryPoint="hero" />);
  await user.type(screen.getByLabelText(/onde/i), "pinh");
  await user.click(screen.getByRole("button", { name: /buscar espaços/i }));
  expect(screen.getByRole("alert")).toHaveTextContent(/selecione uma região válida/i);
});

it("hydrates filters from the URL", () => {
  render(<SearchResultsExperience initialState={searchState} venues={venues} />);
  expect(screen.getByText("Pinheiros · Zona Oeste")).toBeInTheDocument();
  expect(screen.getByDisplayValue("80")).toBeInTheDocument();
});
~~~

- [ ] **Step 2: Run focused tests**

Run: npx vitest run src/test/search.test.tsx src/test/search-refinement.test.tsx

Expected: FAIL because location is free text and results have no neighborhood filter.

- [ ] **Step 3: Implement autocomplete in both form layouts**

Replace desktop/mobile location inputs with LocationAutocomplete. Serialize only selected slug. Keep date optional; convert event labels to canonical values. Preserve typed text only for suggestion matching.

- [ ] **Step 4: Implement results as a projection of the URL**

Parse params once on the server page, filter once, then pass state/results to client experience. Filter updates replace only their param; clear goes to /buscar. Show empty state and adjustment action when no venue matches.

- [ ] **Step 5: Add refresh/back/forward E2E**

Choose Aniversário, Pinheiros, 2026-11-15 and 80; submit; assert URL and populated filters; reload; assert values; use browser back/forward; assert search state returns.

- [ ] **Step 6: Verify and commit**

Run: npx vitest run src/test/search.test.tsx src/test/search-refinement.test.tsx && npx playwright test e2e/search.spec.ts. Expected: PASS on desktop and mobile.

~~~bash
git add src/components/search src/components/results src/app/buscar/page.tsx src/test/search.test.tsx src/test/search-refinement.test.tsx src/test/home.test.tsx e2e/search.spec.ts
git commit -m "feat: add controlled São Paulo search flow"
~~~

### Task 5: Persist safe funnel analytics

**Files:**
- Create: src/lib/repositories/analytics.ts, src/app/api/analytics/route.ts, src/test/analytics-route.test.ts
- Modify: src/lib/analytics.ts, src/test/analytics.test.ts
- Modify: home, search, result, detail, interest and support components as introduced in later tasks.

**Interfaces:**
- track(event: FunnelEventName, properties: FunnelEventProperties): void.
- POST /api/analytics accepts event, properties and occurredAt and persists allowlisted fields only.
- Event union is landing_viewed, search_started, event_type_selected, region_selected, date_selected, guest_count_selected, search_submitted, search_results_viewed, search_filter_applied, map_opened, map_marker_clicked, venue_card_clicked, venue_viewed, interest_cta_clicked, signup_started, signup_completed, rental_interest_started, rental_interest_submitted, support_opened, and support_question_submitted.

- [ ] **Step 1: Write failing allowlist/API tests**

~~~ts
it("rejects PII in analytics", async () => {
  const response = await POST(jsonRequest({
    event: "search_started", properties: { email: "ana@example.com" },
  }));
  expect(response.status).toBe(400);
});

it("persists submitted-interest context without contact fields", async () => {
  await expect(recordFunnelEvent).toHaveBeenCalledWith(expect.objectContaining({
    event: "rental_interest_submitted",
    properties: { venueId: "casa-jardim", guestCount: 80 },
  }));
});
~~~

- [ ] **Step 2: Run them**

Run: npx vitest run src/test/analytics.test.ts src/test/analytics-route.test.ts

Expected: FAIL because analytics is a legacy browser CustomEvent with no endpoint.

- [ ] **Step 3: Implement registry, transport, repository and route**

Define event/property allowlists in one module. Use navigator.sendBeacon then fetch keepalive fallback. Reject email, phone, name, password and question; persist through server-only repository.

- [ ] **Step 4: Instrument completed boundaries and verify**

Add landing_viewed, search_started, event_type_selected, region_selected, date_selected, guest_count_selected, search_submitted, search_results_viewed, search_filter_applied and venue_card_clicked. Map, detail, interest and support tasks add their named events through the same function. Run the focused test command again. Expected: PASS.

~~~bash
git add src/lib/analytics.ts src/lib/repositories/analytics.ts src/app/api/analytics/route.ts src/test/analytics.test.ts src/test/analytics-route.test.ts src/components/home src/components/search src/components/results src/app/page.tsx src/app/buscar
git commit -m "feat: persist allowlisted funnel analytics"
~~~

### Task 6: Build detail navigation and a real filtered map

**Files:**
- Create: src/app/espacos/[slug]/page.tsx, src/lib/venues.ts
- Create: src/components/results/venue-map.tsx, src/components/venue/venue-detail.tsx, src/components/venue/venue-gallery.tsx, src/components/venue/venue-facts.tsx
- Modify: src/components/home/venue-card.tsx, src/components/results/search-results-experience.tsx
- Create: src/test/venue-detail.test.tsx, e2e/venue-detail.spec.ts
- Modify: src/test/venue-card.test.tsx, src/test/venue-results.test.ts

**Interfaces:**
- getVenueBySlug(slug): Venue | null and getVenueHref(venue, state): string.
- VenueMap({ venues, selectedVenueId, onVenueSelect }) receives only filtered results.
- VenueDetail({ venue, search }) exposes gallery, facts, map context, support and interest entry.

- [ ] **Step 1: Write failing link/detail/map tests**

~~~tsx
it("links a card to a detail page while retaining context", () => {
  render(<VenueCard venue={venues[0]} search={searchState} />);
  expect(screen.getByRole("link", { name: venues[0].name })).toHaveAttribute(
    "href", "/espacos/casa-jardim?eventType=aniversario&neighborhood=pinheiros&guestCount=80",
  );
});

it("renders pins only for filtered venues", () => {
  render(<VenueMap venues={[venues[0]]} selectedVenueId={null} onVenueSelect={vi.fn()} />);
  expect(screen.getAllByRole("button", { name: /mapa: casa jardim/i })).toHaveLength(1);
});
~~~

- [ ] **Step 2: Run focused tests**

Run: npx vitest run src/test/venue-card.test.tsx src/test/venue-detail.test.tsx src/test/venue-results.test.ts

Expected: FAIL because cards return to /buscar and no detail/map exists.

- [ ] **Step 3: Implement lookup/detail**

Cards use getVenueHref and retain valid search params. Unknown slug calls notFound(). Detail renders only catalog facts, capacity, event types, amenities and non-deceptive pricing label; it never renders rating or availability claims. Track venue_viewed.

- [ ] **Step 4: Implement lazy MapLibre mode**

Dynamically import map only after Map mode opens. Markers derive exclusively from passed filtered venues; marker/card selection shares selectedVenueId. On initialization/tile error remain in List and show a short notice. Home imports no map code.

- [ ] **Step 5: Add browser proof, verify and commit**

E2E: filter to one venue; open Map; assert one marker; select marker; open card; assert detail heading/context.

Run: npx vitest run src/test/venue-card.test.tsx src/test/venue-detail.test.tsx src/test/venue-results.test.ts && npx playwright test e2e/venue-detail.spec.ts. Expected: PASS.

~~~bash
git add src/app/espacos src/lib/venues.ts src/components/results src/components/venue src/components/home/venue-card.tsx src/test/venue-card.test.tsx src/test/venue-detail.test.tsx src/test/venue-results.test.ts e2e/venue-detail.spec.ts
git commit -m "feat: add venue details and filtered map"
~~~

### Task 7: Capture a real rental interest with magic link

**Files:**
- Create: src/app/api/interests/route.ts, src/app/auth/callback/route.ts, src/app/interesse/confirmado/page.tsx
- Create: src/components/venue/interest-form.tsx, src/components/venue/interest-dialog.tsx
- Modify: src/components/venue/venue-detail.tsx
- Create: src/test/interest-route.test.ts, src/test/interest-form.test.tsx, e2e/interest.spec.ts

**Interfaces:**
- POST /api/interests validates PendingInterestInput, creates it, sends OTP with auth callback and opaque pending id, returns pendingInterestId.
- Callback exchanges code, finalizes interest, then redirects to interest confirmation.
- InterestDialog({ venue, search }) never asks for event data already in search.

- [ ] **Step 1: Write failing endpoint and form tests**

~~~ts
it("creates a pending interest and initiates a magic link", async () => {
  const response = await POST(jsonRequest(validInterestPayload));
  expect(response.status).toBe(202);
  expect(createPendingInterest).toHaveBeenCalledWith(expect.objectContaining({ search: searchState }));
  expect(startMagicLink).toHaveBeenCalledWith("ana@example.com", expect.stringMatching(/pending=/));
});
~~~

~~~tsx
it("shows inherited context instead of collecting it again", () => {
  render(<InterestDialog venue={venue} search={searchState} />);
  expect(screen.getByText(/aniversário.*pinheiros.*80/i)).toBeInTheDocument();
  expect(screen.queryByLabelText(/quantas pessoas/i)).not.toBeInTheDocument();
});
~~~

- [ ] **Step 2: Run focused tests**

Run: npx vitest run src/test/interest-route.test.ts src/test/interest-form.test.tsx

Expected: FAIL because no CTA, route or form exists.

- [ ] **Step 3: Implement pending request and secure callback**

Validate venue, canonical context, name, e-mail, normalized phone and boolean marketing consent. Start magic link after persisting pending data. Callback requires session e-mail match before idempotent finalization. Track only signup_started, signup_completed, rental_interest_started and rental_interest_submitted with non-PII context.

- [ ] **Step 4: Implement UI and confirmation**

Primary CTA is Solicitar disponibilidade. Dialog shows inherited event summary and asks only name, e-mail, phone and optional unchecked marketing consent. It handles pending/submission failure without false success. Confirmation reads persisted interest server-side, names venue and says team will contact requester without an SLA promise.

- [ ] **Step 5: Add E2E, verify and commit**

Use a magic-link callback fixture but do not mock interest API. Assert venue/context reaches endpoint and confirmation follows callback.

Run: npx vitest run src/test/interest-route.test.ts src/test/interest-form.test.tsx && npx playwright test e2e/interest.spec.ts. Expected: PASS.

~~~bash
git add src/app/api/interests src/app/auth/callback src/app/interesse src/components/venue src/test/interest-route.test.ts src/test/interest-form.test.tsx e2e/interest.spec.ts src/lib/repositories/interests.ts
git commit -m "feat: capture rental interest with magic link"
~~~

### Task 8: Persist contextual support questions and publish neutral FAQ

**Files:**
- Create: src/lib/repositories/inquiries.ts, src/app/api/inquiries/route.ts, src/components/venue/support-inquiry-dialog.tsx
- Modify: src/components/venue/venue-detail.tsx, src/data/faqs.ts, src/components/home/demand-sections.tsx, src/components/home/faq.tsx
- Create: src/test/inquiries-route.test.ts, src/test/support-inquiry-dialog.test.tsx
- Modify: src/test/demand-content.test.tsx

**Interfaces:**
- POST /api/inquiries accepts venueId, optional category, question, optional contact and search.
- SupportInquiryDialog({ venue, search, user }) attaches known venue/search/contact context before optional fields.

- [ ] **Step 1: Write failing persistence/FAQ tests**

~~~ts
it("persists a question with inherited venue and search context", async () => {
  const response = await POST(jsonRequest({
    venueId: "casa-jardim", category: "visita", question: "Posso visitar?", search: searchState,
  }));
  expect(response.status).toBe(201);
  expect(createInquiry).toHaveBeenCalledWith(expect.objectContaining({
    venueId: "casa-jardim", search: searchState,
  }));
});
~~~

~~~ts
it("uses neutral wording for undefined policy", () => {
  expect(faqs.find((item) => item.id === "cancelamento")?.answer).toMatch(/confirmar diretamente/i);
});
~~~

- [ ] **Step 2: Run focused tests**

Run: npx vitest run src/test/inquiries-route.test.ts src/test/support-inquiry-dialog.test.tsx src/test/demand-content.test.tsx

Expected: FAIL because support persistence and expanded FAQ do not exist.

- [ ] **Step 3: Implement route and contextual dialog**

Validate venue/question/category/context; persist through server-only repository; reply 201 only after insert; never track question/contact content. Detail button tracks support_opened; dialog provides availability, price, capacity, parking, buffet, hours, equipment, visit and free-text options. Authenticated contact pre-fills but is never required merely to ask.

- [ ] **Step 4: Implement configurable FAQ**

Replace short FAQ with approved objections: process, free search, account, visit, availability, price, suppliers, buffet, hours, sound, cancellation, confirmation, quote, capacity, corporate, parking, cleaning, accessibility and venue questions. For unknown commercial policy, direct user to confirm with team.

- [ ] **Step 5: Verify and commit**

Run: npx vitest run src/test/inquiries-route.test.ts src/test/support-inquiry-dialog.test.tsx src/test/demand-content.test.tsx. Expected: PASS.

~~~bash
git add src/lib/repositories/inquiries.ts src/app/api/inquiries src/components/venue/support-inquiry-dialog.tsx src/components/venue/venue-detail.tsx src/data/faqs.ts src/components/home src/test/inquiries-route.test.ts src/test/support-inquiry-dialog.test.tsx src/test/demand-content.test.tsx
git commit -m "feat: collect contextual venue questions"
~~~

### Task 9: Audit interactive surface and perform final verification

**Files:**
- Create: src/test/footer-audit.test.tsx, e2e/support.spec.ts
- Modify: src/components/layout/footer.tsx, src/components/ui/favorite-button.tsx or remove all consumers
- Modify: src/app/sitemap.ts, src/app/robots.ts, README.md, src/test/analytics.test.ts
- Modify: e2e/home.spec.ts, e2e/search.spec.ts, e2e/venue-detail.spec.ts, e2e/interest.spec.ts

**Interfaces:**
- No public link may use a placeholder destination.
- Every critical event uses central track and carries only allowlisted properties.

- [ ] **Step 1: Write failing UI audit test**

~~~tsx
it("does not render placeholder links or memory-only favorites", () => {
  render(<Footer />);
  expect(screen.getAllByRole("link").some((link) => link.getAttribute("href") === "#")).toBe(false);
  expect(screen.queryByRole("button", { name: /favoritar/i })).not.toBeInTheDocument();
});
~~~

- [ ] **Step 2: Run focused audit**

Run: npx vitest run src/test/footer-audit.test.tsx src/test/analytics.test.ts

Expected: FAIL because current footer has placeholder links and favorites are client-only state.

- [ ] **Step 3: Remove non-functional public actions**

Retain only valid anchors, search/detail destinations and legal/help links with existing routes. Hide public blog navigation/cards; restrict sitemap to actually published routes. Finish map/detail/interest/support analytics assertions.

- [ ] **Step 4: Add support E2E and execute suite**

E2E: Pinheiros search → venue detail → support dialog → category/question → successful API response containing venue/search context.

Run:

~~~bash
npm run test
npx tsc --noEmit
npm run lint
npm run build
npm run test:e2e
~~~

Expected: every command exits 0 and E2E executes desktop/mobile critical flows.

- [ ] **Step 5: Perform manual acceptance verification**

Inspect desktop and mobile home, autocomplete, results/list, map fallback, detail, interest pending/confirmation and support. Check console and network: successful forms have actual API responses; failure response never shows success; refresh/back/forward preserve URL search state.

- [ ] **Step 6: Commit release hardening**

~~~bash
git add src/components src/app src/lib/analytics.ts src/test e2e README.md
git commit -m "chore: complete Arcora demand MVP audit"
~~~
