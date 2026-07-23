import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const projectFile = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('legal pages navigation', () => {
  it.each(['app/privacy/page.tsx', 'app/consent/page.tsx'])('%s uses Next Link for the homepage link', (path) => {
    const page = projectFile(path);

    expect(page).toContain("import Link from 'next/link';");
    expect(page).not.toContain('<a href="/">');
  });
});

describe('legal pages indexing', () => {
  it.each(['app/privacy/page.tsx', 'app/consent/page.tsx'])('%s stays available but out of search results', (path) => {
    const page = projectFile(path);

    expect(page).toContain('index: false');
    expect(page).toContain('follow: true');
  });
});

