import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const page = readFileSync(resolve(process.cwd(), 'app/page.tsx'), 'utf8');
const css = readFileSync(resolve(process.cwd(), 'app/globals.css'), 'utf8');

describe('single-page local content', () => {
  it('covers the verified local service intents with one H1 and descriptive anchors', () => {
    expect((page.match(/<h1/g) || [])).toHaveLength(1);
    expect(page).toContain('Парикмахерская и салон красоты в Салавате');
    expect(page).toContain('Мужская парикмахерская и барбершоп в Салавате');
    expect(page).toContain('Женская парикмахерская в Салавате');
    expect(page).toContain('id="men"');
    expect(page).toContain('id="women"');
    expect(page).toContain('href="#booking"');
  });
});

describe('booking interaction safeguards', () => {
  it('disables duplicate or non-consensual submissions', () => {
    expect(page).toContain("kind: 'success' | 'error' | 'loading' | ''");
    expect(page).toContain("disabled={!consent || status.kind === 'loading'}");
    expect(css).toContain('.btn:disabled');
  });
});

describe('public schedule and service copy', () => {
  it('shows Tuesday and Thursday as days off without editorial wording', () => {
    const site = readFileSync(resolve(process.cwd(), 'lib/site.ts'), 'utf8');

    expect(page).not.toContain('которые вы передали для публикации');
    expect(page).toContain('Пн, Ср');
    expect(page).toContain('Вт, Чт');
    expect(site).not.toContain("['Monday', 'Tuesday', 'Wednesday']");
  });
});

