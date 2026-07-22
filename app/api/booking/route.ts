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
    if (!token || !chatId) return NextResponse.json({ error: 'Форма временно недоступна. Позвоните нам, пожалуйста.' }, { status: 503 });
    const submittedAt = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Moscow' }).format(new Date());
    const text = ['Новая заявка — «Барбер и Барби»', `Время отправки: ${submittedAt}`, '', `Имя: ${body.name.trim()}`, `Телефон: ${normalizePhone(body.phone)}`, `Услуга: ${body.service.trim()}`, `Желаемая дата: ${body.date}`, `Желаемое время: ${body.time}`, `Комментарий: ${(body.comment || '—').trim()}`].join('\n');
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }) });
    if (!telegramResponse.ok) return NextResponse.json({ error: 'Не удалось передать заявку. Позвоните нам, пожалуйста.' }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: 'Не удалось обработать заявку. Проверьте данные и попробуйте ещё раз.' }, { status: 400 }); }
}
