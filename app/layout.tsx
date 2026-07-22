import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Барбер и Барби — парикмахерская и салон красоты в Салавате',
  description: 'Барбер и Барби в Салавате: стрижки, окрашивание, укладка и маникюр. Запись по телефону или через форму.',
  metadataBase: new URL('https://barber-i-barbi.vercel.app'),
  openGraph: { title: 'Барбер и Барби — Салават', description: 'Стрижки, окрашивание и маникюр в Салавате.', type: 'website', locale: 'ru_RU' },
  icons: { icon: '/favicon.svg' },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
