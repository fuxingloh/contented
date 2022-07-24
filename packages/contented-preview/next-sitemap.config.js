const { preview } = require('../../contented.config.js');

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
