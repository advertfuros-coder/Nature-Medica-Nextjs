import Script from "next/script";
import StoreProvider from "@/components/StoreProvider";
import CartHydrator from "@/components/CartHydrator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://naturemedica.in'),
  title: {
    default: "Nature Medica | Authentic Ayurvedic Wellness & Botanical Formulations",
    template: "%s | Nature Medica",
  },
  description: "Discover certified Ayurvedic formulations, cold-pressed hair care, pure Himalayan Shilajit, and natural remedies crafted with classical botanical science.",
  verification: {
    other: {
      "facebook-domain-verification": "qr33mnpi0ioqybmvdodr835b2djbc3",
    },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Nature Medica | Authentic Ayurvedic Formulations & Natural Wellness",
    description: "Discover certified Ayurvedic formulations, cold-pressed hair care, pure Himalayan Shilajit, and natural remedies crafted with classical botanical science.",
    url: 'https://naturemedica.in',
    siteName: 'Nature Medica',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Nature Medica | Authentic Ayurvedic Wellness",
    description: "Discover certified Ayurvedic formulations, cold-pressed hair care, pure Himalayan Shilajit, and natural remedies.",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://naturemedica.in/#organization",
      "name": "Nature Medica",
      "url": "https://naturemedica.in",
      "logo": "https://naturemedica.in/naturemedicalogo.png",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+91 70804 03322",
          "contactType": "customer service",
          "areaServed": "IN",
          "availableLanguage": ["en", "hi"]
        }
      ]
    },
    {
      "@type": "HealthAndBeautyBusiness",
      "@id": "https://naturemedica.in/#localbusiness",
      "name": "Nature Medica",
      "image": "https://naturemedica.in/naturemedicalogo.png",
      "url": "https://naturemedica.in",
      "telephone": "+91 70804 03322",
      "email": "naturemedica09@gmail.com",
      "priceRange": "₹₹",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1st Floor, Lucknow Heart Pre School, Sector 7, Vikas Nagar",
        "addressLocality": "Lucknow",
        "addressRegion": "Uttar Pradesh",
        "postalCode": "226022",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 26.8920,
        "longitude": 80.9570
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "09:30",
          "closes": "19:00"
        }
      ]
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${montserrat.className} antialiased selection:bg-[#dce9d8] selection:text-[#223d1b]`}>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TWJVCM2P');`}
        </Script>
        {/* End Google Tag Manager */}

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
