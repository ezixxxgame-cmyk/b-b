import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { absoluteUrl, business, siteUrl } from '../lib/site';

describe('SEO site foundation', () => {
  it('uses the public www domain as the fallback canonical URL', () => {
    expect(siteUrl).toBe('https://www.barberandbarbie.ru');
  });

  it('uses one canonical site URL and verified local facts', () => {
    expect(siteUrl).toMatch(/^https:\/\//);
    expect(absoluteUrl('/privacy')).toBe(`${siteUrl}/privacy`);
    expect(business.name).toBe('Барбер и Барби');
    expect(business.telephone).toBe('+79876077896');
    expect(business.address.addressLocality).toBe('Салават');
  });
});

describe('crawl controls', () => {
  it('generates robots and sitemap from the canonical URL', () => {
    const robotsPath = resolve(process.cwd(), 'app/robots.ts');
    const sitemapPath = resolve(process.cwd(), 'app/sitemap.ts');

    expect(existsSync(robotsPath)).toBe(true);
    expect(existsSync(sitemapPath)).toBe(true);

    const robots = readFileSync(robotsPath, 'utf8');
    const sitemap = readFileSync(sitemapPath, 'utf8');
    const layout = readFileSync(resolve(process.cwd(), 'app/layout.tsx'), 'utf8');

    expect(robots).toContain("disallow: ['/api/']");
    expect(sitemap).toContain('absoluteUrl');
    expect(sitemap).not.toContain("'/privacy'");
    expect(sitemap).not.toContain("'/consent'");
    expect(layout).toContain("canonical: '/'");
  });
});

describe('technical SEO safeguards', () => {
  it('sets baseline security headers without relying on client JavaScript', () => {
    const config = readFileSync(resolve(process.cwd(), 'next.config.mjs'), 'utf8');

    expect(config).toContain("key: 'X-Content-Type-Options'");
    expect(config).toContain("key: 'X-Frame-Options'");
    expect(config).toContain("key: 'Referrer-Policy'");
  });
});

