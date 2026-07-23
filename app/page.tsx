'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { business } from '@/lib/site';
import { localBusinessSchema } from '@/lib/structured-data';

const yandexUrl = business.yandexUrl;
const services = [
  { title: 'Стрижки и уход за волосами', items: [
    ['Мужская стрижка: кроп, цезарь', 'Классические и современные варианты ножницами и машинкой, с обязательным мытьём головы.', '1 300 ₽'],
    ['Площадка', 'Стрижка с геометричной формой и тщательной проработкой.', '1 500 ₽'],
    ['Стрижка машинкой', 'Быстрый вариант под одну или несколько насадок.', '600 ₽']
  ] },
  { title: 'Уход за бородой и усами', items: [
    ['Моделирование и оформление бороды', 'Создание формы, подравнивание длины и окантовка.', '1 200 ₽'],
    ['Частичное оформление', 'Локальная коррекция формы и длины.', 'от 500 ₽'],
    ['Опасное бритьё', 'Только окантовка.', 'уточняется при записи'],
    ['Камуфляж седины', 'Тонирование волос на голове или бороде для естественного скрытия седины.', '500 ₽ отдельно · 300 ₽ в комплексе']
  ] },
  { title: 'Дополнительные услуги', items: [
    ['Удаление волос воском', 'Быстрое удаление нежелательных волос в носу или на ушах.', 'от 150 ₽ · одна зона 300 ₽'],
    ['Коррекция бровей', 'Придание аккуратной формы.', 'уточняется при записи'],
    ['Укладка и стайлинг', 'Завершение образа с использованием профессиональной косметики.', '500 ₽ отдельно · в комплексе входит в стрижку']
  ] }
];
const reviews = [
  { name: 'Анвар', quote: 'Стрижка получилась именно такой, как я и хотел — аккуратной, стильной и очень мне идущей.', date: '16 января', rating: 5 },
  { name: 'Ильшат И.', quote: 'Стрижка прошла быстро и с максимальным вниманием к деталям, а результат превзошёл все мои ожидания!', date: '3 апреля 2025', rating: 5 },
  { name: 'Алексей Д.', quote: 'Все пожелания учли, атмосфера классная, долгие поиски хорошего барбера увенчались успехом.', date: '9 января', rating: 5 },
  { name: 'Иван Яровицын', quote: 'Если не знаете где подстричься, то вам точно сюда!! Это лучшее место из всех мест которые есть в этом городе. Очень приятный мастер, дядя, именно дядя, а не модно мастер, сделает свою работу на отлично!', date: '5 июля 2025', rating: 5 },
  { name: 'денис щербаков', quote: 'Хорошее место, приветливый персонал, знают своё дело от и до, постригли быстро, а главное качественно, большое спасибо, обязательно приду к вам еще не раз.', date: '31 марта 2025', rating: 5 },
  { name: 'Данил Махмутов', quote: 'Отличный парикмахер, место супер, мастер очень приветливый и выслушает все Ваши предпочтения.', date: '8 февраля', rating: 5 },
  { name: 'валерий иванов', quote: 'Отличная парикмахерская! Отличный Барбер Альбина! Качественно, быстро, стильно! Давно являюсь клиентом Альбины, до этого перебрал кучу мастеров, но все не то. Всем советую посетить данного мастера! Волосатым, стриженым и даже лысым!', date: '12 апреля 2025', rating: 5 },
  { name: 'Елена М.', quote: 'Мастера Альбину любим всей семьёй! Стрижет очень хорошо и меня, и мужа, и сына. Главное всегда в хорошем настроении, и находит тему для разговоров. Сыну мужик такие модные делает, в садике все в восторге. Однозначно рекомендую!!', date: '3 апреля 2025', rating: 5 },
  { name: 'Айрат', quote: 'Отличная парикмахерская со всеми удобствами! Очень вежливый, отзывчивый и добрый персонал выполнит все ваши пожелания к стрижке. Пять звезд, однозначно! Отдельное спасибо с неба, Альбине, профессионалу своего дела!', date: '3 апреля 2025', rating: 5 },
  { name: 'Азат Лукманов', quote: 'Если вы не знаете, где можно стильно и классно подстричься, то вы не ошибётесь с этим выбором!!! Мастер просто от бога, сделает быстро и не как у всех. Альбинка — супер!!!', date: '29 января 2025', rating: 5 },
  { name: 'Сергей Берк', quote: 'Хорошее место!! Хороший мастер, работает не по шаблону. Понравился подход и манера работы, сразу складывается хорошее впечатление. С уверенностью могу отметить: это место стоит посетить! Самое главное, мастер хороший и я доволен! Спасибо! За грамматику простите, давно живу 😎', date: '3 января', rating: 5 },
  { name: 'Ульяна', quote: 'Уютная атмосфера и идеальная стрижка с креативным подходом сделали этот визит в парикмахерскую просто восхитительным.', date: '28 декабря 2025', rating: 5 }
];

