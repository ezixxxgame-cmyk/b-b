export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.barberandbarbie.ru')
  .replace(/\/$/, '');

export function absoluteUrl(path = '/') {
  return new URL(path, `${siteUrl}/`).toString();
}

export const business = {
  name: 'Барбер и Барби',
  telephone: '+79876077896',
  yandexUrl: 'https://yandex.ru/maps/org/barber_i_barbi/129691267585',
  address: {
    streetAddress: 'бульвар Космонавтов, 13, цокольный этаж',
    addressLocality: 'Салават',
    addressRegion: 'Республика Башкортостан',
    addressCountry: 'RU'
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday'],
      opens: '14:00',
      closes: '20:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Friday', 'Saturday', 'Sunday'],
      opens: '14:00',
      closes: '20:00'
    }
  ]
} as const;

