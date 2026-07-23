import { absoluteUrl, business, siteUrl } from './site';

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BeautySalon',
      '@id': `${siteUrl}/#business`,
      name: business.name,
      url: siteUrl,
      telephone: business.telephone,
      address: { '@type': 'PostalAddress', ...business.address },
      openingHoursSpecification: business.openingHoursSpecification,
      image: absoluteUrl('/images/haircut.webp'),
      hasMap: business.yandexUrl
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: business.name
    },
    {
      '@type': 'WebPage',
      '@id': `${siteUrl}/#webpage`,
      url: siteUrl,
      name: 'Барбер и Барби — парикмахерская в Салавате',
      isPartOf: { '@id': `${siteUrl}/#website` },
      about: { '@id': `${siteUrl}/#business` }
    }
  ]
};

