export type BookingInput = {
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  comment?: string;
  website?: string;
  consent?: boolean;
};

export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('8')) return `+7${digits.slice(1)}`;
  if (digits.length === 11 && digits.startsWith('7')) return `+${digits}`;
  if (digits.length === 10) return `+7${digits}`;
  return value.trim();
}

export function validateBooking(input: BookingInput): string[] {
  const errors: string[] = [];
  if (input.website?.trim()) errors.push('spam');
  if (input.name.trim().length < 2 || input.name.trim().length > 80) errors.push('name');
  if (!/^\+7\d{10}$/.test(normalizePhone(input.phone))) errors.push('phone');
  if (input.service.trim().length < 2 || input.service.trim().length > 120) errors.push('service');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) errors.push('date');
  if (!/^\d{2}:\d{2}$/.test(input.time)) errors.push('time');
  if ((input.comment ?? '').length > 1000) errors.push('comment');
  if (!input.consent) errors.push('consent');
  return errors;
}
