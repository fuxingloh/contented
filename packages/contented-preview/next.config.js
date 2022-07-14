const { withContentlayer } = require('next-contentlayer');

// noinspection JSFileReferences
/** @type {ContentedPreview} */
const preview = require('../package.json')?.['contented'];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.jsx'],
  swcMinify: true,
  env: {
    SITE_URL: preview?.url ?? 'https://contented.dev',
    SITE_NAME: preview?.name ?? 'Contented',
    GITHUB_URL: preview?.github?.url ?? 'https://github.com/BirthdayResearch/contented',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = withContentlayer(nextConfig);
