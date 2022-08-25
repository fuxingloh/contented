/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.CONTENTED_PREVIEW_SITE_URL,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};
