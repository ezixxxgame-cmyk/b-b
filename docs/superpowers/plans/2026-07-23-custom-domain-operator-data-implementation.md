# Custom Domain and Operator Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish canonical SEO signals and completed operator data for `www.barberandbarbie.ru`.

**Architecture:** Keep `NEXT_PUBLIC_SITE_URL` as override and change the fallback origin. Reuse existing metadata and JSON-LD helpers. Replace public legal placeholders only with user-supplied data.

**Tech Stack:** Next.js 15, TypeScript, Vitest, Vercel.

## Global Constraints

- Main URL: `https://www.barberandbarbie.ru`.
- No new dependencies.
- Favicon paths remain relative.

---

### Task 1: URL and operator data

**Files:**
- Modify: `lib/site.ts`, `app/privacy/page.tsx`, `app/consent/page.tsx`, `app/page.tsx`, `tests/seo-foundation.test.ts`, `tests/legal-pages.test.ts`.

- [ ] Write failing tests for main URL and absent placeholders.
- [ ] Run `npm.cmd test` and confirm targeted failures.
- [ ] Change fallback URL and legal/footer data.
- [ ] Run `npm.cmd run typecheck; npm.cmd test; npm.cmd run build`.
- [ ] Commit and push to `main`.

