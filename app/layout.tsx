import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  title: 'Барбер и Барби — парикмахерская в Салавате',
  description: 'Барбер и Барби — парикмахерская и салон красоты в Салавате. Мужские стрижки, оформление бороды и запись по телефону или через форму.',
  metadataBase: new URL(siteUrl),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Барбер и Барби — парикмахерская в Салавате',
    description: 'Мужские стрижки, оформление бороды и запись в салон в Салавате.',
    type: 'website',
    locale: 'ru_RU',
    url: '/',
    images: [{ url: '/images/haircut.webp', width: 1280, height: 960, alt: 'Мужская стрижка и оформление бороды в Барбер и Барби' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Барбер и Барби — парикмахерская в Салавате',
    description: 'Мужские стрижки, оформление бороды и запись в салон в Салавате.',
    images: ['/images/haircut.webp']
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ]
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}

