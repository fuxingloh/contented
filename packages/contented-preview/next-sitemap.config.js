// noinspection JSFileReferences
const preview = require('../package.json')?.['contented'];

module.exports = {
  siteUrl: preview?.url ?? process.env.SITE_URL,
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
