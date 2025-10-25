import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'NatureMedica - Natural Health & Ayurvedic Wellness',
  description: 'Shop supplements, vitamins, and organic foods from trusted natural brands.',
  keywords: ['Ayurveda', 'Wellness', 'Health Supplements', 'Organic', 'Vitamins'],
  openGraph: {
    title: 'NatureMedica',
    description: 'Buy natural wellness products online.',
    url: 'https://naturemedica.com',
    siteName: 'NatureMedica',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NatureMedica Shop'
      },
    ],
    locale: 'en-IN',
    type: 'website',
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body  >
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