export default function Home() {
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<{ text: string; kind: 'success' | 'error' | 'loading' | '' }>({ text: '', kind: '' });
  const [showAllReviews, setShowAllReviews] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) {
      setStatus({ text: 'Подтвердите согласие на обработку персональных данных.', kind: 'error' });
      return;
    }
    setStatus({ text: 'Отправляем заявку…', kind: 'loading' });
    const form = event.currentTarget;
    const data = { ...Object.fromEntries(new FormData(form).entries()), consent };
    try {
      const response = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Не удалось отправить заявку');
      setStatus({ text: 'Заявка отправлена. Мы свяжемся с вами для подтверждения времени.', kind: 'success' });
      form.reset();
      setConsent(false);
    } catch (error) {
      setStatus({ text: error instanceof Error ? error.message : 'Проверьте данные и попробуйте ещё раз.', kind: 'error' });
    }
  }

  return <main className="page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
    <section className="poster" id="top">
      <nav className="nav"><a href="#top">Барбер и Барби</a><div className="nav-links"><a href="#services">Услуги</a><a href="#men">Мужчинам</a><a href="#women">Женщинам</a><a href="#reviews">Отзывы</a><a href="#booking">Запись</a></div></nav>
      <div className="hero"><p className="eyebrow">Парикмахерская · салон красоты · барбершоп</p><Image className="hero-art" src="/images/brand-illustration.png" alt="Фирменная иллюстрация Барбер и Барби" width={447} height={447} priority /><h1 className="display">Парикмахерская и салон красоты в Салавате — Барбер и Барби</h1><p className="hero-sub">Салон на бульваре Космонавтов, 13: мужские стрижки, уход за бородой и услуги для женщин и мужчин — по предварительной записи.</p><div className="actions"><a className="btn btn-primary" href="#booking">Записаться</a><a className="btn btn-secondary" href="tel:+79876077896">Позвонить</a></div><div className="facts"><span className="fact"><strong>★</strong> 4,8 на Яндекс.Картах</span><span className="fact">⌖ б-р Космонавтов, 13</span></div></div>
    </section>

    <section className="section" id="services"><div className="shell"><div className="section-head"><h2>Услуги</h2><p className="section-intro">Актуальные услуги и цены, которые вы передали для публикации. Если стоимость зависит от формата, это отмечено в карточке.</p></div><div className="grid services">{services.map(service => <article className="service-card" key={service.title}><h3>{service.title}</h3><ul className="service-list">{service.items.map(([title, description, price]) => <li className="service-item" key={title}><div><strong>{title}</strong><p>{description}</p></div><span className="service-price">{price}</span></li>)}</ul></article>)}</div></div></section>

    <section className="section section-dark" id="men"><div className="shell local-copy"><div className="section-head"><h2>Мужская парикмахерская и барбершоп в Салавате</h2><p className="section-intro">Стрижка и уход — с понятным выбором услуги до записи.</p></div><p>В «Барбер и Барби» доступны мужские стрижки ножницами и машинкой, моделирование бороды, частичное оформление, камуфляж седины, укладка и дополнительные услуги. Стоимость указана в прайсе выше, а нюансы выбранного формата можно уточнить при записи.</p><p>Салон находится в Салавате, на бульваре Космонавтов, 13. Выберите услугу в форме — желаемые дата и время будут согласованы с мастером.</p><a className="text-link" href="#booking">Выбрать мужскую услугу и записаться</a></div></section>

    <section className="section" id="women"><div className="shell local-copy"><div className="section-head"><h2>Женская парикмахерская в Салавате</h2><p className="section-intro">Подберём подходящую услугу и согласуем удобное время.</p></div><p>«Барбер и Барби» — парикмахерская и салон красоты для женщин и мужчин в Салавате. Перед записью расскажите о пожеланиях в комментарии к заявке: администратор или мастер уточнит доступный формат услуги и время визита.</p><p>Так вы получите подтверждение по записи до посещения салона, а не обещание свободного слота на сайте.</p><a className="text-link" href="#booking">Оставить заявку в салон</a></div></section>

    <section className="section section-dark" id="why"><div className="shell"><div className="section-head"><h2>По делу и с уважением</h2><p className="section-intro">Факты, которые подтверждены карточкой «Барбер и Барби» на Яндекс.Картах.</p></div><div className="grid benefits"><div className="benefit"><strong>Для мужчин и женщин</strong><p>Барбершоп и парикмахерские услуги в одном месте.</p></div><div className="benefit"><strong>По предварительной записи</strong><p>Вы выбираете пожелания, а мастер подтверждает удобное время.</p></div><div className="benefit"><strong>Удобно добраться</strong><p>Салават, бульвар Космонавтов, 13. Есть парковка.</p></div><div className="benefit"><strong>Можно с питомцем</strong><p>В карточке отмечено, что разрешено со всеми животными.</p></div></div></div></section>

    <section className="section" id="works"><div className="shell"><div className="section-head"><h2>Работы</h2><p className="section-intro">Примеры маникюра и мужской стрижки из карточки салона.</p></div><div className="grid gallery"><figure className="photo-card work-card"><Image className="work-image" src="/images/nails.webp" alt="Примеры маникюра в салоне" width={1240} height={1240} sizes="(max-width: 800px) 100vw, 58vw" /></figure><figure className="photo-card work-card haircut-card"><Image className="work-image" src="/images/haircut.webp" alt="Пример мужской стрижки и оформления бороды" width={1280} height={960} sizes="(max-width: 800px) 100vw, 42vw" /></figure></div></div></section>

    <section className="section section-dark" id="reviews"><div className="shell"><div className="section-head"><h2>Отзывы</h2><p className="section-intro">Короткие точные цитаты из отзывов на Яндекс.Картах.</p></div><div className="grid reviews">{reviews.slice(0, showAllReviews ? reviews.length : 3).map(review => <article className="review" key={review.name}><div className="stars" aria-label={`${review.rating} из 5`}>★★★★★</div><blockquote>«{review.quote}»</blockquote><footer><span>{review.name} · {review.date}</span><a href={yandexUrl} target="_blank" rel="noreferrer">Источник</a></footer></article>)}</div><div className="reviews-actions">{!showAllReviews && <button className="btn btn-secondary reviews-expand" type="button" onClick={() => setShowAllReviews(true)} aria-expanded={showAllReviews}>Развернуть еще</button>}<a className="reviews-link" href={yandexUrl} target="_blank" rel="noreferrer">Все отзывы на Яндекс.Картах</a></div></div></section>

    <section className="section" id="booking"><div className="shell contact-grid"><div><div className="section-head"><h2>Запись</h2></div><p className="section-intro">Дата и время в форме — это ваше пожелание, а не подтверждённый свободный слот. Мы свяжемся и согласуем визит.</p><div className="contact-list"><div className="contact-item"><small>Телефон</small><a href="tel:+79876077896">+7 (987) 607-78-96</a></div><div className="contact-item"><small>Адрес</small><div>Республика Башкортостан, Салават, бульвар Космонавтов, 13, цокольный этаж</div></div><div className="contact-item"><small>График</small><div className="schedule"><span>Пн–Ср</span><span>14:00–20:00</span><span>Чт</span><span>выходной</span><span>Пт–Вс</span><span>14:00–20:00</span></div></div></div><a className="btn btn-secondary" href={yandexUrl} target="_blank" rel="noreferrer">Построить маршрут в Яндекс.Картах</a></div><form className="form" onSubmit={submit}><div className="form-grid"><div className="field"><label htmlFor="name">Имя</label><input id="name" name="name" required autoComplete="name" /></div><div className="field"><label htmlFor="phone">Телефон</label><input id="phone" name="phone" type="tel" required inputMode="tel" placeholder="+7 (___) ___-__-__" /></div></div><div className="form-grid"><div className="field"><label htmlFor="service">Услуга</label><select id="service" name="service" defaultValue="" required><option value="" disabled>Выберите услугу</option>{services.flatMap(service => service.items.map(([title]) => <option key={title}>{title}</option>))}</select></div><div className="field"><label htmlFor="date">Желаемая дата</label><input id="date" name="date" type="date" required /></div></div><div className="field"><label htmlFor="time">Желаемое время</label><input id="time" name="time" type="time" required /></div><div className="field"><label htmlFor="comment">Комментарий <span aria-hidden="true">(необязательно)</span></label><textarea id="comment" name="comment" maxLength={1000} /></div><input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }} /><label className="consent"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} /><span>Согласен(на) на обработку персональных данных для рассмотрения заявки и связи по ней. Ознакомился(лась) с <a href="/privacy">Политикой конфиденциальности</a> и <a href="/consent">согласием</a>.</span></label><div className={`form-status ${status.kind}`} aria-live="polite">{status.text}</div><button className="btn btn-primary" type="submit" disabled={!consent || status.kind === 'loading'}>{status.kind === 'loading' ? 'Отправляем…' : 'Отправить заявку'}</button></form></div></section>

    <footer className="footer"><div className="shell footer-row"><span>© Барбер и Барби, Салават</span><span><a href="/privacy">Политика конфиденциальности</a> · <a href="/consent">Согласие на обработку ПД</a></span><span>Реквизиты оператора: добавить ФИО, ИНН и контакты</span></div></footer>
  </main>;
}

