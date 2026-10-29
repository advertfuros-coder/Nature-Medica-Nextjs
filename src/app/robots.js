export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://naturemedica.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/checkout/',
          '/orders/',
          '/profile/',
          '/addresses/',
          '/payment-processing',
          '/payment-failed',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
