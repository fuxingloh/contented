export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/_next/'],
      },
    ],
    sitemap: `${process.env.CONTENTED_PREVIEW_SITE_URL}/sitemap.xml`,
  };
}
