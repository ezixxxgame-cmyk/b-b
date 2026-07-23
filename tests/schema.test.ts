import { describe, expect, it } from 'vitest';
import { localBusinessSchema } from '../lib/structured-data';

describe('local business structured data', () => {
  it('describes the salon with verified local facts only', () => {
    const serialized = JSON.stringify(localBusinessSchema);

    expect(serialized).toContain('BeautySalon');
    expect(serialized).toContain('Барбер и Барби');
    expect(serialized).toContain('Салават');
    expect(serialized).not.toContain('aggregateRating');
    expect(serialized).not.toContain('reviewCount');
    expect(serialized).not.toContain('"geo"');
  });
});

