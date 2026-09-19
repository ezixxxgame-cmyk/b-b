import { NextResponse } from 'next/server';
import { normalizePhone, validateBooking, type BookingInput } from '@/lib/booking';

const requests = new Map<string, number>();

function clientKey(request: Request) { return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'; }

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BookingInput;
    const errors = validateBooking(body);
    if (errors.includes('spam')) return NextResponse.json({ ok: true });
    if (errors.length) return NextResponse.json({ error: 'Проверьте имя, телефон, услугу, дату и время.' }, { status: 400 });
    const key = clientKey(request); const now = Date.now(); const previous = requests.get(key) ?? 0;
    if (now - previous < 60_000) return NextResponse.json({ error: 'Заявка уже отправлялась недавно. Подождите минуту.' }, { status: 429 });
    requests.set(key, now);
    const token = process.env.TELEGRAM_BOT_TOKEN; const chatId = process.env.TELEGRAM_CHAT_ID;
    const emailKey = process.env.RESEND_API_KEY; const emailFrom = process.env.BOOKING_EMAIL_FROM;
    if ((!token || !chatId) && (!emailKey || !emailFrom)) return NextResponse.json({ error: 'Форма временно недоступна. Позвоните нам, пожалуйста.' }, { status: 503 });
    const submittedAt = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Moscow' }).format(new Date());
    const text = ['Новая заявка — «Барбер и Барби»', `Время отправки: ${submittedAt}`, '', `Имя: ${body.name.trim()}`, `Телефон: ${normalizePhone(body.phone)}`, `Услуга: ${body.service.trim()}`, `Желаемая дата: ${body.date}`, `Желаемое время: ${body.time}`, `Комментарий: ${(body.comment || '—').trim()}`].join('\n');
    const deliveries: { channel: string; request: Promise<Response> }[] = [];
    if (token && chatId) deliveries.push({ channel: 'Telegram', request: fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }), signal: AbortSignal.timeout(10_000) }) });
    if (emailKey && emailFrom) {
      deliveries.push({ channel: 'Email', request: fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${emailKey}` },
        body: JSON.stringify({ from: emailFrom, to: ['Kav28leta1984@gmail.com'], subject: 'Новая заявка — «Барбер и Барби»', text }),
        signal: AbortSignal.timeout(10_000)
      }) });
    } else {
      console.error('Booking email is not configured: RESEND_API_KEY and BOOKING_EMAIL_FROM are required.');
    }
    const results = await Promise.allSettled(deliveries.map(delivery => delivery.request));
    results.forEach((result, index) => {
      if (result.status === 'rejected' || !result.value.ok) console.error(`Booking notification failed: ${deliveries[index].channel}`);
    });
    if (!results.some(result => result.status === 'fulfilled' && result.value.ok)) return NextResponse.json({ error: 'Не удалось передать заявку. Позвоните нам, пожалуйста.' }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: 'Не удалось обработать заявку. Проверьте данные и попробуйте ещё раз.' }, { status: 400 }); }
}
