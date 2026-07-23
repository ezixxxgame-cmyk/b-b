# Single-Page Local SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the single-page website of «Барбер и Барби» technically indexable and genuinely useful for local service searches in Salavat without adding unverified business claims.

**Architecture:** Keep `/` as the only commercial and indexable URL. Centralize the public site URL and verified business facts in small server-safe modules; consume them from metadata, JSON-LD, sitemap and visible copy. Keep the interactive booking form client-side, but render all critical SEO content and structured data in the initial HTML.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Vitest, Next.js Metadata API, JSON-LD.

## Global Constraints

- Do not create separate commercial pages; `/` remains the only commercial URL.
- Use only confirmed data: name, address, phone, hours, rating shown on the page, user-provided male-service price list and approved local images.
- Do not fabricate female services, prices, practitioner credentials, review counts, coordinates, postcode, social profiles, legal details or external citations.
- `/privacy` and `/consent` must remain accessible but use `noindex, follow` and must not be in the sitemap.
- The submit button must be disabled until personal-data consent is checked; server validation remains mandatory.
- Use `NEXT_PUBLIC_SITE_URL` for the deployed canonical domain, with the current Vercel address only as a documented fallback.
- Do not add analytics, ad pixels, FAQPage schema, HowTo schema or `llms.txt` as a ranking tactic.

---

### Task 1: Centralize verified business and canonical URL data

**Files:**
- Create: `lib/site.ts`
- Modify: `README.md`
- Test: `tests/seo-foundation.test.ts`

**Interfaces:**
- Produces `siteUrl`, `absoluteUrl(path: string): string`, and `business` for server-side metadata, sitemap and schema.
- `business` contains only the confirmed name, phone, postal address, opening-hours specifications, Yandex Maps URL and approved image path.

- [x] **Step 1: Write the failing test**

```ts
import { absoluteUrl, business, siteUrl } from '@/lib/site';

it('uses one canonical site URL and verified local facts', () => {
  expect(siteUrl).toMatch(/^https:\/\//);
  expect(absoluteUrl('/privacy')).toBe(`${siteUrl}/privacy`);
  expect(business.name).toBe('Барбер и Барби');
  expect(business.telephone).toBe('+79876077896');
  expect(business.address.addressLocality).toBe('Салават');
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- tests/seo-foundation.test.ts`

Expected: FAIL because `@/lib/site` does not exist.

- [x] **Step 3: Write the minimal implementation**

```ts
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://barber-i-barbi.vercel.app')
  .replace(/\/$/, '');

export const absoluteUrl = (path = '/') => new URL(path, `${siteUrl}/`).toString();

export const business = {
  name: 'Барбер и Барби',
  telephone: '+79876077896',
  yandexUrl: 'https://yandex.ru/maps/org/barber_i_barbi/129691267585',
  address: {
    streetAddress: 'бульвар Космонавтов, 13, цокольный этаж',
    addressLocality: 'Салават',
    addressRegion: 'Республика Башкортостан',
    addressCountry: 'RU'
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday'], opens: '14:00', closes: '20:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday', 'Saturday', 'Sunday'], opens: '14:00', closes: '20:00' }
  ]
} as const;
```

- [x] **Step 4: Document deployment configuration**

Add `NEXT_PUBLIC_SITE_URL=https://<your-domain>` to the README Vercel section, explicitly stating that it is a public canonical URL, not a secret.

- [x] **Step 5: Run test to verify it passes**

Run: `npm.cmd test -- tests/seo-foundation.test.ts`

Expected: PASS.

### Task 2: Establish canonical metadata, robots and sitemap

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/robots.ts`
- Create: `app/sitemap.ts`
- Delete: `public/robots.txt`
- Delete: `public/sitemap.xml`
- Test: `tests/seo-foundation.test.ts`

**Interfaces:**
- Consumes `siteUrl` and `absoluteUrl` from `lib/site.ts`.
- Produces one dynamic robots response and one dynamic sitemap response, both using the same canonical domain.

- [x] **Step 1: Add failing assertions**

```ts
const layout = readFileSync(resolve('app/layout.tsx'), 'utf8');
const robots = readFileSync(resolve('app/robots.ts'), 'utf8');
const sitemap = readFileSync(resolve('app/sitemap.ts'), 'utf8');

expect(layout).toContain('alternates');
expect(layout).toContain("canonical: '/'");
expect(robots).toContain("disallow: ['/api/']");
expect(sitemap).toContain('absoluteUrl');
expect(sitemap).not.toContain("'/privacy'");
expect(sitemap).not.toContain("'/consent'");
```

- [x] **Step 2: Run the targeted test**

Run: `npm.cmd test -- tests/seo-foundation.test.ts`

Expected: FAIL because dynamic metadata files do not exist.

- [x] **Step 3: Implement dynamic crawl controls**

```ts
// app/robots.ts
import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: ['/api/'] }, sitemap: absoluteUrl('/sitemap.xml') };
}

// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: absoluteUrl('/'), lastModified: new Date() }];
}
```

Set `metadataBase` from `siteUrl`, define a self-canonical alternate for `/`, and add complete Open Graph/Twitter metadata in `app/layout.tsx`. Remove the two obsolete static files to avoid duplicate, conflicting sitemap and robots responses.

- [x] **Step 4: Run the targeted test**

Run: `npm.cmd test -- tests/seo-foundation.test.ts`

Expected: PASS.

### Task 3: Make legal pages intentionally non-indexable

**Files:**
- Modify: `app/privacy/page.tsx`
- Modify: `app/consent/page.tsx`
- Modify: `tests/legal-pages.test.ts`

**Interfaces:**
- Produces metadata with `robots: { index: false, follow: true }` on both legal routes.
- Keeps existing public links and document text unchanged.

- [x] **Step 1: Write failing tests**

```ts
expect(privacy).toContain('index: false');
expect(privacy).toContain('follow: true');
expect(consent).toContain('index: false');
expect(consent).toContain('follow: true');
```

- [x] **Step 2: Run the test**

Run: `npm.cmd test -- tests/legal-pages.test.ts`

Expected: FAIL because the routes only define titles.

- [x] **Step 3: Add the minimal metadata**

```ts
export const metadata = {
  title: 'Политика конфиденциальности — Барбер и Барби',
  robots: { index: false, follow: true }
};
```

Use the equivalent title and `robots` object for the consent page.

- [x] **Step 4: Run the test**

Run: `npm.cmd test -- tests/legal-pages.test.ts`

Expected: PASS.

### Task 4: Add factual on-page local SEO, headings and anchor navigation

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Test: `tests/seo-content.test.ts`

**Interfaces:**
- Consumes `business` and `yandexUrl` from `lib/site.ts`.
- Produces a single H1 and explicit, descriptive H2/H3 content for local, men’s and women’s intent sections without creating new URLs.

- [x] **Step 1: Write failing source-level tests**

```ts
const page = readFileSync(resolve('app/page.tsx'), 'utf8');
expect((page.match(/<h1/g) || [])).toHaveLength(1);
expect(page).toContain('Парикмахерская и салон красоты в Салавате');
expect(page).toContain('Мужская парикмахерская и барбершоп в Салавате');
expect(page).toContain('Услуги для женщин и мужчин');
expect(page).toContain('id="men"');
expect(page).toContain('id="women"');
expect(page).toContain('href="#booking"');
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- tests/seo-content.test.ts`

Expected: FAIL because the landing page has no dedicated semantic anchors for both intent groups.

- [x] **Step 3: Implement factual content and navigation**

Use the following structure; preserve the approved design system and current booking flow:

```tsx
<h1 className="display">Парикмахерская и салон красоты в Салавате — Барбер и Барби</h1>
<section className="section" id="men">
  <div className="shell">
    <h2>Мужская парикмахерская и барбершоп в Салавате</h2>
    <p>Мужские стрижки, оформление бороды и дополнительные услуги — по предварительной записи.</p>
    <a className="text-link" href="#booking">Выбрать услугу и записаться</a>
  </div>
</section>
<section className="section section-dark" id="women">
  <div className="shell">
    <h2>Услуги для женщин и мужчин</h2>
    <p>Подскажем подходящую услугу и согласуем удобное время при записи.</p>
    <a className="text-link" href="#booking">Записаться в салон</a>
  </div>
</section>
```

Do not mention a female service, price or specialist that is not confirmed. Add accessible in-page navigation links to `#services`, `#men`, `#women`, `#reviews` and `#booking`; keep them usable on narrow screens.

- [x] **Step 4: Run test to verify it passes**

Run: `npm.cmd test -- tests/seo-content.test.ts`

Expected: PASS.

### Task 5: Replace fragile schema with verified entity markup

**Files:**
- Create: `lib/structured-data.ts`
- Modify: `app/page.tsx`
- Test: `tests/schema.test.ts`

**Interfaces:**
- Consumes `siteUrl`, `absoluteUrl` and `business`.
- Produces `localBusinessSchema` as a JSON-serializable `@graph` with `BeautySalon`, `WebSite` and `WebPage` nodes.

- [x] **Step 1: Write failing validation tests**

```ts
import { localBusinessSchema } from '@/lib/structured-data';

it('contains only verified local business properties', () => {
  const serialized = JSON.stringify(localBusinessSchema);
  expect(serialized).toContain('BeautySalon');
  expect(serialized).toContain('Барбер и Барби');
  expect(serialized).toContain('Салават');
  expect(serialized).not.toContain('aggregateRating');
  expect(serialized).not.toContain('reviewCount');
  expect(serialized).not.toContain('geo');
});
```

