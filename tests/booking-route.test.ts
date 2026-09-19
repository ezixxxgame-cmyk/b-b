import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/booking', () => import('../lib/booking'));

const booking = { name: 'Анна', phone: '89876077896', service: 'Стрижка', date: '2026-10-01', time: '15:30', comment: 'Пожелание', consent: true };
const fetchMock = vi.fn<typeof fetch>();

async function submit(body = booking) {
  const { POST } = await import('../app/api/booking/route');
  return POST(new Request('http://localhost/api/booking', { method: 'POST', body: JSON.stringify(body) }));
}

beforeEach(() => {
  vi.resetModules();
  fetchMock.mockReset().mockResolvedValue(new Response('{}'));
  vi.stubGlobal('fetch', fetchMock);
  vi.stubEnv('TELEGRAM_BOT_TOKEN', 'test-token');
  vi.stubEnv('TELEGRAM_CHAT_ID', 'test-chat');
  vi.stubEnv('RESEND_API_KEY', 'test-key');
  vi.stubEnv('BOOKING_EMAIL_FROM', 'Салон <booking@example.com>');
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('booking notifications', () => {
  it('sends the same booking to Telegram and the requested email', async () => {
    expect((await submit()).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const emailCall = fetchMock.mock.calls.find(([url]) => url === 'https://api.resend.com/emails');
    const telegramCall = fetchMock.mock.calls.find(([url]) => String(url).includes('api.telegram.org'));
    const email = JSON.parse(String(emailCall?.[1]?.body));
    const telegram = JSON.parse(String(telegramCall?.[1]?.body));
    expect(email).toMatchObject({ to: ['Kav28leta1984@gmail.com'], from: 'Салон <booking@example.com>', text: telegram.text });
    for (const value of ['Анна', '+79876077896', 'Стрижка', '2026-10-01', '15:30', 'Пожелание']) expect(email.text).toContain(value);
    expect(emailCall?.[1]?.headers).toMatchObject({ Authorization: 'Bearer test-key' });
    expect(emailCall?.[1]?.signal).toBeInstanceOf(AbortSignal);
  });

  it.each(['telegram', 'email'])('keeps the other channel working when %s throws', async (channel) => {
    fetchMock.mockImplementation(async url => {
      if (String(url).includes(channel === 'telegram' ? 'api.telegram.org' : 'api.resend.com')) throw new Error('Network error');
      return new Response('{}');
    });
    expect((await submit()).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenCalled();
  });

  it('keeps Telegram available before email is configured', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    expect((await submit()).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toContain('api.telegram.org');
  });

  it('can deliver by email when Telegram is not configured', async () => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', '');
    expect((await submit()).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.resend.com/emails');
  });

  it('returns an error when both channels reject the booking', async () => {
    fetchMock.mockResolvedValue(new Response('{}', { status: 500 }));
    expect((await submit()).status).toBe(502);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not send notifications for invalid input', async () => {
    expect((await submit({ ...booking, consent: false })).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('blocks repeated submissions', async () => {
    expect((await submit()).status).toBe(200);
    expect((await submit()).status).toBe(429);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
