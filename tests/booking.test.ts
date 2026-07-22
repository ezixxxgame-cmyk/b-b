import { describe, expect, it } from 'vitest';
import { normalizePhone, validateBooking } from '../lib/booking';

describe('booking validation', () => {
  it('normalizes common Russian phone formats', () => {
    expect(normalizePhone('8 (987) 607-78-96')).toBe('+79876077896');
    expect(normalizePhone('+7 987 607 78 96')).toBe('+79876077896');
  });

  it('accepts a valid booking', () => {
    expect(validateBooking({ name: 'Анна', phone: '89876077896', service: 'Стрижка', date: '2026-08-01', time: '15:30' })).toEqual([]);
  });

  it('rejects invalid input and honeypot spam', () => {
    expect(validateBooking({ name: 'A', phone: '123', service: '', date: 'tomorrow', time: 'x', website: 'filled' })).toEqual(['spam', 'name', 'phone', 'service', 'date', 'time']);
  });
});
