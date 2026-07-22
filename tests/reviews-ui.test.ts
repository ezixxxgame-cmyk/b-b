import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const file = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('reviews disclosure and mobile CTA', () => {
  it('keeps the three supplied reviews behind the disclosure button', () => {
    const page = file('app/page.tsx');

    expect(page).toContain('Развернуть еще');
    expect(page).toContain('Иван Яровицын');
    expect(page).toContain('денис щербаков');
    expect(page).toContain('Данил Махмутов');
    expect(page).toContain('reviews.slice(0, showAllReviews ? reviews.length : 3)');
  });

  it('does not include a sticky booking CTA', () => {
    expect(file('app/page.tsx')).not.toContain('sticky-cta');
    expect(file('app/globals.css')).not.toContain('.sticky-cta');
  });
});

describe('favicon assets', () => {
  it('provides a small multi-resolution ICO and modern SVG metadata', () => {
    const favicon = resolve(process.cwd(), 'public/favicon.ico');
    const layout = file('app/layout.tsx');

    expect(existsSync(favicon)).toBe(true);
    expect(statSync(favicon).size).toBeLessThan(100_000);
    expect(layout).toContain("'/favicon.ico'");
    expect(layout).toContain("'/favicon.svg'");
  });
});

describe('mobile overflow guards', () => {
  it('stacks service prices and constrains native date and time controls', () => {
    const css = file('app/globals.css');

    expect(css).toContain('.service-item { flex-direction: column; align-items: flex-start; gap: 8px; }');
    expect(css).toContain('.service-price { max-width: 100%; text-align: left; }');
    expect(css).toContain('.field { display: grid; gap: 6px; min-width: 0; }');
    expect(css).toContain(".field input[type='date'], .field input[type='time'] { min-width: 0; max-width: 100%; }");
    expect(css).toContain('.form, .form-grid, .contact-grid > * { min-width: 0; max-width: 100%; }');
    expect(css).toContain('.contact-grid { grid-template-columns: minmax(0, 1fr); }');
  });
});

describe('legal document readability', () => {
  it('uses dark text on the light document surface', () => {
    expect(file('app/doc.css')).toContain('.doc{color:var(--ink);');
  });
});
