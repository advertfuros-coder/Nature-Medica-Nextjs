// import { Inter } from 'next/font/google';
// import './globals.css';
// import Providers from '@/components/Providers';
// import Header from '@/components/layout/Header';
// import Footer from '@/components/layout/Footer';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: 'NatureMedica - Natural Health & Ayurvedic Wellness',
//   description: 'Shop supplements, vitamins, and organic foods from trusted natural brands.',
//   keywords: ['Ayurveda', 'Wellness', 'Health Supplements', 'Organic', 'Vitamins'],
//   openGraph: {
//     title: 'NatureMedica',
//     description: 'Buy natural wellness products online.',
//     url: 'https://naturemedica.com',
//     siteName: 'NatureMedica',
//     images: [
//       {
//         url: '/og-image.png',
//         width: 1200,
//         height: 630,
//         alt: 'NatureMedica Shop'
//       },
//     ],
//     locale: 'en-IN',
//     type: 'website',
//   },
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body  >
//         <Providers>
//           <Header />
//           {children}
//           <Footer />
//         </Providers>
//       </body>
//     </html>
//   );
// }

import StoreProvider from "@/components/StoreProvider";
import CartHydrator from "@/components/CartHydrator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata = {
  title: "NatureMedica - Natural Wellness Products",
  description: "Premium Ayurvedic supplements and natural wellness products",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TWJVCM2P');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className="overf">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TWJVCM2P"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <StoreProvider>
          <Header />
          <CartHydrator />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
