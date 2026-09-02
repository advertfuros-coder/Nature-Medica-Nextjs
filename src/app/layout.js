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
  title: "NatureMedica - Natural Wellness Products",
  description: "Premium Ayurvedic supplements and natural wellness products",
  verification: {
    other: {
      "facebook-domain-verification": "qr33mnpi0ioqybmvdodr835b2djbc3",
    },
  },
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
