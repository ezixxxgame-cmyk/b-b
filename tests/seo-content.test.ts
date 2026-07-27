Exit code: 0
Wall time: 0.4 seconds
Output:
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const page = readFileSync(resolve(process.cwd(), 'app/page.tsx'), 'utf8');
const css = readFileSync(resolve(process.cwd(), 'app/globals.css'), 'utf8');

describe('single-page local content', () => {
  it('presents one about section instead of separate gendered SEO sections', () => {
    expect((page.match(/<h1/g) || [])).toHaveLength(1);
    expect(page).toContain('Парикмахерская и салон красоты в Салавате');
    expect(page).toContain('<h2>О заведении</h2>');
    expect(page).toContain('Опытный барбер, специализирующийся на мужских стрижках, фейде');
    expect(page).toContain('Просторное и чистое пространство с современным ремонтом');
    expect(page).toContain('id="about"');
    expect(page).not.toContain('Мужская парикмахерская и барбершоп в Салавате');
    expect(page).not.toContain('Женская парикмахерская в Салавате');
    expect(page).toContain('href="#booking"');
  });

  it('does not expose technical source notes', () => {
    expect(page).not.toContain('Актуальные услуги и цены.');
    expect(page).not.toContain('подтверждены карточкой');
    expect(page).not.toContain('из карточки салона');
    expect(page).not.toContain('Короткие точные цитаты из отзывов на Яндекс.Картах.');
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