- [x] **Step 2: Run the test**

Run: `npm.cmd test -- tests/schema.test.ts`

Expected: FAIL because the schema helper does not exist.

- [x] **Step 3: Implement the JSON-LD graph**

```ts
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BeautySalon',
      '@id': `${siteUrl}/#business`,
      name: business.name,
      url: siteUrl,
      telephone: business.telephone,
      address: { '@type': 'PostalAddress', ...business.address },
      openingHoursSpecification: business.openingHoursSpecification,
      image: absoluteUrl('/images/haircut.webp'),
      hasMap: business.yandexUrl
    },
    { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: siteUrl, name: business.name },
    { '@type': 'WebPage', '@id': `${siteUrl}/#webpage`, url: siteUrl, name: 'Барбер и Барби — Салават', isPartOf: { '@id': `${siteUrl}/#website` } }
  ]
};
```

Render the graph in the existing server-rendered `<script type="application/ld+json">`. Remove duplicate inline schema literals and any field not substantiated by visible facts.

- [x] **Step 4: Run the test**

Run: `npm.cmd test -- tests/schema.test.ts`

Expected: PASS.

### Task 6: Improve image, interaction and performance safeguards

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `next.config.mjs`
- Modify: `tests/reviews-ui.test.ts`
- Test: `tests/seo-content.test.ts`

**Interfaces:**
- Preserves the visual layout and ensures one LCP image is prioritized while gallery images retain dimensions and descriptive alt text.
- Produces a disabled booking submit control until consent is set.

- [x] **Step 1: Add failing tests**

```ts
expect(page).toContain('priority');
expect(page).toContain('alt="Пример мужской стрижки и оформления бороды"');
expect(page).toContain('disabled={!consent');
expect(css).toContain('.btn:disabled');
```

Replace the obsolete assertion in `tests/reviews-ui.test.ts` with:

```ts
expect(page).toContain('disabled={!consent || status.kind === \'loading\'}');
```

- [x] **Step 2: Run the test**

Run: `npm.cmd test -- tests/seo-content.test.ts`

Expected: FAIL because the submit button is not disabled by consent state and disabled styling is absent.

- [x] **Step 3: Implement the minimal safeguards**

```tsx
<button className="btn btn-primary" type="submit" disabled={!consent || status.kind === 'loading'}>
  {status.kind === 'loading' ? 'Отправляем…' : 'Отправить заявку'}
</button>
```

Expand the local status type and state transitions so the button cannot be
repeatedly activated while the request is in flight:

```ts
const [status, setStatus] = useState<{ text: string; kind: 'success' | 'error' | 'loading' | '' }>({ text: '', kind: '' });
// Before fetch:
setStatus({ text: 'Отправляем заявку…', kind: 'loading' });
```

```css
.btn:disabled { cursor: not-allowed; opacity: .55; transform: none; box-shadow: none; }
```

Keep width and height props on all `next/image` calls. Do not make below-the-fold gallery images `priority`; leave the hero image as the only priority image.

- [x] **Step 4: Run the test**

Run: `npm.cmd test -- tests/seo-content.test.ts`

Expected: PASS.

### Task 7: Verify the complete SEO foundation and document deployment

**Files:**
- Modify: `README.md`
- Modify: `docs/superpowers/plans/2026-07-23-single-page-local-seo-implementation.md`
- Test: `tests/seo-foundation.test.ts`, `tests/seo-content.test.ts`, `tests/schema.test.ts`

**Interfaces:**
- Produces a deployable SEO baseline with a single source of truth for the public URL and a concise owner checklist.

- [x] **Step 1: Update README**

Add a section named `SEO before launch` containing exactly these actions:

```md
1. Set `NEXT_PUBLIC_SITE_URL` in Vercel to the final HTTPS domain, without a trailing slash.
2. Confirm the phone, address and schedule match the current business card before every material update.
3. Add the final domain to Yandex Webmaster and Google Search Console, then submit `/sitemap.xml`.
4. Request only genuine reviews from completed customers; do not buy, filter or fabricate reviews.
5. Recheck legal operator details before enabling booking on the public domain.
```

- [x] **Step 2: Run focused test suite**

Run: `npm.cmd test`

Expected: all existing and SEO tests pass.

- [x] **Step 3: Run code-quality checks**

Run: `npm.cmd run typecheck`

Expected: exit code 0.

Run: `npm.cmd run lint`

Expected: `No ESLint warnings or errors`.

- [x] **Step 4: Run production build**

Run: `npm.cmd run build`

Expected: exit code 0 and dynamic routes for `/robots.txt` and `/sitemap.xml` appear in the route output.

- [x] **Step 5: Record verification**

Mark all completed checkboxes only after the commands above return successfully. Because this workspace currently has no usable Git worktree, do not attempt a commit; initialize or attach the repository before publishing changes.

