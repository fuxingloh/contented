const { join } = require('node:path');
const preview = require(join(process.env.CONTENTED_CWD, 'package.json'))?.['contented'];

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
